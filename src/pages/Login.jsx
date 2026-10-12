import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const u = await login(form.email, form.password)
      const from = location.state?.from
      navigate(from || (u.role === 'admin' ? '/admin' : '/'), { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="container section auth-wrap">
      <form className="form card auth-card" onSubmit={submit}>
        <h2>Welcome back</h2>
        <p className="muted">Apne account mein login karein.</p>

        {error && <div className="alert">{error}</div>}

        <label>
          Email
          <input
            type="email"
            className="input"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            className="input"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            required
          />
        </label>

        <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={busy}>
          {busy ? 'Logging in...' : 'Login'}
        </button>

        <p className="muted center">
          Account nahi hai? <Link className="link" to="/signup">Sign up</Link>
        </p>

        <div className="demo-box">
          <strong>Demo admin</strong>
          <span>admin@shop.com / admin123</span>
        </div>
      </form>
    </div>
  )
}
