import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { toast } from '@/components/ui/use-toast';
import AdminStats from '@/components/admin/AdminStats';
import { Activity, Loader2, ArrowUpRight, ArrowDownLeft, Users, Shield } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient.js';

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  .pg-tag{font-size:.7rem;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:#B8892E;display:flex;align-items:center;gap:.5rem;margin-bottom:.4rem}
  .pg-tag::before{content:'';width:20px;height:2px;background:#B8892E}
  .pg-card{background:#fff;border:1px solid #E8E5DF;position:relative;overflow:hidden;margin-bottom:1.5rem}
  .pg-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#C9A455,rgba(201,164,85,.15))}
  .pg-card-hd{padding:1.25rem 1.75rem 1rem;border-bottom:1px solid #F0EDE8;display:flex;align-items:center;justify-content:space-between}
  .pg-card-bd{padding:1.25rem 1.75rem}
  .pg-title{font-family:'Cormorant Garamond',serif;font-size:1.15rem;font-weight:700;color:#0D1F3C}
  .pg-sub{font-size:.8rem;color:#9B9B9B;margin-top:.15rem}
  .pg-link{font-family:'DM Sans',sans-serif;font-size:.72rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#C9A455;background:none;border:none;cursor:pointer;text-decoration:none}
  .pg-link:hover{color:#0D1F3C}
  .tx-row{display:flex;align-items:center;justify-content:space-between;padding:.75rem 0;border-bottom:1px solid #F5F4F0}
  .tx-row:last-child{border-bottom:none}
  .tx-ic{width:36px;height:36px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .usr-row{display:flex;align-items:center;justify-content:space-between;padding:.75rem 0;border-bottom:1px solid #F5F4F0}
  .usr-row:last-child{border-bottom:none}
  .usr-av{width:36px;height:36px;background:#0D1F3C;display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .pg-empty{display:flex;flex-direction:column;align-items:center;gap:.75rem;padding:2.5rem 0;color:#9B9B9B;text-align:center}
  .pg-loading{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:4rem;gap:1rem}
`;

const fmt   = (a) => new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(a);
const fmtDt = (d) => new Date(d).toLocaleDateString('es-MX',{day:'2-digit',month:'short',year:'numeric'});

const RecentActivity = ({ transactions, loading }) => {
  if (loading) return <div className="pg-loading"><Loader2 style={{color:'#C9A455',width:24,height:24,animation:'spin 1s linear infinite'}}/></div>;
  if (!transactions?.length) return (
    <div className="pg-empty">
      <div style={{width:44,height:44,background:'#0D1F3C',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <Activity style={{color:'#C9A455',width:18,height:18}}/>
      </div>
      <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'.85rem'}}>No hay actividad reciente.</p>
    </div>
  );
  return (
    <div>
      {transactions.map(tx => (
        <div key={tx.id} className="tx-row">
          <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
            <div className="tx-ic" style={{background:tx.type==='credit'?'rgba(5,150,105,.1)':'rgba(239,68,68,.08)',border:`1px solid ${tx.type==='credit'?'rgba(5,150,105,.2)':'rgba(239,68,68,.15)'}`}}>
              {tx.type==='credit'
                ? <ArrowDownLeft style={{width:14,height:14,color:'#059669'}}/>
                : <ArrowUpRight  style={{width:14,height:14,color:'#DC2626'}}/>}
            </div>
            <div>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'.85rem',fontWeight:600,color:'#0D1F3C',margin:0}}>{tx.description}</p>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'.72rem',color:'#9B9B9B',margin:'2px 0 0'}}>{tx.first_name||'N/A'}</p>
            </div>
          </div>
          <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.05rem',fontWeight:700,color:tx.type==='credit'?'#059669':'#0D1F3C'}}>
            {tx.type==='credit'?'+':'-'}{fmt(tx.amount)}
          </span>
        </div>
      ))}
    </div>
  );
};

const RecentUsers = ({ users, loading }) => {
  if (loading) return <div className="pg-loading"><Loader2 style={{color:'#C9A455',width:24,height:24,animation:'spin 1s linear infinite'}}/></div>;
  if (!users?.length) return (
    <div className="pg-empty">
      <div style={{width:44,height:44,background:'#0D1F3C',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <Users style={{color:'#C9A455',width:18,height:18}}/>
      </div>
      <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'.85rem'}}>No hay clientes nuevos.</p>
    </div>
  );
  return (
    <div>
      {users.map(u => (
        <div key={u.id} className="usr-row">
          <div style={{display:'flex',alignItems:'center',gap:'.875rem'}}>
            <div className="usr-av">
              <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:'.62rem',fontWeight:700,color:'#C9A455'}}>{u.first_name?.[0]}{u.last_name?.[0]}</span>
            </div>
            <div>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'.85rem',fontWeight:600,color:'#0D1F3C',margin:0}}>{u.first_name} {u.last_name}</p>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'.72rem',color:'#9B9B9B',margin:'2px 0 0'}}>{u.email}</p>
            </div>
          </div>
          <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:'.72rem',color:'#9B9B9B'}}>{fmtDt(u.created_at)}</span>
        </div>
      ))}
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, userProfile, loading: authLoading } = useAuth();
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [stats, setStats] = useState({ totalUsers:0, totalBalance:0, totalTransactions:0, pendingApprovals:0 });
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const [profilesRes, transactionsRes, pendingRes, recentUsersRes] = await Promise.all([
      supabase.from('profiles').select('id, balance'),
      supabase.from('transactions_with_user_details').select('*').order('created_at',{ascending:false}).limit(5),
      supabase.from('transactions').select('*',{count:'exact',head:true}).eq('status','pending'),
      supabase.from('profiles_with_email').select('*').order('created_at',{ascending:false}).limit(5),
    ]);
    if (!profilesRes.error) {
      const totalBalance = profilesRes.data.reduce((s,u)=>s+(Number(u.balance)||0),0);
      setStats(p=>({...p,totalUsers:profilesRes.data.length,totalBalance}));
    }
    if (!recentUsersRes.error) setRecentUsers(recentUsersRes.data);
    if (!transactionsRes.error) {
      setRecentTransactions(transactionsRes.data);
      const {count} = await supabase.from('transactions').select('*',{count:'exact',head:true});
      setStats(p=>({...p,totalTransactions:count||0}));
    }
    setStats(p=>({...p,pendingApprovals:pendingRes.count||0}));
    setLoading(false);
  },[]);

  useEffect(()=>{
    if(!authLoading){
      if(!user||userProfile?.role!=='admin'){ toast({title:"Acceso denegado",variant:"destructive"}); navigate('/login'); }
      else loadData();
    }
  },[user,userProfile,authLoading,navigate,loadData]);

  if(authLoading||loading) return (
    <>
      <style>{S}</style>
      <div className="pg-loading">
        <div style={{width:52,height:52,border:'1px solid rgba(201,164,85,.4)',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <Shield style={{color:'#C9A455',width:22,height:22}}/>
        </div>
        <Loader2 style={{color:'#C9A455',width:26,height:26,animation:'spin 1s linear infinite'}}/>
      </div>
    </>
  );

  return (
    <>
      <Helmet><title>Dashboard — Admin</title></Helmet>
      <style>{S}</style>

      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} style={{marginBottom:'2rem'}}>
        <div className="pg-tag">Resumen General</div>
        <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'2rem',fontWeight:700,color:'#0D1F3C',lineHeight:1.1,margin:'0 0 .25rem'}}>Centro de Control</h1>
        <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'.875rem',color:'#9B9B9B'}}>Visión general y gestión del sistema.</p>
      </motion.div>

      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.05}} style={{marginBottom:'2rem'}}>
        <AdminStats stats={stats}/>
      </motion.div>

      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.1}}
        style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))',gap:'1.5rem'}}>

        <div className="pg-card">
          <div className="pg-card-hd">
            <div><div className="pg-title">Nuevos Clientes</div><div className="pg-sub">Últimos usuarios registrados</div></div>
            <button className="pg-link" onClick={()=>navigate('/admin/users')}>Ver todos →</button>
          </div>
          <div className="pg-card-bd"><RecentUsers users={recentUsers} loading={loading}/></div>
        </div>

        <div className="pg-card">
          <div className="pg-card-hd">
            <div><div className="pg-title">Actividad Reciente</div><div className="pg-sub">Últimas transacciones del sistema</div></div>
            <button className="pg-link" onClick={()=>navigate('/admin/transactions')}>Ver todas →</button>
          </div>
          <div className="pg-card-bd"><RecentActivity transactions={recentTransactions} loading={loading}/></div>
        </div>
      </motion.div>
    </>
  );
};
export default AdminDashboard;