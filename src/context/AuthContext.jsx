import { createContext, useCallback, useEffect, useState } from 'react'
import { api, clearToken, getToken, setToken } from '../lib/api'
import { COURSES } from '../data/saclabsData'

const AuthContext = createContext(null)

export { AuthContext }

/* How often live content is re-checked, in milliseconds. Firestore pushed
   updates automatically; here the app polls quietly in the background. */
const POLL_MS = 20000

const friendlyError = (e) =>
  e?.message || 'Something went wrong. Please try again.'

export function AuthProvider({ children }) {
  /* App-level user { name, email, role } */
  const [user, setUser] = useState(null)
  /* Full profile from the users collection (sub, watched, scores...) */
  const [profile, setProfile] = useState(null)
  /* True until the first session check + profile load finishes */
  const [authLoading, setAuthLoading] = useState(true)
  /* False when the server can't reach the database / isn't configured */
  const [apiReady, setApiReady] = useState(true)

  const [customSessions, setCustomSessions] = useState([])
  const [customPapers, setCustomPapers] = useState([])
  const [customQuizzes, setCustomQuizzes] = useState([])
  const [grants, setGrants] = useState([])
  const [payRequests, setPayRequests] = useState([])
  const [registeredUsers, setRegisteredUsers] = useState([])

  const signedIn = Boolean(user)

  /* ---------------- loaders ---------------- */

  const refreshContent = useCallback(async () => {
    try {
      const data = await api('/api/content')
      setCustomSessions(data.sessions || [])
      setCustomPapers(data.papers || [])
      setCustomQuizzes(data.quizzes || [])
      setApiReady(true)
    } catch (e) {
      if (e?.status === 503) setApiReady(false)
      console.error('[SAC Labs] Could not load site content:', e)
    }
  }, [])

  const refreshAccess = useCallback(async () => {
    if (!getToken()) {
      setGrants([])
      setPayRequests([])
      setRegisteredUsers([])
      return
    }
    try {
      const data = await api('/api/access')
      setGrants(data.grants || [])
      setPayRequests(data.payRequests || [])
      setRegisteredUsers(data.users || [])
    } catch (e) {
      console.error('[SAC Labs] Could not load access data:', e)
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    if (!getToken()) {
      setUser(null)
      setProfile(null)
      return
    }
    try {
      const { user: me } = await api('/api/auth?action=me')
      setProfile(me)
      setUser({ name: me.name, email: me.email, role: me.role || 'student' })
    } catch (e) {
      /* An expired or invalid token means the session is over */
      if (e?.status === 401) {
        clearToken()
        setUser(null)
        setProfile(null)
      } else {
        if (e?.status === 503) setApiReady(false)
        console.error('[SAC Labs] Could not load your profile:', e)
      }
    }
  }, [])

  /* ---------------- first load ---------------- */

  useEffect(() => {
    let alive = true
    ;(async () => {
      await Promise.all([refreshContent(), refreshProfile()])
      if (!alive) return
      await refreshAccess()
      if (alive) setAuthLoading(false)
    })()
    return () => {
      alive = false
    }
  }, [refreshContent, refreshProfile, refreshAccess])

  /* ---------------- keep everything fresh in the background ---------------- */

  useEffect(() => {
    const tick = () => {
      if (document.hidden) return
      refreshContent()
      if (getToken()) {
        refreshAccess()
        refreshProfile()
      }
    }
    const id = setInterval(tick, POLL_MS)
    /* Also refresh the moment the user comes back to the tab */
    const onFocus = () => tick()
    window.addEventListener('focus', onFocus)
    return () => {
      clearInterval(id)
      window.removeEventListener('focus', onFocus)
    }
  }, [refreshContent, refreshAccess, refreshProfile])

  /* Load access data as soon as somebody signs in or their role changes */
  useEffect(() => {
    if (signedIn) refreshAccess()
  }, [signedIn, user?.role, refreshAccess])

  /* ---------------- Auth ---------------- */

  const applySession = async (data) => {
    setToken(data.token)
    setProfile(data.user)
    setUser({
      name: data.user.name,
      email: data.user.email,
      role: data.user.role || 'student',
    })
    await refreshAccess()
  }

  const register = async (name, email, password) => {
    setAuthLoading(true)
    try {
      const data = await api('/api/auth?action=register', {
        method: 'POST',
        body: { name, email: String(email).trim(), password },
      })
      await applySession(data)
      setAuthLoading(false)
      return { ok: true }
    } catch (e) {
      setAuthLoading(false)
      return { ok: false, error: friendlyError(e) }
    }
  }

  const login = async (email, password) => {
    setAuthLoading(true)
    try {
      const data = await api('/api/auth?action=login', {
        method: 'POST',
        body: { email: String(email).trim(), password },
      })
      await applySession(data)
      setAuthLoading(false)
      return { ok: true }
    } catch (e) {
      setAuthLoading(false)
      return { ok: false, error: friendlyError(e) }
    }
  }

  const logout = async () => {
    clearToken()
    setUser(null)
    setProfile(null)
    setGrants([])
    setPayRequests([])
    setRegisteredUsers([])
  }

  /* ---------------- Password reset ---------------- */

  const requestPasswordReset = async (email) => {
    try {
      await api('/api/auth?action=forgot-password', {
        method: 'POST',
        body: { email: String(email).trim(), origin: window.location.origin },
      })
      return { ok: true }
    } catch (e) {
      return { ok: false, error: friendlyError(e) }
    }
  }

  const resetPassword = async (token, password) => {
    try {
      await api('/api/auth?action=reset-password', {
        method: 'POST',
        body: { token, password },
      })
      return { ok: true }
    } catch (e) {
      return { ok: false, error: friendlyError(e) }
    }
  }

  /* ---------------- Payments & manual access ---------------- */

  const subscribe = async (planId, price) => {
    try {
      await api('/api/profile', {
        method: 'POST',
        body: { action: 'subscribe', planId, price },
      })
      await refreshProfile()
    } catch (e) {
      console.error('[SAC Labs] subscribe failed:', e)
    }
  }

  const isActive = () => {
    const s = profile?.sub
    return !!s && Date.now() < s.expiresAt
  }

  const cancelSub = async () => {
    try {
      await api('/api/profile', { method: 'POST', body: { action: 'cancel' } })
      await refreshProfile()
    } catch {
      /* ignore */
    }
  }

  const submitPaymentRequest = async (data) => {
    const res = await api('/api/access', {
      method: 'POST',
      body: {
        action: 'submitRequest',
        name: data.name || user?.name || '',
        email: (data.email || user?.email || '').toLowerCase(),
        level: data.level || '',
        planId: data.planId,
        price: data.price ?? null,
        method: data.method || '',
        reference: data.reference?.trim() || '',
        message: data.message?.trim() || '',
        receiptName: data.receiptName || '',
      },
    })
    await refreshAccess()
    return res.id
  }

  const approvePaymentRequest = async (requestId) => {
    await api('/api/access', {
      method: 'POST',
      body: { action: 'approveRequest', requestId },
    })
    await refreshAccess()
  }

  const rejectPaymentRequest = async (requestId) => {
    await api('/api/access', {
      method: 'POST',
      body: { action: 'rejectRequest', requestId },
    })
    await refreshAccess()
  }

  const deletePaymentRequest = async (requestId) => {
    await api('/api/access', {
      method: 'POST',
      body: { action: 'deleteRequest', requestId },
    })
    await refreshAccess()
  }

  const grantAccess = async (
    email,
    { name = '', planId = 'monthly', note = '' } = {},
  ) => {
    const key = (email || '').toLowerCase().trim()
    if (!key) return
    await api('/api/access', {
      method: 'POST',
      body: { action: 'grant', email: key, name, planId, note },
    })
    await refreshAccess()
  }

  const extendGrant = async (email, extraDays = 30) => {
    await api('/api/access', {
      method: 'POST',
      body: { action: 'extend', email: (email || '').toLowerCase(), extraDays },
    })
    await refreshAccess()
  }

  const revokeGrant = async (email) => {
    await api('/api/access', {
      method: 'POST',
      body: { action: 'revoke', email: (email || '').toLowerCase() },
    })
    await refreshAccess()
  }

  const getGrantFor = (email) => {
    if (!email) return null
    const key = email.toLowerCase()
    return grants.find((x) => x.email === key) || null
  }

  const hasActiveGrant = (email) => {
    const grant = getGrantFor(email)
    return !!grant && Date.now() < grant.expiresAt
  }

  const hasFullAccess = () =>
    isActive() || user?.role === 'admin' || hasActiveGrant(user?.email)

  const pendingRequestFor = (email) => {
    if (!email) return null
    const key = email.toLowerCase()
    return (
      payRequests.find((r) => r.email === key && r.status === 'pending') || null
    )
  }

  /* ---------------- Learning progress ---------------- */

  const markWatched = (sessionId) => {
    if (!getToken()) return
    /* Update the screen immediately, then save in the background */
    setProfile((p) =>
      p && !(p.watched || []).includes(sessionId)
        ? { ...p, watched: [...(p.watched || []), sessionId] }
        : p,
    )
    api('/api/profile', {
      method: 'POST',
      body: { action: 'watched', sessionId },
    }).catch(() => {})
  }

  const saveScore = (quizId, score) => {
    if (!getToken()) return
    const best = Math.max(score, profile?.scores?.[quizId] || 0)
    setProfile((p) =>
      p ? { ...p, scores: { ...(p.scores || {}), [quizId]: best } } : p,
    )
    api('/api/profile', {
      method: 'POST',
      body: { action: 'score', quizId, score },
    }).catch(() => {})
  }

  /* ---------------- Content management ---------------- */

  const addSession = async (courseId, session) => {
    await api('/api/content?type=session', {
      method: 'POST',
      body: { courseId, session },
    })
    await refreshContent()
  }

  const removeSession = async (sessionId) => {
    await api(`/api/content?type=session&id=${encodeURIComponent(sessionId)}`, {
      method: 'DELETE',
    }).catch(() => {})
    await refreshContent()
  }

  const addPaper = async (paper) => {
    await api('/api/content?type=paper', { method: 'POST', body: paper })
    await refreshContent()
  }

  const removePaper = async (paperId) => {
    /* The server deletes the stored PDF along with the paper */
    await api(`/api/content?type=paper&id=${encodeURIComponent(paperId)}`, {
      method: 'DELETE',
    }).catch(() => {})
    await refreshContent()
  }

  const addQuiz = async (quiz) => {
    await api('/api/content?type=quiz', { method: 'POST', body: quiz })
    await refreshContent()
  }

  const removeQuiz = async (quizId) => {
    await api(`/api/content?type=quiz&id=${encodeURIComponent(quizId)}`, {
      method: 'DELETE',
    }).catch(() => {})
    await refreshContent()
  }

  const totalSessions = () => {
    let n = 0
    for (const c of COURSES) {
      for (const m of c.modules) n += m.sessions.length
    }
    return n + customSessions.length
  }

  const watchedCount = () => (profile?.watched || []).length
  const watched = profile?.watched || []
  const scores = profile?.scores || {}

  const canWatch = (session) => session.free || hasFullAccess()

  const value = {
    apiReady,
    authLoading,
    user,
    register,
    login,
    logout,
    sub: profile?.sub || null,
    subscribe,
    isActive,
    cancelSub,
    watched,
    markWatched,
    scores,
    saveScore,
    customSessions,
    addSession,
    removeSession,
    customPapers,
    addPaper,
    removePaper,
    customQuizzes,
    addQuiz,
    removeQuiz,
    totalSessions,
    watchedCount,
    canWatch,
    grants,
    grantAccess,
    extendGrant,
    revokeGrant,
    getGrantFor,
    hasActiveGrant,
    hasFullAccess,
    payRequests,
    submitPaymentRequest,
    approvePaymentRequest,
    rejectPaymentRequest,
    deletePaymentRequest,
    pendingRequestFor,
    registeredUsers,
    requestPasswordReset,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
