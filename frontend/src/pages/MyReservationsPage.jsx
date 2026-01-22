import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import api from '../services/api'

export default function MyReservationsPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    loadReservations()
  }, [activeTab])

  const loadReservations = async () => {
    try {
      setLoading(true)
      setError('')

      let data
      switch (activeTab) {
        case 'upcoming':
          data = await api.getUpcomingReservations()
          break
        case 'past':
          data = await api.getPastReservations()
          break
        case 'cancelled':
          data = await api.getCancelledReservations()
          break
        default:
          data = await api.getMyReservations()
      }

      setReservations(data.content || data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelReservation = async (id) => {
    if (!confirm('Czy na pewno chcesz anulować tę rezerwację?')) {
      return
    }

    try {
      await api.cancelReservation(id)
      await loadReservations()
    } catch (err) {
      alert(err.message)
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: { label: 'Oczekująca', class: 'badge-warning' },
      CONFIRMED: { label: 'Potwierdzona', class: 'badge-success' },
      CANCELLED: { label: 'Anulowana', class: 'badge-danger' },
      COMPLETED: { label: 'Zakończona', class: 'badge-info' }
    }
    const badge = badges[status] || { label: status, class: 'badge-info' }
    return <span className={`badge ${badge.class}`}>{badge.label}</span>
  }

  const canCancelReservation = (reservation) => {
    return reservation.status === 'PENDING' || reservation.status === 'CONFIRMED'
  }

  return (
    <Layout>
      <div className="container" style={{ padding: '40px 20px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '30px' }}>
          Moje rezerwacje
        </h1>

        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '30px',
          borderBottom: '2px solid #e0e0e0',
          overflowX: 'auto'
        }}>
          <button
            onClick={() => setActiveTab('all')}
            style={{
              padding: '12px 24px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'all' ? '3px solid #e67e22' : '3px solid transparent',
              color: activeTab === 'all' ? '#e67e22' : '#666',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
            }}
          >
            Wszystkie
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            style={{
              padding: '12px 24px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'upcoming' ? '3px solid #e67e22' : '3px solid transparent',
              color: activeTab === 'upcoming' ? '#e67e22' : '#666',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
            }}
          >
            Nadchodzące
          </button>
          <button
            onClick={() => setActiveTab('past')}
            style={{
              padding: '12px 24px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'past' ? '3px solid #e67e22' : '3px solid transparent',
              color: activeTab === 'past' ? '#e67e22' : '#666',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
            }}
          >
            Przeszłe
          </button>
          <button
            onClick={() => setActiveTab('cancelled')}
            style={{
              padding: '12px 24px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'cancelled' ? '3px solid #e67e22' : '3px solid transparent',
              color: activeTab === 'cancelled' ? '#e67e22' : '#666',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
            }}
          >
            Anulowane
          </button>
        </div>

        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Ładowanie rezerwacji...</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <h3>Wystąpił błąd</h3>
            <p>{error}</p>
            <button onClick={loadReservations} className="btn btn-primary">
              Spróbuj ponownie
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {reservations.length === 0 ? (
              <div className="empty-state">
                <h3>Brak rezerwacji</h3>
                <p>
                  {activeTab === 'all' && 'Nie masz jeszcze żadnych rezerwacji'}
                  {activeTab === 'upcoming' && 'Nie masz nadchodzących rezerwacji'}
                  {activeTab === 'past' && 'Nie masz przeszłych rezerwacji'}
                  {activeTab === 'cancelled' && 'Nie masz anulowanych rezerwacji'}
                </p>
                <button
                  onClick={() => navigate('/search')}
                  className="btn btn-primary"
                  style={{ marginTop: '16px' }}
                >
                  Szukaj miejsc
                </button>
              </div>
            ) : (
              <div className="grid grid-2">
                {reservations.map(reservation => (
                  <div key={reservation.id} className="card">
                    <img
                      src={reservation.place?.mainImageUrl}
                      alt={reservation.place?.name}
                      className="card-image"
                    />
                    <div className="card-body">
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '12px'
                      }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', flex: '1' }}>
                          {reservation.place?.name}
                        </h3>
                        {getStatusBadge(reservation.status)}
                      </div>

                      <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>
                        {reservation.place?.city?.name}
                      </p>

                      <div style={{
                        padding: '12px',
                        background: '#f8f9fa',
                        borderRadius: '8px',
                        marginBottom: '12px'
                      }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '4px'
                        }}>
                          <span style={{ color: '#666', fontSize: '14px' }}>Przyjazd:</span>
                          <span style={{ fontWeight: '600', fontSize: '14px' }}>
                            {new Date(reservation.checkIn).toLocaleDateString('pl-PL')}
                          </span>
                        </div>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '4px'
                        }}>
                          <span style={{ color: '#666', fontSize: '14px' }}>Wyjazd:</span>
                          <span style={{ fontWeight: '600', fontSize: '14px' }}>
                            {new Date(reservation.checkOut).toLocaleDateString('pl-PL')}
                          </span>
                        </div>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between'
                        }}>
                          <span style={{ color: '#666', fontSize: '14px' }}>Gości:</span>
                          <span style={{ fontWeight: '600', fontSize: '14px' }}>
                            {reservation.guests}
                          </span>
                        </div>
                      </div>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: '12px',
                        borderTop: '1px solid #e0e0e0',
                        marginBottom: '12px'
                      }}>
                        <span style={{ color: '#666', fontSize: '14px' }}>Całkowita cena:</span>
                        <span style={{ fontSize: '20px', fontWeight: '700', color: '#e67e22' }}>
                          {reservation.totalPrice} zł
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => navigate(`/place/${reservation.place?.id}`)}
                          className="btn btn-secondary btn-small"
                        >
                          Zobacz
                        </button>
                        <button
                          onClick={() => navigate(`/reservation/${reservation.id}`)}
                          className="btn btn-primary btn-small"
                          style={{ flex: '1' }}
                        >
                          Szczegóły
                        </button>
                        {canCancelReservation(reservation) && (
                          <button
                            onClick={() => handleCancelReservation(reservation.id)}
                            className="btn btn-danger btn-small"
                          >
                            Anuluj
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}
