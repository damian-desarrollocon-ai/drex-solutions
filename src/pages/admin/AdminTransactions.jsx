import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, XCircle, Clock, RefreshCw, Activity } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient.js';
import { toast } from '@/components/ui/use-toast';

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=DM+Sans:wght@400;500;600;700&display=swap');
  .pg-tag{font-size:.7rem;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:#B8892E;display:flex;align-items:center;gap:.5rem;margin-bottom:.4rem}
  .pg-tag::before{content:'';width:20px;height:2px;background:#B8892E}
  .pg-card{background:#fff;border:1px solid #E8E5DF;position:relative;overflow:hidden}
  .pg-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#C9A455,rgba(201,164,85,.15))}
  .pg-card-hd{padding:1.25rem 1.75rem 1rem;border-bottom:1px solid #F0EDE8;display:flex;align-items:center;justify-content:space-between}
  .tabs-row{display:flex;border-bottom:1px solid #E8E5DF;padding:0 1.75rem;gap:0}
  .tab-btn{font-family:'DM Sans',sans-serif;font-size:.75rem;font-weight:600;letter-spacing:.06em;padding:.875rem 1.25rem;background:none;border:none;border-bottom:2px solid transparent;cursor:pointer;color:#9B9B9B;transition:all .18s;display:flex;align-items:center;gap:.4rem;margin-bottom:-1px}
  .tab-btn:hover{color:#0D1F3C}
  .tab-btn.active{color:#0D1F3C;border-bottom-color:#C9A455}
  .tx-row{display:flex;align-items:center;justify-content:space-between;padding:1rem 1.75rem;border-bottom:1px solid #F5F4F0;transition:background .15s}
  .tx-row:last-child{border-bottom:none}
  .tx-row:hover{background:#FAFAF8}
  .status-badge{font-size:.62rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:.2rem .65rem;display:inline-flex;align-items:center;gap:.3rem}
  .s-pending  {color:#D97706;background:rgba(217,119,6,.08);border:1px solid rgba(217,119,6,.2)}
  .s-authorized{color:#2563EB;background:rgba(37,99,235,.08);border:1px solid rgba(37,99,235,.2)}
  .s-completed {color:#059669;background:rgba(5,150,105,.08);border:1px solid rgba(5,150,105,.2)}
  .s-rejected  {color:#DC2626;background:rgba(220,38,38,.08);border:1px solid rgba(220,38,38,.2)}
  .s-reversal  {color:#7C3AED;background:rgba(124,58,237,.08);border:1px solid rgba(124,58,237,.2)}
  .act-btn{width:30px;height:30px;display:flex;align-items:center;justify-content:center;border:1px solid #E8E5DF;background:transparent;cursor:pointer;transition:all .18s}
  .act-btn.ok:hover{border-color:#059669;color:#059669;background:rgba(5,150,105,.06)}
  .act-btn.no:hover{border-color:#DC2626;color:#DC2626;background:rgba(220,38,38,.06)}
  .refresh-btn{font-family:'DM Sans',sans-serif;font-size:.72rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:.5rem 1rem;background:transparent;border:1px solid #D6D3CD;cursor:pointer;color:#6B6B6B;display:flex;align-items:center;gap:.4rem;transition:all .18s}
  .refresh-btn:hover{border-color:#0D1F3C;color:#0D1F3C}
  .pg-empty{display:flex;flex-direction:column;align-items:center;gap:.75rem;padding:3rem;color:#9B9B9B;text-align:center}
`;

const fmt   = (a) => new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(a);
const fmtDt = (d) => new Date(d).toLocaleString('es-MX',{dateStyle:'short',timeStyle:'short'});

const statusMap = {
  pending:    {label:'Pendiente',  cls:'s-pending',   Icon:Clock},
  authorized: {label:'Autorizada', cls:'s-authorized', Icon:CheckCircle},
  completed:  {label:'Completada', cls:'s-completed',  Icon:CheckCircle},
  rejected:   {label:'Rechazada',  cls:'s-rejected',   Icon:XCircle},
  reversal:   {label:'Reversión',  cls:'s-reversal',   Icon:RefreshCw},
};

const TxRow = ({ tx, processingId, onAuthorize, onReject }) => {
  const s = statusMap[tx.status] || statusMap.pending;
  return (
    <div className="tx-row">
      <div style={{flex:1,minWidth:0,marginRight:'1rem'}}>
        <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'.875rem',fontWeight:600,color:'#0D1F3C',margin:0,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{tx.description}</p>
        <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'.72rem',color:'#9B9B9B',margin:'3px 0 0'}}>
          {tx.first_name} {tx.last_name} → {tx.recipient_name||'N/A'} · {fmtDt(tx.created_at)}
        </p>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:'1rem',flexShrink:0}}>
        <span className={`status-badge ${s.cls}`}><s.Icon style={{width:10,height:10}}/>{s.label}</span>
        <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.05rem',fontWeight:700,color:tx.type==='credit'?'#059669':'#0D1F3C',minWidth:90,textAlign:'right'}}>
          {tx.type==='credit'?'+':'-'}{fmt(tx.amount)}
        </span>
        {tx.status==='pending' && (
          <div style={{display:'flex',gap:'.3rem'}}>
            <button className="act-btn ok" style={{color:'#059669'}} onClick={()=>onAuthorize(tx)} disabled={processingId===tx.id} title="Autorizar">
              {processingId===tx.id ? <Loader2 style={{width:12,height:12,animation:'spin 1s linear infinite'}}/> : <CheckCircle style={{width:12,height:12}}/>}
            </button>
            <button className="act-btn no" style={{color:'#DC2626'}} onClick={()=>onReject(tx)} disabled={processingId===tx.id} title="Rechazar">
              <XCircle style={{width:12,height:12}}/>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const TABS = [
  {key:'pending',    label:'Pendientes',  Icon:Clock},
  {key:'authorized', label:'Autorizadas', Icon:CheckCircle},
  {key:'rejected',   label:'Rechazadas',  Icon:XCircle},
  {key:'all',        label:'Todas',       Icon:Activity},
];

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('pending');
  const [processingId, setProcessingId] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('transactions_with_user_details').select('*').order('created_at',{ascending:false});
    if (error) toast({title:"Error",description:error.message,variant:"destructive"});
    else setTransactions(data);
    setLoading(false);
  },[]);

  useEffect(()=>{ loadData(); },[loadData]);

  const handleAuthorize = async (tx) => {
    setProcessingId(tx.id);
    try {
      const { data, error } = await supabase.functions.invoke('process-transaction',{
        body:{transactionId:tx.id, status:'authorized', amount:tx.amount, userId:tx.user_id}
      });
      if (error) throw error;
      toast({title:"Éxito",description:data.message||"Transacción autorizada."});
      loadData();
    } catch(e) { toast({title:"Error",description:e.message,variant:"destructive"}); }
    finally { setProcessingId(null); }
  };

  const handleReject = async (tx) => {
    setProcessingId(tx.id);
    try {
      const { error } = await supabase.rpc('reject_and_reverse_transaction',{
        p_transaction_id:tx.id, p_user_id:tx.user_id, p_amount_to_return:tx.amount
      });
      if (error) throw error;
      toast({title:"Rechazada",description:"Transacción rechazada y saldo devuelto."});
      loadData();
    } catch(e) { toast({title:"Error",description:e.message,variant:"destructive"}); }
    finally { setProcessingId(null); }
  };

  const visible = tab==='all' ? transactions : transactions.filter(t=>t.status===tab);

  return (
    <>
      <Helmet><title>Transacciones — Admin</title></Helmet>
      <style>{S}</style>

      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} style={{marginBottom:'2rem'}}>
        <div className="pg-tag">Operaciones</div>
        <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'2rem',fontWeight:700,color:'#0D1F3C',lineHeight:1.1,margin:'0 0 .25rem'}}>Monitor de Transacciones</h1>
        <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'.875rem',color:'#9B9B9B'}}>Visualiza y gestiona todas las transacciones del sistema.</p>
      </motion.div>

      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.05}}>
        <div className="pg-card">
          <div className="pg-card-hd">
            <div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.15rem',fontWeight:700,color:'#0D1F3C'}}>Historial</div>
              <div style={{fontSize:'.8rem',color:'#9B9B9B',marginTop:'.15rem'}}>{transactions.length} transacciones totales</div>
            </div>
            <button className="refresh-btn" onClick={loadData} disabled={loading}>
              <RefreshCw style={{width:13,height:13,animation:loading?'spin 1s linear infinite':undefined}}/>
              Refrescar
            </button>
          </div>

          <div className="tabs-row">
            {TABS.map(t => (
              <button key={t.key} className={`tab-btn ${tab===t.key?'active':''}`} onClick={()=>setTab(t.key)}>
                <t.Icon style={{width:13,height:13}}/>
                {t.label}
                {t.key!=='all' && (
                  <span style={{background:tab===t.key?'#0D1F3C':'#F0EDE8',color:tab===t.key?'#C9A455':'#9B9B9B',fontSize:'.62rem',fontWeight:700,padding:'.1rem .4rem',borderRadius:99,minWidth:18,textAlign:'center'}}>
                    {transactions.filter(x=>x.status===t.key).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div>
            {loading
              ? <div style={{display:'flex',justifyContent:'center',padding:'3rem'}}><Loader2 style={{color:'#C9A455',width:28,height:28,animation:'spin 1s linear infinite'}}/></div>
              : visible.length === 0
                ? <div className="pg-empty"><Activity style={{width:36,height:36,color:'#C9A455'}}/><p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'.875rem'}}>No hay transacciones aquí.</p></div>
                : visible.map(tx => <TxRow key={tx.id} tx={tx} processingId={processingId} onAuthorize={handleAuthorize} onReject={handleReject}/>)
            }
          </div>
        </div>
      </motion.div>
    </>
  );
};
export default AdminTransactions;