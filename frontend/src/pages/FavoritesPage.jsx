import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import api from '../services/api'

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await api.getFavorites()
      setFavorites(data.content || data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFavorite = async (placeId, e) => {
    e.stopPropagation()

    try {
      await api.toggleFavorite(placeId)
      setFavorites(favorites.filter(place => place.id !== placeId))
    } catch (err) {
      alert(err.message)
    }
  }

  const handlePlaceClick = (placeId) => {
    navigate(`/place/${placeId}`)
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
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '30px' }}>
          Ulubione miejsca
        </h1>

        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Ładowanie ulubionych miejsc...</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <h3>Wystąpił błąd</h3>
            <p>{error}</p>
            <button onClick={loadFavorites} className="btn btn-primary">
              Spróbuj ponownie
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {favorites.length === 0 ? (
              <div className="empty-state">
                <span style={{ fontSize: '64px', marginBottom: '20px', display: 'block' }}>
                  🤍
                </span>
                <h3>Brak ulubionych miejsc</h3>
                <p>Dodaj miejsca do ulubionych, aby móc łatwo do nich wrócić później</p>
                <button
                  onClick={() => navigate('/search')}
                  className="btn btn-primary"
                  style={{ marginTop: '20px' }}
                >
                  Szukaj miejsc
                </button>
              </div>
            ) : (
              <>
                <p style={{ color: '#666', marginBottom: '24px', fontSize: '15px' }}>
                  {favorites.length} {favorites.length === 1 ? 'ulubione miejsce' : 'ulubionych miejsca'}
                </p>

                <div className="grid grid-3">
                  {favorites.map(place => {
                    if (!place) return null
                    return (
                      <div
                        key={place.id}
                        className="card"
                        onClick={() => handlePlaceClick(place.id)}
                        style={{ cursor: 'pointer', position: 'relative' }}
                      >
                        <button
                          onClick={(e) => handleRemoveFavorite(place.id, e)}
                          style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            background: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: '20px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            zIndex: 1,
                            transition: 'transform 0.2s'
                          }}
                          onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                        >
                          ❤️
                        </button>

                        <img
                          src={place.mainImageUrl || '/placeholder.jpg'}
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
                            {place.rating > 0 && (
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '14px',
                                fontWeight: '600'
                              }}>
                                <span style={{ color: '#e67e22' }}>★</span>
                                <span>{place.rating.toFixed(1)}</span>
                              </div>
                            )}
                          </div>

                          <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>
                            {getPlaceType(place.type)} • {place.maxGuests} gości
                          </p>

                          <p style={{ color: '#666', fontSize: '14px', marginBottom: '12px' }}>
                            {place.cityName}
                          </p>

                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingTop: '12px',
                            borderTop: '1px solid #e0e0e0'
                          }}>
                            <div>
                              <span style={{ fontSize: '20px', fontWeight: '700', color: '#e67e22' }}>
                                {place.pricePerNight} zł
                              </span>
                              <span style={{ color: '#666', fontSize: '14px' }}> / noc</span>
                            </div>
                            <button
                              className="btn btn-primary btn-small"
                              onClick={(e) => {
                                e.stopPropagation()
                                handlePlaceClick(place.id)
                              }}
                            >
                              Zobacz
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}
