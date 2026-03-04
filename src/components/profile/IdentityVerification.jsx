import React, { useState, useEffect } from 'react';
import { Upload, Loader2, CheckCircle, AlertTriangle, FileImage } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient.js';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=DM+Sans:wght@400;500;600;700&display=swap');
  .iv-status-ok   { display:flex; align-items:flex-start; gap:0.75rem; padding:0.875rem 1.1rem; background:rgba(5,150,105,0.06); border:1px solid rgba(5,150,105,0.2); margin-bottom:1.25rem; }
  .iv-status-warn { display:flex; align-items:flex-start; gap:0.75rem; padding:0.875rem 1.1rem; background:rgba(245,158,11,0.06); border:1px solid rgba(245,158,11,0.25); margin-bottom:1.25rem; }
  .iv-grid { display:grid; grid-template-columns:1fr 1fr; gap:1.25rem; }
  @media(max-width:600px){ .iv-grid{ grid-template-columns:1fr; } }
  .iv-label { font-size:0.68rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:#0D1F3C; display:block; margin-bottom:0.5rem; }
  .iv-drop { border:1px dashed #C9A455; padding:2rem 1rem; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:0.5rem; cursor:pointer; transition:background 0.18s; background:#FAFAF8; }
  .iv-drop:hover { background:rgba(201,164,85,0.06); }
  .iv-drop-text { font-family:'DM Sans',sans-serif; font-size:0.78rem; color:#9B9B9B; text-align:center; }
  .iv-file-name { font-size:0.72rem; color:#059669; font-weight:600; margin-top:0.25rem; }
  .iv-img { width:100%; height:auto; border:1px solid #E8E5DF; display:block; }
  .iv-btn { font-family:'DM Sans',sans-serif; font-size:0.78rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; padding:0.75rem 1.5rem; background:#0D1F3C; color:#fff; border:none; cursor:pointer; transition:background 0.2s; display:flex; align-items:center; gap:0.5rem; margin-top:1.25rem; margin-left:auto; }
  .iv-btn:hover:not(:disabled) { background:#C9A455; color:#0D1F3C; }
  .iv-btn:disabled { opacity:0.6; cursor:not-allowed; }
  .iv-select-btn { font-family:'DM Sans',sans-serif; font-size:0.72rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; padding:0.4rem 0.875rem; background:transparent; color:#0D1F3C; border:1px solid #D6D3CD; cursor:pointer; transition:all 0.18s; margin-top:0.5rem; }
  .iv-select-btn:hover { border-color:#0D1F3C; }
`;

const IdentityVerification = ({ userProfile, onUpdate }) => {
  const { user }  = useAuth();
  const { toast } = useToast();
  const [frontId, setFrontId]       = useState(null);
  const [backId, setBackId]         = useState(null);
  const [uploading, setUploading]   = useState(false);
  const [frontIdUrl, setFrontIdUrl] = useState(null);
  const [backIdUrl, setBackIdUrl]   = useState(null);

  useEffect(() => {
    if (userProfile.ine_front_url) {
      const { data } = supabase.storage.from('verification_documents').getPublicUrl(userProfile.ine_front_url);
      setFrontIdUrl(data.publicUrl);
    }
    if (userProfile.ine_back_url) {
      const { data } = supabase.storage.from('verification_documents').getPublicUrl(userProfile.ine_back_url);
      setBackIdUrl(data.publicUrl);
    }
  }, [userProfile]);

  const handleFile = (e, side) => {
    const file = e.target.files[0];
    if (!file) return;
    if (side === 'front') setFrontId(file);
    else setBackId(file);
  };

  const handleUpload = async () => {
    if (!frontId || !backId) {
      toast({ title:"Archivos faltantes", description:"Selecciona ambos lados de tu INE.", variant:"destructive" });
      return;
    }
    setUploading(true);
    try {
      const extF = frontId.name.split('.').pop();
      const extB = backId.name.split('.').pop();
      const pathF = `${user.id}/ine_front.${extF}`;
      const pathB = `${user.id}/ine_back.${extB}`;

      const { error: e1 } = await supabase.storage.from('verification_documents').upload(pathF, frontId, { upsert:true });
      if (e1) throw e1;
      const { error: e2 } = await supabase.storage.from('verification_documents').upload(pathB, backId, { upsert:true });
      if (e2) throw e2;
      const { error: e3 } = await supabase.from('profiles').update({ ine_front_url:pathF, ine_back_url:pathB }).eq('id', user.id);
      if (e3) throw e3;

      toast({ title:"Documentos subidos", description:"Tu identidad está en revisión." });
      onUpdate();
    } catch (err) {
      toast({ title:"Error de carga", description:err.message, variant:"destructive" });
    } finally { setUploading(false); }
  };

  const isVerified = !!(frontIdUrl && backIdUrl);

  const DropZone = ({ side, file, existingUrl, inputId }) => {
    if (existingUrl) return (
      <div>
        <img src={existingUrl} alt={`INE ${side}`} className="iv-img" />
      </div>
    );
    return (
      <div className="iv-drop" onClick={() => document.getElementById(inputId).click()}>
        <FileImage style={{ color:'#C9A455', width:'24px', height:'24px' }} />
        <div className="iv-drop-text">Haz clic para seleccionar<br />JPG, PNG o HEIC</div>
        {file && <div className="iv-file-name">✓ {file.name}</div>}
        <input id={inputId} type="file" accept="image/*" onChange={(e) => handleFile(e, side)} style={{ display:'none' }} />
        <button className="iv-select-btn" type="button">Seleccionar archivo</button>
      </div>
    );
  };

  return (
    <>
      <style>{STYLES}</style>

      <div className={isVerified ? 'iv-status-ok' : 'iv-status-warn'}>
        {isVerified
          ? <CheckCircle style={{ color:'#059669', width:'18px', height:'18px', flexShrink:0, marginTop:'2px' }} />
          : <AlertTriangle style={{ color:'#F59E0B', width:'18px', height:'18px', flexShrink:0, marginTop:'2px' }} />}
        <div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.82rem', fontWeight:700, color: isVerified ? '#059669' : '#92400E' }}>
            {isVerified ? 'Documentos Cargados' : 'Verificación de Identidad Pendiente'}
          </div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.75rem', color: isVerified ? '#065F46' : '#B45309', marginTop:'2px' }}>
            {isVerified ? 'Tus documentos han sido subidos y están en revisión.' : 'Sube ambos lados de tu INE para completar la verificación.'}
          </div>
        </div>
      </div>

      <div className="iv-grid">
        <div>
          <label className="iv-label">INE — Frente</label>
          <DropZone side="front" file={frontId} existingUrl={frontIdUrl} inputId="ine-front" />
        </div>
        <div>
          <label className="iv-label">INE — Reverso</label>
          <DropZone side="back" file={backId} existingUrl={backIdUrl} inputId="ine-back" />
        </div>
      </div>

      {!isVerified && (
        <button className="iv-btn" onClick={handleUpload} disabled={uploading || !frontId || !backId}>
          {uploading
            ? <><Loader2 style={{ width:'14px', height:'14px', animation:'spin 1s linear infinite' }} /> Subiendo...</>
            : <><Upload style={{ width:'14px', height:'14px' }} /> Subir Documentos</>}
        </button>
      )}
    </>
  );
};

export default IdentityVerification;