import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, ArrowDownLeft, Clock, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=DM+Sans:wght@400;500;600&display=swap');
  .rt-card { background:#fff; border:1px solid #E8E5DF; position:relative; overflow:hidden; margin-bottom:1.5rem; }
  .rt-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,#C9A455,rgba(201,164,85,0.15)); }
  .rt-header { padding:1.25rem 1.5rem 0.875rem; border-bottom:1px solid #F0EDE8; display:flex; align-items:center; justify-content:space-between; }
  .rt-title { font-family:'Cormorant Garamond',serif; font-size:1.15rem; font-weight:700; color:#0D1F3C; }
  .rt-see-all { font-family:'DM Sans',sans-serif; font-size:0.72rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:#C9A455; background:none; border:none; cursor:pointer; transition:color 0.18s; }
  .rt-see-all:hover { color:#B8892E; }
  .rt-row { display:flex; align-items:center; justify-content:space-between; padding:0.875rem 1.5rem; border-bottom:1px solid #F5F4F0; transition:background 0.15s; }
  .rt-row:last-child { border-bottom:none; }
  .rt-row:hover { background:#FAFAF8; }
  .rt-icon-credit { width:38px; height:38px; background:rgba(5,150,105,0.1); border:1px solid rgba(5,150,105,0.2); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .rt-icon-debit { width:38px; height:38px; background:rgba(239,68,68,0.07); border:1px solid rgba(239,68,68,0.15); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .rt-icon-withdrawal { width:38px; height:38px; background:rgba(245,158,11,0.1); border:1px solid rgba(245,158,11,0.2); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .rt-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:3rem 0; gap:0.75rem; }
`;

const getStatusInfo = (status) => {
  switch (status) {
    case 'completed':  return { icon:<CheckCircle style={{width:'13px',height:'13px',color:'#059669'}}/>, text:'Completado', color:'#059669' };
    case 'pending':    return { icon:<RefreshCw   style={{width:'13px',height:'13px',color:'#F59E0B'}}/>, text:'Pendiente',  color:'#F59E0B' };
    case 'authorized': return { icon:<CheckCircle style={{width:'13px',height:'13px',color:'#3B82F6'}}/>, text:'Autorizado', color:'#3B82F6' };
    case 'failed':
    case 'rejected':   return { icon:<AlertCircle style={{width:'13px',height:'13px',color:'#DC2626'}}/>, text:'Rechazado',  color:'#DC2626' };
    default:           return { icon:<Clock       style={{width:'13px',height:'13px',color:'#9B9B9B'}}/>, text:status,      color:'#9B9B9B' };
  }
};

const fmtCurrency = (a) => typeof a === 'number' ? new Intl.NumberFormat('es-MX', { style:'currency', currency:'MXN' }).format(a) : 'N/A';
const fmtDate = (d) => new Date(d).toLocaleDateString('es-MX', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' });

const RecentTransactions = ({ transactions }) => {
  const navigate = useNavigate();
  return (
    <>
      <style>{STYLES}</style>
      <div className="rt-card">
        <div className="rt-header">
          <div className="rt-title">Movimientos Recientes</div>
          <button className="rt-see-all" onClick={() => navigate('/dashboard/transactions')}>Ver todos</button>
        </div>
        {(!transactions || transactions.length === 0) ? (
          <div className="rt-empty">
            <div style={{ width:'44px', height:'44px', background:'#0D1F3C', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Clock style={{ color:'#C9A455', width:'18px', height:'18px' }} />
            </div>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.875rem', color:'#9B9B9B' }}>No hay transacciones recientes</p>
          </div>
        ) : transactions.map((tx) => {
          const si = getStatusInfo(tx.status);
          const isWithdrawal = tx.description?.toLowerCase().includes('retiro');
          const iconCls = tx.type==='credit' ? 'rt-icon-credit' : isWithdrawal ? 'rt-icon-withdrawal' : 'rt-icon-debit';
          const amtColor = tx.type==='credit' ? '#059669' : isWithdrawal ? '#D97706' : tx.status==='rejected' ? '#9B9B9B' : '#0D1F3C';
          return (
            <div key={tx.id} className="rt-row">
              <div style={{ display:'flex', alignItems:'center', gap:'0.875rem' }}>
                <div className={iconCls}>
                  {tx.type==='credit'
                    ? <ArrowDownLeft style={{ width:'15px', height:'15px', color:'#059669' }} />
                    : <ArrowUpRight  style={{ width:'15px', height:'15px', color: isWithdrawal ? '#D97706' : '#DC2626' }} />}
                </div>
                <div>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.82rem', fontWeight:600, color:'#0D1F3C', margin:0 }}>{tx.description}</p>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.4rem', marginTop:'2px' }}>
                    <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.7rem', color:'#9B9B9B' }}>{fmtDate(tx.created_at)}</span>
                    <span style={{ color:'#D0CCC6' }}>·</span>
                    <span style={{ display:'flex', alignItems:'center', gap:'3px', fontSize:'0.7rem', color:si.color }}>{si.icon} {si.text}</span>
                  </div>
                </div>
              </div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.1rem', fontWeight:700, color:amtColor, textDecoration:tx.status==='rejected'?'line-through':'none', flexShrink:0 }}>
                {tx.type==='credit'?'+':'-'}{fmtCurrency(tx.amount)}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default RecentTransactions;