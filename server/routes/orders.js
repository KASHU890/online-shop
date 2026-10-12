import { Router } from 'express'
import { db } from '../db.js'
import { requireAuth, requireAdmin } from '../auth.js'

const router = Router()

function orderCode() {
  return 'SE' + Math.floor(100000 + Math.random() * 900000)
}

router.post('/', requireAuth, (req, res) => {
  const { items, name, phone, email, address, city, payment } = req.body || {}

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Cart khali hai' })
  }
  if (!name || !phone || !address || !city) {
    return res.status(400).json({ error: 'Delivery details mukammal karein' })
  }

  let subtotal = 0
  const snapshot = []
  for (const item of items) {
    const row = db.prepare('SELECT * FROM products WHERE id = ?').get(item.id)
    if (!row) return res.status(400).json({ error: `Product nahi mila (id ${item.id})` })
    const qty = Math.max(1, Number(item.qty) || 1)
    subtotal += row.price * qty
    snapshot.push({ id: String(row.id), title: row.title, price: row.price, qty })
  }

  const shipping = subtotal >= 5000 ? 0 : 250
  const total = subtotal + shipping
  const code = orderCode()

  db.prepare(
    `INSERT INTO orders (order_code, user_id, name, phone, email, address, city, payment, total, items, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    code,
    req.user.id,
    name,
    phone,
    email || req.user.email,
    address,
    city,
    payment || 'cod',
    total,
    JSON.stringify(snapshot),
    Date.now()
  )

  res.status(201).json({ orderCode: code, total, count: snapshot.length })
})

router.get('/my', requireAuth, (req, res) => {
  const rows = db
    .prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC')
    .all(req.user.id)
  res.json(
    rows.map((o) => ({
      id: String(o.id),
      orderCode: o.order_code,
      total: o.total,
      items: JSON.parse(o.items),
      createdAt: o.created_at
    }))
  )
})

router.get('/', requireAdmin, (req, res) => {
  const rows = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all()
  res.json(
    rows.map((o) => ({
      id: String(o.id),
      orderCode: o.order_code,
      name: o.name,
      city: o.city,
      total: o.total,
      payment: o.payment,
      items: JSON.parse(o.items),
      createdAt: o.created_at
    }))
  )
})

export default router
