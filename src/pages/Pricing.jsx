import { Link, useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { PLANS } from '../data/saclabsData'

export default function Pricing() {
  const navigate = useNavigate()

  return (
    <section className="section">
      <div className="container">
        <div className="center">
          <span className="eyebrow">Pricing</span>
          <h2 className="h2">Simple plans, no hidden fees</h2>
          <p className="sub sub-center mt-1">
            Unlock every course, paper and quiz with one subscription. Cancel anytime.
          </p>
        </div>

        <div className="grid-3 mt-4">
          {PLANS.map((plan) => (
            <div className={`card plan-card ${plan.popular ? 'plan-popular' : ''}`} key={plan.id}>
              <span className="plan-name">{plan.name}</span>
              <div className="plan-price">
                LKR {plan.price.toLocaleString()}
                <small> /{plan.period}</small>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                {plan.popular
                  ? 'Our best value — most students choose this.'
                  : 'Flexible access to everything on SAC Labs.'}
              </p>
              <ul className="plan-feats">
                {plan.features.map((f) => (
                  <li key={f}>
                    <Check size={16} style={{ color: '#16a34a', flexShrink: 0, marginTop: 3 }} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`btn ${plan.popular ? 'btn-primary' : 'btn-ghost'} btn-block mt-2`}
                onClick={() => navigate(`/checkout/${plan.id}`)}
              >
                Choose {plan.name}
              </button>
            </div>
          ))}
        </div>

        <div className="card mt-4" style={{ padding: 22, background: 'var(--grad-soft)', borderColor: '#e9d5ff' }}>
          <div className="flex-between">
            <div>
              <b>Teacher / Bulk students?</b>
              <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                Special rates for schools and tuition classes. Contact us for a custom plan.
              </p>
            </div>
            <a
              className="btn btn-ghost btn-sm"
              href="https://wa.me/94771234567"
              target="_blank"
              rel="noopener noreferrer"
            >
              Talk to us on WhatsApp
            </a>
          </div>
        </div>

        <p className="center mt-3" style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
          Already have a plan? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link> to access your sessions.
        </p>
      </div>
    </section>
  )
}
