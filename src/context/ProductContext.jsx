import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { api } from '../utils/api.js'

const ProductContext = createContext(null)

export const CATEGORIES = [
  'Electronics',
  'Fashion',
  'Home',
  'Beauty',
  'Sports',
  'Books',
  'Other'
]

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    try {
      setLoading(true)
      const list = await api.get('/products')
      setProducts(list)
      setError('')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  async function addProduct(data) {
    const created = await api.post('/products', data)
    setProducts((prev) => [created, ...prev])
    return created
  }

  async function updateProduct(id, data) {
    const updated = await api.put(`/products/${id}`, data)
    setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)))
    return updated
  }

  async function removeProduct(id) {
    await api.del(`/products/${id}`)
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  function getProduct(id) {
    return products.find((p) => p.id === id) || null
  }

  return (
    <ProductContext.Provider
      value={{ products, loading, error, refresh, addProduct, updateProduct, removeProduct, getProduct }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export const useProducts = () => useContext(ProductContext)
