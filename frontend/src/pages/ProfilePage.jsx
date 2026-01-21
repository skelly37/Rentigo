import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [upgrading, setUpgrading] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || ''
      })
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const updatedUser = await api.updateMe(formData)
      updateUser(updatedUser)
      setSuccess('Profil został zaktualizowany!')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpgradeToHost = async () => {
    if (!confirm('Czy na pewno chcesz zostać gospodarzem? Będziesz mógł dodawać własne miejsca.')) {
      return
    }

    setUpgrading(true)
    setError('')
    setSuccess('')

    try {
      const updatedUser = await api.upgradeToHost()
      updateUser(updatedUser)
      setSuccess('Zostałeś gospodarzem! Możesz teraz dodawać miejsca.')
      setTimeout(() => {
        navigate('/my-places')
      }, 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setUpgrading(false)
    }
  }

  return (
    <Layout>
      <div className="container" style={{ padding: '40px 20px', maxWidth: '800px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '30px' }}>
          Mój profil
        </h1>

        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          marginBottom: '30px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '30px',
            paddingBottom: '20px',
            borderBottom: '1px solid #e0e0e0'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #e67e22, #d35400)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '32px',
              fontWeight: '700'
            }}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '4px' }}>
                {user?.firstName} {user?.lastName}
              </h2>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>
                {user?.email}
              </p>
              <div>
                {user?.role === 'USER' && (
                  <span className="badge badge-info">Użytkownik</span>
                )}
                {user?.role === 'HOST' && (
                  <span className="badge badge-success">Gospodarz</span>
                )}
                {user?.role === 'ADMIN' && (
                  <span className="badge badge-danger">Administrator</span>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: '20px' }}>
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success" style={{ marginBottom: '20px' }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
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
              <label>Telefon</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+48 123 456 789"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? 'Zapisywanie...' : 'Zapisz zmiany'}
            </button>
          </form>
        </div>

        {user?.role === 'USER' && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '40px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: '#f8f9fa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '40px'
            }}>
              🏠
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '12px' }}>
              Zostań gospodarzem
            </h2>
            <p style={{
              color: '#666',
              fontSize: '16px',
              marginBottom: '24px',
              lineHeight: '1.6'
            }}>
              Zarabiaj, wynajmując swoją nieruchomość. Dołącz do społeczności gospodarzy i zacznij udostępniać swoje miejsce gościom z całego świata.
            </p>
            <button
              onClick={handleUpgradeToHost}
              className="btn btn-primary"
              disabled={upgrading}
              style={{ minWidth: '200px' }}
            >
              {upgrading ? 'Przetwarzanie...' : 'Zostań gospodarzem'}
            </button>
          </div>
        )}

        {(user?.role === 'HOST' || user?.role === 'ADMIN') && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '30px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
              Panel gospodarza
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={() => navigate('/my-places')}
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'flex-start' }}
              >
                📋 Moje miejsca
              </button>
              <button
                onClick={() => navigate('/add-place')}
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'flex-start' }}
              >
                ➕ Dodaj nowe miejsce
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
