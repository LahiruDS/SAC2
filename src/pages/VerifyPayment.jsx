import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CheckCircle2, FileUp, Mail, MessageCircle } from 'lucide-react'
import { COURSES, PLANS, SITE } from '../data/saclabsData'
import { useAuth } from '../context/useAuth'
import Protected from '../components/Protected'

function buildProofText({ name, email, level, planId, method, reference }) {
  const plan = PLANS.find((p) => p.id === planId)
  return [
    `Name: ${name}`,
    `Email: ${email}`,
    `Level / Course: ${level}`,
    `Plan: ${plan ? plan.name : planId}${plan ? ` (LKR ${plan.price.toLocaleString()})` : ''}`,
    `Payment method: ${method}`,
    reference ? `Reference / Transaction no: ${reference}` : '',
    '',
    '(Please attach your payment receipt screenshot or PDF before sending.)',
  ]
    .filter(Boolean)
    .join('\n')
}

function ProofContent() {
  const { user, submitPaymentRequest, pendingRequestFor } = useAuth()
  const location = useLocation()
  const preset = location.state || {}

  const [name, setName] = useState(preset.name || user?.name || '')
  const [email, setEmail] = useState(preset.email || user?.email || '')
  const [level, setLevel] = useState(preset.level || COURSES[0]?.title || 'A/L Chemistry')
  const [planId, setPlanId] = useState(preset.planId || PLANS[0].id)
  const [method, setMethod] = useState(preset.method || 'Bank Transfer')
  const [reference, setReference] = useState('')
  const [receipt, setReceipt] = useState(null)
  const [submittedId, setSubmittedId] = useState(null)

  const pending = pendingRequestFor(user?.email)

  const mailto = () => {
    const subject = encodeURIComponent('SAC Labs — Payment Proof')
    const body = encodeURIComponent(buildProofText({ name, email, level, planId, method, reference }))
    return `mailto:${SITE.contact.email}?subject=${subject}&body=${body}`
  }

  const whatsapp = () => {
    const text = encodeURIComponent(`SAC Labs Payment Proof\n\n${buildProofText({ name, email, level, planId, method, reference })}`)
    return `${SITE.social.whatsapp}?text=${text}`
  }

  const submit = (e) => {
    e.preventDefault()
    const id = submitPaymentRequest({
      name,
      email,
      level,
      planId,
      price: PLANS.find((p) => p.id === planId)?.price,
      method,
      reference,
      receiptName: receipt?.name || '',
    })
    setSubmittedId(id)
  }

  if (submittedId) {
    return (
      <section className="section-tight">
        <div className="container">
          <div className="card auth-box center" style={{ textAlign: 'center' }}>
            <span
              style={{
                width: 84,
                height: 84,
                borderRadius: '50%',
                background: '#f0fdf4',
                display: 'inline-grid',
                placeItems: 'center',
                color: '#16a34a',
                marginBottom: 16,
              }}
            >
              <CheckCircle2 size={44} />
            </span>
            <h2 className="h2">Proof submitted!</h2>
            <p className="sub sub-center mt-1">
              Your payment details were saved for review. Now send the receipt to the
              teacher so access can be activated manually.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 20 }}>
              <a className="btn btn-primary" href={mailto()}>
                <Mail size={16} />
                Open email app
              </a>
              <a className="btn" style={{ background: '#dcfce7', color: '#15803d' }} href={whatsapp()} target="_blank" rel="noreferrer">
                <MessageCircle size={16} />
                Send via WhatsApp
              </a>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginTop: 14 }}>
              Tip: your email app opens with all details filled — just attach the
              receipt image/PDF and press send. Access is usually activated within a
              few hours.
            </p>
            <Link to="/dashboard" className="btn btn-ghost btn-block mt-2">
              Go to my dashboard
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section-tight">
      <div className="container">
        <div className="card auth-box fade-up" style={{ maxWidth: 640, marginInline: 'auto' }}>
          <div className="center">
            <span className="logo-mark" style={{ marginInline: 'auto', marginBottom: 12 }}>
              <FileUp size={20} />
            </span>
            <h2 className="h2">Send your payment proof</h2>
            <p className="sub sub-center mt-1" style={{ fontSize: '0.92rem' }}>
              Fill in your details and attach the payment receipt (screenshot or PDF).
              The teacher will verify it and unlock your account manually.
            </p>
          </div>

          {pending && (
            <div
              className="card"
              style={{ padding: 12, background: '#fef3c7', borderColor: '#fde68a', color: '#b45309', fontSize: '0.88rem', marginBottom: 16 }}
            >
              You already have a payment under review (submitted{' '}
              {new Date(pending.requestedAt).toLocaleDateString('en-GB')}). You can send
              another proof if needed.
            </div>
          )}

          <form onSubmit={submit} className="mt-3">
            <div className="flex">
              <div className="field" style={{ flex: 1 }}>
                <label>Full name</label>
                <input required placeholder="e.g. Sanduni Perera" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="field" style={{ flex: 1 }}>
                <label>Email</label>
                <input type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            <div className="flex">
              <div className="field" style={{ flex: 1 }}>
                <label>Level / Course</label>
                <select value={level} onChange={(e) => setLevel(e.target.value)}>
                  {[...new Set(COURSES.map((c) => c.title))].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                  <option>Other</option>
                </select>
              </div>
              <div className="field" style={{ flex: 1 }}>
                <label>Plan paid for</label>
                <select value={planId} onChange={(e) => setPlanId(e.target.value)}>
                  {PLANS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — LKR {p.price.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex">
              <div className="field" style={{ flex: 1 }}>
                <label>Payment method</label>
                <select value={method} onChange={(e) => setMethod(e.target.value)}>
                  <option>Bank Transfer</option>
                  <option>Mobile / eZ Cash</option>
                  <option>Card Payment</option>
                  <option>Cash deposit</option>
                </select>
              </div>
              <div className="field" style={{ flex: 1 }}>
                <label>Reference / Transaction no.</label>
                <input placeholder="e.g. 00345678" value={reference} onChange={(e) => setReference(e.target.value)} />
              </div>
            </div>

            <div className="field">
              <label>Payment receipt (screenshot or PDF)</label>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setReceipt(e.target.files?.[0] || null)}
              />
              {receipt && (
                <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 6 }}>
                  Attached: <b>{receipt.name}</b>
                </p>
              )}
            </div>

            <button type="submit" className="btn btn-primary btn-block mt-2">
              <CheckCircle2 size={16} />
              Submit proof
            </button>
          </form>

          <p className="center mt-2" style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
            After submitting, use “Open email app” — the message comes pre-filled with
            your details; just attach the receipt file before sending.
          </p>
        </div>
      </div>
    </section>
  )
}

export default function VerifyPayment() {
  return (
    <Protected>
      <ProofContent />
    </Protected>
  )
}
