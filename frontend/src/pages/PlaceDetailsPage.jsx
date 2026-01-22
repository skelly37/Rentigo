import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { getTodayDate, getTomorrowDate, getPlaceType } from '../utils/helpers'

export default function PlaceDetailsPage() {
  const { id } = useParams()
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const [place, setPlace] = useState(null)
  const [reviews, setReviews] = useState([])
  const [reviewSummary, setReviewSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isFavorite, setIsFavorite] = useState(false)

  const [bookingForm, setBookingForm] = useState({
    checkIn: getTodayDate(),
    checkOut: getTomorrowDate(),
    guests: 1
  })
  const [bookingError, setBookingError] = useState('')
  const [bookingLoading, setBookingLoading] = useState(false)

  useEffect(() => {
    loadPlaceDetails()
  }, [id])

  const loadPlaceDetails = async () => {
    try {
      setLoading(true)
      setError('')

      const [placeData, reviewsData, summaryData] = await Promise.all([
        api.getPlace(id),
        api.getPlaceReviews(id),
        api.getReviewSummary(id).catch(() => null)
      ])

      setPlace(placeData)
      setReviews(reviewsData)
      setReviewSummary(summaryData)
      setIsFavorite(placeData.isFavorite || false)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleFavorite = async () => {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }

    try {
      await api.toggleFavorite(id)
      setIsFavorite(!isFavorite)
    } catch (err) {
      alert(err.message)
    }
  }

  const handleBookingSubmit = async (e) => {
    e.preventDefault()

    if (!isLoggedIn) {
      navigate('/login')
      return
    }

    setBookingLoading(true)
    setBookingError('')

    try {
      const reservation = await api.createReservation({
        placeId: parseInt(id),
        checkIn: bookingForm.checkIn,
        checkOut: bookingForm.checkOut,
        guests: parseInt(bookingForm.guests)
      })

      alert('Rezerwacja została utworzona!')
      navigate(`/reservation/${reservation.id}`)
    } catch (err) {
      setBookingError(err.message)
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="container" style={{ padding: '60px 20px' }}>
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Ładowanie szczegółów miejsca...</p>
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
            <button onClick={loadPlaceDetails} className="btn btn-primary">
              Spróbuj ponownie
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  if (!place) {
    return (
      <Layout>
        <div className="container" style={{ padding: '60px 20px' }}>
          <div className="empty-state">
            <h3>Miejsce nie zostało znalezione</h3>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container" style={{ padding: '40px 20px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '8px',
          marginBottom: '40px',
          borderRadius: '16px',
          overflow: 'hidden',
          maxHeight: '500px'
        }}>
          <div style={{ gridRow: 'span 2' }}>
            <img
              src={place.images?.[0]?.url}
              alt={place.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          {place.images?.slice(1, 5).map((image, index) => (
            <img
              key={image.id}
              src={image.url}
              alt={`${place.name} ${index + 2}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ))}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '40px'
        }}>
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '20px'
            }}>
              <div>
                <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '12px' }}>
                  {place.name}
                </h1>
                {reviewSummary && reviewSummary.reviewCount > 0 && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}>
                    <span>{Number(reviewSummary.averageRating).toFixed(1)}</span>
                    <span style={{ color: '#e67e22' }}>★</span>
                    <span style={{ color: '#666', fontWeight: '400' }}>
                      / {reviewSummary.reviewCount} {reviewSummary.reviewCount === 1 ? 'opinia' : 'opinii'}
                    </span>
                  </div>
                )}
                <p style={{ color: '#666', fontSize: '16px' }}>
                  {place.city?.name} • {getPlaceType(place.type)} • {place.maxGuests} gości
                </p>
              </div>

              <button
                onClick={handleToggleFavorite}
                className="btn btn-secondary"
                style={{ fontSize: '20px' }}
              >
                {isFavorite ? '❤️' : '🤍'}
              </button>
            </div>


            <div style={{
              borderTop: '1px solid #e0e0e0',
              borderBottom: '1px solid #e0e0e0',
              padding: '24px 0',
              marginBottom: '24px'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
                Opis
              </h2>
              <p style={{
                color: '#666',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                overflowWrap: 'break-word'
              }}>
                {place.description}
              </p>
            </div>

            {place.owner && (
              <div style={{
                borderBottom: '1px solid #e0e0e0',
                paddingBottom: '24px',
                marginBottom: '24px'
              }}>
                <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
                  Gospodarz
                </h2>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '20px',
                  background: '#f8f9fa',
                  borderRadius: '12px'
                }}>
                  <img
                    src={place.owner.avatarUrl}
                    alt={`${place.owner.firstName} ${place.owner.lastName}`}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                      {place.owner.firstName} {place.owner.lastName}
                    </h3>
                    <p style={{ color: '#666', fontSize: '14px', marginBottom: '4px' }}>
                      Dołączył: {new Date(place.owner.createdAt).toLocaleDateString('pl-PL', {
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                    {place.owner.placeCount !== undefined && (
                      <p style={{ color: '#666', fontSize: '14px' }}>
                        {place.owner.placeCount} {place.owner.placeCount === 1 ? 'miejsce' : 'miejsca'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div style={{
              borderBottom: '1px solid #e0e0e0',
              paddingBottom: '24px',
              marginBottom: '24px'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
                Szczegóły
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <div>
                  <p style={{ color: '#666', fontSize: '14px' }}>Sypialnie</p>
                  <p style={{ fontSize: '18px', fontWeight: '600' }}>{place.bedrooms}</p>
                </div>
                <div>
                  <p style={{ color: '#666', fontSize: '14px' }}>Łazienki</p>
                  <p style={{ fontSize: '18px', fontWeight: '600' }}>{place.bathrooms}</p>
                </div>
                <div>
                  <p style={{ color: '#666', fontSize: '14px' }}>Maksymalnie gości</p>
                  <p style={{ fontSize: '18px', fontWeight: '600' }}>{place.maxGuests}</p>
                </div>
              </div>
            </div>

            {place.amenities && place.amenities.length > 0 && (
              <div style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
                  Udogodnienia
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  {place.amenities.map(amenity => (
                    <div key={amenity.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '20px' }}>✓</span>
                      <span>{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {reviews.length > 0 && (
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
                  Opinie
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {reviews.map(review => (
                    <div
                      key={review.id}
                      style={{
                        padding: '20px',
                        background: '#f8f9fa',
                        borderRadius: '12px'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '12px'
                      }}>
                        <div>
                          <p style={{ fontWeight: '600', marginBottom: '4px' }}>
                            {review.user?.firstName} {review.user?.lastName}
                          </p>
                          <p style={{ color: '#666', fontSize: '14px' }}>
                            {new Date(review.createdAt).toLocaleDateString('pl-PL')}
                          </p>
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '16px',
                          fontWeight: '600'
                        }}>
                          <span style={{ color: '#e67e22' }}>★</span>
                          <span>{review.rating}</span>
                        </div>
                      </div>
                      <p style={{ color: '#666', lineHeight: '1.6' }}>
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <div style={{
              position: 'sticky',
              top: '20px',
              background: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <div style={{ marginBottom: '20px' }}>
                <span style={{ fontSize: '28px', fontWeight: '700', color: '#e67e22' }}>
                  {place.pricePerNight} zł
                </span>
                <span style={{ color: '#666' }}> / noc</span>
              </div>

              {bookingError && (
                <div className="alert alert-error" style={{ marginBottom: '16px' }}>
                  {bookingError}
                </div>
              )}

              <form onSubmit={handleBookingSubmit}>
                <div className="form-group">
                  <label>Data przyjazdu</label>
                  <input
                    type="date"
                    value={bookingForm.checkIn}
                    onChange={(e) => setBookingForm({ ...bookingForm, checkIn: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Data wyjazdu</label>
                  <input
                    type="date"
                    value={bookingForm.checkOut}
                    onChange={(e) => setBookingForm({ ...bookingForm, checkOut: e.target.value })}
                    min={bookingForm.checkIn || new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Liczba gości</label>
                  <input
                    type="number"
                    min="1"
                    max={place.maxGuests}
                    value={bookingForm.guests}
                    onChange={(e) => setBookingForm({ ...bookingForm, guests: e.target.value })}
                    required
                  />
                </div>

                {bookingForm.checkIn && bookingForm.checkOut && (
                  <div style={{
                    marginBottom: '16px',
                    padding: '16px',
                    background: '#f8f9fa',
                    borderRadius: '8px'
                  }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                      Szczegóły ceny
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {(() => {
                        const nights = Math.ceil((new Date(bookingForm.checkOut) - new Date(bookingForm.checkIn)) / (1000 * 60 * 60 * 24))
                        const nightsPrice = place.pricePerNight * nights
                        const serviceFee = Math.round(nightsPrice * 0.05)
                        const totalPrice = nightsPrice + (place.cleaningFee || 0) + serviceFee

                        return (
                          <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                              <span style={{ color: '#666' }}>
                                {place.pricePerNight} zł × {nights} {nights === 1 ? 'noc' : nights < 5 ? 'noce' : 'nocy'}
                              </span>
                              <span style={{ fontWeight: '600' }}>{nightsPrice} zł</span>
                            </div>

                            {place.cleaningFee > 0 && (
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                <span style={{ color: '#666' }}>Opłata za sprzątanie</span>
                                <span style={{ fontWeight: '600' }}>{place.cleaningFee} zł</span>
                              </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                              <span style={{ color: '#666' }}>Prowizja portalu (5%)</span>
                              <span style={{ fontWeight: '600' }}>{serviceFee} zł</span>
                            </div>

                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              paddingTop: '8px',
                              marginTop: '8px',
                              borderTop: '1px solid #e0e0e0'
                            }}>
                              <span style={{ fontSize: '16px', fontWeight: '700' }}>Razem</span>
                              <span style={{ fontSize: '18px', fontWeight: '700', color: '#e67e22' }}>
                                {totalPrice} zł
                              </span>
                            </div>
                          </>
                        )
                      })()}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={bookingLoading}
                  style={{ width: '100%' }}
                >
                  {bookingLoading ? 'Rezerwowanie...' : 'Zarezerwuj'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
