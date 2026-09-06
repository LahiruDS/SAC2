import { Link, Navigate, useLocation } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { useAuth } from '../context/useAuth'

export default function Protected({ children, role }) {
  const { user, authLoading } = useAuth()
  const location = useLocation()

  /* Wait until the session check + profile load finishes */
  if (authLoading) {
    return (
      <section className="section-tight">
        <div className="container center">
          <p className="sub">Loading…</p>
        </div>
      </section>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (role && user.role !== role) {
    return (
      <section className="section">
        <div className="container center">
          <span
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: '#fef2f2',
              display: 'inline-grid',
              placeItems: 'center',
              color: '#b91c1c',
              marginBottom: 16,
            }}
          >
            <ShieldAlert size={34} />
          </span>
          <h2 className="h2">Admins only</h2>
          <p className="sub sub-center mt-1">
            This page is for the SAC Labs admin. Your account doesn't have admin
            access.
          </p>
          <Link to="/dashboard" className="btn btn-primary mt-3">
            Go to my dashboard
          </Link>
        </div>
      </section>
    )
  }

  return children
}
