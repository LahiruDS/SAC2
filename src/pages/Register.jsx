import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import { useAuth } from '../context/useAuth'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setBusy(true)
    setError('')
    const res = await register(name, email, password)
    setBusy(false)
    if (!res.ok) {
      setError(res.error)
      return
    }
    navigate('/dashboard', { replace: true })
  }

  return (
    <section className="section-tight">
      <div className="container">
        <div className="card auth-box fade-up">
          <div className="center">
            <span className="logo-mark" style={{ marginInline: 'auto', marginBottom: 12 }}>
              <UserPlus size={20} />
            </span>
            <h2 className="h2">Join SAC Labs</h2>
            <p className="sub sub-center mt-1" style={{ fontSize: '0.92rem' }}>
              Create your free account and start learning chemistry today.
            </p>
          </div>

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
              <label>Full name</label>
              <input
                required
                placeholder="e.g. Sanduni Perera"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
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
            <div className="field">
              <label>Password</label>
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Confirm password</label>
              <input
                type="password"
                required
                placeholder="Repeat your password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block mt-2" disabled={busy}>
              {busy ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="center mt-3" style={{ fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
