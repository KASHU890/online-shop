import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { money } from '../utils/storage.js'

function Placeholder({ title }) {
  return (
    <div className="card-img placeholder">
      <span>{(title || '?').charAt(0).toUpperCase()}</span>
    </div>
  )
}

export default function ProductCard({ product }) {
  const { add } = useCart()

  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-media">
        {product.image ? (
          <img src={product.image} alt={product.title} loading="lazy" />
        ) : (
          <Placeholder title={product.title} />
        )}
        {discount > 0 && <span className="badge-discount">-{discount}%</span>}
      </Link>

      <div className="product-body">
        <span className="cat">{product.category}</span>
        <Link to={`/product/${product.id}`} className="product-title">
          {product.title}
        </Link>

        <div className="price-row">
          <span className="price">{money(product.price)}</span>
          {product.oldPrice > product.price && (
            <span className="old-price">{money(product.oldPrice)}</span>
          )}
        </div>

        <button
          className="btn btn-primary btn-block"
          onClick={() => add(product)}
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? 'Out of stock' : 'Add to cart'}
        </button>
      </div>
    </div>
  )
}
