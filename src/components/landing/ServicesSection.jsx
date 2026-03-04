import React from 'react';
import { Link } from 'react-router-dom';

const ServicesSection = () => {
  return (
    <section id="servicios" className="py-28" style={{ background: '#fff' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700;400i&family=DM+Sans:wght@300;400;500;600&display=swap');
        .svc-serif { font-family: 'Cormorant Garamond', serif; }
        .svc-sans  { font-family: 'DM Sans', sans-serif; }
        .svc-tag {
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
        .svc-tag::before {
          content: '';
          width: 24px;
          height: 2px;
          background: #B8892E;
        }
        .svc-feature {
          display: flex;
          align-items: flex-start;
          gap: 1.25rem;
          padding: 1.5rem 0;
          border-bottom: 1px solid #F0EDE8;
        }
        .svc-feature:last-child { border-bottom: none; }
        .svc-feature-icon {
          width: 44px;
          height: 44px;
          background: #0D1F3C;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .svc-cta {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.9rem 2rem;
          background: #0D1F3C;
          color: #fff;
          border: 1px solid #0D1F3C;
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          transition: all 0.3s;
        }
        .svc-cta:hover {
          background: transparent;
          color: #0D1F3C;
        }
        .svc-dashboard {
          background: #0D1F3C;
          position: relative;
          overflow: hidden;
        }
        .svc-dashboard::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #C9A455, rgba(201,164,85,0.2));
        }
        .svc-dash-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.85rem 1rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          margin-bottom: 0.625rem;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Header */}
        <div className="max-w-xl mb-16">
          <div className="svc-tag mb-5">Servicios Especializados</div>
          <h2 className="svc-serif" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 700, color: '#0D1F3C', lineHeight: 1.1, marginBottom: '1.25rem' }}>
            Soluciones Integrales<br />
            <span style={{ color: '#C9A455', fontStyle: 'italic' }}>de Recuperación</span>
          </h2>
          <p className="svc-sans" style={{ fontSize: '1rem', color: '#4A4A4A', lineHeight: 1.8, fontWeight: 400 }}>
            Todo lo que necesitas para recuperar y proteger tu patrimonio financiero de manera eficiente y segura.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left: features */}
          <div>
            {[
              {
                icon: 'fas fa-mobile-alt',
                color: '#0369A1',
                title: 'Plataforma Digital Inteligente',
                text: 'Acceso 24/7 a tu caso de recuperación con actualizaciones en tiempo real, documentos y comunicación directa con tu equipo legal asignado.'
              },
              {
                icon: 'fas fa-credit-card',
                color: '#7C3AED',
                title: 'Protección Preventiva Anti-Fraude',
                text: 'Sistema activo que monitorea tus cuentas con chip de seguridad avanzado y notificaciones instantáneas para cada transacción sospechosa.'
              },
              {
                icon: 'fas fa-chart-line',
                color: '#059669',
                title: 'Análisis Forense Financiero',
                text: 'Reportes automáticos que rastrean el origen del fraude, identifican a los responsables y construyen el expediente para la recuperación de fondos.'
              }
            ].map((item, i) => (
              <div key={i} className="svc-feature">
                <div className="svc-feature-icon">
                  <i className={`${item.icon} text-white`} style={{ fontSize: '0.9rem' }}></i>
                </div>
                <div>
                  <div style={{ width: '3px', height: '16px', background: item.color, marginBottom: '0.5rem' }} />
                  <div className="abt-serif" style={{ color: '#0D1F3C', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                    {item.title}
                  </div>
                  <p className="svc-sans" style={{ fontSize: '0.875rem', color: '#4A4A4A', lineHeight: 1.7, fontWeight: 400 }}>
                    {item.text}
                  </p>
                </div>
              </div>
            ))}

            <div style={{ marginTop: '2rem' }}>
              <Link to="/register" className="svc-cta">
                <i className="fas fa-briefcase" style={{ fontSize: '0.75rem' }}></i>
                Abrir Mi Expediente
              </Link>
            </div>
          </div>

          {/* Right: dashboard card */}
          <div>
            <div className="svc-dashboard p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="svc-serif" style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 600 }}>Mi Cuenta DREX</div>
                  <div className="svc-sans" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Panel Principal</div>
                </div>
                <div style={{ width: '40px', height: '40px', border: '1px solid rgba(201,164,85,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fas fa-university" style={{ color: '#C9A455', fontSize: '0.9rem' }}></i>
                </div>
              </div>

              {/* Status rows */}
              <div className="svc-dash-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 6px rgba(34,197,94,0.7)' }} />
                  <span className="svc-sans" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.85rem' }}>Protección Activa</span>
                </div>
                <span className="svc-sans" style={{ color: '#22C55E', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em' }}>ONLINE</span>
              </div>

              <div className="svc-dash-row">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                    <i className="fas fa-credit-card" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}></i>
                    <span className="svc-sans" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem' }}>Última transacción</span>
                  </div>
                  <div className="svc-sans" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.75rem', paddingLeft: '1.25rem' }}>Farmacia San Pablo · hace 2h</div>
                </div>
                <span className="svc-sans" style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600 }}>-$89.50</span>
              </div>

              <div style={{ background: 'rgba(201,164,85,0.12)', border: '1px solid rgba(201,164,85,0.35)', padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}>
                <i className="fas fa-award" style={{ color: '#E8C97A', fontSize: '0.85rem' }}></i>
                <span className="svc-sans" style={{ color: '#E8C97A', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Cliente Premium Verificado</span>
              </div>

              {/* Bottom accent */}
              <div style={{ marginTop: '1.5rem', padding: '0.75rem 0 0', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <i className="fas fa-lock" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}></i>
                <span className="svc-sans" style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Conexión cifrada · 256-bit SSL</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ServicesSection;