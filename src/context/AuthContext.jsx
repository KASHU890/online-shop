import { createContext, useContext, useEffect, useState } from 'react'
import { api, setToken, clearToken } from '../utils/api.js'
import { load, save } from '../utils/storage.js'

const AuthContext = createContext(null)
const SESSION_KEY = 'shopeasy_session'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => load(SESSION_KEY, null))
  const [users, setUsers] = useState([])

  useEffect(() => save(SESSION_KEY, user), [user])

  async function login(email, password) {
    const { user: u, token } = await api.post('/auth/login', { email, password })
    setToken(token)
    setUser(u)
    return u
  }

  async function register(name, email, password) {
    const { user: u, token } = await api.post('/auth/register', { name, email, password })
    setToken(token)
    setUser(u)
    return u
  }

  function logout() {
    clearToken()
    setUser(null)
  }

  const isAdmin = user?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, isAdmin, users, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
