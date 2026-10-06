import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogIn, Sparkles } from 'lucide-react'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../context/useAuth'

export default function Login() {
  const { login, googleLogin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const doLogin = async (em, pw) => {
    if (busy) return

    setBusy(true)
    setError('')

    const res = await login(em, pw)

    setBusy(false)

    if (!res.ok) {
      setError(res.error)
      return
    }

    navigate(from, { replace: true })
  }

  const submit = (e) => {
    e.preventDefault()
    doLogin(email, password)
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    if (busy) return

    if (!credentialResponse?.credential) {
      setError('Google authentication failed. Please try again.')
      return
    }

    setBusy(true)
    setError('')

    try {
      const res = await googleLogin(
        credentialResponse.credential,
      )

      setBusy(false)

      if (!res.ok) {
        setError(res.error)
        return
      }

      navigate(from, { replace: true })
    } catch (err) {
      console.error('[SAC Labs] Google Login failed:', err)

      setBusy(false)
      setError('Google login failed. Please try again.')
    }
  }

  const handleGoogleError = () => {
    setError('Google Login failed. Please try again.')
  }

  return (
    <section className="section-tight">
      <div className="container">
        <div className="card auth-box fade-up">

          <div className="center">
            <span
              className="logo-mark"
              style={{
                marginInline: 'auto',
                marginBottom: 12,
              }}
            >
              <LogIn size={20} />
            </span>

            <h2 className="h2">Welcome back!</h2>

            <p
              className="sub sub-center mt-1"
              style={{ fontSize: '0.92rem' }}
            >
              Sign in to continue your learning journey.
            </p>
          </div>

          <form onSubmit={submit} className="mt-3">

            {error && (
              <div
                className="card"
                style={{
                  padding: 12,
                  background: '#fef2f2',
                  borderColor: '#fecaca',
                  color: '#b91c1c',
                  fontSize: '0.88rem',
                  marginBottom: 16,
                }}
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

            <div className="field">
              <label>Password</label>

              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block mt-2"
              disabled={busy}
            >
              {busy ? 'Signing in…' : 'Sign in'}
            </button>

            {/* Google Login */}
            <div
              className="mt-2"
              style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap={false}
                theme="outline"
                size="large"
                width="100%"
                text="continue_with"
                shape="rectangular"
              />
            </div>

          </form>

          <p
            className="center mt-2"
            style={{ fontSize: '0.88rem' }}
          >
            <Link
              to="/forgot-password"
              style={{ color: 'var(--muted)' }}
            >
              Forgot your password?
            </Link>
          </p>

          <div className="divider" />

          <button
            className="btn btn-block"
            style={{
              background: 'var(--grad-soft)',
              color: 'var(--primary-dark)',
            }}
            disabled={busy}
            onClick={() =>
              doLogin('demo@saclabs.lk', 'demo1234')
            }
          >
            <Sparkles size={16} />
            Try demo account (student)
          </button>

          <p
            className="center mt-3"
            style={{ fontSize: '0.9rem' }}
          >
            New to SAC Labs?{' '}

            <Link
              to="/register"
              style={{
                color: 'var(--primary)',
                fontWeight: 600,
              }}
            >
              Create an account
            </Link>
          </p>

        </div>
      </div>
    </section>
  )
}