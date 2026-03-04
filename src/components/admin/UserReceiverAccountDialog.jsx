import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ArrowRightLeft, Loader2 } from 'lucide-react';

const UserReceiverAccountDialog = ({ user, onUpdateReceiverAccount }) => {
  const [newAccount, setNewAccount] = useState('');
  const [isOpen, setIsOpen]   = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    await onUpdateReceiverAccount(user.id, newAccount);
    setNewAccount(''); setLoading(false); setIsOpen(false);
  };

  return (
    <>
      <style>{`
        .rcd-trigger { width:30px; height:30px; display:flex; align-items:center; justify-content:center; border:1px solid rgba(96,165,250,0.3); background:transparent; cursor:pointer; color:#60A5FA; transition:all 0.18s; }
        .rcd-trigger:hover { border-color:#60A5FA; background:rgba(96,165,250,0.06); }
        .rcd-label { font-family:'DM Sans',sans-serif; font-size:0.72rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:#0D1F3C; display:block; margin-bottom:0.4rem; }
        .rcd-input { font-family:'DM Sans',sans-serif !important; border-radius:0 !important; border:1px solid #D6D3CD !important; background:#FAFAF8 !important; color:#0D1F3C !important; height:42px !important; }
        .rcd-input:focus { border-color:#C9A455 !important; box-shadow:0 0 0 2px rgba(201,164,85,0.12) !important; outline:none !important; }
        .rcd-btn { font-family:'DM Sans',sans-serif; font-size:0.78rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; width:100%; padding:0.75rem; background:#0D1F3C; color:#fff; border:none; cursor:pointer; transition:background 0.2s; margin-top:0.75rem; }
        .rcd-btn:hover { background:#C9A455; color:#0D1F3C; }
      `}</style>
      <button className="rcd-trigger" onClick={() => setIsOpen(true)} title="Cuenta receptora">
        <ArrowRightLeft style={{ width:'13px', height:'13px' }} />
      </button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent style={{ borderRadius:0, border:'1px solid #E8E5DF', fontFamily:"'DM Sans',sans-serif" }}>
          <div style={{ height:'2px', background:'linear-gradient(90deg,#C9A455,transparent)', position:'absolute', top:0, left:0, right:0 }} />
          <DialogHeader>
            <DialogTitle style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.3rem', fontWeight:700, color:'#0D1F3C' }}>
              Cuenta Receptora
            </DialogTitle>
            <DialogDescription style={{ color:'#9B9B9B', fontSize:'0.82rem' }}>
              {user.first_name} {user.last_name} · Actual: <strong style={{ color:'#0D1F3C' }}>{user.receiver_account || 'No asignada'}</strong>
            </DialogDescription>
          </DialogHeader>
          <div style={{ paddingTop:'1rem' }}>
            <label className="rcd-label">Nueva Cuenta Receptora</label>
            <Input value={newAccount} onChange={(e) => setNewAccount(e.target.value)} placeholder="Número de cuenta" className="rcd-input" />
            <button className="rcd-btn" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Guardando...' : 'Asignar Cuenta'}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserReceiverAccountDialog;