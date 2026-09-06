import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Award,
  Brain,
  FileText,
  GraduationCap,
  Lock,
  MessageCircle,
  Play,
  PlayCircle,
  Sparkles,
  Star,
  Video,
} from 'lucide-react'
import { COURSES, TESTIMONIALS } from '../data/saclabsData'

const features = [
  {
    icon: Video,
    color: '#7c3aed',
    bg: '#ede9fe',
    title: 'HD Video Sessions',
    text: 'Short, focused lessons that make even the hardest chemistry topics easy to understand.',
  },
  {
    icon: FileText,
    color: '#0d9488',
    bg: '#ccfbf1',
    title: 'Past Papers & Notes',
    text: 'Download model papers, past papers and beautiful summary notes for quick revision.',
  },
  {
    icon: Brain,
    color: '#ec4899',
    bg: '#fce7f3',
    title: 'Interactive Quizzes',
    text: 'Test yourself after every lesson with instant scoring so you always know where you stand.',
  },
  {
    icon: MessageCircle,
    color: '#f59e0b',
    bg: '#fef3c7',
    title: 'Doubt Support',
    text: 'Stuck on a question? Message us on WhatsApp and get answers within the day.',
  },
  {
    icon: Lock,
    color: '#0ea5e9',
    bg: '#e0f2fe',
    title: 'Secure Access',
    text: 'Only subscribed students can unlock sessions. Your learning progress is saved automatically.',
  },
  {
    icon: GraduationCap,
    color: '#d946ef',
    bg: '#fae8ff',
    title: 'Exam Focused',
    text: 'Every lesson is aligned to the A/L and O/L syllabus with past paper walk-throughs.',
  },
]

const steps = [
  {
    num: '01',
    title: 'Create a free account',
    text: 'Sign up with your name and email in less than a minute.',
  },
  {
    num: '02',
    title: 'Watch free previews',
    text: 'Try the free sessions from any course to see how we teach.',
  },
  {
    num: '03',
    title: 'Subscribe & unlock',
    text: 'Pick a monthly, quarterly or yearly plan to unlock everything.',
  },
  {
    num: '04',
    title: 'Learn & ace your exam',
    text: 'Watch videos, do quizzes, download papers — all in one place.',
  },
]

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-blob b1" />
        <div className="hero-blob b2" />
        <div className="container hero-grid">
          <div className="fade-up">
            
            <h1 className="hero-title">
              Master Chemistry with{' '}
              <span className="grad-text">SAC Labs</span>
            </h1>
            <p className="hero-text">
              HD video tutorials, past papers and quizzes — everything you need to
              ace your A/L or O/L Chemistry exam, all in one friendly place.
            </p>
            <div className="hero-cta">
              <Link to="/courses" className="btn btn-primary">
                <PlayCircle size={18} />
                Start Learning
              </Link>
              <Link to="/pricing" className="btn btn-ghost">
                View Plans
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <b>2,600+</b>
                <span>Students</span>
              </div>
              <div className="hero-stat">
                <b>50+</b>
                <span>Video Sessions</span>
              </div>
              <div className="hero-stat">
                <b>4.8★</b>
                <span>Average Rating</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-card">
              <a
                href="https://www.youtube.com/watch?v=FSyAehMdpyI"
                target="_blank"
                rel="noopener noreferrer"
                style={{ position: 'relative', display: 'block', borderRadius: 16, overflow: 'hidden' }}
              >
                <img
                  src="https://img.youtube.com/vi/FSyAehMdpyI/0.jpg"
                  alt="Free preview lesson"
                  style={{ width: '100%', borderRadius: 16, objectFit: 'cover', aspectRatio: '16/9' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'grid',
                    placeItems: 'center',
                    background: 'rgba(15,13,26,0.35)',
                  }}
                >
                  <span
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.9)',
                      display: 'grid',
                      placeItems: 'center',
                      color: '#7c3aed',
                    }}
                  >
                    <Play size={28} fill="currentColor" />
                  </span>
                </span>
              </a>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 6px 4px' }}>
                <div>
                  <b style={{ display: 'block', fontSize: '0.98rem' }}>Atomic Structure — Free Preview</b>
                  <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>11:10 · G.C.E. A/L Chemistry</span>
                </div>
                <span className="chip chip-green">
                  <Award size={13} />
                  Free
                </span>
              </div>
            </div>

            <div className="hero-mini m1">
              <span className="mini-icon" style={{ background: 'var(--grad)', color: '#fff' }}>
                <Video size={20} />
              </span>
              <div>
                <b>New lesson added</b>
                <span>Kinetics & Equilibrium</span>
              </div>
            </div>

            <div className="hero-mini m2">
              <span className="mini-icon" style={{ background: '#ccfbf1', color: '#0d9488' }}>
                <Brain size={20} />
              </span>
              <div>
                <b>Quiz score: 9/10</b>
                <span>Well done, keep going!</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section-tight">
        <div className="container">
          <div className="center">
            <span className="eyebrow">Why SAC Labs?</span>
            <h2 className="h2">Everything you need to love chemistry</h2>
            <p className="sub sub-center mt-1">
              We built SAC Labs for students like you — simple, fun and made for
              exam success.
            </p>
          </div>
          <div className="grid-3 mt-4">
            {features.map((f) => (
              <div className="card feature-card" key={f.title}>
                <span className="feature-icon" style={{ background: f.bg, color: f.color }}>
                  <f.icon size={24} />
                </span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COURSES */}
      <section className="section">
        <div className="container">
          <div className="flex-between">
            <div>
              <span className="eyebrow">Our Courses</span>
              <h2 className="h2">Pick your course</h2>
              <p className="sub mt-1">Browse our chemistry courses below.</p>
            </div>
            <Link to="/courses" className="btn btn-ghost btn-sm">
              View all courses
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="course-grid mt-4">
            {COURSES.map((course) => (
              <Link to={`/courses/${course.id}`} className="card course-card" key={course.id}>
                <div className="course-banner" style={{ background: course.gradient }}>
                  <span className="chip">{course.level}</span>
                </div>
                <div className="course-body">
                  <h3>{course.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>{course.tagline}</p>
                  <div className="course-meta">
                    <span>🎓 {course.students.toLocaleString()} students</span>
                    <span>
                      <Star size={13} color="var(--accent)" fill="currentColor" />
                      {course.rating}
                    </span>
                  </div>
                  <div className="course-footer">
                    <span className="price">
                      LKR {course.price.toLocaleString()}
                      <small> /month</small>
                    </span>
                    <span className="btn btn-primary btn-sm">
                      <PlayCircle size={15} />
                      Enroll
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section-tight">
        <div className="container">
          <div className="center">
            <span className="eyebrow">How it works</span>
            <h2 className="h2">Start learning in 4 easy steps</h2>
          </div>
          <div className="grid-3 mt-4">
            {steps.map((s) => (
              <div className="card step-card" key={s.num}>
                <span className="step-num">{s.num}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section">
        <div className="container">
          <div className="center">
            <span className="eyebrow">Student Love</span>
            <h2 className="h2">What our students say</h2>
          </div>
          <div className="grid-3 mt-4">
            {TESTIMONIALS.map((t) => (
              <div className="card testi-card" key={t.name}>
                <div className="stars">
                  {'★'.repeat(t.stars)}
                </div>
                <p>“{t.text}”</p>
                <div className="testi-user">
                  <span className="avatar" style={{ background: t.color }}>
                    {t.initials}
                  </span>
                  <div>
                    <b>{t.name}</b>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-tight">
        <div className="container">
          <div className="cta-band">
            <h2>Ready to master Chemistry?</h2>
            <p>
              Join 2,600+ students who trust SAC Labs for their exam preparation.
              Start with a free lesson today.
            </p>
            <div className="hero-cta" style={{ justifyContent: 'center' }}>
              <Link to="/register" className="btn btn-light">
                Create free account
              </Link>
              <Link
                to="/pricing"
                className="btn"
                style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.5)' }}
              >
                See pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
