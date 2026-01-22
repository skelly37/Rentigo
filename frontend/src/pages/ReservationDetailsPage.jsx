import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import api from '../services/api'
import { useAuth } from '../hooks/useAuth'

export default function ReservationDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [reservation, setReservation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  })
  const [reviewLoading, setReviewLoading] = useState(false)
  const [reviewError, setReviewError] = useState('')
  const [reviewSuccess, setReviewSuccess] = useState(false)
  const [messages, setMessages] = useState([])
  const [messageText, setMessageText] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)

  useEffect(() => {
    loadReservation()
    loadMessages()
  }, [id])

  const loadReservation = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await api.getReservation(id)
      setReservation(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async () => {
    try {
      const data = await api.getReservationMessages(id)
      setMessages(data)
    } catch (err) {
      console.error('Failed to load messages:', err)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!messageText.trim()) return

    setSendingMessage(true)
    try {
      await api.sendMessage(id, messageText)
      setMessageText('')
      await loadMessages()
    } catch (err) {
      alert(err.message)
    } finally {
      setSendingMessage(false)
    }
  }

  const handleCancelReservation = async () => {
    if (!confirm('Czy na pewno chcesz anulować tę rezerwację?')) {
      return
    }

    try {
      await api.cancelReservation(id)
      await loadReservation()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    setReviewLoading(true)
    setReviewError('')

    try {
      await api.createReview({
        reservationId: parseInt(id),
        placeId: reservation.place.id,
        rating: parseInt(reviewForm.rating),
        comment: reviewForm.comment
      })

      setReviewSuccess(true)
      setReviewForm({ rating: 5, comment: '' })
      setTimeout(() => {
        loadReservation()
      }, 1500)
    } catch (err) {
      setReviewError(err.message)
    } finally {
      setReviewLoading(false)
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

  const canReview = (reservation) => {
    const isGuest = reservation.user?.id === user?.id
    return isGuest && (reservation.status === 'COMPLETED' || reservation.status === 'CANCELLED') && !reservation.hasReview
  }

  if (loading) {
    return (
      <Layout>
        <div className="container" style={{ padding: '60px 20px' }}>
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Ładowanie szczegółów rezerwacji...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="container" style={{ padding: '60px 20px' }}>
          <div className="error-state">
            <h3>Wystąpił błąd</h3>
            <p>{error}</p>
            <button onClick={loadReservation} className="btn btn-primary">
              Spróbuj ponownie
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  if (!reservation) {
    return (
      <Layout>
        <div className="container" style={{ padding: '60px 20px' }}>
          <div className="empty-state">
            <h3>Rezerwacja nie została znaleziona</h3>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container" style={{ padding: '40px 20px', maxWidth: '900px' }}>
        <button
          onClick={() => navigate('/my-reservations')}
          className="btn btn-secondary"
          style={{ marginBottom: '30px' }}
        >
          ← Powrót do rezerwacji
        </button>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '30px'
        }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700' }}>
            Szczegóły rezerwacji
          </h1>
          {getStatusBadge(reservation.status)}
        </div>

        <div style={{
          background: 'white',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          marginBottom: '30px'
        }}>
          <img
            src={reservation.place?.mainImageUrl || '/placeholder.jpg'}
            alt={reservation.place?.name}
            style={{
              width: '100%',
              height: '300px',
              objectFit: 'cover'
            }}
          />

          <div style={{ padding: '30px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
              {reservation.place?.name}
            </h2>
            <p style={{ color: '#666', fontSize: '16px', marginBottom: '24px' }}>
              {reservation.place?.city?.name} • {reservation.place?.address}
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px',
              padding: '20px',
              background: '#f8f9fa',
              borderRadius: '12px',
              marginBottom: '24px'
            }}>
              <div>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '4px' }}>
                  Data przyjazdu
                </p>
                <p style={{ fontSize: '16px', fontWeight: '600' }}>
                  {new Date(reservation.checkIn).toLocaleDateString('pl-PL')}
                </p>
              </div>
              <div>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '4px' }}>
                  Data wyjazdu
                </p>
                <p style={{ fontSize: '16px', fontWeight: '600' }}>
                  {new Date(reservation.checkOut).toLocaleDateString('pl-PL')}
                </p>
              </div>
              <div>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '4px' }}>
                  Liczba gości
                </p>
                <p style={{ fontSize: '16px', fontWeight: '600' }}>
                  {reservation.guests}
                </p>
              </div>
            </div>

            <div style={{
              borderTop: '1px solid #e0e0e0',
              paddingTop: '20px'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
                Podsumowanie płatności
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666' }}>
                    {reservation.place?.pricePerNight} zł x {Math.ceil((new Date(reservation.checkOut) - new Date(reservation.checkIn)) / (1000 * 60 * 60 * 24))} nocy
                  </span>
                  <span style={{ fontWeight: '600' }}>
                    {reservation.place?.pricePerNight * Math.ceil((new Date(reservation.checkOut) - new Date(reservation.checkIn)) / (1000 * 60 * 60 * 24))} zł
                  </span>
                </div>

                {reservation.place?.cleaningFee > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#666' }}>Opłata za sprzątanie</span>
                    <span style={{ fontWeight: '600' }}>{reservation.place.cleaningFee} zł</span>
                  </div>
                )}

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: '1px solid #e0e0e0',
                  marginTop: '4px'
                }}>
                  <span style={{ fontSize: '18px', fontWeight: '600' }}>Razem</span>
                  <span style={{ fontSize: '24px', fontWeight: '700', color: '#e67e22' }}>
                    {reservation.totalPrice} zł
                  </span>
                </div>
              </div>
            </div>

            {canCancelReservation(reservation) && (
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button
                  onClick={handleCancelReservation}
                  className="btn btn-danger"
                  style={{ flex: '1' }}
                >
                  Anuluj rezerwację
                </button>
                <button
                  onClick={() => navigate(`/place/${reservation.place?.id}`)}
                  className="btn btn-secondary"
                  style={{ flex: '1' }}
                >
                  Zobacz hotel
                </button>
              </div>
            )}
            {!canCancelReservation(reservation) && (
              <button
                onClick={() => navigate(`/place/${reservation.place?.id}`)}
                className="btn btn-secondary"
                style={{ width: '100%', marginTop: '24px' }}
              >
                Zobacz hotel
              </button>
            )}
          </div>
        </div>

        {canReview(reservation) && !reviewSuccess && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '30px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px' }}>
              Dodaj opinię
            </h2>

            {reviewError && (
              <div className="alert alert-error" style={{ marginBottom: '20px' }}>
                {reviewError}
              </div>
            )}

            <form onSubmit={handleReviewSubmit}>
              <div className="form-group">
                <label>Ocena</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {[1, 2, 3, 4, 5].map(value => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: value })}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '32px',
                        cursor: 'pointer',
                        color: value <= reviewForm.rating ? '#e67e22' : '#e0e0e0',
                        transition: 'color 0.2s'
                      }}
                    >
                      ★
                    </button>
                  ))}
                  <span style={{ marginLeft: '8px', fontWeight: '600', fontSize: '18px' }}>
                    {reviewForm.rating}/5
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label>Komentarz</label>
                <textarea
                  rows="5"
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Podziel się swoimi wrażeniami..."
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={reviewLoading}
                style={{ width: '100%' }}
              >
                {reviewLoading ? 'Dodawanie opinii...' : 'Dodaj opinię'}
              </button>
            </form>
          </div>
        )}

        {reviewSuccess && (
          <div className="alert alert-success">
            Dziękujemy za dodanie opinii!
          </div>
        )}

        {reservation.hasReview && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '30px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '48px', marginBottom: '16px', display: 'block' }}>✓</span>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
              Już dodałeś opinię
            </h3>
            <p style={{ color: '#666' }}>
              Dziękujemy za podzielenie się swoją opinią!
            </p>
          </div>
        )}

        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '30px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          marginTop: '30px'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px' }}>
            Wiadomości
          </h2>

          <div style={{
            maxHeight: '400px',
            overflowY: 'auto',
            marginBottom: '20px',
            padding: '16px',
            background: '#f8f9fa',
            borderRadius: '12px'
          }}>
            {messages.length === 0 ? (
              <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
                Brak wiadomości. Rozpocznij konwersację!
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {messages.map(message => (
                  <div
                    key={message.id}
                    style={{
                      padding: '12px 16px',
                      background: 'white',
                      borderRadius: '12px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}>
                      <span style={{ fontWeight: '600', fontSize: '14px' }}>
                        {message.senderName}
                      </span>
                      <span style={{ color: '#666', fontSize: '12px' }}>
                        {new Date(message.createdAt).toLocaleString('pl-PL')}
                      </span>
                    </div>
                    <p style={{ color: '#333', fontSize: '15px', lineHeight: '1.5' }}>
                      {message.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Napisz wiadomość..."
                style={{
                  flex: '1',
                  padding: '12px 16px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '15px'
                }}
                disabled={sendingMessage}
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={sendingMessage || !messageText.trim()}
                style={{ padding: '12px 24px' }}
              >
                {sendingMessage ? 'Wysyłanie...' : 'Wyślij'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
