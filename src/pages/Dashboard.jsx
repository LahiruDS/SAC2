import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CalendarClock,
  FileText,
  Hourglass,
  PlayCircle,
  Trophy,
} from 'lucide-react'
import { useAuth } from '../context/useAuth'
import Protected from '../components/Protected'
import { COURSES, QUIZZES } from '../data/saclabsData'

function DashboardContent() {
  const {
    user,
    sub,
    isActive,
    watched,
    totalSessions,
    watchedCount,
    scores,
    customSessions,
    customQuizzes,
    hasFullAccess,
    getGrantFor,
    pendingRequestFor,
  } = useAuth()

  const pct = totalSessions() === 0 ? 0 : Math.round((watchedCount() / totalSessions()) * 100)
  const active = isActive()
  const fullAccess = hasFullAccess()
  const grant = getGrantFor(user?.email)
  const grantActive = !!grant && Date.now() < grant.expiresAt
  const pendingReq = pendingRequestFor(user?.email)
  const firstName = user?.name?.split(' ')[0] || 'Student'
  const allQuizList = [...customQuizzes, ...QUIZZES]
  const bestQuiz = allQuizList.map((q) => ({
    title: q.title,
    score: scores[q.id],
    total: q.questions.length,
  })).filter((q) => q.score !== undefined)

  const extraSessions = customSessions.map((c) => c.session)
  const recent = [...watched].slice(-3).reverse()

  return (
    <section className="section-tight">
      <div className="container">
        <div className="flex-between">
          <div>
            <span className="eyebrow">Dashboard</span>
            <h2 className="h2">
              Hela! {firstName} 👋
            </h2>
            <p className="sub mt-1">Here is your learning progress at a glance.</p>
          </div>
          <Link to="/courses" className="btn btn-primary btn-sm">
            <PlayCircle size={15} />
            Continue learning
          </Link>
        </div>

        <div className="grid-3 mt-4">
          <div className="card" style={{ padding: 24 }}>
            <div className="flex-between">
              <div>
                <b style={{ fontSize: '1.05rem' }}>
                  {active
                    ? 'Plan active'
                    : grantActive
                      ? 'Access active'
                      : pendingReq
                        ? 'Payment under review'
                        : 'No active plan'}
                </b>
                <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginTop: 4 }}>
                  {active ? (
                    <>
                      <CalendarClock size={14} style={{ verticalAlign: '-2px', marginRight: 4 }} />
                      Valid until {new Date(sub.expiresAt).toLocaleDateString('en-GB')}
                    </>
                  ) : grantActive ? (
                    <>
                      <CalendarClock size={14} style={{ verticalAlign: '-2px', marginRight: 4 }} />
                      Granted by teacher · until {new Date(grant.expiresAt).toLocaleDateString('en-GB')}
                    </>
                  ) : pendingReq ? (
                    <>
                      <Hourglass size={14} style={{ verticalAlign: '-2px', marginRight: 4 }} />
                      Your proof was received — the teacher will activate access soon.
                    </>
                  ) : (
                    'Subscribe or send your payment proof to unlock everything.'
                  )}
                </p>
              </div>
              <span className={`chip ${fullAccess ? 'chip-green' : pendingReq ? 'chip-amber' : 'chip-amber'}`}>
                {fullAccess ? 'Active' : pendingReq ? 'Reviewing' : 'Inactive'}
              </span>
            </div>
            {!fullAccess && (
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <Link to="/pricing" className="btn btn-primary btn-sm btn-block">
                  View plans
                </Link>
                <Link to="/verify-payment" className="btn btn-ghost btn-sm btn-block">
                  Send proof
                </Link>
              </div>
            )}
          </div>

          <div className="card" style={{ padding: 24 }}>
            <div className="flex-between">
              <div>
                <b style={{ fontSize: '1.05rem' }}>Progress</b>
                <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginTop: 4 }}>
                  {watchedCount()} of {totalSessions()} sessions watched
                </p>
              </div>
              <span className="chip chip-primary">{pct}%</span>
            </div>
            <div className="progress-bar mt-2">
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>

          <div className="card" style={{ padding: 24 }}>
            <div className="flex-between">
              <div>
                <b style={{ fontSize: '1.05rem' }}>Quizzes</b>
                <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginTop: 4 }}>
                  {bestQuiz.length} of {allQuizList.length} attempted
                </p>
              </div>
              <Trophy size={20} color="var(--accent)" />
            </div>
            {bestQuiz.length === 0 && (
              <Link to="/quizzes" className="btn btn-ghost btn-sm mt-2">
                Take your first quiz
              </Link>
            )}
          </div>
        </div>

        <div className="grid-2 mt-4" style={{ gridTemplateColumns: '1.15fr 0.85fr' }}>
          <div className="card" style={{ padding: 26 }}>
            <div className="flex-between">
              <h3 style={{ fontSize: '1.15rem' }}>Recently watched</h3>
              <Link to="/courses" style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--primary)' }}>
                All courses
              </Link>
            </div>
            <div className="divider" />
            {recent.length === 0 ? (
              <p style={{ fontSize: '0.92rem', color: 'var(--muted)' }}>
                You haven't watched any sessions yet. Start with a free preview!
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {recent.map((sid) => {
                  let session = null
                  let course = null
                  for (const c of COURSES) {
                    for (const m of c.modules) {
                      const s = m.sessions.find((x) => x.id === sid)
                      if (s) {
                        session = s
                        course = c
                        break
                      }
                    }
                    if (session) break
                  }
                  const extra = extraSessions.find((s) => s.id === sid)
                  if (session || extra) {
                    const s = session || extra
                    const c = course
                    return (
                      <Link
                        key={sid}
                        to={`/courses/${c.id}/session/${s.id}`}
                        className="session-row"
                        style={{ padding: '10px 14px' }}
                      >
                        <span className="session-thumb" style={{ backgroundImage: `url(https://img.youtube.com/vi/${s.ytId}/0.jpg)` }} />
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: '0.92rem' }}>{s.title}</h4>
                          <p>{c.title}</p>
                        </div>
                        <PlayCircle size={18} color="var(--primary)" />
                      </Link>
                    )
                  }
                  return null
                })}
              </div>
            )}
          </div>

          <div className="card" style={{ padding: 26 }}>
            <div className="flex-between">
              <h3 style={{ fontSize: '1.15rem' }}>Quiz scores</h3>
              <Link to="/quizzes" style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--primary)' }}>
                Take quizzes
              </Link>
            </div>
            <div className="divider" />
            {bestQuiz.length === 0 ? (
              <p style={{ fontSize: '0.92rem', color: 'var(--muted)' }}>
                Complete a quiz to see your best scores here.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {bestQuiz.map((q) => (
                  <div className="flex-between" key={q.title}>
                    <span style={{ fontSize: '0.92rem' }}>{q.title}</span>
                    <span className="chip chip-green">
                      {q.score}/{q.total}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <div className="divider" />
            <div className="flex-between">
              <span style={{ fontSize: '0.92rem', fontWeight: 600 }}>Past papers</span>
              <Link to="/papers" className="btn btn-ghost btn-sm">
                <FileText size={14} />
                Open papers
              </Link>
            </div>
          </div>
        </div>

        {fullAccess ? null : (
          <div className="cta-band mt-4">
            <h2>Unlock your full potential</h2>
            <p>
              Subscribe today and get instant access to every video session, past
              paper and quiz on SAC Labs.
            </p>
            <Link to="/pricing" className="btn btn-light">
              See plans
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

export default function Dashboard() {
  return (
    <Protected>
      <DashboardContent />
    </Protected>
  )
}
