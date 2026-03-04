import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient.js';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Loader2, Copy, AlertTriangle, CheckCircle } from 'lucide-react';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  .wm-wrap { padding:1.75rem; font-family:'DM Sans',sans-serif; position:relative; }
  .wm-gold-bar { position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,#C9A455,transparent); }
  .wm-title { font-family:'Cormorant Garamond',serif; font-size:1.3rem; font-weight:700; color:#0D1F3C; margin:0 0 0.2rem; }
  .wm-desc  { font-size:0.8rem; color:#9B9B9B; margin:0 0 1.5rem; }
  .wm-label { font-size:0.68rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:#0D1F3C; display:block; margin-bottom:0.4rem; }
  .wm-input { font-family:'DM Sans',sans-serif !important; border-radius:0 !important; border:1px solid #D6D3CD !important; background:#FAFAF8 !important; color:#0D1F3C !important; height:42px !important; }
  .wm-input:focus { border-color:#C9A455 !important; box-shadow:0 0 0 2px rgba(201,164,85,0.12) !important; outline:none !important; }
  .wm-field { margin-bottom:1rem; }
  .wm-select-trigger { border-radius:0 !important; border:1px solid #D6D3CD !important; background:#FAFAF8 !important; height:42px !important; font-family:'DM Sans',sans-serif !important; font-size:0.875rem !important; }
  .wm-btn { font-family:'DM Sans',sans-serif; font-size:0.78rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; width:100%; padding:0.8rem; background:#0D1F3C; color:#fff; border:none; cursor:pointer; transition:background 0.2s; margin-top:0.75rem; display:flex; align-items:center; justify-content:center; gap:0.5rem; }
  .wm-btn:hover:not(:disabled) { background:#C9A455; color:#0D1F3C; }
  .wm-btn:disabled { opacity:0.6; cursor:not-allowed; }
  .wm-warning { display:flex; align-items:flex-start; gap:0.75rem; padding:0.875rem 1rem; background:#FFFBEB; border:1px solid rgba(245,158,11,0.35); margin-top:0.5rem; }
  .wm-success { display:flex; flex-direction:column; align-items:center; padding:1.25rem; background:rgba(5,150,105,0.06); border:1px solid rgba(5,150,105,0.2); text-align:center; margin-bottom:1.25rem; gap:0.5rem; }
  .wm-ref-box { background:#F5F4F0; border:1px solid #E8E5DF; padding:0.875rem 1rem; display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem; }
  .wm-ref-code { font-family:monospace; font-size:1.2rem; font-weight:700; color:#0D1F3C; letter-spacing:0.12em; }
  .wm-copy-btn { width:32px; height:32px; display:flex; align-items:center; justify-content:center; border:1px solid #D6D3CD; background:transparent; cursor:pointer; color:#6B6B6B; transition:all 0.18s; }
  .wm-copy-btn:hover { border-color:#C9A455; color:#C9A455; }
  .wm-instructions { background:#FAFAF8; border:1px solid #E8E5DF; padding:1rem; font-size:0.8rem; color:#4B4B4B; line-height:1.7; }
`;

const WithdrawalModal = ({ isOpen, onClose, onWithdrawalSuccess }) => {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();

  const [amount, setAmount]     = useState('');
  const [bank, setBank]         = useState('');
  const [step, setStep]         = useState(1);
  const [loading, setLoading]   = useState(false);
  const [reference, setReference] = useState('');

  const banks = ['OXXO', '7-Eleven', 'Circle K', 'Walmart', 'Farmacias del Ahorro'];

  useEffect(() => {
    if (isOpen && userProfile && !userProfile.withdrawals_enabled) {
      toast({ title:"Función Deshabilitada", description:"Los retiros no están activados. Contacta a tu asesor.", variant:"destructive", duration:5000 });
      onClose();
    }
  }, [isOpen, userProfile]);

  const genCode = () => Array.from({ length:16 }, () => Math.floor(Math.random()*10)).join('');

  const getInstructions = (b) => [
    `1. Acude a la caja del establecimiento (${b}).`,
    '2. Indica que realizarás un "Retiro sin Tarjeta".',
    '3. Proporciona al cajero el código de referencia de 16 dígitos.',
    '4. Muestra tu identificación oficial si es requerida.',
    '5. Confirma el monto y recibe tu efectivo.',
  ];

  const handleRequest = async () => {
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0)   { toast({ title:"Monto inválido", variant:"destructive" }); return; }
    if (!bank)                          { toast({ title:"Selecciona un establecimiento", variant:"destructive" }); return; }
    if (userProfile.balance < parsed)   { toast({ title:"Saldo insuficiente", variant:"destructive" }); return; }

    setLoading(true);
    const code = genCode();
    try {
      const { error } = await supabase.from('transactions').insert({
        user_id: user.id, type:'debit', amount:parsed,
        description:`Solicitud de retiro en ${bank}`,
        recipient_name:'Retiro en Alianza', status:'pending',
        withdrawal_reference_code:code, withdrawal_bank:bank,
        withdrawal_instructions: getInstructions(bank).join('\n'),
      });
      if (error) throw error;
      setReference(code); setStep(2);
      onWithdrawalSuccess();
      toast({ title:"Solicitud enviada", description:"Pendiente de aprobación del administrador." });
    } catch (err) {
      toast({ title:"Error", description:err.message, variant:"destructive" });
    } finally { setLoading(false); }
  };

  const handleClose = () => { setStep(1); setAmount(''); setBank(''); setReference(''); onClose(); };

  return (
    <>
      <style>{STYLES}</style>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent style={{ borderRadius:0, border:'1px solid #E8E5DF', padding:0, overflow:'hidden', maxWidth:'440px' }}>
          <div className="wm-wrap">
            <div className="wm-gold-bar" />

            <div className="wm-title">Retiro sin Tarjeta</div>
            <div className="wm-desc">
              {step===1 ? 'Genera una referencia para retirar efectivo en establecimientos aliados.' : 'Tu solicitud ha sido registrada exitosamente.'}
            </div>

            {/* ── Step 1 ── */}
            {step === 1 && (
              <>
                <div className="wm-field">
                  <label className="wm-label">Monto a Retirar (MXN)</label>
                  <Input type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="0.00" className="wm-input" />
                </div>

                <div className="wm-field">
                  <label className="wm-label">Establecimiento Aliado</label>
                  <Select onValueChange={setBank} value={bank}>
                    <SelectTrigger className="wm-select-trigger">
                      <SelectValue placeholder="Selecciona un comercio" />
                    </SelectTrigger>
                    <SelectContent>
                      {banks.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="wm-warning">
                  <AlertTriangle style={{ color:'#F59E0B', width:'16px', height:'16px', flexShrink:0, marginTop:'2px' }} />
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.78rem', color:'#92400E', margin:0, lineHeight:1.5 }}>
                    El monto no se descontará hasta que el administrador apruebe la solicitud.
                  </p>
                </div>

                <button className="wm-btn" onClick={handleRequest} disabled={loading}>
                  {loading
                    ? <><Loader2 style={{ width:'14px', height:'14px', animation:'spin 1s linear infinite' }} /> Procesando...</>
                    : 'Solicitar Retiro'}
                </button>
              </>
            )}

            {/* ── Step 2 ── */}
            {step === 2 && (
              <>
                <div className="wm-success">
                  <CheckCircle style={{ color:'#059669', width:'36px', height:'36px' }} />
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.15rem', fontWeight:700, color:'#0D1F3C' }}>
                    Solicitud Exitosa
                  </div>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.78rem', color:'#9B9B9B', margin:0 }}>
                    Recibirás una notificación cuando tu retiro sea aprobado.
                  </p>
                </div>

                <div className="wm-field">
                  <label className="wm-label">Código de Referencia</label>
                  <div className="wm-ref-box">
                    <span className="wm-ref-code">{reference}</span>
                    <button className="wm-copy-btn" onClick={() => { navigator.clipboard.writeText(reference); toast({ title:"Copiado" }); }}>
                      <Copy style={{ width:'14px', height:'14px' }} />
                    </button>
                  </div>
                </div>

                <div className="wm-field">
                  <label className="wm-label">Instrucciones en {bank}</label>
                  <div className="wm-instructions">
                    {getInstructions(bank).map((line, i) => (
                      <p key={i} style={{ margin:'0 0 4px' }}>{line}</p>
                    ))}
                  </div>
                </div>

                <button className="wm-btn" onClick={handleClose}>Finalizar</button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WithdrawalModal;