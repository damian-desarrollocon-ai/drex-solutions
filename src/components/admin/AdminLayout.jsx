import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, List, Settings, Gift,
  LogOut, ShieldCheck, Menu, Shield, BarChart3
} from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700;400i&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  .al-root { display:flex; height:100vh; background:#F5F4F0; font-family:'DM Sans',sans-serif; overflow:hidden; }

  .al-sidebar { width:260px; background:#0D1F3C; height:100vh; flex-shrink:0; display:flex; flex-direction:column; }
  .al-sidebar-top { padding:1.75rem 1.5rem 1.25rem; border-bottom:1px solid rgba(255,255,255,0.07); flex-shrink:0; }
  .al-logo-row { display:flex; align-items:center; gap:0.75rem; margin-bottom:1.25rem; }
  .al-logo-icon { width:34px; height:34px; border:1px solid rgba(201,164,85,0.4); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .al-logo-text { font-family:'Cormorant Garamond',serif; color:#fff; font-size:1.05rem; font-weight:700; letter-spacing:0.06em; }
  .al-logo-sub { font-size:0.6rem; font-weight:700; letter-spacing:0.2em; text-transform:uppercase; color:#C9A455; margin-top:1px; }

  .al-user-pill { display:flex; align-items:center; gap:0.625rem; padding:0.6rem 0.75rem; background:rgba(201,164,85,0.08); border:1px solid rgba(201,164,85,0.18); }
  .al-user-avatar { width:28px; height:28px; background:#C9A455; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .al-user-name { font-size:0.78rem; font-weight:600; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .al-user-role { font-size:0.6rem; color:#C9A455; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; }

  .al-nav { flex:1; padding:1.25rem 0.75rem; display:flex; flex-direction:column; gap:0.2rem; overflow-y:auto; }
  .al-nav-section { font-size:0.6rem; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; color:rgba(255,255,255,0.22); padding:0.75rem 0.875rem 0.35rem; }
  .al-nav-link { display:flex; align-items:center; gap:0.75rem; padding:0.65rem 0.875rem; color:rgba(255,255,255,0.5); font-size:0.82rem; font-weight:500; cursor:pointer; transition:all 0.18s; border:1px solid transparent; text-decoration:none; }
  .al-nav-link:hover { color:#fff; background:rgba(255,255,255,0.055); border-color:rgba(255,255,255,0.07); }
  .al-nav-link.active { color:#C9A455 !important; background:rgba(201,164,85,0.08); border-color:rgba(201,164,85,0.22); }

  .al-sidebar-bottom { padding:0.875rem 0.75rem; border-top:1px solid rgba(255,255,255,0.07); flex-shrink:0; }
  .al-signout { display:flex; align-items:center; gap:0.75rem; padding:0.65rem 0.875rem; width:100%; background:none; border:none; cursor:pointer; color:rgba(255,255,255,0.38); font-size:0.82rem; font-weight:500; font-family:'DM Sans',sans-serif; transition:color 0.18s; }
  .al-signout:hover { color:#ff6b6b; }

  .al-main { flex:1; display:flex; flex-direction:column; overflow:hidden; min-width:0; }
  .al-topbar { background:#fff; border-bottom:1px solid #E8E5DF; padding:0 2rem; height:60px; flex-shrink:0; display:flex; align-items:center; justify-content:space-between; }
  .al-topbar-left { display:flex; align-items:center; gap:1rem; }
  .al-topbar-eyebrow { font-size:0.63rem; font-weight:700; letter-spacing:0.15em; text-transform:uppercase; color:#9B9B9B; }
  .al-topbar-title { font-family:'Cormorant Garamond',serif; font-size:1.2rem; font-weight:700; color:#0D1F3C; }
  .al-topbar-badge { display:flex; align-items:center; gap:0.45rem; font-size:0.68rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:#C9A455; background:rgba(201,164,85,0.1); border:1px solid rgba(201,164,85,0.28); padding:0.3rem 0.8rem; }

  .al-menu-btn { display:none; align-items:center; justify-content:center; width:36px; height:36px; background:none; border:1px solid #E8E5DF; cursor:pointer; color:#0D1F3C; margin-right:0.75rem; }
  @media (max-width:1023px) { .al-sidebar { display:none; } .al-menu-btn { display:flex; } }

  .al-overlay { position:fixed; inset:0; background:rgba(7,15,30,0.65); z-index:50; display:flex; }
  .al-mobile-sidebar { width:260px; background:#0D1F3C; height:100vh; display:flex; flex-direction:column; overflow-y:auto; }

  .al-content-scroll { flex:1; overflow-y:auto; background:#F5F4F0; }
  .al-content-inner { padding:2rem; }
`;

const navItems = [
  { name: 'Dashboard',      icon: LayoutDashboard, path: '/admin' },
  { name: 'Usuarios',       icon: Users,           path: '/admin/users' },
  { name: 'Verificaciones', icon: ShieldCheck,     path: '/admin/verifications' },
  { name: 'Transacciones',  icon: List,            path: '/admin/transactions' },
  { name: 'Balances',       icon: BarChart3,       path: '/admin/balances' },
  { name: 'Códigos',        icon: Gift,            path: '/admin/codes' },
  { name: 'Ajustes',        icon: Settings,        path: '/admin/settings' },
];

const pageTitles = {
  '/admin':               'Dashboard',
  '/admin/users':         'Usuarios',
  '/admin/verifications': 'Verificaciones',
  '/admin/transactions':  'Transacciones',
  '/admin/balances':      'Balances',
  '/admin/codes':         'Códigos de Invitación',
  '/admin/settings':      'Ajustes',
};

const SidebarContent = ({ onLinkClick }) => {
  const { signOut, userProfile } = useAuth();
  const initials = `${userProfile?.first_name?.[0] || ''}${userProfile?.last_name?.[0] || ''}` || 'AD';

  return (
    <>
      <div className="al-sidebar-top">
        <div className="al-logo-row">
          <div className="al-logo-icon">
            <Shield style={{ color:'#C9A455', width:'15px', height:'15px' }} />
          </div>
          <div>
            <div className="al-logo-text">DREX SOLUTIONS</div>
            <div className="al-logo-sub">Panel Admin</div>
          </div>
        </div>
        <div className="al-user-pill">
          <div className="al-user-avatar">
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.6rem', fontWeight:700, color:'#0D1F3C' }}>
              {initials}
            </span>
          </div>
          <div style={{ minWidth:0 }}>
            <div className="al-user-name">{userProfile?.first_name} {userProfile?.last_name}</div>
            <div className="al-user-role">Administrador</div>
          </div>
        </div>
      </div>

      <nav className="al-nav">
        <div className="al-nav-section">Navegación</div>
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/admin'}
            onClick={onLinkClick}
            className={({ isActive }) => `al-nav-link${isActive ? ' active' : ''}`}
          >
            <item.icon style={{ width:'15px', height:'15px', flexShrink:0 }} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="al-sidebar-bottom">
        <button className="al-signout" onClick={signOut}>
          <LogOut style={{ width:'14px', height:'14px', flexShrink:0 }} />
          Cerrar Sesión
        </button>
      </div>
    </>
  );
};

const AdminLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const currentTitle = pageTitles[location.pathname] || 'Admin';

  useEffect(() => { setMobileOpen(false); }, [location]);

  return (
    <>
      <style>{STYLES}</style>
      <div className="al-root">

        {/* Desktop Sidebar */}
        <aside className="al-sidebar">
          <SidebarContent />
        </aside>

        {/* Mobile Overlay */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div className="al-overlay" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={() => setMobileOpen(false)}>
              <motion.div
                className="al-mobile-sidebar"
                initial={{ x:'-100%' }} animate={{ x:0 }} exit={{ x:'-100%' }}
                transition={{ type:'spring', stiffness:300, damping:30 }}
                onClick={(e) => e.stopPropagation()}
              >
                <SidebarContent onLinkClick={() => setMobileOpen(false)} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main */}
        <main className="al-main">
          {/* Topbar */}
          <div className="al-topbar">
            <div className="al-topbar-left">
              <button className="al-menu-btn" onClick={() => setMobileOpen(true)}>
                <Menu style={{ width:'18px', height:'18px' }} />
              </button>
              <div>
                <div className="al-topbar-eyebrow">Drex Solutions · Admin</div>
                <div className="al-topbar-title">{currentTitle}</div>
              </div>
            </div>
            <div className="al-topbar-badge">
              <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#22C55E', boxShadow:'0 0 5px rgba(34,197,94,0.65)' }} />
              Sistema Activo
            </div>
          </div>

          {/* Content */}
          <div className="al-content-scroll">
            <div className="al-content-inner">
              {children}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminLayout;