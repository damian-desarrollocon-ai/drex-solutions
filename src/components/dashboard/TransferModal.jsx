import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient.js';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Loader2, AlertTriangle, Send, ChevronLeft } from 'lucide-react';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  .tm-wrap { padding:1.75rem; font-family:'DM Sans',sans-serif; position:relative; }
  .tm-gold-bar { position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,#C9A455,transparent); }
  .tm-title { font-family:'Cormorant Garamond',serif; font-size:1.3rem; font-weight:700; color:#0D1F3C; margin:0 0 0.2rem; }
  .tm-desc  { font-size:0.8rem; color:#9B9B9B; margin:0 0 1.5rem; }
  .tm-label { font-size:0.68rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:#0D1F3C; display:block; margin-bottom:0.4rem; }
  .tm-input { font-family:'DM Sans',sans-serif !important; border-radius:0 !important; border:1px solid #D6D3CD !important; background:#FAFAF8 !important; color:#0D1F3C !important; height:42px !important; }
  .tm-input:focus { border-color:#C9A455 !important; box-shadow:0 0 0 2px rgba(201,164,85,0.12) !important; outline:none !important; }
  .tm-field { margin-bottom:1rem; }
  .tm-select-trigger { border-radius:0 !important; border:1px solid #D6D3CD !important; background:#FAFAF8 !important; height:42px !important; font-family:'DM Sans',sans-serif !important; font-size:0.875rem !important; color:#0D1F3C !important; }
  .tm-btn-primary { font-family:'DM Sans',sans-serif; font-size:0.78rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; width:100%; padding:0.8rem; background:#0D1F3C; color:#fff; border:none; cursor:pointer; transition:background 0.2s; margin-top:0.75rem; display:flex; align-items:center; justify-content:center; gap:0.5rem; }
  .tm-btn-primary:hover:not(:disabled) { background:#C9A455; color:#0D1F3C; }
  .tm-btn-primary:disabled { opacity:0.6; cursor:not-allowed; }
  .tm-btn-outline { font-family:'DM Sans',sans-serif; font-size:0.78rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; padding:0.7rem 1.1rem; background:transparent; color:#0D1F3C; border:1px solid #0D1F3C; cursor:pointer; transition:all 0.2s; display:flex; align-items:center; gap:0.4rem; }
  .tm-btn-outline:hover:not(:disabled) { background:#0D1F3C; color:#fff; }
  .tm-btn-outline:disabled { opacity:0.4; cursor:not-allowed; }
  .tm-footer { display:flex; gap:0.75rem; margin-top:0.75rem; }
  .tm-link-btn { background:none; border:none; cursor:pointer; color:#C9A455; font-size:0.75rem; font-weight:600; font-family:'DM Sans',sans-serif; padding:0; text-decoration:underline; }
  .tm-link-btn:hover { color:#B8892E; }
  .tm-warning { display:flex; align-items:flex-start; gap:0.75rem; padding:0.875rem 1rem; background:#FFFBEB; border:1px solid rgba(245,158,11,0.35); margin-top:0.5rem; }
  .tm-confirm-box { background:#FAFAF8; border:1px solid #E8E5DF; padding:1rem; margin-bottom:0.875rem; }
  .tm-confirm-row { display:flex; justify-content:space-between; align-items:center; padding:0.5rem 0; border-bottom:1px solid #F5F4F0; }
  .tm-confirm-row:last-child { border-bottom:none; }
  .tm-confirm-label { font-size:0.78rem; color:#9B9B9B; }
  .tm-confirm-value { font-size:0.875rem; font-weight:600; color:#0D1F3C; }
`;

const TransferModal = ({ isOpen, onClose, onTransferSuccess }) => {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();

  const [amount, setAmount]                     = useState('');
  const [recipientName, setRecipientName]       = useState('');
  const [recipientAccount, setRecipientAccount] = useState('');
  const [recipientBank, setRecipientBank]       = useState('Drex Bank');
  const [description, setDescription]           = useState('');
  const [beneficiaries, setBeneficiaries]       = useState([]);
  const [selectedBenef, setSelectedBenef]       = useState('');
  const [step, setStep]                         = useState(1);
  const [loading, setLoading]                   = useState(false);
  const [savingBenef, setSavingBenef]           = useState(false);

  const fmt = (a) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(a);

  useEffect(() => {
    if (!isOpen || !user) return;
    if (!userProfile?.transfers_enabled) {
      toast({ title: "Función Deshabilitada", description: "Las transferencias no están activadas. Contacta a tu asesor.", variant: "destructive", duration: 5000 });
      onClose();
      return;
    }
    fetchBeneficiaries();
    setStep(1); setAmount(''); setRecipientName(''); setRecipientAccount('');
    setRecipientBank('Drex Bank'); setDescription(''); setSelectedBenef('');
  }, [isOpen, user]);

  const fetchBeneficiaries = async () => {
    const { data } = await supabase.from('beneficiaries').select('*').eq('user_id', user.id);
    if (data) setBeneficiaries(data);
  };

  const handleBenefChange = (val) => {
    setSelectedBenef(val);
    if (val === 'new') { setRecipientName(''); setRecipientAccount(''); setRecipientBank('Drex Bank'); return; }
    const b = beneficiaries.find(b => b.id === val);
    if (b) { setRecipientName(b.name); setRecipientAccount(b.account_number || b.clabe); setRecipientBank(b.bank || 'Drex Bank'); }
  };

  const handleNext = () => {
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0)        { toast({ title: "Monto inválido", description: "El monto debe ser positivo.", variant: "destructive" }); return; }
    if (userProfile.balance < parsed)        { toast({ title: "Saldo insuficiente", variant: "destructive" }); return; }
    if (!recipientName || !recipientAccount) { toast({ title: "Faltan datos", description: "Nombre y cuenta son requeridos.", variant: "destructive" }); return; }
    if (recipientAccount.length !== 18)      { toast({ title: "CLABE inválida", description: "La CLABE debe tener 18 dígitos.", variant: "destructive" }); return; }
    setStep(2);
  };

  const handleSaveBenef = async () => {
    if (!recipientName || recipientAccount.length !== 18) {
      toast({ title: "Error", description: "Nombre y CLABE de 18 dígitos son requeridos.", variant: "destructive" }); return;
    }
    setSavingBenef(true);
    const { error } = await supabase.from('beneficiaries').insert({ user_id: user.id, name: recipientName, clabe: recipientAccount, bank: recipientBank });
    setSavingBenef(false);
    if (error) toast({ title: "Error", description: "No se pudo guardar.", variant: "destructive" });
    else { toast({ title: "Beneficiario guardado" }); fetchBeneficiaries(); }
  };

  const executeTransfer = async () => {
    setLoading(true);
    try {
      const parsed = parseFloat(amount);
      const isReversal = userProfile?.automatic_reversal_enabled || false;

      // 1. Descontar saldo al usuario
      const { error: balanceError } = await supabase
        .from('profiles')
        .update({ balance: userProfile.balance - parsed })
        .eq('id', user.id);
      if (balanceError) throw balanceError;

      // 2. Insertar la transacción
      const { data: txData, error: txError } = await supabase
        .from('transactions')
        .insert({
          user_id:          user.id,
          amount:           parsed,
          type:             'transfer',
          description:      description || 'Transferencia',
          status:           isReversal ? 'en_revision' : 'completed',
          recipient_name:   recipientName,
          withdrawal_bank:  recipientBank,
          reference:        recipientAccount,
        })
        .select()
        .single();
      if (txError) throw txError;

      // 3. Si tiene reversión automática → llamar RPC para marcar en revisión y programar reversión
      if (isReversal) {
        const { error: rpcError } = await supabase
          .rpc('reject_and_reverse_transaction', { p_transaction_id: txData.id });
        if (rpcError) throw rpcError;

        toast({
          title: "Transferencia en Revisión",
          description: `La transferencia a ${recipientName} está siendo revisada y será revertida en breve.`,
          variant: "destructive",
          duration: 6000,
        });
      } else {
        toast({
          title: "Transferencia Exitosa",
          description: `Transferencia a ${recipientName} procesada correctamente.`,
          duration: 5000,
        });
      }

      onTransferSuccess();
      onClose();
    } catch (err) {
      toast({ title: "Error en la Transferencia", description: err.message || "Error inesperado.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const showNewBenef = !selectedBenef || selectedBenef === 'new';

  return (
    <>
      <style>{STYLES}</style>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent style={{ borderRadius: 0, border: '1px solid #E8E5DF', padding: 0, overflow: 'hidden', maxWidth: '440px' }}>
          <div className="tm-wrap">
            <div className="tm-gold-bar" />

            <div className="tm-title">{step === 1 ? 'Nueva Transferencia' : 'Confirmar Transferencia'}</div>
            <div className="tm-desc">{step === 1 ? 'Introduce los datos de la transferencia.' : 'Revisa y confirma la operación.'}</div>

            {/* ── Step 1 ── */}
            {step === 1 && (
              <>
                <div className="tm-field">
                  <label className="tm-label">Monto (MXN)</label>
                  <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="tm-input" />
                </div>

                {beneficiaries.length > 0 && (
                  <div className="tm-field">
                    <label className="tm-label">Beneficiario Guardado</label>
                    <Select onValueChange={handleBenefChange} value={selectedBenef}>
                      <SelectTrigger className="tm-select-trigger">
                        <SelectValue placeholder="Seleccionar beneficiario" />
                      </SelectTrigger>
                      <SelectContent>
                        {beneficiaries.map(b => (
                          <SelectItem key={b.id} value={b.id}>{b.name} (••••{(b.clabe || b.account_number)?.slice(-4)})</SelectItem>
                        ))}
                        <SelectItem value="new">+ Nuevo beneficiario</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {showNewBenef && (
                  <>
                    <div className="tm-field">
                      <label className="tm-label">Nombre del Destinatario</label>
                      <Input value={recipientName} onChange={e => setRecipientName(e.target.value)} placeholder="Nombre completo" className="tm-input" />
                    </div>
                    <div className="tm-field">
                      <label className="tm-label">CLABE (18 dígitos)</label>
                      <Input value={recipientAccount} onChange={e => setRecipientAccount(e.target.value)} placeholder="18 dígitos" maxLength="18" className="tm-input" />
                    </div>
                    <div className="tm-field">
                      <label className="tm-label">Banco</label>
                      <Input value={recipientBank} onChange={e => setRecipientBank(e.target.value)} className="tm-input" />
                    </div>
                    <button className="tm-link-btn" onClick={handleSaveBenef} disabled={savingBenef}>
                      {savingBenef ? 'Guardando...' : '+ Guardar como beneficiario'}
                    </button>
                  </>
                )}

                <div className="tm-field" style={{ marginTop: '0.875rem' }}>
                  <label className="tm-label">Concepto (opcional)</label>
                  <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Ej. Pago de servicios" className="tm-input" />
                </div>

                <button className="tm-btn-primary" onClick={handleNext}>
                  Continuar <Send style={{ width: '14px', height: '14px' }} />
                </button>
              </>
            )}

            {/* ── Step 2 ── */}
            {step === 2 && (
              <>
                <div className="tm-confirm-box">
                  <div className="tm-confirm-row">
                    <span className="tm-confirm-label">Monto</span>
                    <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.25rem', fontWeight: 700, color: '#0D1F3C' }}>{fmt(parseFloat(amount))}</span>
                  </div>
                  <div className="tm-confirm-row">
                    <span className="tm-confirm-label">Para</span>
                    <span className="tm-confirm-value">{recipientName}</span>
                  </div>
                  <div className="tm-confirm-row">
                    <span className="tm-confirm-label">CLABE</span>
                    <span className="tm-confirm-value" style={{ fontFamily: 'monospace' }}>••••{recipientAccount.slice(-4)}</span>
                  </div>
                  <div className="tm-confirm-row">
                    <span className="tm-confirm-label">Banco</span>
                    <span className="tm-confirm-value">{recipientBank}</span>
                  </div>
                  <div className="tm-confirm-row">
                    <span className="tm-confirm-label">Concepto</span>
                    <span className="tm-confirm-value">{description || 'Transferencia'}</span>
                  </div>
                </div>

                <div className="tm-warning">
                  <AlertTriangle style={{ color: '#F59E0B', width: '16px', height: '16px', flexShrink: 0, marginTop: '2px' }} />
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.78rem', color: '#92400E', margin: 0, lineHeight: 1.5 }}>
                    Esta operación es irreversible. Verifica que los datos sean correctos antes de confirmar.
                  </p>
                </div>

                <div className="tm-footer">
                  <button className="tm-btn-outline" onClick={() => setStep(1)} disabled={loading}>
                    <ChevronLeft style={{ width: '13px', height: '13px' }} /> Atrás
                  </button>
                  <button className="tm-btn-primary" style={{ flex: 1, marginTop: 0 }} onClick={executeTransfer} disabled={loading}>
                    {loading
                      ? <><Loader2 style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} /> Procesando...</>
                      : 'Confirmar Transferencia'}
                  </button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TransferModal;