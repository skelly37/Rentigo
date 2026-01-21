import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import './LoginPage.css'

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState('login')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login: authLogin } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const data = await api.login(formData.email, formData.password)
      if (data && data.token && data.user) {
        api.setToken(data.token)
        authLogin(data.token, data.user)
        navigate('/')
      } else {
        setError('Nieprawidłowa odpowiedź serwera')
      }
    } catch (err) {
      setError(err.message || 'Nieprawidłowy email lub hasło')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const data = await api.register(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.password
      )
      api.setToken(data.token)
      authLogin(data.token, data.user)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-header">
        <a href="/" className="logo">Rentigo</a>
      </div>

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-tabs">
            <button
              className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => setActiveTab('login')}
            >
              Logowanie
            </button>
            <button
              className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => setActiveTab('register')}
            >
              Rejestracja
            </button>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {activeTab === 'login' ? (
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Hasło</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading} style={{width: '100%'}}>
                {loading ? 'Logowanie...' : 'Zaloguj się'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label>Imię</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Nazwisko</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Hasło</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading} style={{width: '100%'}}>
                {loading ? 'Rejestracja...' : 'Zarejestruj się'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
