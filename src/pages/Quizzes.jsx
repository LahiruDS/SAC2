import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Award, ChevronLeft, Lock, RefreshCcw, Trophy } from 'lucide-react'
import { QUIZZES } from '../data/saclabsData'
import { useAuth } from '../context/useAuth'
import { useProtectedContent } from '../utils/protection'

const letters = ['A', 'B', 'C', 'D']

function allQuizzes(customQuizzes) {
  return [...customQuizzes, ...QUIZZES]
}

function QuizList() {
  const { scores, customQuizzes, hasFullAccess } = useAuth()
  const quizzes = allQuizzes(customQuizzes)
  const unlocked = hasFullAccess()

  return (
    <section className="section">
      <div className="container">
        <div className="center">
          <span className="eyebrow">Quizzes</span>
          <h2 className="h2">Test your chemistry knowledge</h2>
          <p className="sub sub-center mt-1">
            Try a quiz after each lesson. Your best score is saved to your dashboard.
            {!unlocked && ' Subscribers and approved students can attempt quizzes.'}
          </p>
        </div>

        <div className="grid-3 mt-4">
          {quizzes.map((quiz) => {
            const best = scores[quiz.id]
            return (
              <div className="card feature-card" key={quiz.id}>
                <span className="feature-icon" style={{ background: `${quiz.color}1a`, color: quiz.color }}>
                  <Trophy size={22} />
                </span>
                <h3>{quiz.title}</h3>
                <p style={{ fontSize: '0.9rem' }}>{quiz.description}</p>
                <div className="mt-2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  {best !== undefined ? (
                    <span className="chip chip-green">Best: {best}/{quiz.questions.length}</span>
                  ) : unlocked ? (
                    <span className="chip chip-pink">Not attempted</span>
                  ) : (
                    <span className="chip chip-amber">
                      <Lock size={11} style={{ verticalAlign: '-1px' }} /> Locked
                    </span>
                  )}
                  <Link to={`/quizzes/${quiz.id}`} className="btn btn-primary btn-sm">
                    Start quiz
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function QuizPlay({ quizId }) {
  const { scores, saveScore, customQuizzes, hasFullAccess, user } = useAuth()
  const quiz = allQuizzes(customQuizzes).find((q) => q.id === quizId)
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const guardRef = useProtectedContent()

  if (!quiz) {
    return (
      <section className="section">
        <div className="container center">
          <h2 className="h2">Quiz not found</h2>
          <Link to="/quizzes" className="btn btn-primary mt-3">
            Back to quizzes
          </Link>
        </div>
      </section>
    )
  }

  if (!hasFullAccess()) {
    return (
      <section className="section-tight">
        <div className="container">
          <Link to="/quizzes" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: '0.9rem' }}>
            <ChevronLeft size={16} />
            All quizzes
          </Link>
          <div className="card mt-2 center" style={{ padding: '48px 24px', textAlign: 'center' }}>
            <span
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: 'var(--grad)',
                display: 'inline-grid',
                placeItems: 'center',
                color: '#fff',
                marginBottom: 16,
              }}
            >
              <Lock size={32} />
            </span>
            <h2 className="h2" style={{ fontSize: '1.5rem' }}>This quiz is locked</h2>
            <p className="sub sub-center mt-1" style={{ maxWidth: 460, marginInline: 'auto' }}>
              {user?.name?.split(' ')[0]}, quizzes are available for subscribed and
              approved students. Subscribe or send your payment proof to get manual
              access from the teacher.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 22 }}>
              <Link to="/pricing" className="btn btn-primary">
                <Trophy size={16} />
                See plans
              </Link>
              <Link to="/verify-payment" className="btn btn-ghost">
                Send payment proof
              </Link>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const questions = quiz.questions
  const q = questions[current]
  const answered = answers[current] !== undefined
  const score = Object.entries(answers).filter(
    ([i, a]) => questions[i].answer === a,
  ).length
  const finished = submitted && current === questions.length - 1

  const pick = (optIdx) => {
    if (submitted) return
    setAnswers((a) => ({ ...a, [current]: optIdx }))
  }

  const submit = () => {
    setSubmitted(true)
    saveScore(quiz.id, score)
  }

  const restart = () => {
    setCurrent(0)
    setAnswers({})
    setSubmitted(false)
  }

  return (
    <section className="section-tight">
      <div className="container">
        <Link to="/quizzes" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: '0.9rem' }}>
          <ChevronLeft size={16} />
          All quizzes
        </Link>

        <div className="card mt-2 guarded" ref={guardRef} style={{ padding: 30 }}>
          <div className="flex-between">
            <h2 style={{ fontSize: '1.3rem' }}>{quiz.title}</h2>
            {bestScore(scores[quiz.id], score, submitted) !== null && (
              <span className="chip chip-green">
                Best score: {bestScore(scores[quiz.id], score, submitted)}
              </span>
            )}
          </div>

          <div className="progress-bar mt-2">
            <div
              className="progress-fill"
              style={{ width: `${((current + (submitted ? 1 : 0)) / questions.length) * 100}%` }}
            />
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: 8 }}>
            Question {current + 1} of {questions.length}
          </p>

          {!finished && (
            <>
              <h3 style={{ fontSize: '1.15rem', marginTop: 20 }}>{q.q}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18 }}>
                {q.options.map((opt, i) => {
                  let cls = 'quiz-option'
                  if (answers[current] === i) cls += ' selected'
                  if (submitted) {
                    if (q.answer === i) cls = 'quiz-option correct'
                    else if (answers[current] === i) cls = 'quiz-option wrong'
                  }
                  return (
                    <button key={i} className={cls} onClick={() => pick(i)} disabled={submitted}>
                      <span className="opt-letter">{letters[i]}</span>
                      {opt}
                    </button>
                  )
                })}
              </div>

              {submitted && (
                <div className="card mt-2" style={{ padding: 16, background: '#f0fdf4', borderColor: '#bbf7d0' }}>
                  <b>
                    {answers[current] === q.answer
                      ? 'Correct! 🎉'
                      : `Incorrect — correct answer: ${letters[q.answer]}. ${q.options[q.answer]}`}
                  </b>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
                <button
                  className="btn btn-ghost"
                  onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                  disabled={current === 0 || submitted}
                >
                  Previous
                </button>
                {current < questions.length - 1 ? (
                  <button
                    className="btn btn-primary"
                    disabled={!answered}
                    onClick={() => setCurrent((c) => c + 1)}
                  >
                    Next
                  </button>
                ) : (
                  <button className="btn btn-primary" onClick={submit} disabled={!answered}>
                    <Award size={16} />
                    Submit quiz
                  </button>
                )}
              </div>
            </>
          )}

          {finished && (
            <div className="center" style={{ padding: '30px 0' }}>
              <span
                style={{
                  width: 84,
                  height: 84,
                  borderRadius: '50%',
                  background: 'var(--grad)',
                  display: 'inline-grid',
                  placeItems: 'center',
                  color: '#fff',
                  marginBottom: 16,
                }}
              >
                <Trophy size={40} />
              </span>
              <h2 className="h2">
                You scored {score}/{questions.length}
              </h2>
              <p className="sub sub-center mt-1">
                {score >= 8
                  ? 'Outstanding! You are a chemistry star. 🌟'
                  : score >= 5
                    ? 'Good effort! Review the lessons and try again.'
                    : 'Don’t worry — revisit the video sessions and give it another shot.'}
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
                <button className="btn btn-primary" onClick={restart}>
                  <RefreshCcw size={16} />
                  Retry quiz
                </button>
                <Link to="/courses" className="btn btn-ghost">
                  Back to lessons
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function bestScore(saved, current, submitted) {
  if (saved === undefined && !submitted) return null
  return submitted ? Math.max(saved || 0, current) : saved
}

export default function Quizzes() {
  const { quizId } = useParams()
  return quizId ? <QuizPlay quizId={quizId} /> : <QuizList />
}
