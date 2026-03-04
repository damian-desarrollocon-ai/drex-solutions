import React from 'react';

const TestimonialsSection = () => {
  return (
    <section className="py-28" style={{ background: '#0D1F3C' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700;400i&family=DM+Sans:wght@300;400;500;600&display=swap');
        .tst-serif { font-family: 'Cormorant Garamond', serif; }
        .tst-sans  { font-family: 'DM Sans', sans-serif; }
        .tst-tag {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #E8C97A;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .tst-tag::before {
          content: '';
          width: 24px;
          height: 2px;
          background: #E8C97A;
        }
        .tst-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 2rem;
          transition: all 0.3s;
          position: relative;
        }
        .tst-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #C9A455, transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .tst-card:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(201,164,85,0.3);
        }
        .tst-card:hover::before { opacity: 1; }
        .tst-quote-mark {
          font-family: 'Cormorant Garamond', serif;
          font-size: 5rem;
          line-height: 1;
          color: rgba(201,164,85,0.2);
          font-weight: 700;
          margin-bottom: -1.5rem;
        }
        .tst-avatar {
          width: 48px;
          height: 48px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .tst-badge {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.3rem 0.75rem;
          border: 1px solid;
        }
        .tst-stars { color: #C9A455; font-size: 0.7rem; letter-spacing: 2px; }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6">
          <div>
            <div className="tst-tag mb-5">Casos de Éxito</div>
            <h2 className="tst-serif" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>
              Historias de<br />
              <span style={{ color: '#C9A455', fontStyle: 'italic' }}>Recuperación Real</span>
            </h2>
          </div>
          <p className="tst-sans" style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, maxWidth: '320px', fontWeight: 300 }}>
            Miles de clientes han recuperado sus fondos. Aquí algunos testimonios verificados por nuestro equipo.
          </p>
        </div>

        {/* Testimonial cards */}
        <div className="grid lg:grid-cols-3 gap-6">
          {[
            {
              initials: 'MC',
              name: 'María Carmen Ruiz',
              role: 'Empresaria · Ciudad de México',
              quote: 'Drex Solutions me salvó de perder $85,000 pesos. Su IA detectó que alguien había clonado mi tarjeta y bloqueó las transacciones automáticamente. En menos de 30 segundos recuperé mi dinero.',
              badge: 'Caso Verificado',
              badgeColor: '#22C55E',
            },
            {
              initials: 'JR',
              name: 'Jorge Rodríguez',
              role: 'Ingeniero de Software · Guadalajara',
              quote: 'Como desarrollador, aprecio la tecnología que hay detrás. Su sistema de biometría es impresionante y la app es súper intuitiva. La tranquilidad no tiene precio.',
              badge: 'Experto Técnico',
              badgeColor: '#60A5FA',
            },
            {
              initials: 'AL',
              name: 'Ana López',
              role: 'Doctora · Monterrey',
              quote: 'Los reportes con IA me ayudaron a identificar exactamente dónde ocurrió el fraude. Recuperé el 100% de mis fondos en menos de 48 horas. Un servicio excepcional.',
              badge: 'Profesional',
              badgeColor: '#C9A455',
            },
          ].map((t, i) => (
            <div key={i} className="tst-card">
              <div className="tst-quote-mark">"</div>
              <blockquote className="tst-sans" style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.88)', lineHeight: 1.8, fontWeight: 400, marginBottom: '2rem' }}>
                {t.quote}
              </blockquote>

              {/* Footer */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '1.25rem' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="tst-avatar">
                      <span className="tst-sans" style={{ color: '#C9A455', fontSize: '0.75rem', fontWeight: 600 }}>{t.initials}</span>
                    </div>
                    <div>
                      <div className="tst-sans" style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600 }}>{t.name}</div>
                      <div className="tst-sans" style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.78rem' }}>{t.role}</div>
                    </div>
                  </div>
                  <span className="tst-badge" style={{ color: t.badgeColor, borderColor: t.badgeColor + '40' }}>
                    {t.badge}
                  </span>
                </div>
                <div className="tst-stars">★★★★★</div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom trust bar */}
        <div style={{ marginTop: '4rem', padding: '1.5rem 2rem', background: 'rgba(201,164,85,0.08)', border: '1px solid rgba(201,164,85,0.25)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', textAlign: 'center' }}>
          <div className="tst-sans" style={{ color: '#E8C97A', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Todos los testimonios son verificados</div>
          <div className="tst-sans" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem' }}>Casos auditados por nuestro equipo legal · Identidades protegidas con consentimiento</div>
        </div>

      </div>
    </section>
  );
};

export default TestimonialsSection;