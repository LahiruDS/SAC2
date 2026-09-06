import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Atom, LayoutDashboard, LogOut, Menu, Shield, X } from 'lucide-react'
import { useAuth } from '../context/useAuth'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/courses', label: 'Courses' },
  { to: '/quizzes', label: 'Quizzes' },
  { to: '/papers', label: 'Papers' },
  { to: '/pricing', label: 'Pricing' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    setOpen(false)
    navigate('/')
  }

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link to="/" className="logo">
          
          <div className="w-[50px] h-[50px] relative">
          <img src="/logo2.png" alt="SAC Labs Logo" className="logo-image" /></div>
          
        </Link>

        <nav className="nav-links">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'active' : '')}
              end={item.to === '/'}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" className="btn btn-sm hide-sm" style={{ background: 'var(--grad-soft)', color: 'var(--primary-dark)' }}>
                  <Shield size={15} />
                  Teacher Panel
                </Link>
              )}
              <Link to="/dashboard" className="btn btn-ghost btn-sm hide-sm">
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <button className="btn btn-sm hide-sm" onClick={handleLogout}>
                <LogOut size={15} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm hide-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm hide-sm">
                Sign up
              </Link>
            </>
          )}
          <button
            className="nav-burger"
            aria-label="Menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mobile-menu">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) => (isActive ? 'active' : '')}
              end={item.to === '/'}
            >
              {item.label}
            </NavLink>
          ))}
          <div className="divider" />
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" onClick={() => setOpen(false)}>
                  Teacher Panel
                </Link>
              )}
              <Link to="/dashboard" onClick={() => setOpen(false)}>
                Dashboard
              </Link>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  handleLogout()
                }}
              >
                Logout
              </a>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)}>
                Login
              </Link>
              <Link to="/register" onClick={() => setOpen(false)}>
                Sign up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}
