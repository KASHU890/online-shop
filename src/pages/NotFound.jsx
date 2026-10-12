import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container section">
      <div className="empty">
        <span className="empty-emoji">🔍</span>
        <h2>404 — Page not found</h2>
        <p className="muted">Ye page mojood nahi hai.</p>
        <Link to="/" className="btn btn-primary">
          Go home
        </Link>
      </div>
    </div>
  )
}
