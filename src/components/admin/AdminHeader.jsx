import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Shield, Settings, LogOut, LayoutDashboard, UserCircle, LifeBuoy, Menu } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const AdminHeader = ({ user, logout, onMenuClick }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-40 border-b border-slate-200">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
              <Menu className="w-6 h-6" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="text-slate-600 hover:text-blue-700 hover:bg-slate-100 hidden sm:inline-flex">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Vista de Usuario
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full focus-visible:ring-blue-500">
                  <Avatar className="h-10 w-10 border-2 border-slate-300">
                    <AvatarImage src="" alt="Admin" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-bold">A</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Administrador</p>
                    <p className="text-xs leading-none text-slate-500">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator/>
                 <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Mi Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Vista de Usuario</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast({ title: "🚧 Feature not implemented yet" })}>
                  <LifeBuoy className="mr-2 h-4 w-4" />
                  <span>Soporte</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;