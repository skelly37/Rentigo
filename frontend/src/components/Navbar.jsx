import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const { user, logout, isHost } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-logo">
            <span className="logo-icon">🏠</span>
            <span className="logo-text">Rentigo</span>
          </Link>

          <div className="navbar-links">
            <Link to="/search" className="nav-link">Szukaj</Link>
            <Link to="/about" className="nav-link">O nas</Link>
            <Link to="/contact" className="nav-link">Kontakt</Link>

            {user ? (
              <>
                {isHost && (
                  <Link to="/my-places" className="nav-link">Moje miejsca</Link>
                )}
                <Link to="/my-reservations" className="nav-link">Rezerwacje</Link>
                <Link to="/favorites" className="nav-link">Ulubione</Link>

                <div className="navbar-user">
                  <div className="user-avatar">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <div className="user-dropdown">
                    <Link to="/profile" className="dropdown-item">Profil</Link>
                    <button onClick={handleLogout} className="dropdown-item">Wyloguj</button>
                  </div>
                </div>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary btn-small">
                Zaloguj się
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
