import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Loader2, Search } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient.js';
import { toast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import BalanceEditDialog from '@/components/admin/BalanceEditDialog';

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=DM+Sans:wght@400;500;600;700&display=swap');
  .pg-tag{font-size:.7rem;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:#B8892E;display:flex;align-items:center;gap:.5rem;margin-bottom:.4rem}
  .pg-tag::before{content:'';width:20px;height:2px;background:#B8892E}
  .pg-card{background:#fff;border:1px solid #E8E5DF;position:relative;overflow:hidden}
  .pg-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#C9A455,rgba(201,164,85,.15))}
  .pg-card-hd{padding:1.25rem 1.75rem 1rem;border-bottom:1px solid #F0EDE8}
  .pg-card-bd{padding:0}
  .pg-search{position:relative;margin-top:1rem}
  .pg-search-input{font-family:'DM Sans',sans-serif!important;border-radius:0!important;border:1px solid #D6D3CD!important;background:#FAFAF8!important;color:#0D1F3C!important;height:42px!important;padding-left:2.5rem!important}
  .pg-search-input:focus{border-color:#C9A455!important;box-shadow:0 0 0 2px rgba(201,164,85,.12)!important;outline:none!important}
  .bal-row{display:flex;align-items:center;justify-content:space-between;padding:1rem 1.75rem;border-bottom:1px solid #F0EDE8;transition:background .15s}
  .bal-row:last-child{border-bottom:none}
  .bal-row:hover{background:#FAFAF8}
  .bal-av{width:38px;height:38px;background:#0D1F3C;border:1px solid rgba(201,164,85,.3);display:flex;align-items:center;justify-content:center;flex-shrink:0}
`;

const AdminBalances = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const fmt = (a) => new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(a);

  const loadData = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('profiles').select('*').order('balance',{ascending:false});
    if (error) toast({title:"Error",description:"No se pudieron cargar los balances.",variant:"destructive"});
    else { setUsers(data); setFilteredUsers(data); }
    setLoading(false);
  },[]);

  useEffect(()=>{ loadData(); },[loadData]);
  useEffect(()=>{
    setFilteredUsers(users.filter(u=>
      u.first_name?.toLowerCase().includes(searchTerm.toLowerCase())||
      u.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
    ));
  },[searchTerm,users]);

  // ✅ CORRECCIÓN: se agrega el parámetro isoDate que mandaba BalanceEditDialog
  //    y se pasa como created_at en el insert de transactions.
  const handleUpdateBalance = async (userId, adjustmentAmount, reason, isoDate) => {
    const user = users.find(u=>u.id===userId);
    if (!user) return;
    const newBalance = (Number(user.balance)||0) + adjustmentAmount;
    const { error } = await supabase.from('profiles').update({balance:newBalance}).eq('id',userId);
    if (error) { toast({title:"Error",description:error.message,variant:"destructive"}); return; }
    await supabase.from('transactions').insert({
      user_id:userId, amount:Math.abs(adjustmentAmount),
      type:adjustmentAmount>=0?'credit':'debit',
      description:`Ajuste administrativo: ${reason}`,
      recipient_name:'System', status:'completed',
      created_at: isoDate  // ✅ CORRECCIÓN: fecha elegida por el admin, no now()
    });
    toast({title:"Éxito",description:"Balance actualizado."});
    loadData();
  };

  return (
    <>
      <Helmet><title>Balances — Admin</title></Helmet>
      <style>{S}</style>

      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} style={{marginBottom:'2rem'}}>
        <div className="pg-tag">Gestión Financiera</div>
        <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'2rem',fontWeight:700,color:'#0D1F3C',lineHeight:1.1,margin:'0 0 .25rem'}}>Control de Balances</h1>
        <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'.875rem',color:'#9B9B9B'}}>Modifica los saldos de los usuarios y registra el motivo del ajuste.</p>
      </motion.div>

      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.05}}>
        <div className="pg-card">
          <div className="pg-card-hd">
            <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between'}}>
              <div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.15rem',fontWeight:700,color:'#0D1F3C'}}>Saldos de Clientes</div>
                <div style={{fontSize:'.8rem',color:'#9B9B9B',marginTop:'.15rem'}}>Ordenados por balance descendente</div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:'.5rem'}}>
                <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.75rem',fontWeight:700,color:'#0D1F3C'}}>{filteredUsers.length}</span>
                <span style={{fontSize:'.72rem',color:'#9B9B9B',lineHeight:1.3}}>clientes</span>
              </div>
            </div>
            <div className="pg-search">
              <Search style={{position:'absolute',left:'.75rem',top:'50%',transform:'translateY(-50%)',width:16,height:16,color:'#9B9B9B'}}/>
              <Input placeholder="Buscar por nombre..." className="pg-search-input" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}/>
            </div>
          </div>
          <div className="pg-card-bd">
            {loading
              ? <div style={{display:'flex',justifyContent:'center',padding:'3rem'}}><Loader2 style={{color:'#C9A455',width:28,height:28,animation:'spin 1s linear infinite'}}/></div>
              : filteredUsers.map(u => (
                <div key={u.id} className="bal-row">
                  <div style={{display:'flex',alignItems:'center',gap:'.875rem'}}>
                    <div className="bal-av">
                      <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:'.62rem',fontWeight:700,color:'#C9A455'}}>{u.first_name?.[0]}{u.last_name?.[0]}</span>
                    </div>
                    <div>
                      <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'.875rem',fontWeight:600,color:'#0D1F3C',margin:0}}>{u.first_name} {u.last_name}</p>
                      <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'.72rem',color:'#9B9B9B',margin:'2px 0 0'}}>••••{u.account_number?.slice(-4)}</p>
                    </div>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:'1.5rem'}}>
                    <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.25rem',fontWeight:700,color:'#0D1F3C'}}>{fmt(u.balance||0)}</span>
                    <BalanceEditDialog user={u} onUpdate={handleUpdateBalance}/>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </motion.div>
    </>
  );
};
export default AdminBalances;