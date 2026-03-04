import React from 'react';

const LandingFooter = () => {
  return (
    <footer style={{ background: '#070F1E', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        .ftr-serif { font-family: 'Cormorant Garamond', serif; }
        .ftr-link {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.6);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: color 0.2s;
        }
        .ftr-link:hover { color: #E8C97A; }
        .ftr-social {
          width: 36px;
          height: 36px;
          border: 1px solid rgba(255,255,255,0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.4);
          font-size: 0.8rem;
          transition: all 0.25s;
        }
        .ftr-social:hover {
          border-color: #C9A455;
          color: #C9A455;
        }
      `}</style>

      {/* Top gold line */}
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,164,85,0.3), transparent)' }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid lg:grid-cols-4 gap-12 mb-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '36px', height: '36px', border: '1px solid rgba(201,164,85,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-shield-alt" style={{ color: '#C9A455', fontSize: '0.85rem' }}></i>
              </div>
              <div>
                <div className="ftr-serif" style={{ color: '#fff', fontSize: '1.15rem', fontWeight: 700, letterSpacing: '0.06em' }}>DREX SOLUTIONS</div>
                <div style={{ color: '#C9A455', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Firma de Recuperación Financiera</div>
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', lineHeight: 1.8, fontWeight: 400, maxWidth: '360px', marginBottom: '1.5rem' }}>
              Protegiendo el patrimonio de más de 250,000 familias mexicanas con la tecnología
              de seguridad bancaria más avanzada del mundo.
            </p>
            <div style={{ display: 'flex', gap: '0.625rem' }}>
              {[
                { icon: 'fab fa-facebook-f', href: '#' },
                { icon: 'fab fa-twitter', href: '#' },
                { icon: 'fab fa-instagram', href: '#' },
                { icon: 'fab fa-linkedin-in', href: '#' },
              ].map((s, i) => (
                <a key={i} href={s.href} className="ftr-social">
                  <i className={s.icon}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <div style={{ color: '#C9A455', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Servicios</div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { icon: 'fas fa-university',  text: 'Cuenta Digital' },
                { icon: 'fas fa-credit-card', text: 'Tarjetas Inteligentes' },
                { icon: 'fas fa-shield-alt',  text: 'Protección Anti-Fraude' },
                { icon: 'fas fa-mobile-alt',  text: 'Banca Móvil' },
                { icon: 'fas fa-chart-line',  text: 'Análisis Financiero' },
              ].map((item, i) => (
                <li key={i}>
                  <a href="#" className="ftr-link">
                    <i className={item.icon} style={{ width: '14px', fontSize: '0.72rem', color: 'rgba(201,164,85,0.6)' }}></i>
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <div style={{ color: '#C9A455', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Empresa</div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { icon: 'fas fa-building',    text: 'Nosotros',        href: '#nosotros' },
                { icon: 'fas fa-lock',        text: 'Seguridad',       href: '#seguridad' },
                { icon: 'fas fa-certificate', text: 'Certificaciones', href: '#' },
                { icon: 'fas fa-briefcase',   text: 'Carreras',        href: '#' },
                { icon: 'fas fa-phone',       text: 'Contacto',        href: '#contacto' },
              ].map((item, i) => (
                <li key={i}>
                  <a href={item.href} className="ftr-link">
                    <i className={item.icon} style={{ width: '14px', fontSize: '0.72rem', color: 'rgba(201,164,85,0.6)' }}></i>
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { icon: 'fas fa-shield-alt', color: '#22C55E', text: 'ISO 27001' },
              { icon: 'fas fa-lock',       color: '#60A5FA', text: 'PCI DSS' },
              { icon: 'fas fa-university', color: '#C9A455', text: 'CNBV' },
            ].map((badge, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', letterSpacing: '0.06em' }}>
                <i className={badge.icon} style={{ color: badge.color, fontSize: '0.65rem' }}></i>
                {badge.text}
              </div>
            ))}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem', textAlign: 'center' }}>
            © 2025 Drex Solutions. Todos los derechos reservados. &nbsp;·&nbsp;
            <a href="#" style={{ color: 'rgba(255,255,255,0.55)', transition: 'color 0.2s' }}>Términos</a>
            &nbsp;·&nbsp;
            <a href="#" style={{ color: 'rgba(255,255,255,0.55)', transition: 'color 0.2s' }}>Privacidad</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;