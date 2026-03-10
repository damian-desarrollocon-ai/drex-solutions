import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { toast } from '@/components/ui/use-toast';
import AdminStats from '@/components/admin/AdminStats';
import { Activity, Loader2, Search, ArrowUpRight, ArrowDownLeft, Shield } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { Input } from '@/components/ui/input';
import UserList from '@/components/admin/UserList';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700;400i&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  .adm-section-tag { font-size:0.7rem; font-weight:700; letter-spacing:0.15em; text-transform:uppercase; color:#B8892E; display:flex; align-items:center; gap:0.5rem; margin-bottom:0.4rem; }
  .adm-section-tag::before { content:''; width:20px; height:2px; background:#B8892E; }

  .adm-card { background:#fff; border:1px solid #E8E5DF; position:relative; overflow:hidden; margin-bottom:1.5rem; }
  .adm-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,#C9A455,rgba(201,164,85,0.15)); }
  .adm-card-header { padding:1.5rem 1.75rem 1rem; border-bottom:1px solid #F0EDE8; }
  .adm-card-title { font-family:'Cormorant Garamond',serif; font-size:1.2rem; font-weight:700; color:#0D1F3C; }
  .adm-card-sub { font-size:0.8rem; color:#9B9B9B; font-weight:400; margin-top:0.2rem; }
  .adm-card-body { padding:1.5rem 1.75rem; }

  .adm-search-wrap { position:relative; margin-top:1rem; }
  .adm-search-input { font-family:'DM Sans',sans-serif !important; font-size:0.875rem !important; border-radius:0 !important; border:1px solid #D6D3CD !important; background:#FAFAF8 !important; color:#0D1F3C !important; height:42px !important; padding-left:2.5rem !important; transition:border-color 0.2s !important; }
  .adm-search-input:focus { border-color:#C9A455 !important; box-shadow:0 0 0 2px rgba(201,164,85,0.12) !important; outline:none !important; }

  .adm-tx-row { display:flex; align-items:center; justify-content:space-between; padding:0.875rem 0; border-bottom:1px solid #F5F4F0; }
  .adm-tx-row:last-child { border-bottom:none; }
  .adm-tx-icon-credit { width:40px; height:40px; background:rgba(5,150,105,0.1); border:1px solid rgba(5,150,105,0.2); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .adm-tx-icon-debit { width:40px; height:40px; background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.15); display:flex; align-items:center; justify-content:center; flex-shrink:0; }

  .adm-btn-outline { font-family:'DM Sans',sans-serif; font-size:0.75rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; padding:0.6rem 1.5rem; background:transparent; color:#0D1F3C; border:1px solid #0D1F3C; cursor:pointer; transition:all 0.25s; }
  .adm-btn-outline:hover { background:#0D1F3C; color:#fff; }

  .adm-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:3rem 0; color:#9B9B9B; gap:0.75rem; text-align:center; }
  .adm-loading { min-height:80vh; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1rem; }
`;

// ── Actividad reciente ──────────────────────────────────────────
const RecentActivity = ({ transactions, loading }) => {
  const fmt = (a) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(a);

  if (loading) return (
    <div className="adm-empty">
      <Loader2 style={{ width:'32px', height:'32px', color:'#C9A455', animation:'spin 1s linear infinite' }} />
    </div>
  );

  if (!transactions || transactions.length === 0) return (
    <div className="adm-empty">
      <div style={{ width:'48px', height:'48px', background:'#0D1F3C', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <Activity style={{ color:'#C9A455', width:'20px', height:'20px' }} />
      </div>
      <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.875rem', color:'#9B9B9B' }}>
        No hay actividad reciente en el sistema.
      </p>
    </div>
  );

  return (
    <div>
      {transactions.map((tx) => (
        <div key={tx.id} className="adm-tx-row">
          <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
            <div className={tx.type === 'credit' ? 'adm-tx-icon-credit' : 'adm-tx-icon-debit'}>
              {tx.type === 'credit'
                ? <ArrowDownLeft style={{ width:'16px', height:'16px', color:'#059669' }} />
                : <ArrowUpRight  style={{ width:'16px', height:'16px', color:'#DC2626' }} />
              }
            </div>
            <div>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.875rem', fontWeight:600, color:'#0D1F3C', margin:0 }}>
                {tx.description}
              </p>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.75rem', color:'#9B9B9B', margin:'2px 0 0' }}>
                {tx.first_name || 'N/A'}
              </p>
            </div>
          </div>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.1rem', fontWeight:700, color: tx.type === 'credit' ? '#059669' : '#0D1F3C' }}>
            {tx.type === 'credit' ? '+' : '-'}{fmt(tx.amount)}
          </div>
        </div>
      ))}
    </div>
  );
};

// ── AdminDashboard ──────────────────────────────────────────────
const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, userProfile, loading: authLoading } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ totalUsers:0, totalBalance:0, totalTransactions:0, pendingApprovals:0 });
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const [profilesRes, transactionsRes, pendingRes] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('transactions_with_user_details').select('*').order('created_at', { ascending: false }).limit(5),
      supabase.from('transactions').select('*', { count: 'exact', head: true }).eq('status', 'pending')
    ]);

    const { data: profilesData, error: profilesError } = profilesRes;
    if (profilesError) {
      toast({ title: "Error", description: "No se pudieron cargar los usuarios.", variant: "destructive" });
      setUsers([]);
    } else {
      setUsers(profilesData);
      setFilteredUsers(profilesData);
      const totalBalance = profilesData.reduce((sum, u) => sum + (Number(u.balance) || 0), 0);
      setStats(prev => ({ ...prev, totalUsers: profilesData.length, totalBalance }));
    }

    const { data: transactionsData, error: transactionsError } = transactionsRes;
    if (transactionsError) {
      toast({ title: "Error", description: "No se pudo cargar la actividad reciente.", variant: "destructive" });
    } else {
      setRecentTransactions(transactionsData);
      const { count: totalTxCount } = await supabase.from('transactions').select('*', { count: 'exact', head: true });
      setStats(prev => ({ ...prev, totalTransactions: totalTxCount || 0 }));
    }

    setStats(prev => ({ ...prev, pendingApprovals: pendingRes.count || 0 }));
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!authLoading) {
      if (!user || userProfile?.role !== 'admin') {
        toast({ title: "Acceso denegado", description: "No tienes permisos.", variant: "destructive" });
        navigate('/login');
      } else {
        loadData();
      }
    }
  }, [user, userProfile, authLoading, navigate, loadData]);

  useEffect(() => {
    setFilteredUsers(users.filter(u =>
      u.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.account_number?.includes(searchTerm)
    ));
  }, [searchTerm, users]);

  const handleUpdateUser = async (userId, updatedData) => {
    const { error } = await supabase.from('profiles').update(updatedData).eq('id', userId);
    if (error) toast({ title: "Error", description: `No se pudo actualizar: ${error.message}`, variant: "destructive" });
    else { toast({ title: "Éxito", description: "Usuario actualizado." }); loadData(); }
  };

  const handleUpdateBalance = async (userId, newBalance, description) => {
    const { data: userData, error: fetchError } = await supabase.from('profiles').select('balance').eq('id', userId).single();
    if (fetchError || !userData) return toast({ title: "Error", description: "No se pudo obtener el saldo.", variant: "destructive" });
    const { error: updateError } = await supabase.from('profiles').update({ balance: parseFloat(newBalance) || 0 }).eq('id', userId);
    if (updateError) {
      toast({ title: "Error", description: `No se pudo actualizar el saldo: ${updateError.message}`, variant: "destructive" });
    } else {
      const diff = newBalance - userData.balance;
      await supabase.from('transactions').insert({
        user_id: userId,
        amount: Math.abs(diff),
        type: diff > 0 ? 'credit' : 'debit',
        description: description || 'Ajuste por administrador',
        status: 'completed',
      });
      toast({ title: "Éxito", description: "Saldo actualizado." });
      loadData();
    }
  };

  const handleUpdateReceiverAccount = (userId, val) => handleUpdateUser(userId, { receiver_account: val });

  const handleToggleStatus = (userId) => {
    const u = users.find(u => u.id === userId);
    if (u) handleUpdateUser(userId, { is_active: !(u.is_active !== false) });
  };

  // ✅ CORREGIDO: usa RPC en lugar de Edge Function
  const handleDeleteUser = async (userId) => {
    const { error } = await supabase.rpc('delete_user_by_id', {
      user_id: userId
    });
    if (error) return toast({ title: "Error", description: `No se pudo eliminar: ${error.message}`, variant: "destructive" });
    toast({ title: "Usuario eliminado", description: "El usuario ha sido eliminado correctamente." });
    loadData();
  };

  // ── Loading ──
  if (authLoading || loading) return (
    <>
      <style>{STYLES}</style>
      <div className="adm-loading">
        <div style={{ width:'52px', height:'52px', border:'1px solid rgba(201,164,85,0.4)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Shield style={{ color:'#C9A455', width:'22px', height:'22px' }} />
        </div>
        <Loader2 style={{ color:'#C9A455', width:'26px', height:'26px', animation:'spin 1s linear infinite' }} />
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.78rem', color:'#9B9B9B', letterSpacing:'0.1em', textTransform:'uppercase' }}>
          Cargando datos...
        </p>
      </div>
    </>
  );

  return (
    <>
      <Helmet><title>Dashboard — Drex Solutions Admin</title></Helmet>
      <style>{STYLES}</style>

      {/* ── Page header ── */}
      <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} style={{ marginBottom:'2rem' }}>
        <div className="adm-section-tag">Resumen General</div>
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'2rem', fontWeight:700, color:'#0D1F3C', lineHeight:1.1, margin:'0 0 0.25rem' }}>
          Visión General del Sistema
        </h1>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.875rem', color:'#9B9B9B', fontWeight:400 }}>
          Gestión y monitoreo en tiempo real de todos los clientes y operaciones.
        </p>
      </motion.div>

      {/* ── Stats ── */}
      <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.05 }} style={{ marginBottom:'2rem' }}>
        <AdminStats stats={stats} />
      </motion.div>

      {/* ── Tabla clientes ── */}
      <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}>
        <div className="adm-card">
          <div className="adm-card-header">
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
              <div>
                <div className="adm-section-tag" style={{ marginBottom:'0.3rem' }}>Base de Clientes</div>
                <div className="adm-card-title">Gestión de Usuarios</div>
                <div className="adm-card-sub">Busca, edita y gestiona todos los clientes del sistema.</div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', paddingTop:'0.25rem' }}>
                <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.75rem', fontWeight:700, color:'#0D1F3C' }}>
                  {filteredUsers.length}
                </span>
                <span style={{ fontSize:'0.72rem', color:'#9B9B9B', lineHeight:1.3 }}>
                  usuarios<br/>encontrados
                </span>
              </div>
            </div>
            <div className="adm-search-wrap">
              <Search style={{ position:'absolute', left:'0.75rem', top:'50%', transform:'translateY(-50%)', width:'16px', height:'16px', color:'#9B9B9B' }} />
              <Input
                placeholder="Buscar por nombre, email o número de cuenta..."
                className="adm-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <UserList
              users={filteredUsers}
              onUpdateBalance={handleUpdateBalance}
              onUpdateReceiverAccount={handleUpdateReceiverAccount}
              onToggleStatus={handleToggleStatus}
              onDeleteUser={handleDeleteUser}
              onUpdateUser={handleUpdateUser}
            />
          </div>
        </div>
      </motion.div>

      {/* ── Actividad reciente ── */}
      <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}>
        <div className="adm-card">
          <div className="adm-card-header">
            <div className="adm-section-tag" style={{ marginBottom:'0.3rem' }}>Operaciones</div>
            <div className="adm-card-title">Actividad Reciente</div>
            <div className="adm-card-sub">Últimas transacciones registradas en el sistema.</div>
          </div>
          <div className="adm-card-body">
            <RecentActivity transactions={recentTransactions} loading={loading} />
            <div style={{ marginTop:'1.5rem', paddingTop:'1.25rem', borderTop:'1px solid #F0EDE8', textAlign:'center' }}>
              <button className="adm-btn-outline" onClick={() => navigate('/admin/transactions')}>
                Ver Todas las Transacciones
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default AdminDashboard;