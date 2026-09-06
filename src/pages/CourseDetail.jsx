import { Link, useParams } from 'react-router-dom'
import { ChevronLeft, Clock, FileText, Lock, Play, Star } from 'lucide-react'
import { findCourse } from '../data/helpers'
import { useAuth } from '../context/useAuth'

function Thumb({ ytId, free }) {
  return (
    <span
      className="session-thumb"
      style={{ backgroundImage: `url(https://img.youtube.com/vi/${ytId}/0.jpg)` }}
    >
      <span
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: free ? 'rgba(22,163,74,0.9)' : 'rgba(124,58,237,0.9)',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        {free ? <Play size={14} fill="currentColor" /> : <Lock size={14} />}
      </span>
    </span>
  )
}

export default function CourseDetail() {
  const { courseId } = useParams()
  const { customSessions, isActive, canWatch, watched } = useAuth()
  const course = findCourse(courseId)

  if (!course) {
    return (
      <section className="section">
        <div className="container center">
          <h2 className="h2">Course not found</h2>
          <p className="sub sub-center mt-1">
            The course you are looking for doesn’t exist.
          </p>
          <Link to="/courses" className="btn btn-primary mt-3">
            Back to courses
          </Link>
        </div>
      </section>
    )
  }

  const extra = customSessions
    .filter((c) => c.courseId === course.id)
    .map((c) => c.session)

  const totalSessions =
    course.modules.reduce((n, m) => n + m.sessions.length, 0) + extra.length

  return (
    <section className="section">
      <div className="container">
        <Link
          to="/courses"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: '0.9rem' }}
        >
          <ChevronLeft size={16} />
          All courses
        </Link>

        <div
          className="card mt-2"
          style={{
            background: course.gradient,
            color: '#fff',
            padding: 36,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', maxWidth: 620 }}>
            {course.title}
          </h1>
          <p style={{ opacity: 0.92, marginTop: 8, maxWidth: 520 }}>{course.description}</p>
          <div style={{ display: 'flex', gap: 18, marginTop: 20, flexWrap: 'wrap' }}>
            <span className="chip" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>
              {course.level} Level
            </span>
            <span className="chip" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>
              {course.medium}
            </span>
            <span className="chip" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>
              {totalSessions} sessions
            </span>
            <span className="chip" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>
              <Star size={13} fill="currentColor" />
              {course.rating}
            </span>
            <span className="chip" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>
              LKR {course.price.toLocaleString()} /month
            </span>
          </div>
          {!isActive() && (
            <Link
              to="/pricing"
              className="btn btn-light mt-3"
              style={{ marginTop: 24 }}
            >
              Unlock full course
            </Link>
          )}
        </div>

        <div className="mt-4">
          {course.modules.map((mod) => {
            return (
              <div key={mod.id} className="mt-4">
                <div className="flex-between">
                  <h3 style={{ fontSize: '1.25rem' }}>{mod.title}</h3>
                  <span className="chip chip-primary">{mod.sessions.length} sessions</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} className="mt-2">
                  {mod.sessions.map((s, i) => {
                    const locked = !canWatch(s)
                    const isWatched = watched.includes(s.id)
                    return (
                      <Link
                        key={s.id}
                        to={`/courses/${course.id}/session/${s.id}`}
                        className="session-row"
                      >
                        <Thumb ytId={s.ytId} free={s.free} />
                        <div style={{ flex: 1 }}>
                          <h4>
                            {i + 1}. {s.title}
                          </h4>
                          <p>{s.description}</p>
                          <div style={{ display: 'flex', gap: 10, marginTop: 6, alignItems: 'center' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', color: 'var(--muted)' }}>
                              <Clock size={12} />
                              {s.duration}
                            </span>
                            {s.free ? (
                              <span className="free-badge">
                                <Play size={11} />
                                Free preview
                              </span>
                            ) : locked ? (
                              <span className="lock-badge">
                                <Lock size={11} />
                                Locked
                              </span>
                            ) : null}
                            {isWatched && <span className="chip chip-green">Watched ✓</span>}
                          </div>
                        </div>
                        <span
                          className="btn btn-sm"
                          style={{
                            background: locked
                              ? '#f1eefc'
                              : 'var(--grad)',
                            color: locked ? 'var(--primary-dark)' : '#fff',
                          }}
                        >
                          {locked ? <Lock size={14} /> : <Play size={14} fill="currentColor" />}
                          {locked ? 'Unlock' : 'Play'}
                        </span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}

          {extra.length > 0 && (
            <div className="mt-4">
              <div className="flex-between">
                <h3 style={{ fontSize: '1.25rem' }}>Newly added by your teacher</h3>
                <span className="chip chip-pink">{extra.length} sessions</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} className="mt-2">
                {extra.map((s) => {
                  const locked = !canWatch(s)
                  const isWatched = watched.includes(s.id)
                  return (
                    <Link
                      key={s.id}
                      to={`/courses/${course.id}/session/${s.id}`}
                      className="session-row"
                    >
                      <Thumb ytId={s.ytId} free={s.free} />
                      <div style={{ flex: 1 }}>
                        <h4>
                          ★ {s.title}
                        </h4>
                        <p>{s.description}</p>
                        <div style={{ display: 'flex', gap: 10, marginTop: 6, alignItems: 'center' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', color: 'var(--muted)' }}>
                            <Clock size={12} />
                            {s.duration}
                          </span>
                          {s.free ? (
                            <span className="free-badge">
                              <Play size={11} />
                              Free preview
                            </span>
                          ) : locked ? (
                            <span className="lock-badge">
                              <Lock size={11} />
                              Locked
                            </span>
                          ) : null}
                          {isWatched && <span className="chip chip-green">Watched ✓</span>}
                        </div>
                      </div>
                      <span
                        className="btn btn-sm"
                        style={{
                          background: locked ? '#f1eefc' : 'var(--grad)',
                          color: locked ? 'var(--primary-dark)' : '#fff',
                        }}
                      >
                        {locked ? <Lock size={14} /> : <Play size={14} fill="currentColor" />}
                        {locked ? 'Unlock' : 'Play'}
                      </span>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {!isActive() && (
          <div className="card mt-4" style={{ padding: 28, background: 'var(--grad-soft)' }}>
            <div className="flex-between">
              <div>
                <h3 style={{ fontSize: '1.2rem' }}>Want to unlock everything?</h3>
                <p style={{ fontSize: '0.92rem', color: 'var(--muted)' }}>
                  Get access to all {totalSessions} sessions, papers and quizzes from just LKR{' '}
                  {course.price.toLocaleString()} per month.
                </p>
              </div>
              <Link to="/pricing" className="btn btn-primary">
                See plans
                <FileText size={15} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
