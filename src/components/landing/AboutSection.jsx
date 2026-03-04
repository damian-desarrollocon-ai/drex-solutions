import React from 'react';

const AboutSection = () => {
  return (
    <section id="nosotros" className="py-28" style={{ background: '#F5F4F0' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700;400i&family=DM+Sans:wght@300;400;500;600&display=swap');
        .abt-serif { font-family: 'Cormorant Garamond', serif; }
        .abt-sans  { font-family: 'DM Sans', sans-serif; }
        .abt-tag {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #B8892E;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .abt-tag::before {
          content: '';
          width: 24px;
          height: 2px;
          background: #B8892E;
        }
        .abt-cert-card {
          background: #fff;
          border: 1px solid #E8E5DF;
          padding: 1.5rem;
          transition: all 0.3s;
        }
        .abt-cert-card:hover {
          border-color: #C9A455;
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(13,31,60,0.08);
        }
        .abt-cert-icon {
          width: 40px;
          height: 40px;
          background: #0D1F3C;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.875rem;
        }
        .abt-cta {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.875rem 1.75rem;
          background: transparent;
          color: #0D1F3C;
          border: 1px solid #0D1F3C;
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          transition: all 0.3s;
        }
        .abt-cta:hover {
          background: #0D1F3C;
          color: #fff;
        }
        .abt-commitment-row {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.25rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .abt-commitment-row:last-child { border-bottom: none; }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* Left */}
          <div>
            <div className="abt-tag mb-5">Líderes en Recuperación</div>
            <h2 className="abt-serif" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 700, color: '#0D1F3C', lineHeight: 1.1, marginBottom: '1.5rem' }}>
              Pioneros en<br />
              <span style={{ color: '#C9A455', fontStyle: 'italic' }}>Protección Financiera</span>
            </h2>
            <p className="abt-sans" style={{ fontSize: '1rem', color: '#4A4A4A', lineHeight: 1.8, fontWeight: 400, marginBottom: '2.5rem' }}>
              Desde 2018, Drex Solutions ha revolucionado la recuperación de activos en México,
              recuperando más de $2 mil millones de pesos con tecnología de vanguardia y un
              equipo de expertos legales y financieros.
            </p>

            {/* Certifications */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { icon: 'fas fa-certificate', color: '#059669', title: 'ISO 27001:2022',     sub: 'Seguridad de la información' },
                { icon: 'fas fa-shield-alt',  color: '#0369A1', title: 'PCI DSS Level 1',   sub: 'Máximo nivel en pagos digitales' },
                { icon: 'fas fa-university',  color: '#7C3AED', title: 'CNBV Autorizado',   sub: 'Regulado por la Comisión Nacional' },
                { icon: 'fas fa-globe',       color: '#C9A455', title: 'SWIFT Partner',     sub: 'Red global de transferencias' },
              ].map((cert, i) => (
                <div key={i} className="abt-cert-card">
                  <div className="abt-cert-icon">
                    <i className={`${cert.icon} text-white`} style={{ fontSize: '0.85rem' }}></i>
                  </div>
                  <div className="abt-serif" style={{ color: '#0D1F3C', fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>{cert.title}</div>
                  <div className="abt-sans" style={{ color: '#555', fontSize: '0.78rem', fontWeight: 400 }}>{cert.sub}</div>
                  <div style={{ width: '20px', height: '2px', background: cert.color, marginTop: '0.75rem' }} />
                </div>
              ))}
            </div>

            <a href="#contacto" className="abt-cta">
              <i className="fas fa-info-circle" style={{ fontSize: '0.75rem' }}></i>
              Conocer Más Sobre Nosotros
            </a>
          </div>

          {/* Right */}
          <div>
            <div style={{ background: '#0D1F3C', padding: '2.5rem', position: 'relative' }}>
              {/* Top accent */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #C9A455, rgba(201,164,85,0.2))' }} />

              <div className="text-center mb-8">
                <div style={{ width: '64px', height: '64px', border: '1px solid rgba(201,164,85,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                  <i className="fas fa-shield-alt" style={{ color: '#C9A455', fontSize: '1.5rem' }}></i>
                </div>
                <div className="abt-serif" style={{ color: '#fff', fontSize: '1.75rem', fontWeight: 700 }}>Nuestro Compromiso</div>
                <div className="abt-sans" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', marginTop: '0.25rem' }}>Con cada cliente que confía en nosotros</div>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem' }}>
                {[
                  { icon: 'fas fa-check-circle', color: '#22C55E', title: 'Protección Garantizada', sub: '100% de tu dinero protegido' },
                  { icon: 'fas fa-headset',       color: '#60A5FA', title: 'Soporte 24/7',           sub: 'Siempre disponibles para ti' },
                  { icon: 'fas fa-chart-line',    color: '#C9A455', title: 'Innovación Continua',    sub: 'Mejoramos cada día' },
                  { icon: 'fas fa-handshake',     color: '#F472B6', title: 'Transparencia Total',    sub: 'Sin letras pequeñas' },
                ].map((item, i) => (
                  <div key={i} className="abt-commitment-row">
                    <i className={`${item.icon}`} style={{ color: item.color, fontSize: '1.1rem', marginTop: '2px', flexShrink: 0 }}></i>
                    <div>
                      <div className="abt-sans" style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600 }}>{item.title}</div>
                      <div className="abt-sans" style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.82rem', fontWeight: 400 }}>{item.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;