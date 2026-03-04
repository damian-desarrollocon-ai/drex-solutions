import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/lib/customSupabaseClient.js';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, AlertCircle, Info, PlayCircle, Settings } from 'lucide-react';

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=DM+Sans:wght@400;500;600;700&display=swap');
  .pg-tag{font-size:.7rem;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:#B8892E;display:flex;align-items:center;gap:.5rem;margin-bottom:.4rem}
  .pg-tag::before{content:'';width:20px;height:2px;background:#B8892E}
  .pg-card{background:#fff;border:1px solid #E8E5DF;position:relative;overflow:hidden;margin-bottom:1.5rem}
  .pg-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#C9A455,rgba(201,164,85,.15))}
  .pg-card-hd{padding:1.25rem 1.75rem 1rem;border-bottom:1px solid #F0EDE8}
  .pg-card-bd{padding:1.25rem 1.75rem}
  .sw-row{display:flex;align-items:flex-start;justify-content:space-between;padding:1rem 1.25rem;border:1px solid #E8E5DF;margin-bottom:.5rem}
  .sw-row.warn{border-color:rgba(217,119,6,.35);background:rgba(253,246,236,.6)}
  .info-box{padding:1rem 1.25rem;border:1px solid #E8E5DF;background:#FAFAF8;margin-bottom:1rem}
  .info-box.warn{border-color:rgba(217,119,6,.3);background:rgba(253,246,236,.5)}
  .info-box.info{border-color:rgba(37,99,235,.2);background:rgba(239,246,255,.5)}
  .step-num{font-family:'Cormorant Garamond',serif;font-size:1.1rem;font-weight:700;flex-shrink:0;margin-top:.1rem}
  .action-btn{font-family:'DM Sans',sans-serif;font-size:.75rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:.65rem 1.25rem;border:none;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:.5rem;width:100%}
  .action-btn.primary{background:#0D1F3C;color:#fff}.action-btn.primary:hover:not(:disabled){background:#C9A455;color:#0D1F3C}
  .action-btn.secondary{background:transparent;border:1px solid #D6D3CD;color:#6B6B6B}.action-btn.secondary:hover:not(:disabled){border-color:#0D1F3C;color:#0D1F3C}
  .action-btn:disabled{opacity:.6;cursor:not-allowed}
  .active-chip{font-size:.6rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#059669;background:rgba(5,150,105,.1);border:1px solid rgba(5,150,105,.25);padding:.15rem .5rem;display:inline-block;margin-left:.5rem}
`;

const AdminSettings = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [marking, setMarking] = useState(false);
  const { toast } = useToast();

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase.from('profiles').select('id,automatic_reversal_enabled').eq('id',user.id).single();
      if(error) throw error;
      setProfile(data);
    } catch(e) {
      toast({title:'Error',description:e.message,variant:'destructive'});
    } finally { setLoading(false); }
  },[toast]);

  useEffect(()=>{ fetchProfile(); },[fetchProfile]);

  const handleReversalToggle = async (val) => {
    if(!profile) return;
    setUpdating(true);
    const prev = profile.automatic_reversal_enabled;
    setProfile(p=>({...p,automatic_reversal_enabled:val}));
    try {
      const {data,error} = await supabase.from('profiles').update({automatic_reversal_enabled:val}).eq('id',profile.id).select();
      if(error||!data?.length) throw error||new Error('No se pudo confirmar');
      toast({title:val?'Reversión automática activada':'Reversión automática desactivada'});
      await fetchProfile();
    } catch(e) {
      toast({title:'Error',description:e.message,variant:'destructive'});
      setProfile(p=>({...p,automatic_reversal_enabled:prev}));
    } finally { setUpdating(false); }
  };

  const markTransactions = async () => {
    setMarking(true);
    try {
      const {data,error} = await supabase.functions.invoke('reverse-transactions',{method:'GET'});
      if(error) throw error;
      toast({title:'Transacciones marcadas',description:`${data?.marked||0} transacción(es) marcadas como "en_revision".`});
    } catch(e) { toast({title:'Error',description:e.message,variant:'destructive'}); }
    finally { setMarking(false); }
  };

  const processRefunds = async () => {
    setProcessing(true);
    try {
      const {data,error} = await supabase.rpc('revert_pending_transactions');
      if(error) throw error;
      toast({title:'Reembolsos procesados',description:`${data?.length||0} reembolso(s) procesados.`});
    } catch(e) { toast({title:'Error',description:e.message,variant:'destructive'}); }
    finally { setProcessing(false); }
  };

  const runAll = async () => { await markTransactions(); await new Promise(r=>setTimeout(r,1000)); await processRefunds(); };

  if(loading) return (
    <>
      <style>{S}</style>
      <div style={{display:'flex',justifyContent:'center',padding:'4rem'}}>
        <Loader2 style={{color:'#C9A455',width:28,height:28,animation:'spin 1s linear infinite'}}/>
      </div>
    </>
  );

  if(!profile) return (
    <>
      <style>{S}</style>
      <div style={{padding:'1.5rem',border:'1px solid rgba(220,38,38,.2)',background:'rgba(220,38,38,.04)',display:'flex',gap:'.75rem',alignItems:'flex-start'}}>
        <AlertCircle style={{color:'#DC2626',width:18,height:18,flexShrink:0,marginTop:2}}/>
        <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'.85rem',color:'#DC2626',margin:0}}>No se pudo cargar el perfil del administrador.</p>
      </div>
    </>
  );

  return (
    <>
      <Helmet><title>Ajustes — Admin</title></Helmet>
      <style>{S}</style>

      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} style={{marginBottom:'2rem'}}>
        <div className="pg-tag">Configuración</div>
        <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'2rem',fontWeight:700,color:'#0D1F3C',lineHeight:1.1,margin:'0 0 .25rem'}}>Ajustes del Sistema</h1>
        <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'.875rem',color:'#9B9B9B'}}>Controla las funcionalidades clave de la plataforma.</p>
      </motion.div>

      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.05}}>

        {/* Card 1: Configuración de transacciones */}
        <div className="pg-card">
          <div className="pg-card-hd">
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.15rem',fontWeight:700,color:'#0D1F3C'}}>Configuración de Transacciones</div>
            <div style={{fontSize:'.8rem',color:'#9B9B9B',marginTop:'.15rem'}}>Controla el comportamiento de las transferencias.</div>
          </div>
          <div className="pg-card-bd">
            <div className={`sw-row ${profile.automatic_reversal_enabled?'warn':''}`}>
              <div style={{flex:1,marginRight:'1.5rem'}}>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'.875rem',fontWeight:700,color:'#0D1F3C',margin:'0 0 .25rem'}}>
                  Reversión Automática de Transacciones
                  {profile.automatic_reversal_enabled && <span className="active-chip">Activo</span>}
                </p>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'.78rem',color:'#6B6B6B',margin:0,lineHeight:1.5}}>
                  Cuando está activado, las transferencias se procesan normalmente pero el sistema crea un reembolso automático. Útil para modo demo.
                </p>
                <div style={{display:'flex',alignItems:'center',gap:'.4rem',marginTop:'.5rem'}}>
                  <div style={{width:7,height:7,borderRadius:'50%',background:profile.automatic_reversal_enabled?'#22C55E':'#D1D5DB'}}/>
                  <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:'.7rem',fontWeight:600,color:'#9B9B9B',textTransform:'uppercase',letterSpacing:'.08em'}}>
                    {profile.automatic_reversal_enabled?'Activado':'Desactivado'}
                  </span>
                </div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:'.75rem',flexShrink:0}}>
                {updating && <Loader2 style={{width:14,height:14,color:'#C9A455',animation:'spin 1s linear infinite'}}/>}
                <Switch checked={profile.automatic_reversal_enabled} onCheckedChange={handleReversalToggle} disabled={updating}/>
              </div>
            </div>

            {profile.automatic_reversal_enabled && (
              <div className="info-box warn" style={{display:'flex',gap:'.75rem',alignItems:'flex-start'}}>
                <Info style={{width:15,height:15,color:'#D97706',flexShrink:0,marginTop:2}}/>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'.78rem',color:'#92400E',margin:0,lineHeight:1.5}}>
                  <strong>Modo de reversión activo.</strong> Las transferencias generarán dos movimientos: el débito y un crédito de reembolso automático.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Gestión de reembolsos */}
        <div className="pg-card">
          <div className="pg-card-hd">
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.15rem',fontWeight:700,color:'#0D1F3C'}}>Gestión de Reembolsos</div>
            <div style={{fontSize:'.8rem',color:'#9B9B9B',marginTop:'.15rem'}}>Marca y procesa reembolsos de forma manual o automática.</div>
          </div>
          <div className="pg-card-bd">
            <div className="info-box" style={{marginBottom:'1.25rem'}}>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'.78rem',fontWeight:700,color:'#0D1F3C',margin:'0 0 .625rem'}}>¿Cómo funciona?</p>
              {[
                {num:'1.',color:'#2563EB',text:<><strong>Marcar en revisión:</strong> Busca transacciones de usuarios con reversión activada y las marca como <code style={{background:'#F0EDE8',padding:'0 .25rem',fontSize:'.72rem'}}>en_revision</code></>,},
                {num:'2.',color:'#059669',text:<><strong>Procesar reembolsos:</strong> Devuelve el saldo y crea transacciones de crédito para las que están en revisión.</>,},
                {num:'3.',color:'#7C3AED',text:<><strong>Ejecutar todo:</strong> Realiza ambos pasos automáticamente en secuencia.</>,},
              ].map((s,i)=>(
                <div key={i} style={{display:'flex',gap:'.625rem',marginBottom:'.4rem',alignItems:'flex-start'}}>
                  <span className="step-num" style={{color:s.color}}>{s.num}</span>
                  <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'.78rem',color:'#6B6B6B',margin:0,lineHeight:1.5}}>{s.text}</p>
                </div>
              ))}
            </div>

            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:'.75rem'}}>
              <button className="action-btn secondary" onClick={markTransactions} disabled={marking||processing}>
                {marking ? <Loader2 style={{width:13,height:13,animation:'spin 1s linear infinite'}}/> : <AlertCircle style={{width:13,height:13}}/>}
                1. Marcar Revisión
              </button>
              <button className="action-btn secondary" onClick={processRefunds} disabled={processing||marking}>
                {processing ? <Loader2 style={{width:13,height:13,animation:'spin 1s linear infinite'}}/> : <PlayCircle style={{width:13,height:13}}/>}
                2. Procesar Reembolsos
              </button>
              <button className="action-btn primary" onClick={runAll} disabled={processing||marking}>
                {(processing||marking) ? <Loader2 style={{width:13,height:13,animation:'spin 1s linear infinite'}}/> : <PlayCircle style={{width:13,height:13}}/>}
                Ejecutar Todo
              </button>
            </div>

            <div className="info-box info" style={{marginTop:'.875rem',display:'flex',gap:'.625rem',alignItems:'flex-start'}}>
              <Info style={{width:14,height:14,color:'#2563EB',flexShrink:0,marginTop:2}}/>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'.75rem',color:'#1E40AF',margin:0,lineHeight:1.5}}>
                <strong>Recomendación:</strong> Usa "Ejecutar Todo" para el proceso completo, o los botones individuales si necesitas control paso a paso.
              </p>
            </div>
          </div>
        </div>

      </motion.div>
    </>
  );
};
export default AdminSettings;