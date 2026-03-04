import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient.js';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
  .pf-label { font-size:0.68rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:#0D1F3C; display:block; margin-bottom:0.4rem; }
  .pf-input-wrap { position:relative; }
  .pf-input { font-family:'DM Sans',sans-serif; font-size:0.875rem; color:#0D1F3C; background:#FAFAF8; border:1px solid #D6D3CD; padding:0.65rem 2.5rem 0.65rem 0.875rem; width:100%; box-sizing:border-box; transition:border-color 0.18s; }
  .pf-input:focus { border-color:#C9A455; outline:none; box-shadow:0 0 0 2px rgba(201,164,85,0.12); }
  .pf-toggle { position:absolute; right:0.625rem; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:#9B9B9B; display:flex; align-items:center; padding:0; transition:color 0.18s; }
  .pf-toggle:hover { color:#0D1F3C; }
  .pf-field { margin-bottom:1.1rem; }
  .pf-btn { font-family:'DM Sans',sans-serif; font-size:0.78rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; width:100%; padding:0.8rem; background:#0D1F3C; color:#fff; border:none; cursor:pointer; transition:background 0.2s; display:flex; align-items:center; justify-content:center; gap:0.5rem; margin-top:0.5rem; }
  .pf-btn:hover:not(:disabled) { background:#C9A455; color:#0D1F3C; }
  .pf-btn:disabled { opacity:0.6; cursor:not-allowed; }
  .pf-hint { font-size:0.72rem; color:#9B9B9B; margin-top:0.35rem; }
`;

const PasswordInput = ({ id, label, value, onChange, show, onToggle, hint }) => (
  <div className="pf-field">
    <label className="pf-label">{label}</label>
    <div className="pf-input-wrap">
      <input id={id} name={id} type={show?'text':'password'} value={value} onChange={onChange} className="pf-input" placeholder="••••••••" />
      <button type="button" className="pf-toggle" onClick={onToggle}>
        {show ? <EyeOff style={{width:'15px',height:'15px'}}/> : <Eye style={{width:'15px',height:'15px'}}/>}
      </button>
    </div>
    {hint && <div className="pf-hint">{hint}</div>}
  </div>
);

const PasswordForm = () => {
  const [data, setData]   = useState({ newPassword:'', confirmPassword:'' });
  const [show, setShow]   = useState({ new:false, confirm:false });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });
  const toggleShow   = (f) => setShow(p => ({ ...p, [f]:!p[f] }));

  const handleSubmit = async () => {
    if (!data.newPassword || !data.confirmPassword) { toast({ title:"Campos requeridos", variant:"destructive" }); return; }
    if (data.newPassword !== data.confirmPassword)  { toast({ title:"Las contraseñas no coinciden", variant:"destructive" }); return; }
    if (data.newPassword.length < 8)                { toast({ title:"Mínimo 8 caracteres", variant:"destructive" }); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: data.newPassword });
    setLoading(false);
    if (error) toast({ title:"Error", description:error.message, variant:"destructive" });
    else { setData({ newPassword:'', confirmPassword:'' }); toast({ title:"Contraseña actualizada" }); }
  };

  return (
    <>
      <style>{STYLES}</style>
      <PasswordInput id="newPassword"     label="Nueva Contraseña"          value={data.newPassword}     onChange={handleChange} show={show.new}     onToggle={() => toggleShow('new')}     hint="Mínimo 8 caracteres" />
      <PasswordInput id="confirmPassword" label="Confirmar Nueva Contraseña" value={data.confirmPassword} onChange={handleChange} show={show.confirm} onToggle={() => toggleShow('confirm')} />
      <button className="pf-btn" onClick={handleSubmit} disabled={loading}>
        {loading ? <Loader2 style={{width:'14px',height:'14px',animation:'spin 1s linear infinite'}}/> : <Lock style={{width:'14px',height:'14px'}}/>}
        Cambiar Contraseña
      </button>
    </>
  );
};

export default PasswordForm;