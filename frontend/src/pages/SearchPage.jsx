import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout'
import api from '../services/api'
import { getTodayDate, getTomorrowDate, getPlaceType } from '../utils/helpers'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const [places, setPlaces] = useState([])
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [filters, setFilters] = useState({
    cityId: searchParams.get('cityId') || '',
    guests: searchParams.get('guests') || '',
    checkIn: searchParams.get('checkIn') || getTodayDate(),
    checkOut: searchParams.get('checkOut') || getTomorrowDate()
  })
  const navigate = useNavigate()

  useEffect(() => {
    loadCities()
  }, [])

  useEffect(() => {
    loadPlaces()
  }, [filters])

  const loadCities = async () => {
    try {
      const data = await api.getCities()
      setCities(data)
    } catch (err) {
      console.error('Failed to load cities:', err)
    }
  }

  const loadPlaces = async () => {
    try {
      setLoading(true)
      setError('')

      let data
      if (filters.cityId) {
        data = await api.getPlacesByCity(filters.cityId, filters.guests, filters.checkIn, filters.checkOut)
      } else {
        data = await api.getPlaces()
      }

      setPlaces(data.content || data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters({ ...filters, [name]: value })
  }

  const handleFilterSubmit = (e) => {
    e.preventDefault()
    loadPlaces()
  }

  const handlePlaceClick = (placeId) => {
    navigate(`/place/${placeId}`)
  }

  return (
    <Layout>
      <div className="container" style={{ padding: '40px 20px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '30px' }}>
          Wyniki wyszukiwania
        </h1>

        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '30px',
          marginBottom: '40px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
            Filtry
          </h2>

          <form onSubmit={handleFilterSubmit} style={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            alignItems: 'flex-end'
          }}>
            <div className="form-group" style={{ flex: '1', minWidth: '200px', marginBottom: '0' }}>
              <label>Miasto</label>
              <select
                name="cityId"
                value={filters.cityId}
                onChange={handleFilterChange}
              >
                <option value="">Wszystkie miasta</option>
                {cities.map(city => (
                  <option key={city.id} value={city.id}>{city.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ flex: '0 0 150px', marginBottom: '0' }}>
              <label>Liczba gości</label>
              <input
                type="number"
                name="guests"
                min="1"
                value={filters.guests}
                onChange={handleFilterChange}
                placeholder="Dowolna"
              />
            </div>

            <div className="form-group" style={{ flex: '1', minWidth: '150px', marginBottom: '0' }}>
              <label>Data przyjazdu</label>
              <input
                type="date"
                name="checkIn"
                value={filters.checkIn}
                onChange={handleFilterChange}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-group" style={{ flex: '1', minWidth: '150px', marginBottom: '0' }}>
              <label>Data wyjazdu</label>
              <input
                type="date"
                name="checkOut"
                value={filters.checkOut}
                onChange={handleFilterChange}
                min={filters.checkIn || new Date().toISOString().split('T')[0]}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ height: '48px' }}>
              Zastosuj filtry
            </button>
          </form>
        </div>

        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Wyszukiwanie miejsc...</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <h3>Wystąpił błąd</h3>
            <p>{error}</p>
            <button onClick={loadPlaces} className="btn btn-primary">
              Spróbuj ponownie
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {places.length === 0 ? (
              <div className="empty-state">
                <h3>Nie znaleziono miejsc</h3>
                <p>Spróbuj zmienić filtry wyszukiwania</p>
              </div>
            ) : (
              <>
                <p style={{ color: '#666', marginBottom: '24px', fontSize: '15px' }}>
                  Znaleziono {places.length} {places.length === 1 ? 'miejsce' : 'miejsca'}
                </p>

                <div className="grid grid-3">
                  {places.map(place => (
                    <div
                      key={place.id}
                      className="card"
                      onClick={() => handlePlaceClick(place.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <img
                        src={place.mainImageUrl || place.images?.[0]?.url}
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
                            Zobacz więcej
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}
