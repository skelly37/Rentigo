import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      return JSON.parse(storedUser)
    }
    return null
  })
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      api.setToken(storedToken)
      return storedToken
    }
    return null
  })
  const [loading, setLoading] = useState(false)

  const login = (newToken, newUser) => {
    setToken(newToken)
    setUser(newUser)
    api.setToken(newToken)
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    api.setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const updateUser = (updatedUser) => {
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    updateUser,
    isLoggedIn: !!user,
    isHost: user?.role === 'HOST' || user?.role === 'ADMIN',
    isAdmin: user?.role === 'ADMIN'
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
