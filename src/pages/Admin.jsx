import { useEffect, useState } from 'react'
import { useProducts, CATEGORIES } from '../context/ProductContext.jsx'
import { api } from '../utils/api.js'
import { money } from '../utils/storage.js'

const emptyForm = {
  title: '',
  price: '',
  oldPrice: '',
  category: 'Electronics',
  image: '',
  stock: '',
  description: ''
}

const sample = [
  {
    title: 'Wireless Headphones',
    price: 4999,
    oldPrice: 6999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    stock: 12,
    description: 'Noise cancelling over-ear headphones with 30 hour battery.'
  },
  {
    title: 'Classic Denim Jacket',
    price: 3500,
    oldPrice: 4500,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=600&q=80',
    stock: 8,
    description: 'Durable cotton denim jacket, unisex fit.'
  },
  {
    title: 'Running Sneakers',
    price: 6200,
    oldPrice: null,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    stock: 20,
    description: 'Lightweight running shoes with breathable mesh.'
  },
  {
    title: 'Scented Candle Set',
    price: 1200,
    oldPrice: 1500,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1602874801006-e26c76fc1b9c?w=600&q=80',
    stock: 30,
    description: 'Set of 3 soothing aroma candles.'
  }
]

export default function Admin() {
  const { products, addProduct, updateProduct, removeProduct } = useProducts()
  const [orders, setOrders] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    api.get('/orders').then(setOrders).catch(() => {})
  }, [])

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  function reset() {
    setForm(emptyForm)
    setEditingId(null)
  }

  function flash(text) {
    setMsg(text)
    setTimeout(() => setMsg(''), 2000)
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      if (editingId) {
        await updateProduct(editingId, form)
        flash('Product update ho gaya ✓')
      } else {
        await addProduct(form)
        flash('Naya product add ho gaya ✓')
      }
      reset()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  function edit(p) {
    setEditingId(p.id)
    setForm({
      title: p.title,
      price: p.price,
      oldPrice: p.oldPrice ?? '',
      category: p.category,
      image: p.image,
      stock: p.stock,
      description: p.description
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function loadSample() {
    setError('')
    try {
      for (const s of sample) await addProduct(s)
      flash('Sample products add ho gaye ✓')
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(id) {
    setError('')
    try {
      await removeProduct(id)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="container section">
      <div className="section-head">
        <h2>Admin panel</h2>
        <span className="pill">{orders.length} orders</span>
      </div>

      <div className="stats">
        <div className="stat">
          <span className="muted">Products</span>
          <strong>{products.length}</strong>
        </div>
        <div className="stat">
          <span className="muted">In stock</span>
          <strong>{products.filter((p) => p.stock > 0).length}</strong>
        </div>
        <div className="stat">
          <span className="muted">Out of stock</span>
          <strong>{products.filter((p) => p.stock === 0).length}</strong>
        </div>
        <div className="stat">
          <span className="muted">Orders</span>
          <strong>{orders.length}</strong>
        </div>
      </div>

      {msg && <div className="alert success-alert">{msg}</div>}
      {error && <div className="alert">{error}</div>}

      <div className="admin-layout">
        <form className="form card" onSubmit={submit}>
          <h3>{editingId ? 'Edit product' : 'Add new product'}</h3>

          <label>
            Title
            <input className="input" value={form.title} onChange={set('title')} required />
          </label>

          <div className="two">
            <label>
              Price (Rs)
              <input type="number" className="input" value={form.price} onChange={set('price')} required />
            </label>
            <label>
              Old price (optional)
              <input type="number" className="input" value={form.oldPrice} onChange={set('oldPrice')} />
            </label>
          </div>

          <div className="two">
            <label>
              Category
              <select className="input" value={form.category} onChange={set('category')}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Stock
              <input type="number" className="input" value={form.stock} onChange={set('stock')} />
            </label>
          </div>

          <label>
            Image URL
            <input className="input" value={form.image} onChange={set('image')} placeholder="https://..." />
          </label>

          <label>
            Description
            <textarea className="input" rows="3" value={form.description} onChange={set('description')} />
          </label>

          <div className="two">
            <button className="btn btn-primary btn-block" type="submit" disabled={busy}>
              {busy ? 'Saving...' : editingId ? 'Save changes' : 'Add product'}
            </button>
            {editingId ? (
              <button type="button" className="btn btn-outline btn-block" onClick={reset}>
                Cancel
              </button>
            ) : (
              <button type="button" className="btn btn-outline btn-block" onClick={loadSample}>
                Load sample data
              </button>
            )}
          </div>
        </form>

        <div className="admin-list card">
          <h3>Products ({products.length})</h3>
          {products.length === 0 ? (
            <p className="muted">Koi product nahi. Left form se add karein ya sample data load karein.</p>
          ) : (
            <div className="table">
              {products.map((p) => (
                <div className="table-row" key={p.id}>
                  <div className="row-thumb card-img placeholder">
                    {p.image ? (
                      <img src={p.image} alt={p.title} />
                    ) : (
                      <span>{p.title.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="row-meta">
                    <strong>{p.title}</strong>
                    <span className="muted">
                      {p.category} · {money(p.price)} · stock {p.stock}
                    </span>
                  </div>
                  <div className="row-actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => edit(p)}>
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(p.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
