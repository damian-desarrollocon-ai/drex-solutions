import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, Loader2 } from 'lucide-react';

const BalanceEditDialog = ({ user, onUpdate }) => {
  const [adjustmentAmount, setAdjustmentAmount] = useState('');
  const [reason, setReason] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (!isOpen) {
      setAdjustmentAmount('');
      setReason('');
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!reason) {
      alert("Por favor, especifica un motivo para el ajuste.");
      return;
    }
    const amount = parseFloat(adjustmentAmount);
    if (isNaN(amount)) {
      alert("La cantidad a ajustar debe ser un número válido.");
      return;
    }

    setLoading(true);
    await onUpdate(user.id, amount, reason);
    setLoading(false);
    setIsOpen(false);
  };
  
  const formatCurrency = (amount) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="w-4 h-4 mr-2" />
          Modificar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajustar Balance</DialogTitle>
          <DialogDescription>Modifica el saldo de {user.first_name} {user.last_name}.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p>Balance actual: <span className="font-bold">{formatCurrency(user.balance || 0)}</span></p>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="adjustment" className="text-right">Cantidad a Ajustar</Label>
            <Input id="adjustment" type="number" value={adjustmentAmount} onChange={(e) => setAdjustmentAmount(e.target.value)} className="col-span-3" placeholder="Ej: 100 o -50" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reason" className="text-right">Motivo</Label>
            <Input id="reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Ej. Bono de bienvenida" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirmar Ajuste'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BalanceEditDialog;