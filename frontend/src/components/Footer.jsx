import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Rentigo</h3>
            <p>Platforma do wynajmu krótkoterminowego nieruchomości</p>
          </div>

          <div className="footer-section">
            <h4>Odkrywaj</h4>
            <Link to="/search">Szukaj miejsc</Link>
            <Link to="/about">O nas</Link>
            <Link to="/contact">Kontakt</Link>
          </div>

          <div className="footer-section">
            <h4>Hosting</h4>
            <Link to="/my-places">Moje miejsca</Link>
            <Link to="/add-place">Dodaj miejsce</Link>
          </div>

          <div className="footer-section">
            <h4>Wsparcie</h4>
            <Link to="/contact">Centrum pomocy</Link>
            <Link to="/about">Zasady</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 Rentigo. Wszystkie prawa zastrzeżone.</p>
        </div>
      </div>
    </footer>
  )
}
