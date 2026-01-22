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
  const [selectedImages, setSelectedImages] = useState([])
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

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files)

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        alert(`Plik ${file.name} jest za duży. Maksymalny rozmiar to 5MB.`)
        return
      }
    }

    setSelectedImages([...selectedImages, ...files])
  }

  const handleRemoveImage = (index) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index))
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

      if (selectedImages.length > 0) {
        for (const image of selectedImages) {
          const formData = new FormData()
          formData.append('file', image)
          await api.uploadImage(newPlace.id, formData)
        }
      }

      alert('Miejsce zostało dodane!')
      navigate(`/my-places`)
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
              Zdjęcia
            </h2>

            <div style={{ marginBottom: '32px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '16px'
              }}>
                {selectedImages.map((file, index) => (
                  <div
                    key={index}
                    style={{
                      position: 'relative',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: index === 0 ? '3px solid #e67e22' : '1px solid #e0e0e0'
                    }}
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '150px',
                        objectFit: 'cover'
                      }}
                    />
                    {index === 0 && (
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        left: '8px',
                        background: '#e67e22',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        Główne
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="btn btn-danger btn-small"
                      style={{
                        position: 'absolute',
                        bottom: '8px',
                        right: '8px',
                        fontSize: '12px',
                        padding: '4px 8px'
                      }}
                    >
                      Usuń
                    </button>
                  </div>
                ))}
              </div>

              <label
                style={{
                  display: 'inline-block',
                  padding: '12px 24px',
                  background: '#e67e22',
                  color: 'white',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'background 0.2s'
                }}
              >
                + Dodaj zdjęcia
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  style={{ display: 'none' }}
                />
              </label>
              <p style={{ color: '#666', fontSize: '14px', marginTop: '8px' }}>
                Maksymalny rozmiar pliku: 5MB. Pierwsze zdjęcie będzie głównym.
              </p>
            </div>

            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '20px',
              paddingTop: '24px',
              borderTop: '1px solid #e0e0e0'
            }}>
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
                {loading ? (selectedImages.length > 0 ? 'Dodawanie i przesyłanie zdjęć...' : 'Dodawanie...') : 'Dodaj miejsce'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
