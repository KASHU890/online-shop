import { useMemo, useState } from 'react'
import { useProducts, CATEGORIES } from '../context/ProductContext.jsx'
import ProductCard from '../components/ProductCard.jsx'

export default function Products() {
  const { products, loading } = useProducts()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('All')
  const [sort, setSort] = useState('new')

  const filtered = useMemo(() => {
    let list = products.filter((p) =>
      p.title.toLowerCase().includes(q.trim().toLowerCase())
    )
    if (cat !== 'All') list = list.filter((p) => p.category === cat)
    if (sort === 'low') list = [...list].sort((a, b) => a.price - b.price)
    if (sort === 'high') list = [...list].sort((a, b) => b.price - a.price)
    if (sort === 'new') list = [...list].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    return list
  }, [products, q, cat, sort])

  return (
    <div className="container section">
      <div className="section-head">
        <h2>All products</h2>
        <span className="muted">{filtered.length} items</span>
      </div>

      <div className="filters">
        <input
          className="input"
          placeholder="Search products..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select className="input" value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="All">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select className="input" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="new">Newest</option>
          <option value="low">Price: low to high</option>
          <option value="high">Price: high to low</option>
        </select>
      </div>

      {loading ? (
        <div className="empty">
          <h3>Products load ho rahe hain...</h3>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty">
          <h3>Koi product nahi mila</h3>
          <p className="muted">Filters badlein ya admin panel se products add karein.</p>
        </div>
      ) : (
        <div className="grid">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
