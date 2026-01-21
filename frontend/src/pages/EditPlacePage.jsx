import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import api from '../services/api'

export default function EditPlacePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [cities, setCities] = useState([])
  const [amenities, setAmenities] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [place, setPlace] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
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
    loadData()
  }, [id])

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')

      const [placeData, citiesData, amenitiesData] = await Promise.all([
        api.getPlace(id),
        api.getCities(),
        api.getAmenities()
      ])

      setPlace(placeData)
      setCities(citiesData)
      setAmenities(amenitiesData)

      setFormData({
        name: placeData.name,
        description: placeData.description,
        cityId: placeData.cityId,
        address: placeData.address,
        type: placeData.type,
        pricePerNight: placeData.pricePerNight,
        cleaningFee: placeData.cleaningFee || '',
        maxGuests: placeData.maxGuests,
        bedrooms: placeData.bedrooms,
        bathrooms: placeData.bathrooms,
        amenityIds: placeData.amenities?.map(a => a.id) || []
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
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
    setSaving(true)
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

      await api.updatePlace(id, placeData)
      alert('Miejsce zostało zaktualizowane!')
      navigate('/my-places')
    } catch (err) {
      setError(err.message)
      window.scrollTo(0, 0)
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert('Plik jest za duży. Maksymalny rozmiar to 5MB.')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      setUploadingImage(true)
      await api.uploadImage(id, formData)
      await loadData()
    } catch (err) {
      alert(err.message)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleDeleteImage = async (imageId) => {
    if (!confirm('Czy na pewno chcesz usunąć to zdjęcie?')) return

    try {
      await api.deleteImage(imageId)
      await loadData()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleSetMainImage = async (imageId) => {
    try {
      await api.setMainImage(imageId)
      await loadData()
    } catch (err) {
      alert(err.message)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="container" style={{ padding: '60px 20px' }}>
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Ładowanie danych miejsca...</p>
          </div>
        </div>
      </Layout>
    )
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
          Edytuj miejsce
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
                {place?.images?.map(image => (
                  <div
                    key={image.id}
                    style={{
                      position: 'relative',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: image.isMain ? '3px solid #e67e22' : '1px solid #e0e0e0'
                    }}
                  >
                    <img
                      src={image.url}
                      alt="Place"
                      style={{
                        width: '100%',
                        height: '150px',
                        objectFit: 'cover'
                      }}
                    />
                    {image.isMain && (
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
                    <div style={{
                      position: 'absolute',
                      bottom: '8px',
                      right: '8px',
                      display: 'flex',
                      gap: '8px'
                    }}>
                      {!image.isMain && (
                        <button
                          type="button"
                          onClick={() => handleSetMainImage(image.id)}
                          className="btn btn-secondary btn-small"
                          style={{ fontSize: '12px', padding: '4px 8px' }}
                        >
                          Ustaw jako główne
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(image.id)}
                        className="btn btn-danger btn-small"
                        style={{ fontSize: '12px', padding: '4px 8px' }}
                      >
                        Usuń
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <label
                style={{
                  display: 'inline-block',
                  padding: '12px 24px',
                  background: uploadingImage ? '#ccc' : '#e67e22',
                  color: 'white',
                  borderRadius: '8px',
                  cursor: uploadingImage ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  transition: 'background 0.2s'
                }}
              >
                {uploadingImage ? 'Przesyłanie...' : '+ Dodaj zdjęcie'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  style={{ display: 'none' }}
                />
              </label>
              <p style={{ color: '#666', fontSize: '14px', marginTop: '8px' }}>
                Maksymalny rozmiar pliku: 5MB
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
                disabled={saving}
                style={{ flex: '1' }}
              >
                {saving ? 'Zapisywanie...' : 'Zapisz zmiany'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
