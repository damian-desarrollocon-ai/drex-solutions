import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, Loader2 } from 'lucide-react';

const B_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&display=swap');
  .be-label { font-family:'DM Sans',sans-serif; font-size:0.72rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:#0D1F3C; display:block; margin-bottom:0.4rem; }
  .be-input { font-family:'DM Sans',sans-serif !important; border-radius:0 !important; border:1px solid #D6D3CD !important; background:#FAFAF8 !important; color:#0D1F3C !important; height:42px !important; }
  .be-input:focus { border-color:#C9A455 !important; box-shadow:0 0 0 2px rgba(201,164,85,0.12) !important; outline:none !important; }
  .be-input-date { font-family:'DM Sans',sans-serif; border-radius:0; border:1px solid #D6D3CD; background:#FAFAF8; color:#0D1F3C; height:42px; padding:0 0.75rem; font-size:0.88rem; width:100%; box-sizing:border-box; transition:border-color 0.2s; outline:none; }
  .be-input-date:focus { border-color:#C9A455; box-shadow:0 0 0 2px rgba(201,164,85,0.12); }
  .be-note { font-family:'DM Sans',sans-serif; font-size:0.72rem; color:#9B9B9B; margin-top:0.35rem; }
  .be-btn { font-family:'DM Sans',sans-serif; font-size:0.78rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; padding:0.7rem 1.5rem; background:#0D1F3C; color:#fff; border:none; cursor:pointer; transition:all 0.2s; border-radius:0; }
  .be-btn:hover { background:#C9A455; color:#0D1F3C; }
  .be-btn:disabled { opacity:0.6; cursor:not-allowed; }
`;

const nowLocal = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

/**
 * Convierte el valor de un <input type="datetime-local"> (ej: "2026-04-10T14:30")
 * a un ISO string RESPETANDO la zona horaria local del navegador.
 *
 * El problema original: new Date("2026-04-10T14:30") se interpreta como UTC
 * en algunos entornos, lo que provoca un desfase de horas al guardarse.
 */
const localDateTimeToISO = (datetimeLocalValue) => {
  // Añadir segundos si el input los omite (algunos navegadores devuelven HH:MM)
  const normalized = datetimeLocalValue.length === 16
    ? datetimeLocalValue + ':00'
    : datetimeLocalValue;

  // Parsear cada parte manualmente para evitar que JS asuma UTC
  const [datePart, timePart] = normalized.split('T');
  const [year, month, day]   = datePart.split('-').map(Number);
  const [hours, minutes, seconds] = timePart.split(':').map(Number);

  // new Date(year, month-1, day, h, m, s) usa la zona horaria LOCAL del navegador
  const localDate = new Date(year, month - 1, day, hours, minutes, seconds);

  return localDate.toISOString(); // ahora sí representa el momento correcto en UTC
};

const fmt = (a) => new Intl.NumberFormat('es-MX', { style:'currency', currency:'MXN' }).format(a);

const BalanceEditDialog = ({ user, onUpdate }) => {
  const [adjustmentAmount, setAdjustmentAmount] = useState('');
  const [reason,           setReason]           = useState('');
  const [txDate,           setTxDate]           = useState(nowLocal());
  const [isOpen,           setIsOpen]           = useState(false);
  const [loading,          setLoading]          = useState(false);

  React.useEffect(() => {
    if (!isOpen) {
      setAdjustmentAmount('');
      setReason('');
      setTxDate(nowLocal());
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!reason) { alert("Por favor, especifica un motivo para el ajuste."); return; }
    const amount = parseFloat(adjustmentAmount);
    if (isNaN(amount)) { alert("La cantidad debe ser un número válido."); return; }

    setLoading(true);

    // ✅ CORRECCIÓN: usar localDateTimeToISO en lugar de new Date(txDate).toISOString()
    //    para respetar la zona horaria local y no guardar con la hora real/UTC incorrecta.
    const isoDate = localDateTimeToISO(txDate);

    await onUpdate(user.id, amount, reason, isoDate);
    setLoading(false);
    setIsOpen(false);
  };

  return (
    <>
      <style>{B_STYLES}</style>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" style={{ borderRadius:0, fontFamily:"'DM Sans',sans-serif", fontSize:'0.75rem', fontWeight:600 }}>
            <Edit className="w-4 h-4 mr-2" /> Modificar
          </Button>
        </DialogTrigger>

        <DialogContent style={{ borderRadius:0, border:'1px solid #E8E5DF', fontFamily:"'DM Sans',sans-serif", padding:0, overflow:'hidden' }}>
          {/* Gold top bar */}
          <div style={{ height:'2px', background:'linear-gradient(90deg,#C9A455,transparent)' }} />

          <div style={{ padding:'1.5rem 1.75rem 0' }}>
            <DialogHeader>
              <DialogTitle style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.3rem', fontWeight:700, color:'#0D1F3C' }}>
                Ajustar Balance
              </DialogTitle>
              <DialogDescription style={{ color:'#9B9B9B', fontSize:'0.82rem' }}>
                Modifica el saldo de {user.first_name} {user.last_name}.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div style={{ padding:'1.25rem 1.75rem', display:'flex', flexDirection:'column', gap:'1rem' }}>
            {/* Balance actual */}
            <div style={{ padding:'0.875rem', background:'#F5F4F0', border:'1px solid #E8E5DF', fontFamily:"'DM Sans',sans-serif", fontSize:'0.875rem', color:'#0D1F3C' }}>
              Balance actual:&nbsp;
              <strong style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.1rem' }}>
                {fmt(user.balance || 0)}
              </strong>
            </div>

            {/* Cantidad */}
            <div>
              <label className="be-label">Cantidad a Ajustar</label>
              <Input
                type="number"
                value={adjustmentAmount}
                onChange={(e) => setAdjustmentAmount(e.target.value)}
                placeholder="Ej: 100 o -50"
                className="be-input"
              />
            </div>

            {/* Motivo */}
            <div>
              <label className="be-label">Motivo</label>
              <Input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ej. Bono de bienvenida"
                className="be-input"
              />
            </div>

            {/* Fecha del movimiento */}
            <div>
              <label className="be-label">Fecha del Movimiento</label>
              <input
                type="datetime-local"
                value={txDate}
                onChange={(e) => setTxDate(e.target.value)}
                className="be-input-date"
              />
              <p className="be-note">Puedes cambiarla para registrar el movimiento en una fecha anterior.</p>
            </div>
          </div>

          <DialogFooter style={{ padding:'0 1.75rem 1.5rem', gap:'0.5rem' }}>
            <button className="be-btn" onClick={() => setIsOpen(false)} style={{ background:'transparent', color:'#0D1F3C', border:'1px solid #D6D3CD' }}>
              Cancelar
            </button>
            <button className="be-btn" onClick={handleSubmit} disabled={loading || !adjustmentAmount || !reason}>
              {loading ? <Loader2 style={{ width:'14px', height:'14px', display:'inline', animation:'spin 1s linear infinite' }} /> : 'Confirmar Ajuste'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BalanceEditDialog;