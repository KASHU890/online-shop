import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { db } from '../db.js'
import { signToken } from '../auth.js'

const router = Router()

function publicUser(u) {
  return { id: String(u.id), name: u.name, email: u.email, role: u.role }
}

router.post('/register', (req, res) => {
  const { name, email, password } = req.body || {}
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email aur password zaroori hain' })
  }
  if (String(password).length < 6) {
    return res.status(400).json({ error: 'Password kam az kam 6 characters ka ho' })
  }

  const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase())
  if (exists) {
    return res.status(409).json({ error: 'Ye email pehle se registered hai' })
  }

  const hash = bcrypt.hashSync(password, 10)
  const info = db
    .prepare(
      'INSERT INTO users (name, email, password, role, created_at) VALUES (?, ?, ?, ?, ?)'
    )
    .run(name.trim(), email.toLowerCase().trim(), hash, 'customer', Date.now())

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid)
  const safe = publicUser(user)
  res.status(201).json({ user: safe, token: signToken(safe) })
})

router.post('/login', (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) {
    return res.status(400).json({ error: 'Email aur password daalein' })
  }
  const user = db
    .prepare('SELECT * FROM users WHERE email = ?')
    .get(String(email).toLowerCase().trim())

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Email ya password ghalat hai' })
  }

  const safe = publicUser(user)
  res.json({ user: safe, token: signToken(safe) })
})

router.get('/me', (req, res) => {
  res.json({ ok: true })
})

export default router
