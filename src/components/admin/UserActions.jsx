import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DollarSign, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const UserActions = ({ user, onUpdateUser, onDeleteUser }) => {
  const [newBalance, setNewBalance] = useState('');
  const [newReceiverAccount, setNewReceiverAccount] = useState('');

  const handleUpdateBalance = () => {
    onUpdateUser(user.id, { balance: parseFloat(newBalance) || 0 });
    toast({ title: "Balance actualizado" });
    setNewBalance('');
  };

  const handleUpdateReceiverAccount = () => {
    onUpdateUser(user.id, { receiverAccount: newReceiverAccount });
    toast({ title: "Cuenta receptora actualizada" });
    setNewReceiverAccount('');
  };

  const handleToggleStatus = () => {
    onUpdateUser(user.id, { isActive: !(user.isActive !== false) });
    toast({ title: "Estado actualizado" });
  };

  return (
    <div className="flex items-center space-x-1">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="text-green-500 hover:text-green-600 hover:bg-green-100">
            <DollarSign className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modificar Balance</DialogTitle>
            <DialogDescription>Actualizar el balance de {user.firstName} {user.lastName}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Label>Balance actual: {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(user.balance || 0)}</Label>
            <Input type="number" value={newBalance} onChange={(e) => setNewBalance(e.target.value)} placeholder="Nuevo balance" />
            <Button onClick={handleUpdateBalance} className="w-full">Actualizar Balance</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-600 hover:bg-blue-100">
            <Edit className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Asignar Cuenta Receptora</DialogTitle>
            <DialogDescription>Configurar cuenta para {user.firstName} {user.lastName}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Label>Cuenta actual: {user.receiverAccount || 'No asignada'}</Label>
            <Input value={newReceiverAccount} onChange={(e) => setNewReceiverAccount(e.target.value)} placeholder="Nueva cuenta receptora" />
            <Button onClick={handleUpdateReceiverAccount} className="w-full">Asignar Cuenta</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggleStatus}
        className={user.isActive !== false ? 'text-green-500 hover:text-green-600 hover:bg-green-100' : 'text-red-500 hover:text-red-600 hover:bg-red-100'}
      >
        {user.isActive !== false ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDeleteUser(user.id)}
        className="text-red-500 hover:text-red-600 hover:bg-red-100"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default UserActions;