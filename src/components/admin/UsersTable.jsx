import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, Users } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import UserActions from './UserActions';

const UsersTable = ({ users, onUpdateUser, onDeleteUser }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Gestión de Usuarios
          <Button onClick={() => toast({ title: "Función no implementada" })}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Usuario
          </Button>
        </CardTitle>
        <CardDescription>Administra todos los usuarios del sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.length > 0 ? users.map((user) => (
            <div key={user.id} className="border rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="" alt={user.firstName} />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-800">{user.firstName} {user.lastName}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <p className="text-xs text-gray-400">Registrado: {formatDate(user.createdAt)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <p className="font-semibold text-gray-800">{formatCurrency(user.balance || 0)}</p>
                  <p className="text-sm text-gray-500">Cuenta: ••••{user.accountNumber?.slice(-4)}</p>
                  {user.receiverAccount && <p className="text-xs text-blue-600">Receptora: {user.receiverAccount}</p>}
                </div>
                
                <UserActions user={user} onUpdateUser={onUpdateUser} onDeleteUser={onDeleteUser} />
              </div>
            </div>
          )) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3" />
              <p>No hay usuarios registrados</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UsersTable;