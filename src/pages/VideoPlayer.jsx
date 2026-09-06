import { useEffect, useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, ChevronLeft, Clock, Lock, PlayCircle } from 'lucide-react'
import { useAuth } from '../context/useAuth'
import { allSessions, findCourse, findSessionAny } from '../data/helpers'
import { useProtectedContent } from '../utils/protection'

export default function VideoPlayer() {
  const { courseId, sessionId } = useParams()
  const navigate = useNavigate()
  const { canWatch, markWatched, hasFullAccess, customSessions } = useAuth()
  const playerRef = useProtectedContent()

  const course = findCourse(courseId)
  const extra = customSessions.filter((c) => c.courseId === courseId)
  const session = findSessionAny(course, sessionId, extra)

  const flat = useMemo(() => allSessions(course, extra), [course, extra])

  const idx = flat.findIndex((s) => s.id === sessionId)
  const next = idx >= 0 ? flat[idx + 1] : null

  useEffect(() => {
    if (session && (session.free || hasFullAccess())) {
      markWatched(session.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId])

  if (!course || !session) {
    return (
      <section className="section">
        <div className="container center">
          <h2 className="h2">Session not found</h2>
          <Link to="/courses" className="btn btn-primary mt-3">
            Back to courses
          </Link>
        </div>
      </section>
    )
  }

  const unlocked = canWatch(session)

  return (
    <section className="section-tight">
      <div className="container">
        <Link
          to={`/courses/${course.id}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: '0.9rem' }}
        >
          <ChevronLeft size={16} />
          {course.title}
        </Link>

        <div className="player-frame mt-2 guarded" ref={playerRef} onContextMenu={(e) => e.preventDefault()}>
          {unlocked ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${session.ytId}?rel=0&modestbranding=1`}
              title={session.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="paywall">
              <span
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  background: 'var(--grad)',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <Lock size={32} />
              </span>
              <h3 style={{ fontSize: '1.4rem' }}>This session is locked</h3>
              <p style={{ maxWidth: 400 }}>
                Subscribe to SAC Labs to unlock this video session and get access to
                all courses, papers and quizzes.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Link to="/pricing" className="btn btn-primary">
                  <PlayCircle size={16} />
                  Subscribe now
                </Link>
                <Link
                  to="/courses"
                  className="btn"
                  style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.5)' }}
                >
                  Browse free previews
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="card mt-2" style={{ padding: 26 }}>
          <div className="flex-between">
            <div>
              <h2 style={{ fontSize: '1.35rem' }}>{session.title}</h2>
              <p style={{ fontSize: '0.92rem', color: 'var(--muted)', marginTop: 6 }}>
                {session.description}
              </p>
              <div style={{ display: 'flex', gap: 10, marginTop: 10, alignItems: 'center' }}>
                <span className="chip chip-primary">
                  <Clock size={12} />
                  {session.duration}
                </span>
                {session.free ? (
                  <span className="free-badge">Free preview</span>
                ) : (
                  <span className="chip chip-teal">Premium session</span>
                )}
              </div>
            </div>
            {next && (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate(`/courses/${course.id}/session/${next.id}`)}
              >
                Next: {next.title.slice(0, 22)}…
                <ArrowRight size={15} />
              </button>
            )}
          </div>
        </div>

        {unlocked && !session.free && (
          <div className="card mt-2" style={{ padding: 20, background: '#f0fdf4', borderColor: '#bbf7d0' }}>
            <b style={{ fontSize: '0.95rem' }}>✓ Marked as watched</b>
            <p style={{ fontSize: '0.88rem', color: 'var(--muted)' }}>
              Your progress is saved. Keep going — consistency wins exams!
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
