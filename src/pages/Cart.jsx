import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { money } from '../utils/storage.js'

export default function Cart() {
  const { items, setQty, remove, subtotal, clear } = useCart()
  const navigate = useNavigate()

  const shipping = subtotal === 0 || subtotal >= 5000 ? 0 : 250
  const total = subtotal + shipping

  if (items.length === 0) {
    return (
      <div className="container section">
        <div className="empty">
          <span className="empty-emoji">🛒</span>
          <h3>Aap ka cart khali hai</h3>
          <p className="muted">Shopping shuru karne ke liye products dekhein.</p>
          <Link to="/products" className="btn btn-primary">
            Browse products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container section">
      <div className="section-head">
        <h2>Your cart</h2>
        <button className="link" onClick={clear}>
          Clear cart
        </button>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <div className="cart-item" key={item.id}>
              <div className="cart-thumb card-img placeholder">
                {item.image ? (
                  <img src={item.image} alt={item.title} />
                ) : (
                  <span>{item.title.charAt(0).toUpperCase()}</span>
                )}
              </div>

              <div className="cart-meta">
                <Link to={`/product/${item.id}`} className="product-title">
                  {item.title}
                </Link>
                <span className="muted">{money(item.price)}</span>
              </div>

              <div className="qty">
                <button onClick={() => setQty(item.id, item.qty - 1)}>−</button>
                <span>{item.qty}</span>
                <button onClick={() => setQty(item.id, item.qty + 1)}>+</button>
              </div>

              <div className="cart-line">
                <strong>{money(item.price * item.qty)}</strong>
              </div>

              <button className="icon-btn" onClick={() => remove(item.id)} title="Remove">
                ✕
              </button>
            </div>
          ))}
        </div>

        <aside className="summary">
          <h3>Order summary</h3>
          <div className="sum-row">
            <span>Subtotal</span>
            <span>{money(subtotal)}</span>
          </div>
          <div className="sum-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : money(shipping)}</span>
          </div>
          <div className="sum-row total">
            <span>Total</span>
            <span>{money(total)}</span>
          </div>
          <button className="btn btn-primary btn-block btn-lg" onClick={() => navigate('/checkout')}>
            Proceed to checkout
          </button>
          <Link to="/products" className="link center">
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  )
}
