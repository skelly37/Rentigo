import Layout from '../components/Layout'

export default function AboutPage() {
  return (
    <Layout>
      <div style={{
        background: 'linear-gradient(135deg, #e67e22, #d35400)',
        padding: '80px 20px',
        textAlign: 'center',
        color: 'white'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '48px', fontWeight: '700', marginBottom: '20px' }}>
            O Rentigo
          </h1>
          <p style={{ fontSize: '20px', maxWidth: '700px', margin: '0 auto', opacity: '0.95' }}>
            Platforma łącząca gospodarzy z podróżnikami z całego świata
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '60px 20px' }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '60px 40px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          marginBottom: '40px'
        }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '700',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            Nasza misja
          </h2>
          <p style={{
            color: '#666',
            fontSize: '18px',
            lineHeight: '1.8',
            textAlign: 'center',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            Rentigo powstało z myślą o stworzeniu prostej i wygodnej platformy do wynajmu krótkoterminowego.
            Naszym celem jest połączenie gospodarzy oferujących wyjątkowe miejsca z podróżnikami szukającymi
            komfortowego zakwaterowania. Wierzymy, że każda podróż powinna być niezapomniana, a pobyt w naszych
            obiektach to gwarancja doskonałych wrażeń.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '30px',
          marginBottom: '60px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '40px 30px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: '#fff5f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: '40px'
            }}>
              🏠
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '12px' }}>
              Tysiące miejsc
            </h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              Szeroki wybór obiektów w najlepszych lokalizacjach w całej Polsce
            </p>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '40px 30px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: '#fff5f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: '40px'
            }}>
              ✓
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '12px' }}>
              Zaufanie
            </h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              Weryfikowani gospodarze i system ocen gwarantujący wysoką jakość
            </p>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '40px 30px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: '#fff5f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: '40px'
            }}>
              💬
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '12px' }}>
              Wsparcie 24/7
            </h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              Nasz zespół jest zawsze gotowy pomóc w każdej sprawie
            </p>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '60px 40px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          marginBottom: '40px'
        }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '700',
            marginBottom: '40px',
            textAlign: 'center'
          }}>
            Dlaczego Rentigo?
          </h2>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: '#e67e22',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: '700',
                flexShrink: 0
              }}>
                1
              </div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
                  Prosta rezerwacja
                </h3>
                <p style={{ color: '#666', lineHeight: '1.6' }}>
                  Intuicyjny system rezerwacji pozwala znaleźć i zarezerwować idealne miejsce w kilka minut.
                  Bez ukrytych kosztów i niepotrzebnych komplikacji.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: '#e67e22',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: '700',
                flexShrink: 0
              }}>
                2
              </div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
                  Bezpieczne płatności
                </h3>
                <p style={{ color: '#666', lineHeight: '1.6' }}>
                  Wszystkie transakcje są zabezpieczone. Płacisz dopiero po potwierdzeniu rezerwacji przez gospodarza.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: '#e67e22',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: '700',
                flexShrink: 0
              }}>
                3
              </div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
                  Elastyczne zasady
                </h3>
                <p style={{ color: '#666', lineHeight: '1.6' }}>
                  Możliwość anulowania rezerwacji zgodnie z polityką gospodarza.
                  Każdy obiekt ma jasno określone warunki rezerwacji.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: '#e67e22',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: '700',
                flexShrink: 0
              }}>
                4
              </div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
                  System ocen
                </h3>
                <p style={{ color: '#666', lineHeight: '1.6' }}>
                  Prawdziwe opinie gości pomagają wybrać najlepsze miejsce.
                  Każda opinia jest weryfikowana i pochodzi od rzeczywistych użytkowników.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #e67e22, #d35400)',
          borderRadius: '16px',
          padding: '60px 40px',
          textAlign: 'center',
          color: 'white'
        }}>
          <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '20px' }}>
            Dołącz do społeczności Rentigo
          </h2>
          <p style={{ fontSize: '18px', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
            Zostań częścią naszej platformy jako gospodarz lub odkryj niesamowite miejsca jako gość
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => window.location.href = '/search'}
              className="btn btn-primary"
              style={{ background: 'white', color: '#e67e22' }}
            >
              Szukaj miejsc
            </button>
            <button
              onClick={() => window.location.href = '/profile'}
              className="btn btn-secondary"
              style={{ background: 'transparent', color: 'white', border: '2px solid white' }}
            >
              Zostań gospodarzem
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
