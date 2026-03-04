import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient.js';
import { Loader2, ArrowUpRight, ArrowDownLeft, Clock, AlertCircle, CheckCircle, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  .tp-wrap { padding:2rem; font-family:'DM Sans',sans-serif; }
  @media(max-width:640px){ .tp-wrap{ padding:1rem; } }
  .tp-section-tag { font-size:0.7rem; font-weight:700; letter-spacing:0.15em; text-transform:uppercase; color:#B8892E; display:flex; align-items:center; gap:0.5rem; margin-bottom:0.4rem; }
  .tp-section-tag::before { content:''; width:20px; height:2px; background:#B8892E; }
  .tp-card { background:#fff; border:1px solid #E8E5DF; position:relative; overflow:hidden; }
  .tp-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,#C9A455,rgba(201,164,85,0.15)); }
  .tp-card-header { padding:1.5rem 1.75rem 1rem; border-bottom:1px solid #F0EDE8; }
  .tp-card-title { font-family:'Cormorant Garamond',serif; font-size:1.3rem; font-weight:700; color:#0D1F3C; }
  .tp-row { display:flex; align-items:center; justify-content:space-between; padding:1rem 1.75rem; border-bottom:1px solid #F5F4F0; transition:background 0.15s; }
  .tp-row:last-child { border-bottom:none; }
  .tp-row:hover { background:#FAFAF8; }
  .tp-icon-credit { width:40px; height:40px; background:rgba(5,150,105,0.1); border:1px solid rgba(5,150,105,0.2); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .tp-icon-debit { width:40px; height:40px; background:rgba(239,68,68,0.07); border:1px solid rgba(239,68,68,0.15); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .tp-icon-withdrawal { width:40px; height:40px; background:rgba(245,158,11,0.1); border:1px solid rgba(245,158,11,0.2); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .tp-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:4rem 0; gap:0.875rem; }
  .tp-pagination { display:flex; align-items:center; justify-content:flex-end; gap:0.5rem; padding:1.25rem 1.75rem; border-top:1px solid #F0EDE8; }
  .tp-page-btn { font-family:'DM Sans',sans-serif; font-size:0.72rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; padding:0.45rem 0.875rem; background:transparent; color:#0D1F3C; border:1px solid #D6D3CD; cursor:pointer; transition:all 0.2s; display:flex; align-items:center; gap:0.3rem; }
  .tp-page-btn:hover:not(:disabled) { background:#0D1F3C; color:#fff; border-color:#0D1F3C; }
  .tp-page-btn:disabled { opacity:0.4; cursor:not-allowed; }
`;

const PER_PAGE = 10;

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

const fmtCurrency = (a) => typeof a==='number' ? new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(a) : 'N/A';
const fmtDate = (d) => new Date(d).toLocaleDateString('es-MX',{year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'});

const TransactionsPage = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchTransactions = useCallback(async (pageNum) => {
    if (!user) return;
    setLoading(true);
    const from = pageNum * PER_PAGE;
    const { data, error } = await supabase
      .from('transactions').select('*').eq('user_id', user.id)
      .neq('status','pending_reversal').order('created_at',{ascending:false}).range(from, from+PER_PAGE-1);
    if (!error) { setTransactions(data); setHasMore(data.length === PER_PAGE); }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchTransactions(page);
    const iv = setInterval(() => fetchTransactions(page), 30000);
    return () => clearInterval(iv);
  }, [fetchTransactions, page]);

  return (
    <>
      <Helmet><title>Movimientos — Drex Solutions</title></Helmet>
      <style>{STYLES}</style>
      <div className="tp-wrap">
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} style={{marginBottom:'1.75rem'}}>
          <div className="tp-section-tag">Cuenta</div>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'2rem',fontWeight:700,color:'#0D1F3C',lineHeight:1.1,margin:0}}>
            Historial de Movimientos
          </h1>
          <p style={{fontSize:'0.875rem',color:'#9B9B9B',marginTop:'0.25rem'}}>Consulta todas tus operaciones registradas.</p>
        </motion.div>

        <div className="tp-card">
          <div className="tp-card-header">
            <div className="tp-card-title">Transacciones</div>
          </div>

          {loading ? (
            <div style={{display:'flex',alignItems:'center',justifyContent:'center',padding:'4rem'}}>
              <Loader2 style={{color:'#C9A455',width:'28px',height:'28px',animation:'spin 1s linear infinite'}}/>
            </div>
          ) : transactions.length === 0 ? (
            <div className="tp-empty">
              <div style={{width:'48px',height:'48px',background:'#0D1F3C',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <Clock style={{color:'#C9A455',width:'20px',height:'20px'}}/>
              </div>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'0.875rem',color:'#9B9B9B'}}>No hay transacciones para mostrar</p>
            </div>
          ) : transactions.map((tx) => {
            const si = getStatusInfo(tx.status);
            const isWithdrawal = tx.description?.toLowerCase().includes('retiro');
            const iconCls = tx.type==='credit' ? 'tp-icon-credit' : isWithdrawal ? 'tp-icon-withdrawal' : 'tp-icon-debit';
            const amtColor = tx.type==='credit' ? '#059669' : isWithdrawal ? '#D97706' : tx.status==='rejected' ? '#9B9B9B' : '#0D1F3C';
            return (
              <div key={tx.id} className="tp-row">
                <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
                  <div className={iconCls}>
                    {tx.type==='credit'
                      ? <ArrowDownLeft style={{width:'16px',height:'16px',color:'#059669'}}/>
                      : <ArrowUpRight  style={{width:'16px',height:'16px',color:isWithdrawal?'#D97706':'#DC2626'}}/>}
                  </div>
                  <div>
                    <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'0.875rem',fontWeight:600,color:'#0D1F3C',margin:0}}>{tx.description}</p>
                    <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginTop:'2px'}}>
                      <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:'0.72rem',color:'#9B9B9B'}}>{fmtDate(tx.created_at)}</span>
                      <span style={{color:'#D0CCC6'}}>·</span>
                      <span style={{display:'flex',alignItems:'center',gap:'3px',fontSize:'0.72rem',color:si.color}}>{si.icon} {si.text}</span>
                    </div>
                  </div>
                </div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.15rem',fontWeight:700,color:amtColor,textDecoration:tx.status==='rejected'?'line-through':'none',flexShrink:0}}>
                  {tx.type==='credit'?'+':'-'}{fmtCurrency(tx.amount)}
                </div>
              </div>
            );
          })}

          <div className="tp-pagination">
            <button className="tp-page-btn" onClick={()=>setPage(p=>Math.max(0,p-1))} disabled={page===0||loading}>
              <ChevronLeft style={{width:'13px',height:'13px'}}/> Anterior
            </button>
            <button className="tp-page-btn" onClick={()=>setPage(p=>p+1)} disabled={!hasMore||loading}>
              Siguiente <ChevronRight style={{width:'13px',height:'13px'}}/>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TransactionsPage;