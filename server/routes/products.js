import { Router } from 'express'
import { db, rowToProduct } from '../db.js'
import { requireAdmin } from '../auth.js'

const router = Router()

router.get('/', (req, res) => {
  const { q = '', category = '' } = req.query
  let sql = 'SELECT * FROM products WHERE 1=1'
  const params = []
  if (q) {
    sql += ' AND title LIKE ?'
    params.push(`%${q}%`)
  }
  if (category && category !== 'All') {
    sql += ' AND category = ?'
    params.push(category)
  }
  sql += ' ORDER BY created_at DESC'
  const rows = db.prepare(sql).all(...params)
  res.json(rows.map(rowToProduct))
})

router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id)
  if (!row) return res.status(404).json({ error: 'Product nahi mila' })
  res.json(rowToProduct(row))
})

router.post('/', requireAdmin, (req, res) => {
  const b = req.body || {}
  if (!b.title || b.price == null || b.price === '') {
    return res.status(400).json({ error: 'Title aur price zaroori hain' })
  }
  const info = db
    .prepare(
      'INSERT INTO products (title, price, old_price, category, image, description, stock, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    )
    .run(
      String(b.title).trim(),
      Number(b.price),
      b.oldPrice ? Number(b.oldPrice) : null,
      b.category || 'Other',
      b.image || '',
      b.description || '',
      b.stock === '' || b.stock == null ? 0 : Number(b.stock),
      Date.now()
    )
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(info.lastInsertRowid)
  res.status(201).json(rowToProduct(row))
})

router.put('/:id', requireAdmin, (req, res) => {
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'Product nahi mila' })
  const b = req.body || {}
  db.prepare(
    `UPDATE products SET title = ?, price = ?, old_price = ?, category = ?, image = ?, description = ?, stock = ? WHERE id = ?`
  ).run(
    b.title != null ? String(b.title).trim() : existing.title,
    b.price != null && b.price !== '' ? Number(b.price) : existing.price,
    b.oldPrice ? Number(b.oldPrice) : null,
    b.category || existing.category,
    b.image ?? existing.image,
    b.description ?? existing.description,
    b.stock === '' || b.stock == null ? 0 : Number(b.stock),
    req.params.id
  )
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id)
  res.json(rowToProduct(row))
})

router.delete('/:id', requireAdmin, (req, res) => {
  const info = db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id)
  if (info.changes === 0) return res.status(404).json({ error: 'Product nahi mila' })
  res.json({ ok: true })
})

export default router
