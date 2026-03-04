import React from 'react';
import { CheckCircle, XCircle, Trash2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UserBalanceDialog from '@/components/admin/UserBalanceDialog';
import UserReceiverAccountDialog from '@/components/admin/UserReceiverAccountDialog';
import UserEditDialog from '@/components/admin/UserEditDialog';

const UL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');
  .ul-row { border-bottom:1px solid #F0EDE8; padding:1rem 1.75rem; display:flex; align-items:center; justify-content:space-between; transition:background 0.15s; }
  .ul-row:last-child { border-bottom:none; }
  .ul-row:hover { background:#FAFAF8; }
  .ul-avatar { width:40px; height:40px; background:#0D1F3C; border:1px solid rgba(201,164,85,0.3); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .ul-action { width:30px; height:30px; display:flex; align-items:center; justify-content:center; border:1px solid #E8E5DF; background:transparent; cursor:pointer; transition:all 0.18s; color:#6B6B6B; }
  .ul-action:hover { border-color:#0D1F3C; color:#0D1F3C; background:#F5F4F0; }
  .ul-action.danger:hover { border-color:#DC2626; color:#DC2626; background:#FEF2F2; }
  .ul-action.success { color:#059669; border-color:rgba(5,150,105,0.3); }
  .ul-action.success:hover { border-color:#059669; background:rgba(5,150,105,0.06); }
  .ul-action.warning { color:#F59E0B; border-color:rgba(245,158,11,0.3); }
  .ul-action.warning:hover { border-color:#F59E0B; background:rgba(245,158,11,0.06); }
  .ul-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:3.5rem 0; gap:0.75rem; }
  .ul-badge-active   { font-size:0.62rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:#059669; background:rgba(5,150,105,0.08); border:1px solid rgba(5,150,105,0.2); padding:0.2rem 0.6rem; }
  .ul-badge-inactive { font-size:0.62rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:#F59E0B; background:rgba(245,158,11,0.08); border:1px solid rgba(245,158,11,0.2); padding:0.2rem 0.6rem; }
`;

const UserList = ({ users, onUpdateBalance, onUpdateReceiverAccount, onToggleStatus, onDeleteUser, onUpdateUser }) => {
  const fmt    = (a) => new Intl.NumberFormat('es-MX', { style:'currency', currency:'MXN' }).format(a);
  const fmtDt  = (d) => new Date(d).toLocaleDateString('es-MX', { year:'numeric', month:'short', day:'numeric' });

  if (!users || users.length === 0) return (
    <>
      <style>{UL_STYLES}</style>
      <div className="ul-empty">
        <div style={{ width:'48px', height:'48px', background:'#0D1F3C', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Users style={{ color:'#C9A455', width:'20px', height:'20px' }} />
        </div>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.875rem', color:'#9B9B9B' }}>No se encontraron clientes.</p>
      </div>
    </>
  );

  return (
    <>
      <style>{UL_STYLES}</style>
      {users.map((u) => (
        <div key={u.id} className="ul-row">
          {/* Left: avatar + info */}
          <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
            <div className="ul-avatar">
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.7rem', fontWeight:700, color:'#C9A455' }}>
                {u.first_name?.[0]}{u.last_name?.[0]}
              </span>
            </div>
            <div>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.875rem', fontWeight:600, color:'#0D1F3C', margin:0 }}>
                {u.first_name} {u.last_name}
              </p>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.75rem', color:'#9B9B9B', margin:'2px 0' }}>
                {u.email}
              </p>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.68rem', color:'#B0B0B0', margin:0 }}>
                Registrado: {fmtDt(u.created_at)}
              </p>
            </div>
          </div>

          {/* Right: balance + actions */}
          <div style={{ display:'flex', alignItems:'center', gap:'2rem' }}>
            <div style={{ textAlign:'right' }}>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.2rem', fontWeight:700, color:'#0D1F3C', margin:0 }}>
                {fmt(u.balance || 0)}
              </p>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.72rem', color:'#9B9B9B', margin:'2px 0' }}>
                •••• {u.account_number?.slice(-4) || '----'}
              </p>
              {u.receiver_account && (
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.68rem', color:'#C9A455', margin:0 }}>
                  Receptora: {u.receiver_account}
                </p>
              )}
              <div style={{ marginTop:'4px' }}>
                <span className={u.is_active !== false ? 'ul-badge-active' : 'ul-badge-inactive'}>
                  {u.is_active !== false ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>

            <div style={{ display:'flex', alignItems:'center', gap:'0.35rem' }}>
              <UserEditDialog user={u} onUpdateUser={onUpdateUser} />
              <UserBalanceDialog user={u} onUpdateBalance={onUpdateBalance} />
              <UserReceiverAccountDialog user={u} onUpdateReceiverAccount={onUpdateReceiverAccount} />
              <button
                className={`ul-action ${u.is_active !== false ? 'success' : 'warning'}`}
                onClick={() => onToggleStatus(u.id)}
                title={u.is_active !== false ? 'Desactivar' : 'Activar'}
              >
                {u.is_active !== false
                  ? <CheckCircle style={{ width:'13px', height:'13px' }} />
                  : <XCircle    style={{ width:'13px', height:'13px' }} />}
              </button>
              <button
                className="ul-action danger"
                onClick={() => { if (window.confirm('¿Eliminar este usuario? Esta acción es irreversible.')) onDeleteUser(u.id); }}
                title="Eliminar"
              >
                <Trash2 style={{ width:'13px', height:'13px' }} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default UserList;