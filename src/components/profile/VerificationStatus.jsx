import React, { useState } from 'react';
import { Mail, Phone, ShieldCheck, AlertTriangle, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient.js';
import IdentityVerification from './IdentityVerification';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=DM+Sans:wght@400;500;600;700&display=swap');
  .vs-item { display:flex; align-items:center; justify-content:space-between; padding:1rem 1.25rem; border:1px solid #E8E5DF; background:#fff; margin-bottom:0.75rem; transition:background 0.15s; }
  .vs-item:hover { background:#FAFAF8; }
  .vs-icon-ok  { width:36px; height:36px; background:rgba(5,150,105,0.1); border:1px solid rgba(5,150,105,0.2); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .vs-icon-warn{ width:36px; height:36px; background:rgba(245,158,11,0.1); border:1px solid rgba(245,158,11,0.2); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .vs-badge-ok   { font-size:0.65rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:#059669; background:rgba(5,150,105,0.08); border:1px solid rgba(5,150,105,0.2); padding:0.2rem 0.6rem; }
  .vs-badge-warn { font-size:0.65rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:#F59E0B; background:rgba(245,158,11,0.08); border:1px solid rgba(245,158,11,0.2); padding:0.2rem 0.6rem; }
  .vs-action-btn { font-family:'DM Sans',sans-serif; font-size:0.72rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; padding:0.4rem 0.875rem; background:transparent; color:#0D1F3C; border:1px solid #0D1F3C; cursor:pointer; transition:all 0.18s; }
  .vs-action-btn:hover:not(:disabled) { background:#0D1F3C; color:#fff; }
  .vs-action-btn:disabled { opacity:0.5; cursor:not-allowed; }
  .vs-section-title { font-family:'Cormorant Garamond',serif; font-size:1.1rem; font-weight:700; color:#0D1F3C; margin:1.5rem 0 1rem; padding-top:1.5rem; border-top:1px solid #F0EDE8; }
  .vs-summary { display:flex; align-items:flex-start; gap:0.875rem; padding:1.1rem 1.25rem; background:#FAFAF8; border:1px solid #E8E5DF; }
  .md-label { font-size:0.68rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:#0D1F3C; display:block; margin-bottom:0.4rem; }
  .md-input { font-family:'DM Sans',sans-serif !important; border-radius:0 !important; border:1px solid #D6D3CD !important; background:#FAFAF8 !important; color:#0D1F3C !important; height:42px !important; }
  .md-input:focus { border-color:#C9A455 !important; box-shadow:0 0 0 2px rgba(201,164,85,0.12) !important; outline:none !important; }
  .md-btn { font-family:'DM Sans',sans-serif; font-size:0.78rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; width:100%; padding:0.75rem; background:#0D1F3C; color:#fff; border:none; cursor:pointer; transition:background 0.2s; margin-top:0.75rem; }
  .md-btn:hover:not(:disabled) { background:#C9A455; color:#0D1F3C; }
  .md-btn:disabled { opacity:0.6; cursor:not-allowed; }
`;

// ── Phone verification dialog ──────────────────────────────────
const PhoneVerificationDialog = ({ userProfile, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep]     = useState(1);
  const [phone, setPhone]   = useState(userProfile.phone || '');
  const [otp, setOtp]       = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    setLoading(true);
    await supabase.from('profiles').update({ phone }).eq('id', userProfile.id);
    const { error } = await supabase.auth.signInWithOtp({ phone });
    setLoading(false);
    if (error) toast({ title:"Error", description:error.message, variant:"destructive" });
    else { toast({ title:"Código enviado", description:"Revisa tus mensajes SMS." }); setStep(2); }
  };

  const handleVerify = async () => {
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({ phone, token:otp, type:'sms' });
    setLoading(false);
    if (error) toast({ title:"Código inválido", description:error.message, variant:"destructive" });
    else { toast({ title:"Teléfono verificado" }); onUpdate(); setIsOpen(false); setStep(1); }
  };

  return (
    <>
      <button className="vs-action-btn" onClick={() => setIsOpen(true)}>Verificar</button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent style={{ borderRadius:0, border:'1px solid #E8E5DF', padding:'1.75rem', maxWidth:'400px' }}>
          <div style={{ height:'2px', background:'linear-gradient(90deg,#C9A455,transparent)', position:'absolute', top:0, left:0, right:0 }} />
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.2rem', fontWeight:700, color:'#0D1F3C', marginBottom:'0.25rem' }}>
            Verificar Teléfono
          </div>
          <div style={{ fontSize:'0.8rem', color:'#9B9B9B', marginBottom:'1.25rem' }}>
            {step===1 ? 'Confirma tu número para recibir el código.' : 'Introduce el código que recibiste.'}
          </div>
          {step === 1 && (
            <>
              <label className="md-label">Número de Teléfono</label>
              <Input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+521234567890" className="md-input" />
              <button className="md-btn" onClick={handleSendOtp} disabled={loading||!phone}>
                {loading ? 'Enviando...' : 'Enviar Código SMS'}
              </button>
            </>
          )}
          {step === 2 && (
            <>
              <label className="md-label">Código de Verificación</label>
              <Input value={otp} onChange={e=>setOtp(e.target.value)} placeholder="123456" className="md-input" />
              <button className="md-btn" onClick={handleVerify} disabled={loading||!otp}>
                {loading ? 'Verificando...' : 'Confirmar Código'}
              </button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

// ── VerificationItem ───────────────────────────────────────────
const VerificationItem = ({ icon:Icon, title, subtitle, verified, actionComponent, onAction, actionText, loading }) => (
  <div className="vs-item">
    <div style={{ display:'flex', alignItems:'center', gap:'0.875rem' }}>
      <div className={verified ? 'vs-icon-ok' : 'vs-icon-warn'}>
        <Icon style={{ width:'16px', height:'16px', color: verified ? '#059669' : '#F59E0B' }} />
      </div>
      <div>
        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.875rem', fontWeight:600, color:'#0D1F3C' }}>{title}</div>
        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.75rem', color:'#9B9B9B', marginTop:'2px' }}>{subtitle}</div>
      </div>
    </div>
    <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', flexShrink:0 }}>
      <span className={verified ? 'vs-badge-ok' : 'vs-badge-warn'}>
        {verified ? 'Verificado' : 'Pendiente'}
      </span>
      {!verified && (actionComponent || (onAction && (
        <button className="vs-action-btn" onClick={onAction} disabled={loading}>
          {loading ? <Loader2 style={{width:'12px',height:'12px',display:'inline',animation:'spin 1s linear infinite'}}/> : actionText}
        </button>
      )))}
    </div>
  </div>
);

// ── VerificationStatus ─────────────────────────────────────────
const VerificationStatus = ({ user, userProfile, onUpdate }) => {
  const [loading, setLoading] = useState(false);

  const handleResendEmail = async () => {
    setLoading(true);
    const { error } = await supabase.auth.resend({ type:'signup', email:user.email });
    setLoading(false);
    if (error) toast({ title:"Error", description:error.message, variant:"destructive" });
    else toast({ title:"Correo enviado", description:"Revisa tu bandeja de entrada." });
  };

  const isEmailVerified    = !!(user.email_confirmed_at || user.identities?.some(i => i.identity_data?.email_verified));
  const isPhoneVerified    = !!user.phone_confirmed_at;
  const isIdentityVerified = !!(userProfile.ine_front_url && userProfile.ine_back_url);
  const allVerified        = isEmailVerified && isPhoneVerified && isIdentityVerified;

  return (
    <>
      <style>{STYLES}</style>

      <VerificationItem icon={Mail}  title="Correo Electrónico" subtitle={user.email}                          verified={isEmailVerified} onAction={handleResendEmail} actionText="Reenviar" loading={loading} />
      <VerificationItem icon={Phone} title="Teléfono"           subtitle={userProfile.phone||'No proporcionado'} verified={isPhoneVerified}  actionComponent={<PhoneVerificationDialog userProfile={userProfile} onUpdate={onUpdate} />} />

      <div className="vs-section-title">Verificación de Identidad (INE)</div>
      <IdentityVerification userProfile={userProfile} onUpdate={onUpdate} />

      <div className="vs-section-title" style={{ marginTop:'1.25rem' }}>Estado General</div>
      <div className="vs-summary">
        {allVerified
          ? <ShieldCheck style={{ color:'#059669', width:'20px', height:'20px', flexShrink:0, marginTop:'2px' }} />
          : <AlertTriangle style={{ color:'#F59E0B', width:'20px', height:'20px', flexShrink:0, marginTop:'2px' }} />}
        <div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.875rem', fontWeight:700, color: allVerified ? '#059669' : '#0D1F3C' }}>
            {allVerified ? 'Cuenta Completamente Verificada' : 'Verificación Incompleta'}
          </div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.78rem', color:'#9B9B9B', marginTop:'3px' }}>
            {allVerified ? '¡Felicidades! Tienes acceso completo a todos nuestros servicios.' : 'Completa todos los pasos para desbloquear el potencial de tu cuenta.'}
          </div>
        </div>
      </div>
    </>
  );
};

export default VerificationStatus;