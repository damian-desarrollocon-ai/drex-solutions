import React from 'react';
import { Link } from 'react-router-dom';

const CtaSection = () => {
  return (
    <section id="contacto" className="py-28" style={{ background: '#0D1F3C', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700;400i&family=DM+Sans:wght@300;400;500;600&display=swap');
        .cta-serif { font-family: 'Cormorant Garamond', serif; }
        .cta-sans  { font-family: 'DM Sans', sans-serif; }
        .cta-bg-grid {
          background-image:
            linear-gradient(rgba(201,164,85,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,164,85,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .cta-primary {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 1.1rem 2.5rem;
          background: #C9A455;
          color: #0D1F3C;
          border: 1px solid #C9A455;
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          transition: all 0.3s;
        }
        .cta-primary:hover {
          background: transparent;
          color: #C9A455;
        }
        .cta-secondary {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 1.1rem 2.5rem;
          background: transparent;
          color: rgba(255,255,255,0.7);
          border: 1px solid rgba(255,255,255,0.2);
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          transition: all 0.3s;
        }
        .cta-secondary:hover {
          border-color: rgba(255,255,255,0.5);
          color: #fff;
        }
      `}</style>

      <div className="cta-bg-grid absolute inset-0" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(26,58,107,0.5) 0%, transparent 70%)' }} />
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,164,85,0.4), transparent)' }} />

      <div className="relative max-w-4xl mx-auto px-6 lg:px-10 text-center">
        <div style={{ width: '40px', height: '40px', border: '1px solid rgba(201,164,85,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
          <i className="fas fa-shield-alt" style={{ color: '#C9A455', fontSize: '1rem' }}></i>
        </div>

        <div style={{ width: '48px', height: '1px', background: '#C9A455', margin: '0 auto 2rem' }} />

        <h2 className="cta-serif" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, color: '#fff', lineHeight: 1.1, marginBottom: '1.5rem' }}>
          ¿Sufriste un fraude<br />
          <span style={{ color: '#C9A455', fontStyle: 'italic' }}>financiero?</span>
        </h2>

        <p className="cta-sans" style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.78)', lineHeight: 1.8, fontWeight: 400, maxWidth: '560px', margin: '0 auto 3rem' }}>
          Nuestro equipo de expertos está listo para evaluar tu caso de forma
          gratuita y sin compromiso. Actúa ahora — el tiempo es crucial.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register" className="cta-primary">
            <i className="fas fa-briefcase" style={{ fontSize: '0.75rem' }}></i>
            Consulta Gratuita
          </Link>
          <a href="tel:+525500000000" className="cta-secondary">
            <i className="fas fa-phone" style={{ fontSize: '0.75rem' }}></i>
            Llamar Ahora
          </a>
        </div>

        <div style={{ marginTop: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          {['Evaluación gratuita', 'Sin compromiso', 'Confidencial 100%'].map((item, i) => (
            <div key={i} className="cta-sans" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem' }}>
              <i className="fas fa-check" style={{ color: '#22C55E', fontSize: '0.65rem' }}></i>
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CtaSection;