import { useState } from 'react'
import { Link } from 'react-router-dom'
import { KeyRound, Mail, MailOpen } from 'lucide-react'
import { useAuth } from '../context/useAuth'

export default function ForgotPassword() {
  const { requestPasswordReset } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    const res = await requestPasswordReset(email)
    setBusy(false)
    if (!res.ok) {
      setError(res.error)
      return
    }
    setSent(true)
  }

  return (
    <section className="section-tight">
      <div className="container">
        <div className="card auth-box fade-up">
          <div className="center">
            <span className="logo-mark" style={{ marginInline: 'auto', marginBottom: 12 }}>
              <KeyRound size={20} />
            </span>
            <h2 className="h2">Forgot your password?</h2>
            <p className="sub sub-center mt-1" style={{ fontSize: '0.92rem' }}>
              Enter the email you signed up with — we'll send a reset link to it.
            </p>
          </div>

          {!sent ? (
            <>
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
                  <label>Email</label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block mt-2" disabled={busy}>
                  <Mail size={16} />
                  {busy ? 'Sending…' : 'Send reset link'}
                </button>
              </form>

              <p className="center mt-3" style={{ fontSize: '0.9rem' }}>
                Remembered it?{' '}
                <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                  Sign in
                </Link>
              </p>
            </>
          ) : (
            <>
              <div
                className="card mt-3"
                style={{ padding: 20, background: '#f0f9ff', borderColor: '#bae6fd' }}
              >
                <b style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <MailOpen size={16} color="#0369a1" />
                  Password reset email sent
                </b>
                <p style={{ fontSize: '0.88rem', color: 'var(--muted)', marginTop: 8 }}>
                  We've sent a reset link to <b>{email}</b>. Check your inbox (and the
                  spam folder just in case), then follow the link to choose a new
                  password.
                </p>
              </div>
              <p className="center mt-3" style={{ fontSize: '0.9rem' }}>
                Didn't get it?{' '}
                <Link to="/forgot-password" style={{ color: 'var(--primary)', fontWeight: 600 }} onClick={() => window.location.reload()}>
                  Try again
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
