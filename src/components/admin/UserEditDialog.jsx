import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Pencil, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const UserEditDialog = ({ user, onUpdateUser }) => {
  const [data, setData]     = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && isOpen) setData({
      first_name:     user.first_name     || '',
      last_name:      user.last_name      || '',
      account_number: user.account_number || '',
      clabe:          user.clabe          || '',
    });
  }, [user, isOpen]);

  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (data.account_number && data.account_number.length !== 16) {
      toast({ title: "Error", description: "El número de tarjeta debe tener 16 dígitos.", variant: "destructive" });
      return;
    }
    setLoading(true);
    await onUpdateUser(user.id, data);
    setLoading(false); setIsOpen(false);
  };

  const fields = [
    { name:'first_name',     label:'Nombre' },
    { name:'last_name',      label:'Apellidos' },
    { name:'account_number', label:'Nº Tarjeta', maxLength:16 },
    { name:'clabe',          label:'CLABE' },
  ];

  return (
    <>
      <style>{`
        .ued-trigger { width:30px; height:30px; display:flex; align-items:center; justify-content:center; border:1px solid #E8E5DF; background:transparent; cursor:pointer; color:#6B6B6B; transition:all 0.18s; }
        .ued-trigger:hover { border-color:#0D1F3C; color:#0D1F3C; }
        .ued-label { font-family:'DM Sans',sans-serif; font-size:0.72rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:#0D1F3C; display:block; margin-bottom:0.4rem; }
        .ued-input { font-family:'DM Sans',sans-serif !important; border-radius:0 !important; border:1px solid #D6D3CD !important; background:#FAFAF8 !important; color:#0D1F3C !important; height:42px !important; }
        .ued-input:focus { border-color:#C9A455 !important; box-shadow:0 0 0 2px rgba(201,164,85,0.12) !important; outline:none !important; }
        .ued-btn { font-family:'DM Sans',sans-serif; font-size:0.78rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; width:100%; padding:0.75rem; background:#0D1F3C; color:#fff; border:none; cursor:pointer; transition:background 0.2s; margin-top:0.5rem; }
        .ued-btn:hover:not(:disabled) { background:#C9A455; color:#0D1F3C; }
        .ued-btn:disabled { opacity:0.6; cursor:not-allowed; }
      `}</style>
      <button className="ued-trigger" onClick={() => setIsOpen(true)} title="Editar usuario">
        <Pencil style={{ width:'13px', height:'13px' }} />
      </button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent style={{ borderRadius:0, border:'1px solid #E8E5DF', fontFamily:"'DM Sans',sans-serif" }}>
          <div style={{ height:'2px', background:'linear-gradient(90deg,#C9A455,transparent)', position:'absolute', top:0, left:0, right:0 }} />
          <DialogHeader>
            <DialogTitle style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.3rem', fontWeight:700, color:'#0D1F3C' }}>
              Editar Cliente
            </DialogTitle>
            <DialogDescription style={{ color:'#9B9B9B', fontSize:'0.82rem' }}>
              Modificar datos de {user.first_name} {user.last_name}
            </DialogDescription>
          </DialogHeader>
          <div style={{ display:'flex', flexDirection:'column', gap:'1rem', paddingTop:'1rem' }}>
            {fields.map((f) => (
              <div key={f.name}>
                <label className="ued-label">{f.label}</label>
                <Input name={f.name} value={data[f.name] || ''} onChange={handleChange} className="ued-input" maxLength={f.maxLength} />
              </div>
            ))}
            <button className="ued-btn" onClick={handleSubmit} disabled={loading}>
              {loading
                ? <Loader2 style={{ width:'14px', height:'14px', display:'inline', animation:'spin 1s linear infinite' }} />
                : 'Guardar Cambios'
              }
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserEditDialog;