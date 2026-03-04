import React from 'react';
import { toast } from '@/components/ui/use-toast';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=DM+Sans:wght@400;500;600;700&display=swap');
  .pif-avatar { width:72px; height:72px; background:#0D1F3C; border:2px solid rgba(201,164,85,0.4); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .pif-label { font-size:0.68rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:#0D1F3C; display:block; margin-bottom:0.4rem; }
  .pif-input { font-family:'DM Sans',sans-serif; font-size:0.875rem; color:#0D1F3C; background:#FAFAF8; border:1px solid #D6D3CD; padding:0.6rem 0.875rem; width:100%; box-sizing:border-box; transition:border-color 0.18s; }
  .pif-input:focus { border-color:#C9A455; outline:none; box-shadow:0 0 0 2px rgba(201,164,85,0.12); }
  .pif-input:disabled { background:#F5F4F0; color:#9B9B9B; cursor:not-allowed; }
  .pif-grid { display:grid; grid-template-columns:1fr 1fr; gap:1.25rem; margin-top:1.75rem; }
  @media(max-width:640px){ .pif-grid{ grid-template-columns:1fr; } }
  .pif-full { grid-column:1 / -1; }
  .pif-readonly { font-family:'DM Sans',sans-serif; font-size:0.875rem; color:#6B6B6B; background:#F5F4F0; border:1px solid #E8E5DF; padding:0.6rem 0.875rem; width:100%; box-sizing:border-box; }
`;

const ProfileInfoForm = ({ user, profileData, handleProfileChange, isEditing }) => {
  const initials = `${user?.first_name?.[0]||''}${user?.last_name?.[0]||''}` || 'U';
  const joined   = user?.created_at ? new Date(user.created_at).toLocaleDateString('es-MX',{year:'numeric',month:'long',day:'numeric'}) : '—';

  return (
    <>
      <style>{STYLES}</style>

      {/* Avatar + name */}
      <div style={{ display:'flex', alignItems:'center', gap:'1.25rem', paddingBottom:'1.5rem', borderBottom:'1px solid #F0EDE8' }}>
        <div className="pif-avatar">
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'1.25rem', fontWeight:700, color:'#C9A455' }}>{initials}</span>
        </div>
        <div>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.3rem', fontWeight:700, color:'#0D1F3C' }}>
            {user?.first_name} {user?.last_name}
          </div>
          <div style={{ fontSize:'0.8rem', color:'#9B9B9B', marginTop:'2px' }}>{user?.email}</div>
          <div style={{ fontSize:'0.72rem', color:'#B0B0B0', marginTop:'2px' }}>Miembro desde {joined}</div>
        </div>
      </div>

      {/* Fields */}
      <div className="pif-grid">
        <div>
          <label className="pif-label">Nombre</label>
          {isEditing
            ? <input className="pif-input" name="first_name" value={profileData.first_name} onChange={handleProfileChange} />
            : <div className="pif-readonly">{profileData.first_name || '—'}</div>}
        </div>
        <div>
          <label className="pif-label">Apellidos</label>
          {isEditing
            ? <input className="pif-input" name="last_name" value={profileData.last_name} onChange={handleProfileChange} />
            : <div className="pif-readonly">{profileData.last_name || '—'}</div>}
        </div>
        <div>
          <label className="pif-label">Teléfono</label>
          {isEditing
            ? <input className="pif-input" name="phone" value={profileData.phone} onChange={handleProfileChange} placeholder="+521234567890" />
            : <div className="pif-readonly">{profileData.phone || '—'}</div>}
        </div>
        <div>
          <label className="pif-label">País</label>
          {isEditing
            ? <input className="pif-input" name="country" value={profileData.country} onChange={handleProfileChange} />
            : <div className="pif-readonly">{profileData.country || '—'}</div>}
        </div>
        <div className="pif-full">
          <label className="pif-label">Dirección</label>
          {isEditing
            ? <input className="pif-input" name="address" value={profileData.address} onChange={handleProfileChange} />
            : <div className="pif-readonly">{profileData.address || '—'}</div>}
        </div>
      </div>
    </>
  );
};

export default ProfileInfoForm;