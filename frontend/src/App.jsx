import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SearchPage from './pages/SearchPage'
import PlaceDetailsPage from './pages/PlaceDetailsPage'
import ProfilePage from './pages/ProfilePage'
import MyReservationsPage from './pages/MyReservationsPage'
import ReservationDetailsPage from './pages/ReservationDetailsPage'
import FavoritesPage from './pages/FavoritesPage'
import MyPlacesPage from './pages/MyPlacesPage'
import AddPlacePage from './pages/AddPlacePage'
import EditPlacePage from './pages/EditPlacePage'
import ContactPage from './pages/ContactPage'
import AboutPage from './pages/AboutPage'

function PrivateRoute({ children, requiredRole }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user.role !== requiredRole && user.role !== 'ADMIN') {
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/place/:id" element={<PlaceDetailsPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />

      <Route path="/profile" element={
        <PrivateRoute>
          <ProfilePage />
        </PrivateRoute>
      } />

      <Route path="/my-reservations" element={
        <PrivateRoute>
          <MyReservationsPage />
        </PrivateRoute>
      } />

      <Route path="/reservation/:id" element={
        <PrivateRoute>
          <ReservationDetailsPage />
        </PrivateRoute>
      } />

      <Route path="/favorites" element={
        <PrivateRoute>
          <FavoritesPage />
        </PrivateRoute>
      } />

      <Route path="/my-places" element={
        <PrivateRoute requiredRole="HOST">
          <MyPlacesPage />
        </PrivateRoute>
      } />

      <Route path="/add-place" element={
        <PrivateRoute requiredRole="HOST">
          <AddPlacePage />
        </PrivateRoute>
      } />

      <Route path="/edit-place/:id" element={
        <PrivateRoute requiredRole="HOST">
          <EditPlacePage />
        </PrivateRoute>
      } />
    </Routes>
  )
}

export default App
