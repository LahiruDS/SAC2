import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, CreditCard, Landmark, Smartphone } from 'lucide-react'
import { PLANS } from '../data/saclabsData'
import { useAuth } from '../context/useAuth'
import Protected from '../components/Protected'

const methods = [
  { id: 'bank', label: 'Bank Transfer', icon: Landmark },
  { id: 'mobile', label: 'Mobile / eZ Cash', icon: Smartphone },
  { id: 'card', label: 'Card Payment', icon: CreditCard },
]

function CheckoutContent() {
  const { planId } = useParams()
  const navigate = useNavigate()
  const { user, submitPaymentRequest, sub } = useAuth()

  const plan = PLANS.find((p) => p.id === planId)
  const [method, setMethod] = useState('bank')
  const [processing, setProcessing] = useState(false)
  const [done, setDone] = useState(false)

  if (!plan) {
    return (
      <section className="section">
        <div className="container center">
          <h2 className="h2">Plan not found</h2>
          <Link to="/pricing" className="btn btn-primary mt-3">
            Back to pricing
          </Link>
        </div>
      </section>
    )
  }

  const pay = (e) => {
    e.preventDefault()
    setProcessing(true)
    setTimeout(() => {
      submitPaymentRequest({
        planId: plan.id,
        price: plan.price,
        method: methods.find((m) => m.id === method)?.label || method,
      })
      setProcessing(false)
      setDone(true)
    }, 900)
  }

  if (done) {
    return (
      <section className="section">
        <div className="container">
          <div className="card auth-box center" style={{ textAlign: 'center' }}>
            <span
              style={{
                width: 84,
                height: 84,
                borderRadius: '50%',
                background: '#fef9c3',
                display: 'inline-grid',
                placeItems: 'center',
                color: '#b45309',
                marginBottom: 16,
              }}
            >
              <CheckCircle2 size={44} />
            </span>
            <h2 className="h2">Order received!</h2>
            <p className="sub sub-center mt-1">
              Almost there, {user?.name?.split(' ')[0]}! Send us your payment proof and
              the teacher will activate your {plan.name} plan manually after checking it.
            </p>
            <Link
              to="/verify-payment"
              state={{ planId: plan.id, method: methods.find((m) => m.id === method)?.label }}
              className="btn btn-primary btn-block mt-3"
            >
              Send payment proof now
            </Link>
            <button className="btn btn-ghost btn-block mt-2" onClick={() => navigate('/dashboard')}>
              Go to my dashboard
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section-tight">
      <div className="container">
        <Link to="/pricing" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: '0.9rem' }}>
          <ArrowLeft size={16} />
          Back to pricing
        </Link>

        <div className="grid-2 mt-2" style={{ gridTemplateColumns: '1.1fr 0.9fr' }}>
          <div className="card" style={{ padding: 28 }}>
            <h2 style={{ fontSize: '1.3rem' }}>Checkout</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
              Pay using one of the methods below — your access starts after the teacher
              verifies the payment.
            </p>

            <form onSubmit={pay} className="mt-3">
              <div className="field">
                <label>Payment method</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {methods.map((m) => (
                    <button
                      type="button"
                      key={m.id}
                      className="quiz-option"
                      onClick={() => setMethod(m.id)}
                      style={{
                        borderColor: method === m.id ? 'var(--primary)' : 'var(--line)',
                        background: method === m.id ? 'var(--primary-soft)' : '#fff',
                      }}
                    >
                      <m.icon size={18} style={{ color: 'var(--primary)' }} />
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {method === 'bank' && (
                <div className="card" style={{ padding: 14, background: '#fdfbff', fontSize: '0.9rem' }}>
                  <b>Bank transfer details</b>
                  <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
                    Bank: People's Bank · Account: 123-4567-8901-2 · SAC Labs (Pvt) Ltd
                  </p>
                  <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
                    Add your email as the reference and send us the deposit slip.
                  </p>
                </div>
              )}

              {method === 'mobile' && (
                <div className="card" style={{ padding: 14, background: '#fdfbff', fontSize: '0.9rem' }}>
                  <b>Mobile payment details</b>
                  <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
                    Dial #170# and send LKR {plan.price.toLocaleString()} to 0771234567 (SAC Labs).
                  </p>
                  <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
                    Keep the confirmation SMS to attach as your proof.
                  </p>
                </div>
              )}

              {method === 'card' && (
                <div className="card" style={{ padding: 14, background: '#fdfbff', fontSize: '0.9rem' }}>
                  <b>Card payment</b>
                  <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
                    Online card payments are handled manually for now — pay via bank or
                    mobile and send the receipt, or contact us to arrange card payment.
                  </p>
                </div>
              )}

              <button type="submit" className="btn btn-primary btn-block mt-2" disabled={processing}>
                {processing ? 'Processing…' : `I have paid LKR ${plan.price.toLocaleString()}`}
              </button>
              <p className="center mt-1" style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
                Next you'll be asked to attach your payment receipt.
              </p>
            </form>
          </div>

          <div className="card" style={{ padding: 28, alignSelf: 'start' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Order summary</h3>
            <div className="divider" />
            <div className="flex-between">
              <span style={{ fontSize: '0.92rem', color: 'var(--muted)' }}>Plan</span>
              <b>{plan.name}</b>
            </div>
            <div className="flex-between mt-1">
              <span style={{ fontSize: '0.92rem', color: 'var(--muted)' }}>Duration</span>
              <b>{plan.period}</b>
            </div>
            <div className="flex-between mt-1">
              <span style={{ fontSize: '0.92rem', color: 'var(--muted)' }}>Access</span>
              <b>All courses + papers + quizzes</b>
            </div>
            <div className="divider" />
            <div className="flex-between">
              <span style={{ fontWeight: 700 }}>Total</span>
              <span className="price" style={{ fontSize: '1.4rem' }}>
                LKR {plan.price.toLocaleString()}
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginTop: 10 }}>
              By paying you agree to SAC Labs' terms. If you subscribed before, your
              access is extended.
            </p>
          </div>
        </div>

        {sub && (
          <p className="center mt-3" style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
            You already have an active {sub.planId} plan. You can extend it with a new
            payment.
          </p>
        )}
      </div>
    </section>
  )
}

export default function Checkout() {
  return (
    <Protected>
      <CheckoutContent />
    </Protected>
  )
}
