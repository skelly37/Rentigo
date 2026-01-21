const API_BASE = '/api'

class ApiService {
  constructor() {
    this.token = null
  }

  setToken(token) {
    this.token = token
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    })

    if (response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
      throw new Error('Sesja wygasła')
    }

    const data = await response.json().catch(() => null)

    if (!response.ok) {
      if (data?.data && typeof data.data === 'object') {
        const fieldTranslations = {
          'name': 'Nazwa',
          'description': 'Opis',
          'cityId': 'Miasto',
          'address': 'Adres',
          'type': 'Typ',
          'pricePerNight': 'Cena za noc',
          'cleaningFee': 'Opłata za sprzątanie',
          'maxGuests': 'Maksymalna liczba gości',
          'bedrooms': 'Liczba sypialni',
          'bathrooms': 'Liczba łazienek'
        }
        const errors = Object.entries(data.data)
          .map(([field, message]) => {
            const fieldName = fieldTranslations[field] || field
            return `${fieldName}: ${message}`
          })
          .join('\n')
        throw new Error(errors || data?.message || 'Wystąpił błąd')
      }
      throw new Error(data?.message || 'Wystąpił błąd')
    }

    return data
  }

  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
  }

  async register(firstName, lastName, email, password) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ firstName, lastName, email, password })
    })
  }

  async getMe() {
    return this.request('/users/me')
  }

  async updateMe(data) {
    return this.request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  async upgradeToHost() {
    return this.request('/users/me/upgrade-to-host', {
      method: 'POST'
    })
  }

  async getPlaces() {
    return this.request('/places')
  }

  async getPlace(id) {
    return this.request(`/places/${id}`)
  }

  async searchPlaces(query) {
    return this.request(`/places/search?query=${encodeURIComponent(query)}`)
  }

  async getPlacesByCity(cityId, guests, checkIn, checkOut) {
    let url = `/places/city/${cityId}`
    const params = new URLSearchParams()
    if (guests) params.append('guests', guests)
    if (checkIn) params.append('checkIn', checkIn)
    if (checkOut) params.append('checkOut', checkOut)
    const queryString = params.toString()
    if (queryString) url += `?${queryString}`
    return this.request(url)
  }

  async createPlace(data) {
    return this.request('/places', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async updatePlace(id, data) {
    return this.request(`/places/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  async deletePlace(id) {
    return this.request(`/places/${id}`, {
      method: 'DELETE'
    })
  }

  async getMyReservations() {
    return this.request('/reservations')
  }

  async getUpcomingReservations() {
    return this.request('/reservations/upcoming')
  }

  async getPastReservations() {
    return this.request('/reservations/past')
  }

  async getCancelledReservations() {
    return this.request('/reservations/cancelled')
  }

  async getReservation(id) {
    return this.request(`/reservations/${id}`)
  }

  async createReservation(data) {
    return this.request('/reservations', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async cancelReservation(id) {
    return this.request(`/reservations/${id}/cancel`, {
      method: 'POST'
    })
  }

  async confirmReservation(id) {
    return this.request(`/reservations/${id}/confirm`, {
      method: 'POST'
    })
  }

  async getPlaceReviews(placeId) {
    return this.request(`/reviews/place/${placeId}`)
  }

  async getReviewSummary(placeId) {
    return this.request(`/reviews/place/${placeId}/summary`)
  }

  async createReview(data) {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async getFavorites() {
    return this.request('/favorites')
  }

  async toggleFavorite(placeId) {
    return this.request(`/favorites/${placeId}/toggle`, {
      method: 'POST'
    })
  }

  async getMyPlaces() {
    return this.request('/host/places')
  }

  async getHostStats() {
    return this.request('/host/stats')
  }

  async getPlaceReservations(placeId) {
    return this.request(`/host/places/${placeId}/reservations`)
  }

  async getCities() {
    return this.request('/cities')
  }

  async getAmenities() {
    return this.request('/amenities')
  }

  async sendContactMessage(data) {
    return this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async uploadImage(placeId, formData) {
    const headers = {}
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const response = await fetch(`${API_BASE}/files/places/${placeId}/images`, {
      method: 'POST',
      headers,
      body: formData
    })

    if (!response.ok) {
      const data = await response.json().catch(() => null)
      throw new Error(data?.message || 'Nie udało się przesłać zdjęcia')
    }

    return response.json()
  }

  async deleteImage(imageId) {
    return this.request(`/files/places/images/${imageId}`, {
      method: 'DELETE'
    })
  }

  async setMainImage(imageId) {
    return this.request(`/files/places/images/${imageId}/set-main`, {
      method: 'PATCH'
    })
  }

  async getReservationMessages(reservationId) {
    return this.request(`/messages/reservation/${reservationId}`)
  }

  async sendMessage(reservationId, content) {
    return this.request('/messages', {
      method: 'POST',
      body: JSON.stringify({ reservationId, content })
    })
  }
}

export const api = new ApiService()
export default api
