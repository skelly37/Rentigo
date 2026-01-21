import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import api from '../services/api'

export default function MyPlacesPage() {
  const [places, setPlaces] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reservations, setReservations] = useState([])
  const [selectedPlaceId, setSelectedPlaceId] = useState(null)
  const [loadingReservations, setLoadingReservations] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')

      const [placesData, statsData] = await Promise.all([
        api.getMyPlaces(),
        api.getHostStats()
      ])

      setPlaces(placesData.content || placesData)
      setStats(statsData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePlace = async (id) => {
    if (!confirm('Czy na pewno chcesz usunąć to miejsce?')) {
      return
    }

    try {
      await api.deletePlace(id)
      setPlaces(places.filter(place => place.id !== id))
      loadData()
    } catch (err) {
      alert(err.message)
    }
  }

  const loadPlaceReservations = async (placeId) => {
    try {
      setLoadingReservations(true)
      setSelectedPlaceId(placeId)
      const data = await api.getPlaceReservations(placeId)
      setReservations(data)
    } catch (err) {
      alert(err.message)
    } finally {
      setLoadingReservations(false)
    }
  }

  const handleApproveReservation = async (reservationId) => {
    try {
      await api.confirmReservation(reservationId)
      if (selectedPlaceId) {
        loadPlaceReservations(selectedPlaceId)
      }
      loadData()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleCancelReservation = async (reservationId) => {
    if (!confirm('Czy na pewno chcesz anulować tę rezerwację?')) {
      return
    }

    try {
      await api.cancelReservation(reservationId)
      if (selectedPlaceId) {
        loadPlaceReservations(selectedPlaceId)
      }
      loadData()
    } catch (err) {
      alert(err.message)
    }
  }

  const getReservationStatus = (status) => {
    const statuses = {
      PENDING: { text: 'Oczekująca', color: '#ffc107' },
      CONFIRMED: { text: 'Potwierdzona', color: '#28a745' },
      CANCELLED: { text: 'Anulowana', color: '#dc3545' },
      COMPLETED: { text: 'Zakończona', color: '#6c757d' }
    }
    return statuses[status] || { text: status, color: '#666' }
  }

  const getPlaceType = (type) => {
    const types = {
      APARTMENT: 'Apartament',
      HOUSE: 'Dom',
      ROOM: 'Pokój',
      VILLA: 'Willa',
      STUDIO: 'Studio'
    }
    return types[type] || type
  }

  return (
    <Layout>
      <div className="container" style={{ padding: '40px 20px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700' }}>
            Moje miejsca
          </h1>
          <button
            onClick={() => navigate('/add-place')}
            className="btn btn-primary"
          >
            + Dodaj nowe miejsce
          </button>
        </div>

        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Ładowanie danych...</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <h3>Wystąpił błąd</h3>
            <p>{error}</p>
            <button onClick={loadData} className="btn btn-primary">
              Spróbuj ponownie
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {stats && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '20px',
                marginBottom: '40px'
              }}>
                <div style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                }}>
                  <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>
                    Aktywne miejsca
                  </p>
                  <p style={{ fontSize: '32px', fontWeight: '700', color: '#e67e22' }}>
                    {stats.activePlaces || 0}
                  </p>
                </div>

                <div style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                }}>
                  <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>
                    Rezerwacje (ten miesiąc)
                  </p>
                  <p style={{ fontSize: '32px', fontWeight: '700', color: '#28a745' }}>
                    {stats.monthlyReservations || 0}
                  </p>
                </div>

                <div style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                }}>
                  <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>
                    Średnia ocena
                  </p>
                  <p style={{ fontSize: '32px', fontWeight: '700', color: '#ffc107' }}>
                    {stats.averageRating ? Number(stats.averageRating).toFixed(1) : '—'}
                  </p>
                </div>

                <div style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                }}>
                  <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>
                    Dochód (ten miesiąc)
                  </p>
                  <p style={{ fontSize: '32px', fontWeight: '700', color: '#007bff' }}>
                    {stats.monthlyRevenue ? Number(stats.monthlyRevenue).toFixed(0) : 0} zł
                  </p>
                </div>
              </div>
            )}

            {places.length === 0 ? (
              <div className="empty-state">
                <span style={{ fontSize: '64px', marginBottom: '20px', display: 'block' }}>
                  🏠
                </span>
                <h3>Nie masz jeszcze żadnych miejsc</h3>
                <p>Dodaj swoje pierwsze miejsce i zacznij zarabiać na wynajmie</p>
                <button
                  onClick={() => navigate('/add-place')}
                  className="btn btn-primary"
                  style={{ marginTop: '20px' }}
                >
                  Dodaj miejsce
                </button>
              </div>
            ) : (
              <>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  marginBottom: '24px'
                }}>
                  Lista miejsc ({places.length})
                </h2>

                <div className="grid grid-3">
                  {places.map(place => (
                    <div key={place.id} className="card">
                      <img
                        src={place.mainImageUrl || place.images?.[0]?.url || '/placeholder.jpg'}
                        alt={place.name}
                        className="card-image"
                      />
                      <div className="card-body">
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '8px'
                        }}>
                          <h3 style={{
                            fontSize: '18px',
                            fontWeight: '600',
                            flex: '1',
                            marginRight: '8px'
                          }}>
                            {place.name}
                          </h3>
                          {place.averageRating > 0 && (
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '14px',
                              fontWeight: '600'
                            }}>
                              <span style={{ color: '#e67e22' }}>★</span>
                              <span>{place.averageRating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>

                        <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>
                          {getPlaceType(place.type)} • {place.maxGuests} gości
                        </p>

                        <p style={{ color: '#666', fontSize: '14px', marginBottom: '12px' }}>
                          {place.city?.name}
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
                            <span style={{ color: '#666', fontSize: '14px' }}>Cena / noc:</span>
                            <span style={{ fontWeight: '600', color: '#e67e22' }}>
                              {place.pricePerNight} zł
                            </span>
                          </div>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between'
                          }}>
                            <span style={{ color: '#666', fontSize: '14px' }}>Rezerwacje:</span>
                            <span style={{ fontWeight: '600' }}>
                              {place.reservationCount || 0}
                            </span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                          <button
                            onClick={() => navigate(`/place/${place.id}`)}
                            className="btn btn-secondary btn-small"
                            style={{ flex: '1' }}
                          >
                            Zobacz
                          </button>
                          <button
                            onClick={() => navigate(`/edit-place/${place.id}`)}
                            className="btn btn-primary btn-small"
                            style={{ flex: '1' }}
                          >
                            Edytuj
                          </button>
                          <button
                            onClick={() => handleDeletePlace(place.id)}
                            className="btn btn-danger btn-small"
                          >
                            🗑️
                          </button>
                        </div>
                        <button
                          onClick={() => loadPlaceReservations(place.id)}
                          className="btn btn-secondary btn-small"
                          style={{ width: '100%' }}
                        >
                          Rezerwacje ({place.reservationCount || 0})
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedPlaceId && (
                  <div style={{
                    marginTop: '40px',
                    background: 'white',
                    borderRadius: '16px',
                    padding: '30px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '24px'
                    }}>
                      <h2 style={{ fontSize: '24px', fontWeight: '600' }}>
                        Rezerwacje dla: {places.find(p => p.id === selectedPlaceId)?.name}
                      </h2>
                      <button
                        onClick={() => {
                          setSelectedPlaceId(null)
                          setReservations([])
                        }}
                        className="btn btn-secondary btn-small"
                      >
                        Zamknij
                      </button>
                    </div>

                    {loadingReservations ? (
                      <div style={{ textAlign: 'center', padding: '20px' }}>
                        <div className="spinner"></div>
                        <p>Ładowanie rezerwacji...</p>
                      </div>
                    ) : reservations.length === 0 ? (
                      <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                        Brak rezerwacji dla tego miejsca
                      </p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {reservations.map(reservation => {
                          const statusInfo = getReservationStatus(reservation.status)
                          return (
                            <div
                              key={reservation.id}
                              style={{
                                border: '1px solid #e0e0e0',
                                borderRadius: '12px',
                                padding: '20px',
                                background: '#f8f9fa'
                              }}
                            >
                              <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr 1fr auto',
                                gap: '20px',
                                alignItems: 'center'
                              }}>
                                <div>
                                  <p style={{ color: '#666', fontSize: '14px', marginBottom: '4px' }}>
                                    Gość
                                  </p>
                                  <p style={{ fontWeight: '600' }}>
                                    {reservation.user?.firstName} {reservation.user?.lastName}
                                  </p>
                                  <p style={{ color: '#666', fontSize: '14px' }}>
                                    {reservation.guests} {reservation.guests === 1 ? 'gość' : 'gości'}
                                  </p>
                                </div>

                                <div>
                                  <p style={{ color: '#666', fontSize: '14px', marginBottom: '4px' }}>
                                    Daty
                                  </p>
                                  <p style={{ fontWeight: '600' }}>
                                    {new Date(reservation.checkIn).toLocaleDateString('pl-PL')}
                                  </p>
                                  <p style={{ color: '#666', fontSize: '14px' }}>
                                    do {new Date(reservation.checkOut).toLocaleDateString('pl-PL')}
                                  </p>
                                </div>

                                <div>
                                  <p style={{ color: '#666', fontSize: '14px', marginBottom: '4px' }}>
                                    Status
                                  </p>
                                  <span style={{
                                    display: 'inline-block',
                                    padding: '4px 12px',
                                    borderRadius: '12px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    background: statusInfo.color,
                                    color: 'white'
                                  }}>
                                    {statusInfo.text}
                                  </span>
                                  <p style={{ fontWeight: '600', marginTop: '4px' }}>
                                    {reservation.totalPrice} zł
                                  </p>
                                </div>

                                <div style={{ display: 'flex', gap: '8px' }}>
                                  {reservation.status === 'PENDING' && (
                                    <>
                                      <button
                                        onClick={() => handleApproveReservation(reservation.id)}
                                        className="btn btn-primary btn-small"
                                      >
                                        Zatwierdź
                                      </button>
                                      <button
                                        onClick={() => handleCancelReservation(reservation.id)}
                                        className="btn btn-danger btn-small"
                                      >
                                        Anuluj
                                      </button>
                                    </>
                                  )}
                                  {reservation.status === 'CONFIRMED' && (
                                    <button
                                      onClick={() => handleCancelReservation(reservation.id)}
                                      className="btn btn-danger btn-small"
                                    >
                                      Anuluj
                                    </button>
                                  )}
                                  <button
                                    onClick={() => navigate(`/reservation/${reservation.id}`)}
                                    className="btn btn-secondary btn-small"
                                  >
                                    Szczegóły
                                  </button>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}
