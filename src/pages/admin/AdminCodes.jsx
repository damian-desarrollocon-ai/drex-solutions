import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Loader2, PlusCircle, Copy, CheckCircle, XCircle, Ticket } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient.js';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=DM+Sans:wght@400;500;600;700&display=swap');
  .pg-tag{font-size:.7rem;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:#B8892E;display:flex;align-items:center;gap:.5rem;margin-bottom:.4rem}
  .pg-tag::before{content:'';width:20px;height:2px;background:#B8892E}
  .pg-card{background:#fff;border:1px solid #E8E5DF;position:relative;overflow:hidden}
  .pg-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#C9A455,rgba(201,164,85,.15))}
  .pg-card-hd{padding:1.25rem 1.75rem 1rem;border-bottom:1px solid #F0EDE8}
  .gen-btn{font-family:'DM Sans',sans-serif;font-size:.78rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:.65rem 1.5rem;background:#0D1F3C;color:#fff;border:none;cursor:pointer;transition:background .2s;display:flex;align-items:center;gap:.5rem}
  .gen-btn:hover{background:#C9A455;color:#0D1F3C}
  .gen-btn:disabled{opacity:.6;cursor:not-allowed}
  .tbl{width:100%;border-collapse:collapse}
  .tbl th{font-family:'DM Sans',sans-serif;font-size:.62rem;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:#9B9B9B;padding:.875rem 1.75rem;text-align:left;border-bottom:2px solid #F0EDE8;white-space:nowrap}
  .tbl td{font-family:'DM Sans',sans-serif;font-size:.82rem;color:#0D1F3C;padding:.875rem 1.75rem;border-bottom:1px solid #F5F4F0}
  .tbl tr:last-child td{border-bottom:none}
  .tbl tr:hover td{background:#FAFAF8}
  .badge-ok{font-size:.62rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#059669;background:rgba(5,150,105,.08);border:1px solid rgba(5,150,105,.2);padding:.2rem .65rem;display:inline-flex;align-items:center;gap:.3rem}
  .badge-used{font-size:.62rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#9B9B9B;background:#F5F4F0;border:1px solid #E8E5DF;padding:.2rem .65rem;display:inline-flex;align-items:center;gap:.3rem}
  .copy-btn{width:28px;height:28px;display:flex;align-items:center;justify-content:center;border:1px solid #E8E5DF;background:transparent;cursor:pointer;color:#6B6B6B;transition:all .18s}
  .copy-btn:hover{border-color:#C9A455;color:#C9A455}
  .pg-empty{display:flex;flex-direction:column;align-items:center;gap:.75rem;padding:3rem;color:#9B9B9B;text-align:center}
`;

const AdminCodes = () => {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const { user: adminUser } = useAuth();
  const { toast } = useToast();
  const fmtDt = (d) => d ? new Date(d).toLocaleString('es-MX') : '—';

  const fetchCodes = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('referral_codes').select('*').order('created_at',{ascending:false});
    if (error) toast({title:"Error",description:error.message,variant:"destructive"});
    else setCodes(data);
    setLoading(false);
  },[toast]);

  useEffect(()=>{ fetchCodes(); },[fetchCodes]);

  const generateCode = async () => {
    setGenerating(true);
    const code = `DREX-${Math.random().toString(36).substring(2,8).toUpperCase()}`;
    const { error } = await supabase.from('referral_codes').insert({code, generated_by_admin_id:adminUser.id});
    if (error) toast({title:"Error",description:error.message,variant:"destructive"});
    else { toast({title:"Código generado",description:`Código: ${code}`}); fetchCodes(); }
    setGenerating(false);
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    toast({title:"Copiado",description:"Código copiado al portapapeles."});
  };

  return (
    <>
      <Helmet><title>Códigos — Admin</title></Helmet>
      <style>{S}</style>

      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:'2rem',flexWrap:'wrap',gap:'1rem'}}>
        <div>
          <div className="pg-tag">Acceso al Sistema</div>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'2rem',fontWeight:700,color:'#0D1F3C',lineHeight:1.1,margin:'0 0 .25rem'}}>Códigos de Invitación</h1>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'.875rem',color:'#9B9B9B'}}>Crea y gestiona los códigos para registrar nuevos usuarios.</p>
        </div>
        <button className="gen-btn" onClick={generateCode} disabled={generating}>
          {generating ? <Loader2 style={{width:14,height:14,animation:'spin 1s linear infinite'}}/> : <PlusCircle style={{width:14,height:14}}/>}
          Generar Código
        </button>
      </motion.div>

      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.05}}>
        <div className="pg-card">
          <div className="pg-card-hd">
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.15rem',fontWeight:700,color:'#0D1F3C'}}>Historial de Códigos</div>
                <div style={{fontSize:'.8rem',color:'#9B9B9B',marginTop:'.15rem'}}>Todos los códigos generados en el sistema</div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:'.5rem'}}>
                <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.75rem',fontWeight:700,color:'#0D1F3C'}}>{codes.filter(c=>!c.is_used).length}</span>
                <span style={{fontSize:'.72rem',color:'#9B9B9B',lineHeight:1.3}}>disponibles</span>
              </div>
            </div>
          </div>
          {loading
            ? <div style={{display:'flex',justifyContent:'center',padding:'3rem'}}><Loader2 style={{color:'#C9A455',width:28,height:28,animation:'spin 1s linear infinite'}}/></div>
            : codes.length === 0
              ? <div className="pg-empty"><Ticket style={{width:36,height:36,color:'#C9A455'}}/><p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'.875rem'}}>No se han generado códigos aún.</p></div>
              : (
                <div style={{overflowX:'auto'}}>
                  <table className="tbl">
                    <thead>
                      <tr>
                        <th>Código</th>
                        <th>Estado</th>
                        <th>Creado</th>
                        <th>Usado</th>
                        <th style={{textAlign:'center'}}>Copiar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {codes.map(c => (
                        <tr key={c.id}>
                          <td><span style={{fontFamily:'monospace',fontWeight:700,fontSize:'.88rem',color:'#0D1F3C',letterSpacing:'.05em'}}>{c.code}</span></td>
                          <td>
                            {c.is_used
                              ? <span className="badge-used"><XCircle style={{width:10,height:10}}/>Usado</span>
                              : <span className="badge-ok"><CheckCircle style={{width:10,height:10}}/>Disponible</span>
                            }
                          </td>
                          <td style={{color:'#9B9B9B',fontSize:'.78rem'}}>{fmtDt(c.created_at)}</td>
                          <td style={{color:'#9B9B9B',fontSize:'.78rem'}}>{fmtDt(c.used_at)}</td>
                          <td style={{textAlign:'center'}}>
                            <button className="copy-btn" onClick={()=>handleCopy(c.code)} style={{margin:'0 auto'}}>
                              <Copy style={{width:12,height:12}}/>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
          }
        </div>
      </motion.div>
    </>
  );
};
export default AdminCodes;