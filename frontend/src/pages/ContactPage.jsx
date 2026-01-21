import { useState } from 'react'
import Layout from '../components/Layout'
import api from '../services/api'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      await api.sendContactMessage(formData)
      setSuccess(true)
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: ''
      })

      setTimeout(() => {
        setSuccess(false)
      }, 5000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="container" style={{ padding: '40px 20px' }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            Skontaktuj się z nami
          </h1>
          <p style={{
            color: '#666',
            fontSize: '16px',
            marginBottom: '40px',
            textAlign: 'center',
            lineHeight: '1.6'
          }}>
            Masz pytania? Chętnie Ci pomożemy! Wypełnij formularz poniżej, a nasz zespół odpowie najszybciej jak to możliwe.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '40px',
            marginBottom: '40px'
          }}>
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

              {success && (
                <div className="alert alert-success" style={{ marginBottom: '20px' }}>
                  Dziękujemy za wiadomość! Skontaktujemy się z Tobą wkrótce.
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>Imię *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Nazwisko *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Temat *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Czego dotyczy Twoja wiadomość?"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Wiadomość *</label>
                  <textarea
                    name="message"
                    rows="6"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Opisz swoje pytanie lub problem..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ width: '100%' }}
                >
                  {loading ? 'Wysyłanie...' : 'Wyślij wiadomość'}
                </button>
              </form>
            </div>

            <div>
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '30px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                marginBottom: '20px'
              }}>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  marginBottom: '20px'
                }}>
                  Informacje kontaktowe
                </h2>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: '#fff5f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      flexShrink: 0
                    }}>
                      📧
                    </div>
                    <div>
                      <p style={{ fontWeight: '600', marginBottom: '4px' }}>Email</p>
                      <p style={{ color: '#666', fontSize: '15px' }}>kontakt@rentigo.pl</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: '#fff5f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      flexShrink: 0
                    }}>
                      📞
                    </div>
                    <div>
                      <p style={{ fontWeight: '600', marginBottom: '4px' }}>Telefon</p>
                      <p style={{ color: '#666', fontSize: '15px' }}>+48 123 456 789</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: '#fff5f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      flexShrink: 0
                    }}>
                      📍
                    </div>
                    <div>
                      <p style={{ fontWeight: '600', marginBottom: '4px' }}>Adres</p>
                      <p style={{ color: '#666', fontSize: '15px' }}>
                        ul. Przykładowa 123<br />
                        00-000 Warszawa<br />
                        Polska
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #e67e22, #d35400)',
                borderRadius: '16px',
                padding: '30px',
                color: 'white',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
              }}>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  marginBottom: '12px'
                }}>
                  Godziny otwarcia
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Poniedziałek - Piątek</span>
                    <span style={{ fontWeight: '600' }}>9:00 - 18:00</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Sobota</span>
                    <span style={{ fontWeight: '600' }}>10:00 - 14:00</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Niedziela</span>
                    <span style={{ fontWeight: '600' }}>Zamknięte</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '40px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            textAlign: 'center'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '16px'
            }}>
              Często zadawane pytania
            </h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Sprawdź naszą sekcję FAQ, gdzie znajdziesz odpowiedzi na najczęściej zadawane pytania.
            </p>
            <button
              onClick={() => window.location.href = '/about'}
              className="btn btn-secondary"
            >
              Przejdź do FAQ
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
