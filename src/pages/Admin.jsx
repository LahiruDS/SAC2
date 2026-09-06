import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Brain,
  FilePlus2,
  KeyRound,
  MailCheck,
  PlayCircle,
  Plus,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react'
import { COURSES, PLANS } from '../data/saclabsData'
import { useAuth } from '../context/useAuth'
import Protected from '../components/Protected'
import { MAX_PAPER_BYTES, humanFileSize, savePaperFile } from '../utils/paperStore'

const letters = ['A', 'B', 'C', 'D']

const emptyQuestion = () => ({ q: '', options: ['', '', '', ''], answer: 0 })

function AdminContent() {
  const {
    user,
    addSession,
    removeSession,
    addPaper,
    removePaper,
    addQuiz,
    removeQuiz,
    customSessions,
    customPapers,
    customQuizzes,
    payRequests,
    approvePaymentRequest,
    rejectPaymentRequest,
    grantAccess,
    extendGrant,
    revokeGrant,
    grants,
    registeredUsers,
  } = useAuth()

  /* ---- Session form ---- */
  const [courseId, setCourseId] = useState(COURSES[0].id)
  const [title, setTitle] = useState('')
  const [ytId, setYtId] = useState('')
  const [duration, setDuration] = useState('')
  const [description, setDescription] = useState('')
  const [free, setFree] = useState(false)

  /* ---- Paper form ---- */
  const [pTitle, setPTitle] = useState('')
  const [pSubject, setPSubject] = useState('A/L Chemistry')
  const [pType, setPType] = useState('Past Paper')
  const [pPages, setPPages] = useState('')
  const [pFile, setPFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  /* ---- Access management ---- */
  const [gEmail, setGEmail] = useState('')
  const [gPlan, setGPlan] = useState('monthly')
  const [gNote, setGNote] = useState('')

  /* ---- Quiz builder ---- */
  const [qTitle, setQTitle] = useState('')
  const [qDesc, setQDesc] = useState('')
  const [questions, setQuestions] = useState([emptyQuestion()])

  const [toast, setToast] = useState(null)

  const notify = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 1800)
  }

  const submitSession = (e) => {
    e.preventDefault()
    if (!title.trim() || !ytId.trim()) {
      notify('Title and YouTube ID are required')
      return
    }
    addSession(courseId, {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      ytId: ytId.trim(),
      duration: duration.trim() || '10:00',
      free,
      description: description.trim() || 'Custom session added by your teacher.',
    })
    setTitle('')
    setYtId('')
    setDuration('')
    setDescription('')
    setFree(false)
    notify('Session added! It is now live in the course.')
  }

  const submitPaper = async (e) => {
    e.preventDefault()
    if (!pTitle.trim()) {
      notify('Paper title is required')
      return
    }
    if (pFile && pFile.type !== 'application/pdf') {
      notify('Only PDF files are supported')
      return
    }
    if (pFile && pFile.size > MAX_PAPER_BYTES) {
      notify('PDF is too large — keep it under 4 MB')
      return
    }

    setUploading(true)
    const id = `paper-custom-${Date.now()}`
    let fileKey = null
    let filePath = null
    let fileUrl = null
    if (pFile) {
      try {
        const res = await savePaperFile(id, pFile)
        fileKey = res.key
        filePath = res.filePath
        fileUrl = res.url
      } catch {
        notify('Could not upload the PDF. Please check your connection and try again.')
        setUploading(false)
        return
      }
    }

    addPaper({
      id,
      title: pTitle.trim(),
      subject: pSubject,
      type: pType,
      pages: pPages || '—',
      size: pFile ? humanFileSize(pFile.size) : '—',
      color: '#7c3aed',
      fileKey,
      fileName: pFile?.name || '',
      filePath,
      fileUrl,
    })
    setPTitle('')
    setPPages('')
    setPFile(null)
    e.target.reset()
    setUploading(false)
    notify(pFile ? 'Paper uploaded! Students can now download the PDF.' : 'Paper added!')
  }

  const manualGrant = (e) => {
    e.preventDefault()
    if (!gEmail.trim() || !gEmail.includes('@')) {
      notify('Enter a valid student email')
      return
    }
    grantAccess(gEmail.trim().toLowerCase(), { planId: gPlan, note: gNote.trim() })
    notify(`Access granted to ${gEmail.trim().toLowerCase()}`)
    setGEmail('')
    setGNote('')
  }

  const updateQuestion = (idx, patch) => {
    setQuestions((qs) => qs.map((q, i) => (i === idx ? { ...q, ...patch } : q)))
  }

  const updateOption = (qIdx, optIdx, value) => {
    setQuestions((qs) =>
      qs.map((q, i) => {
        if (i !== qIdx) return q
        const options = q.options.map((o, j) => (j === optIdx ? value : o))
        return { ...q, options }
      }),
    )
  }

  const addQuestion = () => setQuestions((qs) => [...qs, emptyQuestion()])
  const removeQuestion = (idx) =>
    setQuestions((qs) => (qs.length > 1 ? qs.filter((_, i) => i !== idx) : qs))

  const submitQuiz = (e) => {
    e.preventDefault()
    const validQuestions = questions.map((q) => ({
      q: q.q.trim(),
      options: q.options.map((o) => o.trim()),
      answer: q.answer,
    }))

    if (!qTitle.trim()) {
      notify('Quiz title is required')
      return
    }
    if (validQuestions.length < 2) {
      notify('Add at least 2 questions')
      return
    }
    for (let i = 0; i < validQuestions.length; i++) {
      const q = validQuestions[i]
      if (!q.q) {
        notify(`Question ${i + 1} has no text`)
        return
      }
      if (q.options.some((o) => !o)) {
        notify(`Question ${i + 1} has an empty option`)
        return
      }
    }

    addQuiz({
      id: `quiz-custom-${Date.now()}`,
      title: qTitle.trim(),
      description: qDesc.trim() || `${validQuestions.length} questions · your teacher`,
      icon: 'trophy',
      color: '#7c3aed',
      custom: true,
      questions: validQuestions,
    })
    setQTitle('')
    setQDesc('')
    setQuestions([emptyQuestion()])
    notify('Quiz published! Students can try it now.')
  }

  const sectionTitle = (icon, text) => (
    <h3
      style={{
        fontSize: '1.15rem',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6,
      }}
    >
      {icon}
      {text}
    </h3>
  )

  return (
    <section className="section-tight">
      <div className="container">
        <div className="center">
          <span className="eyebrow">Teacher Panel</span>
          <h2 className="h2">Add content for your students</h2>
          <p className="sub sub-center mt-1">
            Hello {user?.name}. Add new video sessions, past papers and quizzes here —
            they go live instantly for your students.
          </p>
        </div>

        {/* STUDENT ACCESS MANAGEMENT */}
        <div className="card mt-4" style={{ padding: 26 }}>
          {sectionTitle(<ShieldCheck size={20} color="var(--primary)" />, 'Student access & payments')}

          <p style={{ fontSize: '0.88rem', color: 'var(--muted)' }}>
            When a student sends their payment proof, approve it here (or grant access
            manually) — locked sessions, quizzes and paper downloads unlock instantly for
            that student.
          </p>

          <div className="divider" />

          <b style={{ fontSize: '0.9rem' }}>
            <MailCheck size={15} style={{ verticalAlign: '-2px' }} /> Payment proofs waiting for review
          </b>
          {payRequests.filter((r) => r.status === 'pending').length === 0 ? (
            <p style={{ fontSize: '0.88rem', color: 'var(--muted)', margin: '8px 0 4px' }}>
              No pending payments right now.
            </p>
          ) : (
            <ul style={{ margin: '10px 0 16px', display: 'flex', flexDirection: 'column', gap: 10, listStyle: 'none', padding: 0 }}>
              {payRequests
                .filter((r) => r.status === 'pending')
                .map((r) => (
                  <li key={r.id} className="card" style={{ padding: 14, background: '#fffbeb', borderColor: '#fde68a' }}>
                    <div className="flex-between" style={{ flexWrap: 'wrap', gap: 8 }}>
                      <div>
                        <b style={{ fontSize: '0.95rem' }}>{r.name}</b>{' '}
                        <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>({r.email})</span>
                        <p style={{ fontSize: '0.84rem', color: 'var(--muted)', marginTop: 2 }}>
                          {r.level} · {PLANS.find((p) => p.id === r.planId)?.name || r.planId} ·{' '}
                          {r.method}
                          {r.reference ? ` · Ref: ${r.reference}` : ''}
                          {r.receiptName ? ` · Receipt: ${r.receiptName}` : ''}
                        </p>
                        <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: 2 }}>
                          Submitted {new Date(r.requestedAt).toLocaleString('en-GB')}
                          {r.message ? ` · “${r.message}”` : ''}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          className="btn btn-sm"
                          style={{ background: '#dcfce7', color: '#15803d' }}
                          onClick={() => {
                            approvePaymentRequest(r.id)
                            notify(`Access granted to ${r.email}`)
                          }}
                        >
                          Approve &amp; grant access
                        </button>
                        <button
                          className="btn btn-sm"
                          style={{ background: '#fef2f2', color: '#b91c1c' }}
                          onClick={() => {
                            rejectPaymentRequest(r.id)
                            notify('Request rejected')
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          )}

          <div className="divider" />

          <b style={{ fontSize: '0.9rem' }}>
            <KeyRound size={15} style={{ verticalAlign: '-2px' }} /> Grant access manually
          </b>
          <form onSubmit={manualGrant} className="mt-2">
            <div className="flex" style={{ alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div className="field" style={{ flex: 1.5 }}>
                <label>Student email</label>
                <input
                  list="registered-emails"
                  required
                  placeholder="student@email.com"
                  value={gEmail}
                  onChange={(e) => setGEmail(e.target.value)}
                />
                <datalist id="registered-emails">
                  {registeredUsers.map((u) => (
                    <option key={u.email} value={u.email}>
                      {u.name}
                    </option>
                  ))}
                </datalist>
              </div>
              <div className="field" style={{ flex: 1 }}>
                <label>Duration</label>
                <select value={gPlan} onChange={(e) => setGPlan(e.target.value)}>
                  <option value="monthly">1 month (30 days)</option>
                  <option value="quarterly">3 months (92 days)</option>
                  <option value="yearly">1 year (365 days)</option>
                </select>
              </div>
              <button className="btn btn-primary">Grant access</button>
            </div>
            <div className="field">
              <input
                placeholder="Note (optional) — e.g. paid via bank slip #2231"
                value={gNote}
                onChange={(e) => setGNote(e.target.value)}
              />
            </div>
          </form>

          <div className="divider" />

          <b style={{ fontSize: '0.9rem' }}>Active manual grants</b>
          {grants.length === 0 ? (
            <p style={{ fontSize: '0.88rem', color: 'var(--muted)', margin: '8px 0 0' }}>
              No students have been granted manual access yet.
            </p>
          ) : (
            <ul style={{ margin: '10px 0 0', display: 'flex', flexDirection: 'column', gap: 8, listStyle: 'none', padding: 0 }}>
              {grants.map((g) => {
                const active = Date.now() < g.expiresAt
                return (
                  <li
                    key={g.id || g.email}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 10,
                      flexWrap: 'wrap',
                      fontSize: '0.92rem',
                      padding: '10px 12px',
                      border: '1px solid var(--line)',
                      borderRadius: 10,
                    }}
                  >
                    <span>
                      <b>{g.name}</b> · {g.email}{' '}
                      <span className={`chip ${active ? 'chip-green' : 'chip-amber'}`}>
                        {active ? 'Active' : 'Expired'}
                      </span>
                      <span style={{ color: 'var(--muted)', fontSize: '0.82rem', display: 'block', marginTop: 2 }}>
                        Until {new Date(g.expiresAt).toLocaleDateString('en-GB')}
                        {g.note ? ` · ${g.note}` : ''}
                      </span>
                    </span>
                    <span style={{ display: 'flex', gap: 8 }}>
                      <button
                        className="btn btn-sm"
                        onClick={() => {
                          extendGrant(g.email, 30)
                          notify('Extended by 30 days')
                        }}
                      >
                        +30 days
                      </button>
                      <button
                        className="btn btn-sm"
                        style={{ background: '#fef2f2', color: '#b91c1c' }}
                        onClick={() => {
                          revokeGrant(g.email)
                          notify('Access revoked')
                        }}
                      >
                        <Trash2 size={13} />
                        Revoke
                      </button>
                    </span>
                  </li>
                )
              })}
            </ul>
          )}

          <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginTop: 14 }}>
            Approvals are saved to the cloud — students see their access on any device,
            instantly.
          </p>
        </div>

        <div className="grid-2 mt-4">
          <div className="card" style={{ padding: 26 }}>
            {sectionTitle(<PlayCircle size={20} color="var(--primary)" />, 'Add a video session')}
            <p style={{ fontSize: '0.88rem', color: 'var(--muted)' }}>
              Paste the YouTube video ID from a link like
              youtube.com/watch?v=<b>FSyAehMdpyI</b>
            </p>
            <form onSubmit={submitSession} className="mt-3">
              <div className="field">
                <label>Course</label>
                <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
                  {COURSES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Session title</label>
                <input required placeholder="e.g. Mole Concept — Part 1" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="field">
                <label>YouTube video ID</label>
                <input required placeholder="FSyAehMdpyI" value={ytId} onChange={(e) => setYtId(e.target.value)} />
              </div>
              <div className="flex">
                <div className="field" style={{ flex: 1 }}>
                  <label>Duration</label>
                  <input placeholder="11:10" value={duration} onChange={(e) => setDuration(e.target.value)} />
                </div>
                <div className="field" style={{ flex: 1 }}>
                  <label>Free preview?</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 10 }}>
                    <input
                      type="checkbox"
                      checked={free}
                      onChange={(e) => setFree(e.target.checked)}
                      style={{ width: 18, height: 18 }}
                    />
                    <span style={{ fontSize: '0.9rem' }}>Free</span>
                  </div>
                </div>
              </div>
              <div className="field">
                <label>Description</label>
                <textarea rows={2} placeholder="Short description of the lesson…" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <button className="btn btn-primary btn-block">
                <Plus size={16} />
                Add session
              </button>
            </form>
          </div>

          <div className="card" style={{ padding: 26 }}>
            {sectionTitle(<FilePlus2 size={20} color="var(--primary)" />, 'Add a paper / notes')}
            <p style={{ fontSize: '0.88rem', color: 'var(--muted)' }}>
              Upload the real PDF file so students can download it from the Papers page.
            </p>
            <form onSubmit={submitPaper} className="mt-3">
              <div className="field">
                <label>Title</label>
                <input required placeholder="e.g. A/L Chemistry — 2025 Paper" value={pTitle} onChange={(e) => setPTitle(e.target.value)} />
              </div>
              <div className="flex">
                <div className="field" style={{ flex: 1 }}>
                  <label>Subject</label>
                  <select value={pSubject} onChange={(e) => setPSubject(e.target.value)}>
                    <option>A/L Chemistry</option>
                    <option>O/L Science</option>
                    <option>Notes</option>
                  </select>
                </div>
                <div className="field" style={{ flex: 1 }}>
                  <label>Type</label>
                  <select value={pType} onChange={(e) => setPType(e.target.value)}>
                    <option>Past Paper</option>
                    <option>Question Bank</option>
                    <option>Notes</option>
                  </select>
                </div>
              </div>
              <div className="flex">
                <div className="field" style={{ flex: 1 }}>
                  <label>Pages (optional)</label>
                  <input placeholder="18" value={pPages} onChange={(e) => setPPages(e.target.value)} />
                </div>
                <div className="field" style={{ flex: 2 }}>
                  <label>PDF file</label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setPFile(e.target.files?.[0] || null)}
                  />
                  {pFile && (
                    <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: 4 }}>
                      {pFile.name} · {humanFileSize(pFile.size)}
                    </p>
                  )}
                </div>
              </div>
              <button className="btn btn-primary btn-block" disabled={uploading}>
                <Plus size={16} />
                {uploading ? 'Uploading…' : pFile ? 'Upload & add paper' : 'Add paper'}
              </button>
            </form>
          </div>
        </div>

        {/* QUIZ BUILDER */}
        <div className="card mt-4" style={{ padding: 26 }}>
          {sectionTitle(<Brain size={20} color="var(--primary)" />, 'Build a quiz')}
          <p style={{ fontSize: '0.88rem', color: 'var(--muted)' }}>
            Create a multiple-choice quiz with up to 4 options per question. Pick the
            correct option and publish — students can take it right away.
          </p>

          <form onSubmit={submitQuiz} className="mt-3">
            <div className="flex">
              <div className="field" style={{ flex: 1.4 }}>
                <label>Quiz title</label>
                <input required placeholder="e.g. Mole Concept Revision Quiz" value={qTitle} onChange={(e) => setQTitle(e.target.value)} />
              </div>
              <div className="field" style={{ flex: 1 }}>
                <label>Short description</label>
                <input placeholder="10 questions · 15 minutes" value={qDesc} onChange={(e) => setQDesc(e.target.value)} />
              </div>
            </div>

            <div className="divider" />

            {questions.map((q, qi) => (
              <div key={qi} className="card" style={{ padding: 18, marginBottom: 16, background: '#fdfbff' }}>
                <div className="flex-between">
                  <b style={{ fontSize: '0.95rem' }}>Question {qi + 1}</b>
                  <button
                    type="button"
                    className="btn btn-sm"
                    style={{ background: '#fef2f2', color: '#b91c1c' }}
                    onClick={() => removeQuestion(qi)}
                    disabled={questions.length === 1}
                  >
                    <X size={14} />
                    Remove
                  </button>
                </div>
                <div className="field mt-2">
                  <input
                    placeholder="Type the question…"
                    value={q.q}
                    onChange={(e) => updateQuestion(qi, { q: e.target.value })}
                  />
                </div>
                {q.options.map((opt, oi) => (
                  <div key={oi} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span
                      className="opt-letter"
                      style={{ flexShrink: 0, cursor: 'pointer' }}
                      title="Mark as correct answer"
                      onClick={() => updateQuestion(qi, { answer: oi })}
                    >
                      {letters[oi]}
                    </span>
                    <input
                      style={{ flex: 1 }}
                      placeholder={`Option ${letters[oi]}`}
                      value={opt}
                      onChange={(e) => updateOption(qi, oi, e.target.value)}
                    />
                    <input
                      type="radio"
                      name={`correct-${qi}`}
                      checked={q.answer === oi}
                      onChange={() => updateQuestion(qi, { answer: oi })}
                      title="Correct answer"
                    />
                  </div>
                ))}
                <p style={{ fontSize: '0.78rem', color: 'var(--muted)', textAlign: 'right' }}>
                  Click a letter or radio to set the <b>correct answer ({letters[q.answer]})</b>
                </p>
              </div>
            ))}

            <div className="flex-between">
              <button type="button" className="btn btn-ghost" onClick={addQuestion}>
                <Plus size={15} />
                Add question
              </button>
              <button className="btn btn-primary" onClick={submitQuiz}>
                <Brain size={15} />
                Publish quiz
              </button>
            </div>
          </form>
        </div>

        {/* ADDED CONTENT LIST */}
        {(customSessions.length > 0 ||
          customPapers.length > 0 ||
          customQuizzes.length > 0) && (
          <div className="card mt-4" style={{ padding: 26 }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: 16 }}>
              Your added content
            </h3>

            {customSessions.length > 0 && (
              <>
                <b style={{ fontSize: '0.9rem' }}>Sessions</b>
                <ul
                  style={{
                    margin: '10px 0 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    listStyle: 'none',
                  }}
                >
                  {customSessions.map((c) => (
                    <li
                      key={c.session.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 10,
                        fontSize: '0.92rem',
                        padding: '8px 12px',
                        border: '1px solid var(--line)',
                        borderRadius: 10,
                      }}
                    >
                      <Link
                        to={`/courses/${c.courseId}/session/${c.session.id}`}
                        style={{ color: 'var(--primary)' }}
                      >
                        {c.session.title}
                      </Link>
                      <button
                        className="btn btn-sm"
                        style={{ background: '#fef2f2', color: '#b91c1c', padding: '4px 10px' }}
                        onClick={() => {
                          removeSession(c.session.id)
                          notify('Session removed')
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {customPapers.length > 0 && (
              <>
                <b style={{ fontSize: '0.9rem' }}>Papers</b>
                <ul
                  style={{
                    margin: '10px 0 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    listStyle: 'none',
                  }}
                >
                  {customPapers.map((p) => (
                    <li
                      key={p.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 10,
                        fontSize: '0.92rem',
                        padding: '8px 12px',
                        border: '1px solid var(--line)',
                        borderRadius: 10,
                      }}
                    >
                      <span>
                        {p.title}{' '}
                        <span style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>
                          · {p.subject} · {p.type}
                        </span>
                      </span>
                      <button
                        className="btn btn-sm"
                        style={{ background: '#fef2f2', color: '#b91c1c', padding: '4px 10px' }}
                        onClick={() => {
                          removePaper(p.id)
                          notify('Paper removed')
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {customQuizzes.length > 0 && (
              <>
                <b style={{ fontSize: '0.9rem' }}>Quizzes</b>
                <ul
                  style={{
                    margin: '10px 0 0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    listStyle: 'none',
                  }}
                >
                  {customQuizzes.map((quiz) => (
                    <li
                      key={quiz.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 10,
                        fontSize: '0.92rem',
                        padding: '8px 12px',
                        border: '1px solid var(--line)',
                        borderRadius: 10,
                      }}
                    >
                      <Link to={`/quizzes/${quiz.id}`} style={{ color: 'var(--primary)' }}>
                        {quiz.title}
                      </Link>
                      <button
                        className="btn btn-sm"
                        style={{ background: '#fef2f2', color: '#b91c1c', padding: '4px 10px' }}
                        onClick={() => {
                          removeQuiz(quiz.id)
                          notify('Quiz removed')
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginTop: 14 }}>
              Everything you add here is published live to all students via the cloud.
            </p>
          </div>
        )}

        {toast && <div className="toast">{toast}</div>}
      </div>
    </section>
  )
}

export default function Admin() {
  return (
    <Protected role="admin">
      <AdminContent />
    </Protected>
  )
}
