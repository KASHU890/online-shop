import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useProducts } from '../context/ProductContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { money } from '../utils/storage.js'

export default function ProductDetail() {
  const { id } = useParams()
  const { getProduct, loading } = useProducts()
  const { add } = useCart()
  const navigate = useNavigate()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const product = getProduct(id)

  if (loading) {
    return (
      <div className="container section">
        <div className="empty">
          <h3>Product load ho raha hai...</h3>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container section">
        <div className="empty">
          <h3>Product nahi mila</h3>
          <Link to="/products" className="btn btn-primary">
            Back to products
          </Link>
        </div>
      </div>
    )
  }

  function handleAdd() {
    add(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="container section">
      <button className="link back" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="detail">
        <div className="detail-media card-img placeholderlg">
          {product.image ? (
            <img src={product.image} alt={product.title} />
          ) : (
            <span>{product.title.charAt(0).toUpperCase()}</span>
          )}
        </div>

        <div className="detail-info">
          <span className="cat">{product.category}</span>
          <h1>{product.title}</h1>

          <div className="price-row">
            <span className="price lg">{money(product.price)}</span>
            {product.oldPrice > product.price && (
              <span className="old-price">{money(product.oldPrice)}</span>
            )}
          </div>

          <p className="desc">
            {product.description || 'Is product ki tafseel jald add ki jayegi.'}
          </p>

          <p className={product.stock > 0 ? 'in-stock' : 'out-stock'}>
            {product.stock > 0 ? `In stock (${product.stock})` : 'Out of stock'}
          </p>

          <div className="buy-row">
            <div className="qty">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)}>+</button>
            </div>
            <button
              className="btn btn-primary btn-lg"
              onClick={handleAdd}
              disabled={product.stock === 0}
            >
              {added ? 'Added ✓' : 'Add to cart'}
            </button>
            <Link to="/cart" className="btn btn-outline btn-lg">
              View cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
