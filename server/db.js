import { DatabaseSync } from 'node:sqlite'
import bcrypt from 'bcryptjs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(__dirname, 'data')
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })

const dbPath = path.join(dataDir, 'shop.db')
export const db = new DatabaseSync(dbPath)

db.exec('PRAGMA journal_mode = WAL;')

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'customer',
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    price REAL NOT NULL,
    old_price REAL,
    category TEXT NOT NULL DEFAULT 'Other',
    image TEXT,
    description TEXT,
    stock INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_code TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    payment TEXT NOT NULL,
    total REAL NOT NULL,
    items TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );
`)

export function seedAdmin() {
  const admins = db
    .prepare("SELECT COUNT(*) AS c FROM users WHERE role = 'admin'")
    .get()
  if (admins.c === 0) {
    const hash = bcrypt.hashSync('admin123', 10)
    db.prepare(
      'INSERT INTO users (name, email, password, role, created_at) VALUES (?, ?, ?, ?, ?)'
    ).run('Administrator', 'admin@shop.com', hash, 'admin', Date.now())
    console.log('✔ Seeded admin: admin@shop.com / admin123')
  }
}

export function ensureSampleProducts() {
  const { c } = db.prepare('SELECT COUNT(*) AS c FROM products').get()
  if (c > 0) return 0
  const now = Date.now()
  const rows = [
    ['Wireless Headphones', 4999, 6999, 'Electronics', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80', 'Noise cancelling over-ear headphones with 30 hour battery.', 12],
    ['Classic Denim Jacket', 3500, 4500, 'Fashion', 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=600&q=80', 'Durable cotton denim jacket, unisex fit.', 8],
    ['Running Sneakers', 6200, null, 'Fashion', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80', 'Lightweight running shoes with breathable mesh.', 20],
    ['Scented Candle Set', 1200, 1500, 'Home', 'https://images.unsplash.com/photo-1602874801006-e26c76fc1b9c?w=600&q=80', 'Set of 3 soothing aroma candles.', 30]
  ]
  const stmt = db.prepare(
    'INSERT INTO products (title, price, old_price, category, image, description, stock, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  )
  for (const r of rows) stmt.run(...r, now)
  return rows.length
}

export function rowToProduct(row) {
  return {
    id: String(row.id),
    title: row.title,
    price: row.price,
    oldPrice: row.old_price,
    category: row.category,
    image: row.image || '',
    description: row.description || '',
    stock: row.stock,
    createdAt: row.created_at
  }
}
