import React, { useState } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, User, List, LogOut, Loader2, Shield, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  .dl-root { min-height:100vh; display:flex; background:#F5F4F0; font-family:'DM Sans',sans-serif; }

  .dl-sidebar { width:260px; background:#0D1F3C; min-height:100vh; display:flex; flex-direction:column; flex-shrink:0; }
  .dl-sidebar-top { padding:1.75rem 1.5rem 1.25rem; border-bottom:1px solid rgba(255,255,255,0.07); }
  .dl-logo-img { height:64px; width:auto; object-fit:contain; }
  .dl-logo-sub { font-size:0.6rem; font-weight:700; letter-spacing:0.2em; text-transform:uppercase; color:rgba(255,255,255,0.3); margin-top:0.5rem; }

  .dl-user-pill { margin-top:1.25rem; display:flex; align-items:center; gap:0.625rem; padding:0.6rem 0.75rem; background:rgba(201,164,85,0.08); border:1px solid rgba(201,164,85,0.18); }
  .dl-user-avatar { width:28px; height:28px; background:#C9A455; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .dl-user-name { font-size:0.78rem; font-weight:600; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .dl-user-role { font-size:0.6rem; color:#C9A455; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; }

  .dl-nav { flex:1; padding:1.25rem 0.75rem; display:flex; flex-direction:column; gap:0.2rem; }
  .dl-nav-section { font-size:0.6rem; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; color:rgba(255,255,255,0.22); padding:0.75rem 0.875rem 0.35rem; }
  .dl-nav-link { display:flex; align-items:center; gap:0.75rem; padding:0.65rem 0.875rem; color:rgba(255,255,255,0.5); font-size:0.82rem; font-weight:500; cursor:pointer; transition:all 0.18s; border:1px solid transparent; background:none; width:100%; font-family:'DM Sans',sans-serif; text-align:left; }
  .dl-nav-link:hover { color:#fff; background:rgba(255,255,255,0.055); border-color:rgba(255,255,255,0.07); }
  .dl-nav-link.active { color:#C9A455; background:rgba(201,164,85,0.08); border-color:rgba(201,164,85,0.22); }

  .dl-sidebar-bottom { padding:0.875rem 0.75rem; border-top:1px solid rgba(255,255,255,0.07); }
  .dl-signout { display:flex; align-items:center; gap:0.75rem; padding:0.65rem 0.875rem; width:100%; background:none; border:none; cursor:pointer; color:rgba(255,255,255,0.38); font-size:0.82rem; font-weight:500; font-family:'DM Sans',sans-serif; transition:color 0.18s; }
  .dl-signout:hover { color:#ff6b6b; }

  .dl-main { flex:1; display:flex; flex-direction:column; min-width:0; }
  .dl-topbar { background:#fff; border-bottom:1px solid #E8E5DF; padding:0 2rem; height:60px; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:30; }
  .dl-topbar-eyebrow { font-size:0.63rem; font-weight:700; letter-spacing:0.15em; text-transform:uppercase; color:#9B9B9B; }
  .dl-topbar-title { font-family:'Cormorant Garamond',serif; font-size:1.2rem; font-weight:700; color:#0D1F3C; }
  .dl-topbar-badge { display:flex; align-items:center; gap:0.45rem; font-size:0.68rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:#059669; background:rgba(5,150,105,0.08); border:1px solid rgba(5,150,105,0.2); padding:0.3rem 0.8rem; }

  .dl-content { flex:1; }
  .dl-footer { text-align:center; padding:1rem; font-size:0.75rem; color:#B0B0B0; border-top:1px solid #E8E5DF; background:#fff; }

  .dl-menu-btn { display:none; align-items:center; justify-content:center; width:36px; height:36px; background:none; border:1px solid #E8E5DF; cursor:pointer; color:#0D1F3C; flex-shrink:0; }
  .dl-overlay { position:fixed; inset:0; background:rgba(7,15,30,0.65); z-index:50; display:flex; }
  .dl-mobile-sidebar { width:260px; background:#0D1F3C; height:100vh; display:flex; flex-direction:column; overflow-y:auto; }
  .dl-close-row { display:flex; justify-content:flex-end; padding:1rem 1rem 0.5rem; }
  .dl-close-btn { display:flex; align-items:center; justify-content:center; width:32px; height:32px; background:none; border:1px solid rgba(255,255,255,0.15); cursor:pointer; color:rgba(255,255,255,0.6); }

  @media (max-width:767px) {
    .dl-sidebar  { display:none !important; }
    .dl-menu-btn { display:flex; }
    .dl-topbar   { padding:0 1rem; }
  }
`;

const navItems = [
  { icon: Home,     label: 'Inicio',        path: '/dashboard' },
  { icon: List,     label: 'Movimientos',   path: '/dashboard/transactions' },
  { icon: User,     label: 'Mi Perfil',     path: '/dashboard/profile' },
];

const pageTitles = {
  '/dashboard':              'Inicio',
  '/dashboard/transactions': 'Movimientos',
  '/dashboard/profile':      'Mi Perfil',
  '/dashboard/settings':     'Configuración',
};

const SidebarContent = ({ userProfile, currentPath, onNavigate, onSignOut, onClose }) => {
  const initials = `${userProfile?.first_name?.[0] || ''}${userProfile?.last_name?.[0] || ''}` || 'U';
  return (
    <>
      {onClose && (
        <div className="dl-close-row">
          <button className="dl-close-btn" onClick={onClose}>
            <X style={{ width:'14px', height:'14px' }} />
          </button>
        </div>
      )}
      <div className="dl-sidebar-top">
        <img
          src="https://horizons-cdn.hostinger.com/ced3d611-f27b-4726-855b-d53f776e1e0f/17379bf36b498ccb625d959c7267d24a.png"
          alt="Drex Solutions"
          className="dl-logo-img"
        />
        <div className="dl-logo-sub">Banca Digital</div>
        <div className="dl-user-pill">
          <div className="dl-user-avatar">
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.6rem', fontWeight:700, color:'#0D1F3C' }}>
              {initials}
            </span>
          </div>
          <div style={{ minWidth:0 }}>
            <div className="dl-user-name">{userProfile?.first_name} {userProfile?.last_name}</div>
            <div className="dl-user-role">Cliente</div>
          </div>
        </div>
      </div>

      <nav className="dl-nav">
        <div className="dl-nav-section">Menú</div>
        {navItems.map((item) => (
          <button
            key={item.path}
            className={`dl-nav-link ${currentPath === item.path ? 'active' : ''}`}
            onClick={() => onNavigate(item.path)}
          >
            <item.icon style={{ width:'15px', height:'15px', flexShrink:0 }} />
            {item.label}
          </button>
        ))}
        {userProfile?.role === 'admin' && (
          <>
            <div className="dl-nav-section" style={{ marginTop:'0.5rem' }}>Administración</div>
            <button className="dl-nav-link" onClick={() => onNavigate('/admin')}>
              <Shield style={{ width:'15px', height:'15px', flexShrink:0 }} />
              Panel Admin
            </button>
          </>
        )}
      </nav>

      <div className="dl-sidebar-bottom">
        <button className="dl-signout" onClick={onSignOut}>
          <LogOut style={{ width:'14px', height:'14px', flexShrink:0 }} />
          Cerrar Sesión
        </button>
      </div>
    </>
  );
};

const DashboardLayout = ({ children }) => {
  const { userProfile, signOut, loading } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentPath  = location.pathname;
  const currentTitle = pageTitles[currentPath] || 'Mi Cuenta';

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0D1F3C' }}>
      <Loader2 style={{ color:'#C9A455', width:'32px', height:'32px', animation:'spin 1s linear infinite' }} />
    </div>
  );

  const handleNavigate = (path) => { setMobileOpen(false); navigate(path); };

  const handleSignOut = () => {
    setMobileOpen(false);
    signOut();
    navigate('/login');
    toast({ title:"Sesión cerrada", description:"Has cerrado sesión correctamente." });
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="dl-root">

        {/* Sidebar desktop */}
        <aside className="dl-sidebar">
          <SidebarContent
            userProfile={userProfile}
            currentPath={currentPath}
            onNavigate={handleNavigate}
            onSignOut={handleSignOut}
          />
        </aside>

        {/* Sidebar mobile overlay */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              className="dl-overlay"
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              onClick={() => setMobileOpen(false)}
            >
              <motion.div
                className="dl-mobile-sidebar"
                initial={{ x:'-100%' }} animate={{ x:0 }} exit={{ x:'-100%' }}
                transition={{ type:'spring', stiffness:300, damping:30 }}
                onClick={(e) => e.stopPropagation()}
              >
                <SidebarContent
                  userProfile={userProfile}
                  currentPath={currentPath}
                  onNavigate={handleNavigate}
                  onSignOut={handleSignOut}
                  onClose={() => setMobileOpen(false)}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content */}
        <main className="dl-main">
          {/* Topbar */}
          <div className="dl-topbar">
            <div style={{ display:'flex', alignItems:'center', gap:'0.875rem' }}>
              <button className="dl-menu-btn" onClick={() => setMobileOpen(true)}>
                <Menu style={{ width:'18px', height:'18px' }} />
              </button>
              <div>
                <div className="dl-topbar-eyebrow">Drex Solutions</div>
                <div className="dl-topbar-title">{currentTitle}</div>
              </div>
            </div>
            <div className="dl-topbar-badge">
              <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#22C55E', boxShadow:'0 0 6px rgba(34,197,94,0.7)', animation:'pulse 2s infinite' }} />
              En línea
            </div>
          </div>

          <div className="dl-content">{children}</div>

          <footer className="dl-footer">
            © {new Date().getFullYear()} Drex Solutions. Todos los derechos reservados.
          </footer>
        </main>
      </div>
    </>
  );
};

export default DashboardLayout;