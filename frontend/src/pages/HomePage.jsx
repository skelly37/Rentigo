import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import api from '../services/api'

export default function HomePage() {
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const getTomorrowDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  const [searchForm, setSearchForm] = useState({
    cityId: '',
    guests: 1,
    checkIn: getTodayDate(),
    checkOut: getTomorrowDate()
  })
  const navigate = useNavigate()

  useEffect(() => {
    loadCities()
  }, [])

  const loadCities = async () => {
    try {
      setLoading(true)
      const data = await api.getCities()
      setCities(data.content || data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchForm.cityId) {
      navigate(`/search?cityId=${searchForm.cityId}&guests=${searchForm.guests}&checkIn=${searchForm.checkIn}&checkOut=${searchForm.checkOut}`)
    }
  }

  const handleCityClick = (cityId) => {
    navigate(`/search?cityId=${cityId}`)
  }

  return (
    <Layout>
      <div className="hero-section" style={{
        background: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(/placeholder.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '120px 20px',
        textAlign: 'center',
        color: 'white'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '48px', fontWeight: '700', marginBottom: '20px' }}>
            Znajdź idealne miejsce na pobyt
          </h1>
          <p style={{ fontSize: '20px', marginBottom: '40px', opacity: '0.95' }}>
            Tysiące wyjątkowych domów i apartamentów czeka na Ciebie
          </p>

          <form onSubmit={handleSearch} style={{
            background: 'white',
            borderRadius: '16px',
            padding: '20px',
            display: 'flex',
            gap: '16px',
            maxWidth: '700px',
            margin: '0 auto',
            flexWrap: 'wrap',
            boxShadow: '0 8px 30px rgba(0,0,0,0.2)'
          }}>
            <div className="form-group" style={{ flex: '0 0 150px', marginBottom: '0' }}>
              <label style={{ color: '#333' }}>Liczba gości</label>
              <input
                type="number"
                min="1"
                value={searchForm.guests}
                onChange={(e) => setSearchForm({ ...searchForm, guests: e.target.value })}
                required
              />
            </div>

            <div className="form-group" style={{ flex: '1', minWidth: '150px', marginBottom: '0' }}>
              <label style={{ color: '#333' }}>Przyjazd</label>
              <input
                type="date"
                value={searchForm.checkIn}
                onChange={(e) => setSearchForm({ ...searchForm, checkIn: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-group" style={{ flex: '1', minWidth: '150px', marginBottom: '0' }}>
              <label style={{ color: '#333' }}>Wyjazd</label>
              <input
                type="date"
                value={searchForm.checkOut}
                onChange={(e) => setSearchForm({ ...searchForm, checkOut: e.target.value })}
                min={searchForm.checkIn || new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-group" style={{ flex: '1', minWidth: '200px', marginBottom: '0' }}>
              <label style={{ color: '#333' }}>Miasto</label>
              <select
                value={searchForm.cityId}
                onChange={(e) => setSearchForm({ ...searchForm, cityId: e.target.value })}
                required
              >
                <option value="">Wybierz miasto</option>
                {cities.map(city => (
                  <option key={city.id} value={city.id}>{city.name}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{
              alignSelf: 'flex-end',
              height: '48px',
              marginTop: 'auto'
            }}>
              Szukaj
            </button>
          </form>
        </div>
      </div>

      <div className="container" style={{ padding: '60px 20px' }}>
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Ładowanie miast...</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <h3>Wystąpił błąd</h3>
            <p>{error}</p>
            <button onClick={loadCities} className="btn btn-primary">
              Spróbuj ponownie
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '12px' }}>
                Popularne miasta
              </h2>
              <p style={{ color: '#666', fontSize: '16px' }}>
                Odkryj najlepsze miejsca w najpopularniejszych lokalizacjach
              </p>
            </div>

            <div className="grid grid-4">
              {cities.slice(0, 8).map(city => (
                <div
                  key={city.id}
                  className="card"
                  onClick={() => handleCityClick(city.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="card-body">
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
                      {city.name}
                    </h3>
                    <p style={{ color: '#666', fontSize: '14px' }}>
                      {city.placeCount || 0} miejsc
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: '80px',
              background: 'white',
              borderRadius: '16px',
              padding: '60px 40px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <h2 style={{
                fontSize: '32px',
                fontWeight: '700',
                marginBottom: '40px',
                textAlign: 'center'
              }}>
                Jak to działa?
              </h2>

              <div className="grid grid-3">
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: '#e67e22',
                    color: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    fontWeight: '700',
                    margin: '0 auto 20px'
                  }}>
                    1
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>
                    Znajdź miejsce
                  </h3>
                  <p style={{ color: '#666', fontSize: '15px' }}>
                    Przeglądaj tysiące wyjątkowych miejsc i znajdź idealne dla siebie
                  </p>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: '#e67e22',
                    color: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    fontWeight: '700',
                    margin: '0 auto 20px'
                  }}>
                    2
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>
                    Zarezerwuj pobyt
                  </h3>
                  <p style={{ color: '#666', fontSize: '15px' }}>
                    Wybierz daty i dokonaj rezerwacji w kilka sekund
                  </p>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: '#e67e22',
                    color: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    fontWeight: '700',
                    margin: '0 auto 20px'
                  }}>
                    3
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>
                    Ciesz się pobytem
                  </h3>
                  <p style={{ color: '#666', fontSize: '15px' }}>
                    Relaksuj się i korzystaj z niesamowitych wrażeń
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}
