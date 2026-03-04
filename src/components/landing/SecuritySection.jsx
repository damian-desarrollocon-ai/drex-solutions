import React from 'react';

const SecuritySection = () => {
  return (
    <section id="seguridad" className="py-28" style={{ background: '#F5F4F0' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        .sec-serif { font-family: 'Cormorant Garamond', serif; }
        .sec-sans  { font-family: 'DM Sans', sans-serif; }
        .sec-card {
          background: #fff;
          border: 1px solid #E8E5DF;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .sec-card:hover {
          border-color: #C9A455;
          box-shadow: 0 20px 60px rgba(13,31,60,0.08);
        }
        .sec-icon-box {
          width: 56px;
          height: 56px;
          background: #0D1F3C;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .sec-tag {
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
        .sec-tag::before {
          content: '';
          width: 24px;
          height: 2px;
          background: #B8892E;
        }
        .sec-feature-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.6rem 0;
          border-bottom: 1px solid #F0EDE8;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.83rem;
          color: #444;
        }
        .sec-feature-item:last-child { border-bottom: none; }
        .sec-stat-card {
          background: #fff;
          border: 1px solid #E8E5DF;
          padding: 2rem 1.5rem;
          text-align: center;
          transition: all 0.3s;
        }
        .sec-stat-card:hover {
          border-color: #C9A455;
          transform: translateY(-4px);
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Header */}
        <div className="max-w-2xl mb-20">
          <div className="sec-tag mb-5">Tecnología de Vanguardia</div>
          <h2 className="sec-serif" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 700, color: '#0D1F3C', lineHeight: 1.1, marginBottom: '1.25rem' }}>
            Seguridad que<br />
            <span style={{ color: '#C9A455', fontStyle: 'italic' }}>Nunca Descansa</span>
          </h2>
          <p className="sec-sans" style={{ fontSize: '1rem', color: '#4A4A4A', lineHeight: 1.8, fontWeight: 400 }}>
            Nuestros sistemas de protección utilizan las tecnologías más avanzadas
            del mundo para mantener tu dinero seguro las 24 horas del día.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: 'fas fa-brain',
              accentColor: '#7C3AED',
              title: 'Inteligencia Artificial',
              description: 'Algoritmos de aprendizaje automático que analizan millones de patrones para detectar actividad sospechosa en microsegundos.',
              features: [
                { icon: 'fas fa-bolt', text: 'Detección en tiempo real' },
                { icon: 'fas fa-chart-line', text: 'Análisis predictivo' },
                { icon: 'fas fa-robot', text: 'Aprendizaje continuo' },
              ]
            },
            {
              icon: 'fas fa-fingerprint',
              accentColor: '#059669',
              title: 'Biometría Avanzada',
              description: 'Múltiples factores de autenticación biométrica que garantizan que solo tú puedas acceder a tu cuenta y fondos.',
              features: [
                { icon: 'fas fa-fingerprint', text: 'Huella dactilar' },
                { icon: 'fas fa-eye', text: 'Reconocimiento facial' },
                { icon: 'fas fa-microphone', text: 'Análisis de voz' },
              ]
            },
            {
              icon: 'fas fa-link',
              accentColor: '#0369A1',
              title: 'Blockchain Security',
              description: 'Tecnología blockchain que crea un registro inmutable y transparente de todas tus transacciones financieras.',
              features: [
                { icon: 'fas fa-lock', text: 'Registro inmutable' },
                { icon: 'fas fa-eye', text: 'Auditable y transparente' },
                { icon: 'fas fa-network-wired', text: 'Red descentralizada' },
              ]
            }
          ].map((card, i) => (
            <div key={i} className="sec-card p-8">
              <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div className="sec-icon-box">
                  <i className={`${card.icon} text-white`} style={{ fontSize: '1.1rem' }}></i>
                </div>
                <div style={{ width: '3px', height: '36px', background: card.accentColor, opacity: 0.6 }} />
              </div>
              <h3 className="sec-serif" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0D1F3C', marginBottom: '0.75rem' }}>
                {card.title}
              </h3>
              <p className="sec-sans" style={{ fontSize: '0.875rem', color: '#4A4A4A', lineHeight: 1.7, fontWeight: 400, marginBottom: '1.5rem' }}>
                {card.description}
              </p>
              <div>
                {card.features.map((f, fi) => (
                  <div key={fi} className="sec-feature-item" style={{ color: '#333' }}>
                    <i className={`${f.icon}`} style={{ color: card.accentColor, width: '14px', fontSize: '0.75rem', flexShrink: 0 }}></i>
                    {f.text}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: 'fas fa-users',      value: '250,000+', label: 'Clientes Protegidos',  color: '#059669' },
            { icon: 'fas fa-shield-alt', value: '99.95%',   label: 'Efectividad Anti-Fraude', color: '#0369A1' },
            { icon: 'fas fa-dollar-sign',value: '$2B+',     label: 'Fondos Protegidos',    color: '#C9A455' },
            { icon: 'fas fa-clock',      value: '0.3s',     label: 'Tiempo de Detección',  color: '#7C3AED' },
          ].map((stat, i) => (
            <div key={i} className="sec-stat-card">
              <div style={{ width: '40px', height: '40px', background: '#0D1F3C', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <i className={`${stat.icon} text-white`} style={{ fontSize: '0.85rem' }}></i>
              </div>
              <div className="sec-serif" style={{ fontSize: '2rem', fontWeight: 700, color: '#0D1F3C' }}>{stat.value}</div>
              <div className="sec-sans" style={{ fontSize: '0.78rem', color: '#666', letterSpacing: '0.04em', marginTop: '0.25rem' }}>{stat.label}</div>
              <div style={{ width: '24px', height: '2px', background: stat.color, margin: '0.75rem auto 0' }} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default SecuritySection;