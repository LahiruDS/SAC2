import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle2, KeyRound, Lock } from 'lucide-react'
import { useAuth } from '../context/useAuth'

/*
 * Firebase used to host this screen for us. Now the reset link points here,
 * carrying a one-time token that the API checks before saving the new password.
 */
export default function ResetPassword() {
  const { resetPassword } = useAuth()
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const token = params.get('token') || ''
  const email = params.get('email') || ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }
    if (password !== confirm) {
      setError('The two passwords do not match.')
      return
    }

    setBusy(true)
    const res = await resetPassword(token, password)
    setBusy(false)

    if (!res.ok) {
      setError(res.error)
      return
    }
    setDone(true)
  }

  if (!token) {
    return (
      <section className="section-tight">
        <div className="container">
          <div className="card auth-box center">
            <h2 className="h2">This link is not valid</h2>
            <p className="sub sub-center mt-1" style={{ fontSize: '0.92rem' }}>
              The reset link looks incomplete. Please request a new one.
            </p>
            <Link to="/forgot-password" className="btn btn-primary mt-3">
              Request a new link
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section-tight">
      <div className="container">
        <div className="card auth-box fade-up">
          <div className="center">
            <span className="logo-mark" style={{ marginInline: 'auto', marginBottom: 12 }}>
              <KeyRound size={20} />
            </span>
            <h2 className="h2">Choose a new password</h2>
            <p className="sub sub-center mt-1" style={{ fontSize: '0.92rem' }}>
              {email ? `For ${email}` : 'Pick something you will remember.'}
            </p>
          </div>

          {!done ? (
            <form onSubmit={submit} className="mt-3">
              {error && (
                <div
                  className="card"
                  style={{ padding: 12, background: '#fef2f2', borderColor: '#fecaca', color: '#b91c1c', fontSize: '0.88rem', marginBottom: 16 }}
                >
                  {error}
                </div>
              )}
              <div className="field">
                <label>New password</label>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="field">
                <label>Confirm new password</label>
                <input
                  type="password"
                  required
                  placeholder="Type it again"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block mt-2" disabled={busy}>
                <Lock size={16} />
                {busy ? 'Saving…' : 'Save new password'}
              </button>
            </form>
          ) : (
            <>
              <div
                className="card mt-3"
                style={{ padding: 20, background: '#f0fdf4', borderColor: '#bbf7d0' }}
              >
                <b style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={16} color="#16a34a" />
                  Password updated
                </b>
                <p style={{ fontSize: '0.88rem', color: 'var(--muted)', marginTop: 8 }}>
                  You can now sign in with your new password.
                </p>
              </div>
              <button
                className="btn btn-primary btn-block mt-3"
                onClick={() => navigate('/login')}
              >
                Go to sign in
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
