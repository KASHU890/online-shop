import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Signup() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) {
      setError('Password kam az kam 6 characters ka hona chahiye')
      return
    }
    if (form.password !== form.confirm) {
      setError('Dono password match nahi kar rahe')
      return
    }
    setBusy(true)
    try {
      await register(form.name, form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="container section auth-wrap">
      <form className="form card auth-card" onSubmit={submit}>
        <h2>Create account</h2>
        <p className="muted">Aaj hi ShopEasy join karein.</p>

        {error && <div className="alert">{error}</div>}

        <label>
          Full name
          <input
            className="input"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
        </label>
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
        <div className="two">
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
          <label>
            Confirm
            <input
              type="password"
              className="input"
              value={form.confirm}
              onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
              required
            />
          </label>
        </div>

        <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={busy}>
          {busy ? 'Creating...' : 'Create account'}
        </button>

        <p className="muted center">
          Pehle se account hai? <Link className="link" to="/login">Login</Link>
        </p>
      </form>
    </div>
  )
}
