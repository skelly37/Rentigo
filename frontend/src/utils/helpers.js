export const getTodayDate = () => {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

export const getTomorrowDate = () => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
}

export const getPlaceType = (type) => {
  const types = {
    APARTMENT: 'Apartament',
    HOUSE: 'Dom',
    ROOM: 'Pokój',
    VILLA: 'Willa',
    STUDIO: 'Studio',
    LOFT: 'Loft'
  }
  return types[type] || type
}

export const formatPrice = (price) => {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN'
  }).format(price)
}

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
