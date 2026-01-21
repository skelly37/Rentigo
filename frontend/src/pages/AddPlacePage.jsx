import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import api from '../services/api'

export default function AddPlacePage() {
  const navigate = useNavigate()
  const [cities, setCities] = useState([])
  const [amenities, setAmenities] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cityId: '',
    address: '',
    type: 'APARTMENT',
    pricePerNight: '',
    cleaningFee: '',
    maxGuests: '',
    bedrooms: '',
    bathrooms: '',
    amenityIds: []
  })

  useEffect(() => {
    loadFormData()
  }, [])

  const loadFormData = async () => {
    try {
      const [citiesData, amenitiesData] = await Promise.all([
        api.getCities(),
        api.getAmenities()
      ])
      setCities(citiesData)
      setAmenities(amenitiesData)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    setError('')
  }

  const handleAmenityToggle = (amenityId) => {
    const currentIds = formData.amenityIds
    const newIds = currentIds.includes(amenityId)
      ? currentIds.filter(id => id !== amenityId)
      : [...currentIds, amenityId]

    setFormData({ ...formData, amenityIds: newIds })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const placeData = {
        ...formData,
        cityId: parseInt(formData.cityId),
        pricePerNight: parseFloat(formData.pricePerNight),
        cleaningFee: formData.cleaningFee ? parseFloat(formData.cleaningFee) : 0,
        maxGuests: parseInt(formData.maxGuests),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms)
      }

      const newPlace = await api.createPlace(placeData)
      alert('Miejsce zostało dodane!')
      navigate(`/edit-place/${newPlace.id}`)
    } catch (err) {
      setError(err.message)
      window.scrollTo(0, 0)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="container" style={{ padding: '40px 20px', maxWidth: '800px' }}>
        <button
          onClick={() => navigate('/my-places')}
          className="btn btn-secondary"
          style={{ marginBottom: '30px' }}
        >
          ← Powrót do moich miejsc
        </button>

        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '30px' }}>
          Dodaj nowe miejsce
        </h1>

        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          {error && (
            <div className="alert alert-error" style={{ marginBottom: '20px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
              Podstawowe informacje
            </h2>

            <div className="form-group">
              <label>Nazwa miejsca *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="np. Przytulny apartament w centrum"
                required
              />
            </div>

            <div className="form-group">
              <label>Opis *</label>
              <textarea
                name="description"
                rows="6"
                value={formData.description}
                onChange={handleChange}
                placeholder="Opisz swoje miejsce..."
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Miasto *</label>
                <select
                  name="cityId"
                  value={formData.cityId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Wybierz miasto</option>
                  {cities.map(city => (
                    <option key={city.id} value={city.id}>{city.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Typ *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="APARTMENT">Apartament</option>
                  <option value="HOUSE">Dom</option>
                  <option value="ROOM">Pokój</option>
                  <option value="VILLA">Willa</option>
                  <option value="STUDIO">Studio</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Adres *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="np. ul. Główna 123"
                required
              />
            </div>

            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              marginTop: '32px',
              marginBottom: '20px',
              paddingTop: '24px',
              borderTop: '1px solid #e0e0e0'
            }}>
              Cena
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Cena za noc (zł) *</label>
                <input
                  type="number"
                  name="pricePerNight"
                  min="0"
                  step="0.01"
                  value={formData.pricePerNight}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Opłata za sprzątanie (zł)</label>
                <input
                  type="number"
                  name="cleaningFee"
                  min="0"
                  step="0.01"
                  value={formData.cleaningFee}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
            </div>

            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              marginTop: '32px',
              marginBottom: '20px',
              paddingTop: '24px',
              borderTop: '1px solid #e0e0e0'
            }}>
              Szczegóły
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div className="form-group">
                <label>Liczba gości *</label>
                <input
                  type="number"
                  name="maxGuests"
                  min="1"
                  value={formData.maxGuests}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Liczba sypialni *</label>
                <input
                  type="number"
                  name="bedrooms"
                  min="0"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Liczba łazienek *</label>
                <input
                  type="number"
                  name="bathrooms"
                  min="1"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              marginTop: '32px',
              marginBottom: '20px',
              paddingTop: '24px',
              borderTop: '1px solid #e0e0e0'
            }}>
              Udogodnienia
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px'
            }}>
              {amenities.map(amenity => (
                <label
                  key={amenity.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    border: '2px solid',
                    borderColor: formData.amenityIds.includes(amenity.id) ? '#e67e22' : '#e0e0e0',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: formData.amenityIds.includes(amenity.id) ? '#fff5f0' : 'transparent'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.amenityIds.includes(amenity.id)}
                    onChange={() => handleAmenityToggle(amenity.id)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span style={{ fontWeight: formData.amenityIds.includes(amenity.id) ? '600' : '400' }}>
                    {amenity.name}
                  </span>
                </label>
              ))}
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              marginTop: '32px',
              paddingTop: '24px',
              borderTop: '1px solid #e0e0e0'
            }}>
              <button
                type="button"
                onClick={() => navigate('/my-places')}
                className="btn btn-secondary"
                style={{ flex: '1' }}
              >
                Anuluj
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ flex: '1' }}
              >
                {loading ? 'Dodawanie...' : 'Dodaj miejsce'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
