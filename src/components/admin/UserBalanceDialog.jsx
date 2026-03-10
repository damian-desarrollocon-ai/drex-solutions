import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { DollarSign, Loader2 } from 'lucide-react';

const D_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&display=swap');
  .dlg-label { font-family:'DM Sans',sans-serif; font-size:0.72rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:#0D1F3C; display:block; margin-bottom:0.4rem; }
  .dlg-input { font-family:'DM Sans',sans-serif !important; border-radius:0 !important; border:1px solid #D6D3CD !important; background:#FAFAF8 !important; color:#0D1F3C !important; height:42px !important; }
  .dlg-input:focus { border-color:#C9A455 !important; box-shadow:0 0 0 2px rgba(201,164,85,0.12) !important; outline:none !important; }
  .dlg-input-date { font-family:'DM Sans',sans-serif !important; border-radius:0 !important; border:1px solid #D6D3CD !important; background:#FAFAF8 !important; color:#0D1F3C !important; height:42px !important; padding:0 0.75rem; font-size:0.88rem; width:100%; box-sizing:border-box; transition:border-color 0.2s; }
  .dlg-input-date:focus { border-color:#C9A455 !important; box-shadow:0 0 0 2px rgba(201,164,85,0.12) !important; outline:none !important; }
  .dlg-btn { font-family:'DM Sans',sans-serif; font-size:0.78rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; width:100%; padding:0.75rem; background:#0D1F3C; color:#fff; border:none; cursor:pointer; transition:background 0.2s; margin-top:0.5rem; }
  .dlg-btn:hover { background:#C9A455; color:#0D1F3C; }
  .dlg-btn:disabled { opacity:0.6; cursor:not-allowed; }
  .dlg-trigger { width:30px; height:30px; display:flex; align-items:center; justify-content:center; border:1px solid rgba(5,150,105,0.3); background:transparent; cursor:pointer; color:#059669; transition:all 0.18s; }
  .dlg-trigger:hover { border-color:#059669; background:rgba(5,150,105,0.06); }
  .dlg-date-note { font-family:'DM Sans',sans-serif; font-size:0.72rem; color:#9B9B9B; margin-top:0.35rem; }
`;

// Devuelve el datetime local actual en formato yyyy-MM-ddTHH:mm
const nowLocal = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

const UserBalanceDialog = ({ user, onUpdateBalance }) => {
  const [newBalance,   setNewBalance]   = useState('');
  const [description,  setDescription]  = useState('');
  const [txDate,       setTxDate]       = useState(nowLocal());
  const [isOpen,       setIsOpen]       = useState(false);
  const [loading,      setLoading]      = useState(false);

  const fmt = (a) => new Intl.NumberFormat('es-MX', { style:'currency', currency:'MXN' }).format(a);

  const handleOpen = () => {
    setNewBalance('');
    setDescription('');
    setTxDate(nowLocal()); // resetea a "ahora" cada vez que se abre
    setIsOpen(true);
  };

  const handleSubmit = async () => {
    if (!newBalance) return;
    setLoading(true);
    // Convierte la fecha local elegida a ISO UTC para guardar en Supabase
    const isoDate = new Date(txDate).toISOString();
    await onUpdateBalance(user.id, newBalance, description, isoDate);
    setLoading(false);
    setIsOpen(false);
  };

  return (
    <>
      <style>{D_STYLES}</style>
      <button className="dlg-trigger" onClick={handleOpen} title="Modificar saldo">
        <DollarSign style={{ width:'13px', height:'13px' }} />
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent style={{ borderRadius:0, border:'1px solid #E8E5DF', fontFamily:"'DM Sans',sans-serif" }}>
          <div style={{ height:'2px', background:'linear-gradient(90deg,#C9A455,transparent)', position:'absolute', top:0, left:0, right:0 }} />
          <DialogHeader>
            <DialogTitle style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.3rem', fontWeight:700, color:'#0D1F3C' }}>
              Modificar Saldo
            </DialogTitle>
            <DialogDescription style={{ color:'#9B9B9B', fontSize:'0.82rem' }}>
              {user.first_name} {user.last_name} · Saldo actual:&nbsp;
              <strong style={{ color:'#0D1F3C' }}>{fmt(user.balance || 0)}</strong>
            </DialogDescription>
          </DialogHeader>

          <div style={{ paddingTop:'1rem', display:'flex', flexDirection:'column', gap:'1rem' }}>
            {/* Nuevo saldo */}
            <div>
              <label className="dlg-label">Nuevo Saldo</label>
              <Input
                type="number"
                value={newBalance}
                onChange={(e) => setNewBalance(e.target.value)}
                placeholder="0.00"
                className="dlg-input"
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="dlg-label">Motivo (opcional)</label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ej. Depósito inicial"
                className="dlg-input"
              />
            </div>

            {/* ✅ Fecha del movimiento */}
            <div>
              <label className="dlg-label">Fecha del Movimiento</label>
              <input
                type="datetime-local"
                value={txDate}
                onChange={(e) => setTxDate(e.target.value)}
                className="dlg-input-date"
              />
              <p className="dlg-date-note">
                Puedes cambiarla para registrar el movimiento en una fecha anterior.
              </p>
            </div>

            <button className="dlg-btn" onClick={handleSubmit} disabled={loading || !newBalance}>
              {loading
                ? <Loader2 style={{ width:'14px', height:'14px', display:'inline', animation:'spin 1s linear infinite' }} />
                : 'Confirmar Cambio'
              }
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserBalanceDialog;