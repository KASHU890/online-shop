import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { api } from '../utils/api.js'
import { money } from '../utils/storage.js'

export default function Checkout() {
  const { items, subtotal, clear } = useCart()
  const { user } = useAuth()
  const [placed, setPlaced] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: '',
    email: user?.email || '',
    address: '',
    city: '',
    payment: 'cod'
  })

  const shipping = subtotal === 0 || subtotal >= 5000 ? 0 : 250
  const total = subtotal + shipping

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const res = await api.post('/orders', {
        items: items.map((i) => ({ id: i.id, qty: i.qty })),
        ...form
      })
      setPlaced(res)
      clear()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  if (placed) {
    return (
      <div className="container section">
        <div className="empty success">
          <span className="empty-emoji">✅</span>
          <h2>Order confirm ho gaya!</h2>
          <p className="muted">
            Order ID: <strong>{placed.orderCode}</strong> — {placed.count} items, total {money(placed.total)}
          </p>
          <p className="muted">Hum aap ko jald hi call karenge.</p>
          <Link to="/products" className="btn btn-primary">
            Continue shopping
          </Link>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container section">
        <div className="empty">
          <h3>Checkout ke liye cart khali hai</h3>
          <Link to="/products" className="btn btn-primary">
            Browse products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container section">
      <h2>Checkout</h2>

      <div className="cart-layout">
        <form className="form card" onSubmit={submit}>
          <h3>Delivery details</h3>
          <label>
            Full name
            <input className="input" value={form.name} onChange={set('name')} required />
          </label>
          <div className="two">
            <label>
              Phone
              <input className="input" value={form.phone} onChange={set('phone')} required />
            </label>
            <label>
              Email
              <input type="email" className="input" value={form.email} onChange={set('email')} required />
            </label>
          </div>
          <label>
            Address
            <input className="input" value={form.address} onChange={set('address')} required />
          </label>
          <label>
            City
            <input className="input" value={form.city} onChange={set('city')} required />
          </label>

          <h3>Payment</h3>
          <label className="radio">
            <input type="radio" name="pay" checked={form.payment === 'cod'} onChange={set('payment')} value="cod" />
            Cash on delivery
          </label>
          <label className="radio">
            <input type="radio" name="pay" checked={form.payment === 'card'} onChange={set('payment')} value="card" />
            Card / Online (demo)
          </label>

          {error && <div className="alert">{error}</div>}

          <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={busy}>
            {busy ? 'Placing order...' : `Place order — ${money(total)}`}
          </button>
        </form>

        <aside className="summary">
          <h3>Order summary</h3>
          {items.map((i) => (
            <div className="sum-row" key={i.id}>
              <span>
                {i.title} × {i.qty}
              </span>
              <span>{money(i.price * i.qty)}</span>
            </div>
          ))}
          <div className="sum-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : money(shipping)}</span>
          </div>
          <div className="sum-row total">
            <span>Total</span>
            <span>{money(total)}</span>
          </div>
        </aside>
      </div>
    </div>
  )
}
