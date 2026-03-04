import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Loader2, UserCheck, UserX, Clock, Eye, ShieldCheck } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/lib/customSupabaseClient.js';
import { toast } from '@/components/ui/use-toast';

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=DM+Sans:wght@400;500;600;700&display=swap');
  .pg-tag{font-size:.7rem;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:#B8892E;display:flex;align-items:center;gap:.5rem;margin-bottom:.4rem}
  .pg-tag::before{content:'';width:20px;height:2px;background:#B8892E}
  .pg-card{background:#fff;border:1px solid #E8E5DF;position:relative;overflow:hidden}
  .pg-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#C9A455,rgba(201,164,85,.15))}
  .pg-card-hd{padding:1.25rem 1.75rem 1rem;border-bottom:1px solid #F0EDE8}
  .vr-row{display:flex;align-items:center;justify-content:space-between;padding:1rem 1.75rem;border-bottom:1px solid #F5F4F0;transition:background .15s;flex-wrap:wrap;gap:.75rem}
  .vr-row:last-child{border-bottom:none}
  .vr-row:hover{background:#FAFAF8}
  .vr-av{width:40px;height:40px;background:#0D1F3C;border:1px solid rgba(201,164,85,.3);display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .vr-btn{font-family:'DM Sans',sans-serif;font-size:.72rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:.5rem 1rem;border:none;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:.4rem}
  .vr-btn.approve{background:#0D1F3C;color:#fff}.vr-btn.approve:hover{background:#059669}
  .vr-btn.reject{background:transparent;border:1px solid #D6D3CD;color:#6B6B6B}.vr-btn.reject:hover{border-color:#DC2626;color:#DC2626}
  .vr-btn.view{background:transparent;border:1px solid #D6D3CD;color:#6B6B6B}.vr-btn.view:hover{border-color:#C9A455;color:#C9A455}
  .pg-empty{display:flex;flex-direction:column;align-items:center;gap:.75rem;padding:4rem;color:#9B9B9B;text-align:center}
`;

const VerificationDetailsDialog = ({ user }) => {
  const [urls, setUrls] = useState({front:null,back:null,selfie:null});
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const fetch = async () => {
      if(!user){setLoading(false);return;}
      setLoading(true);
      const out = {};
      for(const [k,path] of [['front',user.ine_front_url],['back',user.ine_back_url],['selfie',user.selfie_url]]){
        if(path){
          const {data,error} = await supabase.storage.from('verification_documents').createSignedUrl(path,3600);
          if(!error) out[k]=data.signedUrl;
        }
      }
      setUrls(out); setLoading(false);
    };
    fetch();
  },[user]);

  return (
    <DialogContent style={{maxWidth:780,borderRadius:0,border:'1px solid #E8E5DF',fontFamily:"'DM Sans',sans-serif"}}>
      <div style={{height:2,background:'linear-gradient(90deg,#C9A455,transparent)',position:'absolute',top:0,left:0,right:0}}/>
      <DialogHeader>
        <DialogTitle style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.3rem',fontWeight:700,color:'#0D1F3C'}}>
          Documentos de Verificación
        </DialogTitle>
        <p style={{fontSize:'.82rem',color:'#9B9B9B'}}>{user.first_name} {user.last_name}</p>
      </DialogHeader>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1.25rem',padding:'1rem 0'}}>
        {loading
          ? <div style={{gridColumn:'1/-1',display:'flex',justifyContent:'center',padding:'2rem'}}><Loader2 style={{width:28,height:28,color:'#C9A455',animation:'spin 1s linear infinite'}}/></div>
          : [['front','INE — Frente'],['back','INE — Reverso'],['selfie','Selfie']].map(([k,label])=>(
            <div key={k}>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'.72rem',fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:'#9B9B9B',marginBottom:'.5rem'}}>{label}</p>
              {urls[k]
                ? <img src={urls[k]} alt={label} style={{width:'100%',border:'1px solid #E8E5DF',display:'block'}}/>
                : <div style={{width:'100%',aspectRatio:'4/3',background:'#F5F4F0',display:'flex',alignItems:'center',justifyContent:'center',border:'1px solid #E8E5DF'}}>
                    <p style={{fontSize:'.75rem',color:'#9B9B9B'}}>No disponible</p>
                  </div>
              }
            </div>
          ))
        }
      </div>
    </DialogContent>
  );
};

const AdminVerifications = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const {data,error} = await supabase.from('profiles_with_email').select('*').eq('verification_status','pending').order('created_at',{ascending:true});
    if(error) toast({title:"Error",description:error.message,variant:"destructive"});
    else setPendingUsers(data);
    setLoading(false);
  },[]);

  useEffect(()=>{ loadData(); },[loadData]);

  const handleVerification = async (userId, status) => {
    const {error} = await supabase.from('profiles').update({verification_status:status,is_active:status==='approved'}).eq('id',userId);
    if(error) toast({title:"Error",description:error.message,variant:"destructive"});
    else { toast({title:"Éxito",description:`Usuario ${status==='approved'?'aprobado':'rechazado'}.`}); loadData(); }
  };

  return (
    <>
      <Helmet><title>Verificaciones — Admin</title></Helmet>
      <style>{S}</style>

      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} style={{marginBottom:'2rem'}}>
        <div className="pg-tag">Onboarding</div>
        <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'2rem',fontWeight:700,color:'#0D1F3C',lineHeight:1.1,margin:'0 0 .25rem'}}>Verificaciones Pendientes</h1>
        <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'.875rem',color:'#9B9B9B'}}>Revisa y aprueba las cuentas de nuevos usuarios.</p>
      </motion.div>

      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.05}}>
        <div className="pg-card">
          <div className="pg-card-hd">
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.15rem',fontWeight:700,color:'#0D1F3C'}}>Solicitudes en Cola</div>
                <div style={{fontSize:'.8rem',color:'#9B9B9B',marginTop:'.15rem'}}>Orden de llegada — más antiguas primero</div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:'.5rem'}}>
                <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.75rem',fontWeight:700,color:pendingUsers.length?'#D97706':'#0D1F3C'}}>{pendingUsers.length}</span>
                <span style={{fontSize:'.72rem',color:'#9B9B9B',lineHeight:1.3}}>pendientes</span>
              </div>
            </div>
          </div>

          {loading
            ? <div style={{display:'flex',justifyContent:'center',padding:'3rem'}}><Loader2 style={{color:'#C9A455',width:28,height:28,animation:'spin 1s linear infinite'}}/></div>
            : pendingUsers.length===0
              ? (
                <div className="pg-empty">
                  <div style={{width:52,height:52,background:'#0D1F3C',display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <ShieldCheck style={{color:'#C9A455',width:22,height:22}}/>
                  </div>
                  <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'.875rem',fontWeight:600,color:'#0D1F3C'}}>Todo al día</p>
                  <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'.82rem'}}>No hay verificaciones pendientes.</p>
                </div>
              )
              : pendingUsers.map(u=>(
                <div key={u.id} className="vr-row">
                  <div style={{display:'flex',alignItems:'center',gap:'.875rem'}}>
                    <div className="vr-av">
                      <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:'.62rem',fontWeight:700,color:'#C9A455'}}>{u.first_name?.[0]}{u.last_name?.[0]}</span>
                    </div>
                    <div>
                      <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'.875rem',fontWeight:600,color:'#0D1F3C',margin:0}}>{u.first_name} {u.last_name}</p>
                      <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'.72rem',color:'#9B9B9B',margin:'2px 0 0'}}>{u.email}</p>
                      <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'.68rem',color:'#B0B0B0',margin:'2px 0 0'}}>
                        <Clock style={{width:10,height:10,display:'inline',marginRight:3}}/>{new Date(u.created_at).toLocaleString('es-MX')}
                      </p>
                    </div>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:'.5rem'}}>
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="vr-btn view"><Eye style={{width:13,height:13}}/>Ver Docs</button>
                      </DialogTrigger>
                      <VerificationDetailsDialog user={u}/>
                    </Dialog>
                    <button className="vr-btn reject" onClick={()=>handleVerification(u.id,'rejected')}>
                      <UserX style={{width:13,height:13}}/>Rechazar
                    </button>
                    <button className="vr-btn approve" onClick={()=>handleVerification(u.id,'approved')}>
                      <UserCheck style={{width:13,height:13}}/>Aprobar
                    </button>
                  </div>
                </div>
              ))
          }
        </div>
      </motion.div>
    </>
  );
};
export default AdminVerifications;