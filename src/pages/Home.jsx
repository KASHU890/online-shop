import { Link } from 'react-router-dom'
import { useProducts } from '../context/ProductContext.jsx'
import ProductCard from '../components/ProductCard.jsx'

export default function Home() {
  const { products, loading } = useProducts()
  const featured = products.slice(0, 8)

  return (
    <div>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-text">
            <span className="eyebrow">New season, new deals</span>
            <h1>Shop everything you love, in one place.</h1>
            <p>
              Electronics, fashion, home aur bohot kuch. Fast delivery, easy returns
              aur best prices — sirf ShopEasy par.
            </p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary btn-lg">
                Shop now
              </Link>
              <Link to="/products" className="btn btn-outline btn-lg">
                Browse categories
              </Link>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <span>🛍️</span>
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <h2>Featured products</h2>
          <Link to="/products" className="link">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="empty">
            <h3>Products load ho rahe hain...</h3>
          </div>
        ) : featured.length === 0 ? (
          <div className="empty">
            <h3>Abhi koi product nahi hai</h3>
            <p className="muted">
              Admin panel se products add karein, phir unhe yahan dekhen.
            </p>
            <div className="hero-actions">
              <Link to="/admin" className="btn btn-primary">
                Go to Admin
              </Link>
              <Link to="/products" className="btn btn-outline">
                Products page
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      <section className="container section">
        <div className="features">
          <div className="feature">
            <span className="feature-icon">🚚</span>
            <h4>Free delivery</h4>
            <p className="muted">Rs 5,000 se upar ke orders par</p>
          </div>
          <div className="feature">
            <span className="feature-icon">↩️</span>
            <h4>Easy returns</h4>
            <p className="muted">7 din ke andar wapas</p>
          </div>
          <div className="feature">
            <span className="feature-icon">🔒</span>
            <h4>Secure checkout</h4>
            <p className="muted">Aapka data mehfooz</p>
          </div>
          <div className="feature">
            <span className="feature-icon">💬</span>
            <h4>24/7 support</h4>
            <p className="muted">Hamesha aap ke saath</p>
          </div>
        </div>
      </section>
    </div>
  )
}
