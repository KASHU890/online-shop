import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { load, save } from '../utils/storage.js'

const CartContext = createContext(null)
const KEY = 'shopeasy_cart'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => load(KEY, []))

  useEffect(() => save(KEY, items), [items])

  function add(product, qty = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + qty } : i
        )
      }
      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          qty
        }
      ]
    })
  }

  function setQty(id, qty) {
    if (qty <= 0) return remove(id)
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)))
  }

  function remove(id) {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  function clear() {
    setItems([])
  }

  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items])
  const subtotal = useMemo(
    () => items.reduce((s, i) => s + i.price * i.qty, 0),
    [items]
  )

  return (
    <CartContext.Provider
      value={{ items, add, setQty, remove, clear, count, subtotal }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
