import React from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, Activity, AlertTriangle } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, accent, delay }) => (
  <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay }}
    style={{
      background:'#fff', border:'1px solid #E8E5DF', position:'relative',
      overflow:'hidden', padding:'1.5rem 1.75rem'
    }}
  >
    <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:`linear-gradient(90deg, ${accent}, transparent)` }} />
    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'1rem' }}>
      <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'#9B9B9B' }}>
        {title}
      </span>
      <div style={{ width:'32px', height:'32px', background:'#0D1F3C', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        <Icon style={{ width:'14px', height:'14px', color: accent }} />
      </div>
    </div>
    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'2rem', fontWeight:700, color:'#0D1F3C', lineHeight:1 }}>
      {value}
    </div>
  </motion.div>
);

const AdminStats = ({ stats }) => {
  const fmt = (a) => new Intl.NumberFormat('es-MX', { style:'currency', currency:'MXN' }).format(a);
  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=DM+Sans:wght@400;700&display=swap');`}</style>
      <div style={{ display:'grid', gap:'1rem', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', marginBottom:'2rem' }}>
        <StatCard title="Total Clientes"   value={stats.totalUsers}            icon={Users}         accent="#C9A455" delay={0.05} />
        <StatCard title="Balance Total"    value={fmt(stats.totalBalance)}     icon={DollarSign}    accent="#22C55E" delay={0.1}  />
        <StatCard title="Transacciones"    value={stats.totalTransactions}     icon={Activity}      accent="#60A5FA" delay={0.15} />
        <StatCard title="Pendientes"       value={stats.pendingApprovals}      icon={AlertTriangle} accent="#F59E0B" delay={0.2}  />
      </div>
    </>
  );
};

export default AdminStats;