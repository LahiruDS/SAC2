import { Link } from 'react-router-dom'
import { Atom } from 'lucide-react'
import { SITE } from '../data/saclabsData'
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from './SocialIcons'
import { useAuth } from '../context/useAuth'

const socials = [
  { label: 'Facebook', url: SITE.social.facebook, color: '#1877f2', Icon: FacebookIcon },
  { label: 'WhatsApp', url: SITE.social.whatsapp, color: '#25d366', Icon: WhatsAppIcon },
  { label: 'Instagram', url: SITE.social.instagram, color: '#e4405f', Icon: InstagramIcon },
]

export default function Footer() {
  const { user } = useAuth()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <Link to="/" className="logo" style={{ color: '#fff' }}>
              
              <img src="/logo1.png" alt="SAC Labs Logo" className="logo-image" />
            </Link>
            <p style={{ marginTop: 14, fontSize: '0.92rem', maxWidth: 340 }}>
              {SITE.description} Join hundreds of students mastering chemistry with
              SAC Labs.
            </p>
            <div className="social-row mt-3">
              {socials.map(({ label, url, color, Icon }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="social-btn"
                  style={{ background: color }}
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4>Explore</h4>
            <div className="footer-links">
              <Link to="/courses">Courses</Link>
              <Link to="/quizzes">Quizzes</Link>
              <Link to="/papers">Past Papers</Link>
              <Link to="/pricing">Pricing</Link>
            </div>
          </div>

          <div>
            <h4>Get in touch</h4>
            <div className="footer-links">
              <p>Address: No.19, Market building, Ja-Ela, Sri Lanka.</p>
              <a href="mailto:saclabs@gmail.com">Email: saclabs@gmail.com</a>
              <a href="tel:+94704197762">Phone: +94 70 419 7762</a>
              <a href="https://wa.me/94704197762" target="_blank" rel="noopener noreferrer">
                WhatsApp us
              </a>
              <Link to="/login">Student login</Link>
              {user?.role === 'admin' && <Link to="/admin">Teacher panel</Link>}

            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} SAC Labs. All rights reserved.</span>
          <span>
            Designed by Lahiru De Silva for SAC Labs.
          </span>
        </div>
      </div>
    </footer>
  )
}
