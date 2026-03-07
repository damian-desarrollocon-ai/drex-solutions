import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const DASHBOARD_STATES = [
  {
    label: 'Panel Principal',
    rows: [
      { left: { dot: '#22C55E', text: 'Protección Activa' }, right: { color: '#22C55E', text: 'ONLINE' } },
      { left: { icon: 'fas fa-credit-card', title: 'Última transacción', sub: 'Farmacia San Pablo · hace 2h' }, right: { color: '#fff', text: '-$89.50' } },
    ],
    badge: { icon: 'fas fa-award', color: '#E8C97A', bg: 'rgba(201,164,85,0.12)', border: 'rgba(201,164,85,0.35)', text: 'Cliente Premium Verificado' },
  },
  {
    label: 'Recuperación Activa',
    rows: [
      { left: { dot: '#C9A455', text: 'Caso en Proceso' }, right: { color: '#C9A455', text: 'EN CURSO' } },
      { left: { icon: 'fas fa-folder-open', title: 'Expediente #DRX-2847', sub: 'Actualizado hace 15 min' }, right: { color: '#C9A455', text: '68%' } },
    ],
    badge: { icon: 'fas fa-balance-scale', color: '#93C5FD', bg: 'rgba(37,99,235,0.12)', border: 'rgba(37,99,235,0.35)', text: 'Equipo Legal Asignado' },
  },
  {
    label: 'Fondos Recuperados',
    rows: [
      { left: { dot: '#22C55E', text: 'Transferencia Completada' }, right: { color: '#22C55E', text: 'EXITOSO' } },
      { left: { icon: 'fas fa-piggy-bank', title: 'Fondos recuperados', sub: 'Depositado hoy · 09:42 am' }, right: { color: '#22C55E', text: '+$87,492' } },
    ],
    badge: { icon: 'fas fa-shield-alt', color: '#86EFAC', bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.35)', text: 'Patrimonio Protegido' },
  },
  {
    label: 'Alerta de Seguridad',
    rows: [
      { left: { dot: '#F59E0B', text: 'Transacción Sospechosa' }, right: { color: '#F59E0B', text: 'ALERTA' } },
      { left: { icon: 'fas fa-exclamation-triangle', title: 'Intento bloqueado', sub: 'Origen desconocido · hace 3 min' }, right: { color: '#F87171', text: '-$4,200' } },
    ],
    badge: { icon: 'fas fa-lock', color: '#FCA5A5', bg: 'rgba(220,38,38,0.12)', border: 'rgba(220,38,38,0.35)', text: 'Transacción Bloqueada' },
  },
];

const DashCard = ({ state }) => (
  <>
    {/* Row 1 */}
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0.85rem 1rem', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', marginBottom:'0.625rem' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
        <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:state.rows[0].left.dot, boxShadow:`0 0 6px ${state.rows[0].left.dot}` }}/>
        <span style={{ fontFamily:"'DM Sans',sans-serif", color:'rgba(255,255,255,0.9)', fontSize:'0.85rem' }}>{state.rows[0].left.text}</span>
      </div>
      <span style={{ fontFamily:"'DM Sans',sans-serif", color:state.rows[0].right.color, fontSize:'0.75rem', fontWeight:700, letterSpacing:'0.08em' }}>{state.rows[0].right.text}</span>
    </div>

    {/* Row 2 */}
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0.85rem 1rem', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', marginBottom:'0.625rem' }}>
      <div>
        <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'0.25rem' }}>
          <i className={state.rows[1].left.icon} style={{ color:'rgba(255,255,255,0.6)', fontSize:'0.75rem' }}/>
          <span style={{ fontFamily:"'DM Sans',sans-serif", color:'rgba(255,255,255,0.85)', fontSize:'0.85rem' }}>{state.rows[1].left.title}</span>
        </div>
        <div style={{ fontFamily:"'DM Sans',sans-serif", color:'rgba(255,255,255,0.55)', fontSize:'0.75rem', paddingLeft:'1.25rem' }}>{state.rows[1].left.sub}</div>
      </div>
      <span style={{ fontFamily:"'DM Sans',sans-serif", color:state.rows[1].right.color, fontSize:'0.9rem', fontWeight:600 }}>{state.rows[1].right.text}</span>
    </div>

    {/* Badge */}
    <div style={{ background:state.badge.bg, border:`1px solid ${state.badge.border}`, padding:'0.85rem 1rem', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.6rem' }}>
      <i className={state.badge.icon} style={{ color:state.badge.color, fontSize:'0.85rem' }}/>
      <span style={{ fontFamily:"'DM Sans',sans-serif", color:state.badge.color, fontSize:'0.78rem', fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase' }}>{state.badge.text}</span>
    </div>
  </>
);

const ServicesSection = () => {
  const [current, setCurrent]     = useState(0);
  const [animating, setAnimating] = useState(false);
  const [phase, setPhase]         = useState('idle'); // 'fold' | 'swap' | 'unfold' | 'idle'
  const [displayed, setDisplayed] = useState(0);

  const flipTo = (target) => {
    if (animating || target === current) return;
    setAnimating(true);
    // Phase 1: fold (rotate top half down)
    setPhase('fold');
    setTimeout(() => {
      // Phase 2: swap content mid-flip
      setDisplayed(target);
      setPhase('unfold');
      setTimeout(() => {
        setCurrent(target);
        setPhase('idle');
        setAnimating(false);
      }, 350);
    }, 350);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const next = (current + 1) % DASHBOARD_STATES.length;
      flipTo(next);
    }, 3500);
    return () => clearInterval(interval);
  }, [current, animating]);

  const foldStyle = phase === 'fold'
    ? { transform: 'rotateX(-90deg)', transformOrigin: 'top center', opacity: 0, transition: 'transform 0.35s ease-in, opacity 0.35s ease-in' }
    : phase === 'unfold'
    ? { transform: 'rotateX(0deg)', transformOrigin: 'top center', opacity: 1, transition: 'transform 0.35s ease-out, opacity 0.35s ease-out' }
    : { transform: 'rotateX(0deg)', opacity: 1, transition: 'none' };

  return (
    <section id="servicios" className="py-28" style={{ background: '#fff' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700;400i&family=DM+Sans:wght@300;400;500;600&display=swap');
        .svc-tag { font-family:'DM Sans',sans-serif; font-size:0.75rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:#B8892E; display:flex; align-items:center; gap:0.5rem; }
        .svc-tag::before { content:''; width:24px; height:2px; background:#B8892E; }
        .svc-feature { display:flex; align-items:flex-start; gap:1.25rem; padding:1.5rem 0; border-bottom:1px solid #F0EDE8; }
        .svc-feature:last-child { border-bottom:none; }
        .svc-feature-icon { width:44px; height:44px; background:#0D1F3C; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .svc-cta { font-family:'DM Sans',sans-serif; font-size:0.8rem; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; padding:0.9rem 2rem; background:#0D1F3C; color:#fff; border:1px solid #0D1F3C; display:inline-flex; align-items:center; gap:0.75rem; transition:all 0.3s; }
        .svc-cta:hover { background:transparent; color:#0D1F3C; }
        .dash-indicators { display:flex; gap:0.4rem; justify-content:center; margin-top:1.25rem; }
        .dash-dot-ind { width:6px; height:6px; border-radius:50%; background:rgba(255,255,255,0.2); transition:all 0.3s; cursor:pointer; }
        .dash-dot-ind.active { background:#C9A455; width:18px; border-radius:3px; }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Header */}
        <div className="max-w-xl mb-16">
          <div className="svc-tag mb-5">Servicios Especializados</div>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(2.2rem,4vw,3.2rem)', fontWeight:700, color:'#0D1F3C', lineHeight:1.1, marginBottom:'1.25rem' }}>
            Soluciones Integrales<br/>
            <span style={{ color:'#C9A455', fontStyle:'italic' }}>de Recuperación</span>
          </h2>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'1rem', color:'#4A4A4A', lineHeight:1.8, fontWeight:400 }}>
            Todo lo que necesitas para recuperar y proteger tu patrimonio financiero de manera eficiente y segura.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left: features */}
          <div>
            {[
              { icon:'fas fa-mobile-alt',  color:'#0369A1', title:'Plataforma Digital Inteligente',   text:'Acceso 24/7 a tu caso de recuperación con actualizaciones en tiempo real, documentos y comunicación directa con tu equipo legal asignado.' },
              { icon:'fas fa-credit-card', color:'#7C3AED', title:'Protección Preventiva Anti-Fraude', text:'Sistema activo que monitorea tus cuentas con chip de seguridad avanzado y notificaciones instantáneas para cada transacción sospechosa.' },
              { icon:'fas fa-chart-line',  color:'#059669', title:'Análisis Forense Financiero',        text:'Reportes automáticos que rastrean el origen del fraude, identifican a los responsables y construyen el expediente para la recuperación de fondos.' },
            ].map((item, i) => (
              <div key={i} className="svc-feature">
                <div className="svc-feature-icon">
                  <i className={`${item.icon} text-white`} style={{ fontSize:'0.9rem' }}/>
                </div>
                <div>
                  <div style={{ width:'3px', height:'16px', background:item.color, marginBottom:'0.5rem' }}/>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", color:'#0D1F3C', fontSize:'1.1rem', fontWeight:700, marginBottom:'0.4rem' }}>{item.title}</div>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.875rem', color:'#4A4A4A', lineHeight:1.7, fontWeight:400 }}>{item.text}</p>
                </div>
              </div>
            ))}
            <div style={{ marginTop:'2rem' }}>
              <Link to="/register" className="svc-cta">
                <i className="fas fa-briefcase" style={{ fontSize:'0.75rem' }}/>
                Abrir Mi Expediente
              </Link>
            </div>
          </div>

          {/* Right: book flip */}
          <div>
            <div style={{ background:'#0D1F3C', position:'relative', overflow:'hidden', padding:'2rem' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg,#C9A455,rgba(201,164,85,0.2))' }}/>

              {/* Header fijo */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'2rem' }}>
                <div>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", color:'#fff', fontSize:'1.25rem', fontWeight:600 }}>Mi Cuenta DREX</div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", color:'rgba(255,255,255,0.4)', fontSize:'0.7rem', letterSpacing:'0.1em', textTransform:'uppercase' }}>
                    {DASHBOARD_STATES[displayed].label}
                  </div>
                </div>
                <div style={{ width:'40px', height:'40px', border:'1px solid rgba(201,164,85,0.4)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <i className="fas fa-university" style={{ color:'#C9A455', fontSize:'0.9rem' }}/>
                </div>
              </div>

              {/* Contenido animado tipo libro */}
              <div style={{ perspective:'800px' }}>
                <div style={{ ...foldStyle, transformStyle:'preserve-3d' }}>
                  <DashCard state={DASHBOARD_STATES[displayed]} />
                </div>
              </div>

              {/* Indicadores */}
              <div className="dash-indicators">
                {DASHBOARD_STATES.map((_, i) => (
                  <div key={i} className={`dash-dot-ind ${i === current ? 'active' : ''}`} onClick={() => flipTo(i)} />
                ))}
              </div>

              {/* Footer */}
              <div style={{ marginTop:'1rem', padding:'0.75rem 0 0', borderTop:'1px solid rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem' }}>
                <i className="fas fa-lock" style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.7rem' }}/>
                <span style={{ fontFamily:"'DM Sans',sans-serif", color:'rgba(255,255,255,0.45)', fontSize:'0.72rem', letterSpacing:'0.08em', textTransform:'uppercase' }}>
                  Conexión cifrada · 256-bit SSL
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ServicesSection;