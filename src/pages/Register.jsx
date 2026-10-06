import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import { FcGoogle } from 'react-icons/fc'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../context/useAuth'

export default function Register() {
  const { register, googleLogin } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  /* ---------------- Normal Register ---------------- */

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

    const res = await register(
      name,
      email,
      password,
    )

    setBusy(false)

    if (!res.ok) {
      setError(res.error)
      return
    }

    navigate('/dashboard', {
      replace: true,
    })
  }

  /* ---------------- Google Register/Login ---------------- */

  const handleGoogleSuccess = async (
    credentialResponse,
  ) => {
    if (!credentialResponse?.credential) {
      setError('Google authentication failed. Please try again.')
      return
    }

    setBusy(true)
    setError('')

    const res = await googleLogin(
      credentialResponse.credential,
    )

    setBusy(false)

    if (!res.ok) {
      setError(res.error)
      return
    }

    navigate('/dashboard', {
      replace: true,
    })
  }

  const handleGoogleError = () => {
    setError(
      'Google Login failed. Please try again.',
    )
  }

  return (
    <section className="section-tight">
      <div className="container">
        <div className="card auth-box fade-up">

          {/* Header */}
          <div className="center">
            <span
              className="logo-mark"
              style={{
                marginInline: 'auto',
                marginBottom: 12,
              }}
            >
              <UserPlus size={20} />
            </span>

            <h2 className="h2">
              Join SAC Labs
            </h2>

            <p
              className="sub sub-center mt-1"
              style={{
                fontSize: '0.92rem',
              }}
            >
              Create your free account and start
              learning chemistry today.
            </p>
          </div>

          <form
            onSubmit={submit}
            className="mt-3"
          >

            {/* Error */}
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

            {/* Name */}
            <div className="field">
              <label>
                Full name
              </label>

              <input
                required
                placeholder="e.g. Sanduni Perera"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
              />
            </div>

            {/* Email */}
            <div className="field">
              <label>
                Email
              </label>

              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />
            </div>

            {/* Password */}
            <div className="field">
              <label>
                Password
              </label>

              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />
            </div>

            {/* Confirm password */}
            <div className="field">
              <label>
                Confirm password
              </label>

              <input
                type="password"
                required
                placeholder="Repeat your password"
                value={confirm}
                onChange={(e) =>
                  setConfirm(e.target.value)
                }
              />
            </div>

            {/* Normal register */}
            <button
              type="submit"
              className="btn btn-primary btn-block mt-2"
              disabled={busy}
            >
              {busy
                ? 'Creating account...'
                : 'Create account'}
            </button>

            {/* Divider */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                margin: '20px 0',
                color: '#888',
                fontSize: '0.85rem',
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: '#ddd',
                }}
              />

              <span>
                OR
              </span>

              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: '#ddd',
                }}
              />
            </div>

            {/* Google Login */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap={false}
              />
            </div>

          </form>

          {/* Login link */}
          <p
            className="center mt-3"
            style={{
              fontSize: '0.9rem',
            }}
          >
            Already have an account?{' '}

            <Link
              to="/login"
              style={{
                color: 'var(--primary)',
                fontWeight: 600,
              }}
            >
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </section>
  )
}