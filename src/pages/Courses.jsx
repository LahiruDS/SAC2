import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, PlayCircle, Star } from 'lucide-react'
import { COURSES } from '../data/saclabsData'

export default function Courses() {
  return (
    <section className="section">
      <div className="container">
        <div className="center">
          <span className="eyebrow">Courses</span>
          <h2 className="h2">Browse all chemistry courses</h2>
          <p className="sub sub-center mt-1">
            Every course includes video sessions, past papers and quizzes. Watch a
            free preview before you subscribe.
          </p>
        </div>

        <div className="course-grid mt-4">
          {COURSES.map((course) => {
            const totalSessions = course.modules.reduce(
              (n, m) => n + m.sessions.length,
              0,
            )
            const freeCount = course.modules.reduce(
              (n, m) => n + m.sessions.filter((s) => s.free).length,
              0,
            )
            return (
              <Link to={`/courses/${course.id}`} className="card course-card" key={course.id}>
                <div className="course-banner" style={{ background: course.gradient }}>
                  <span className="chip">{course.level}</span>
                </div>
                <div className="course-body">
                  <h3>{course.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                    {course.tagline}
                  </p>
                  <div className="course-meta">
                    <span>
                      <BookOpen size={13} />
                      {course.modules.length} modules
                    </span>
                    <span>
                      <PlayCircle size={13} />
                      {totalSessions} sessions
                    </span>
                    <span>
                      <Star size={13} color="var(--accent)" fill="currentColor" />
                      {course.rating}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                    <span className="chip chip-green" style={{ marginRight: 6 }}>
                      {freeCount} free
                    </span>
                    {course.medium}
                  </p>
                  <div className="course-footer">
                    <span className="price">
                      LKR {course.price.toLocaleString()}
                      <small> /month</small>
                    </span>
                    <span className="btn btn-primary btn-sm">
                      View course
                      <ArrowRight size={15} />
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
