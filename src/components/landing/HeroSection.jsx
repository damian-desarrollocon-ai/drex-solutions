import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: '#0D1F3C' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

        .hero-bg-grid {
          background-image:
            linear-gradient(rgba(201,164,85,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,164,85,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .hero-serif { font-family: 'Cormorant Garamond', serif; }
        .hero-sans { font-family: 'DM Sans', sans-serif; }
        .hero-gold-text { color: #C9A455; }
        .hero-stat-divider { width: 1px; height: 40px; background: rgba(255,255,255,0.15); }

        .status-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
        }
        .status-dot-green { background: #22C55E; box-shadow: 0 0 8px rgba(34,197,94,0.6); }
        .status-dot-blue  { background: #60A5FA; box-shadow: 0 0 8px rgba(96,165,250,0.6); }
        .status-dot-gold  { background: #C9A455; box-shadow: 0 0 8px rgba(201,164,85,0.6); }

        .hero-divider {
          width: 48px;
          height: 2px;
          background: linear-gradient(90deg, #C9A455, transparent);
        }

        .hero-cta-primary {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 1rem 2.5rem;
          background: #C9A455;
          color: #0D1F3C;
          border: 1px solid #C9A455;
          transition: all 0.3s;
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
        }
        .hero-cta-primary:hover {
          background: transparent;
          color: #C9A455;
        }
        .hero-cta-secondary {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 1rem 2.5rem;
          background: transparent;
          color: rgba(255,255,255,0.7);
          border: 1px solid rgba(255,255,255,0.2);
          transition: all 0.3s;
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
        }
        .hero-cta-secondary:hover {
          border-color: rgba(255,255,255,0.5);
          color: #fff;
        }

        .cert-badge {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #E8C97A;
          background: rgba(201,164,85,0.12);
          border: 1px solid rgba(201,164,85,0.5);
          padding: 0.5rem 1.1rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }
        .cert-badge::before {
          content: '';
          width: 6px;
          height: 6px;
          background: #22C55E;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .float-anim {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }

        .hero-light-beam {
          position: absolute;
          top: -200px;
          right: 5%;
          width: 1px;
          height: 600px;
          background: linear-gradient(180deg, transparent, rgba(201,164,85,0.3), transparent);
          transform: rotate(15deg);
        }
        .hero-light-beam-2 {
          position: absolute;
          top: -150px;
          right: 15%;
          width: 1px;
          height: 500px;
          background: linear-gradient(180deg, transparent, rgba(255,255,255,0.08), transparent);
          transform: rotate(15deg);
        }
      `}</style>

      {/* Background elements */}
      <div className="hero-bg-grid absolute inset-0" />
      <div className="hero-light-beam" />
      <div className="hero-light-beam-2" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 70% 50%, rgba(26,58,107,0.6) 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,164,85,0.4), transparent)' }} />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-28 pb-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left column */}
          <div className="hero-sans space-y-8">
            <div>
              <span className="cert-badge">Protección Certificada ISO 27001</span>
            </div>

            <div className="space-y-4">
              <div className="hero-divider" />
              <h1 className="hero-serif" style={{ fontSize: 'clamp(2.8rem, 5vw, 4.2rem)', lineHeight: 1.1, color: '#fff', fontWeight: 800 }}>
                Recuperamos<br />
                <span className="hero-gold-text" style={{ fontStyle: 'italic', fontWeight: 800 }}>lo que es tuyo.</span>
              </h1>
              <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.78)', lineHeight: 1.8, maxWidth: '480px', fontWeight: 400 }}>
                Firma especializada en la recuperación de fondos ante fraudes financieros.
                Operamos con métodos legales y tecnología de inteligencia artificial de vanguardia.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="hero-cta-primary">
                <i className="fas fa-briefcase text-xs"></i>
                Iniciar Mi Caso
              </Link>
              <a href="#servicios" className="hero-cta-secondary">
                <i className="fas fa-arrow-right text-xs"></i>
                Nuestros Servicios
              </a>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
              <div>
                <div className="hero-serif" style={{ fontSize: '2rem', fontWeight: 800, color: '#E8C97A' }}>99.9%</div>
                <div style={{ fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', marginTop: '2px' }}>Tasa de éxito</div>
              </div>
              <div className="hero-stat-divider" />
              <div>
                <div className="hero-serif" style={{ fontSize: '2rem', fontWeight: 800, color: '#E8C97A' }}>$500M+</div>
                <div style={{ fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', marginTop: '2px' }}>Fondos recuperados</div>
              </div>
              <div className="hero-stat-divider" />
              <div>
                <div className="hero-serif" style={{ fontSize: '2rem', fontWeight: 800, color: '#E8C97A' }}>24/7</div>
                <div style={{ fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', marginTop: '2px' }}>Monitoreo activo</div>
              </div>
            </div>
          </div>

          {/* Right column - Status card */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="float-anim w-full max-w-sm">
              {/* Card border accent */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #C9A455, rgba(201,164,85,0.2))' }} />

              <div className="status-card p-8" style={{ position: 'relative' }}>
                {/* Card header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <div className="hero-serif" style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 700 }}>Centro de Protección</div>
                    <div className="hero-sans" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '2px' }}>Monitoreo en tiempo real</div>
                  </div>
                  <div style={{ width: '40px', height: '40px', border: '1px solid rgba(201,164,85,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fas fa-shield-alt" style={{ color: '#C9A455', fontSize: '1rem' }}></i>
                  </div>
                </div>

                {/* Status items */}
                <div className="space-y-3 mb-6">
                  {[
                    { dot: 'status-dot-green', label: 'Sistema Anti-Fraude', value: 'ACTIVO', valueColor: '#22C55E' },
                    { dot: 'status-dot-blue',  label: 'Monitoreo IA',        value: 'ONLINE',  valueColor: '#60A5FA' },
                    { dot: 'status-dot-gold',  label: 'Cifrado 256-bit',     value: 'SEGURO',  valueColor: '#E8C97A' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between" style={{ padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <div className="flex items-center gap-3">
                        <div className={item.dot} style={{ width: '7px', height: '7px', borderRadius: '50%' }} />
                        <span className="hero-sans" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.85rem', fontWeight: 500 }}>{item.label}</span>
                      </div>
                      <span className="hero-sans" style={{ color: item.valueColor, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em' }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                {/* Balance section */}
                <div style={{ padding: '1.25rem', background: 'rgba(201,164,85,0.08)', border: '1px solid rgba(201,164,85,0.3)' }}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="hero-sans" style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Última verificación</span>
                    <span className="hero-sans" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>Hace 0.3s</span>
                  </div>
                  <div className="hero-serif" style={{ color: '#E8C97A', fontSize: '2rem', fontWeight: 800 }}>$87,492.35</div>
                  <div className="hero-sans" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', marginTop: '2px' }}>Saldo bajo protección activa</div>
                </div>

                {/* Footer */}
                <div className="mt-4 flex items-center justify-center gap-2">
                  <i className="fas fa-check-circle" style={{ color: '#22C55E', fontSize: '0.75rem' }}></i>
                  <span className="hero-sans" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', letterSpacing: '0.06em' }}>CUENTA TOTALMENTE PROTEGIDA</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;