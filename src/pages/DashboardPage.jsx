import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Send, Download, User, Eye, EyeOff, Loader2, Award, Check, Landmark, AlertTriangle, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { toast } from '@/components/ui/use-toast';
import DigitalCard from '@/components/dashboard/DigitalCard';
import TransferModal from '@/components/dashboard/TransferModal';
import ReceiveInfo from '@/components/dashboard/ReceiveInfo';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import { supabase } from '@/lib/customSupabaseClient.js';
import WithdrawalModal from '@/components/dashboard/WithdrawalModal';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const ActionButton = ({ action, icon: Icon, label, color, onClick, isEnabled }) => {
  const content = (
    <div className={cn(
      "h-24 flex flex-col items-center justify-center text-slate-700 border-slate-200 transition-all duration-200",
      isEnabled ? "cursor-pointer hover:bg-slate-50 hover:border-blue-500" : "cursor-not-allowed bg-slate-50 text-slate-400"
    )}>
      <Icon className={cn("w-6 h-6 mb-2", isEnabled ? color : "text-slate-400")} />
      {label}
    </div>
  );

  if (isEnabled) {
    return <Button onClick={() => onClick(action)} variant="outline" className="h-auto p-0">{content}</Button>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="h-24 w-full rounded-md border">{content}</div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Función deshabilitada. Contacta a tu asesor.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, userProfile, loading: authLoading, fetchUserProfile } = useAuth();
  const [showBalance, setShowBalance] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const [isProductsModalOpen, setIsProductsModalOpen] = useState(false);
  const [isReceiveInfoOpen, setIsReceiveInfoOpen] = useState(false);
  const [showLimitWarning, setShowLimitWarning] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    if (!user) return;
    setLoadingTransactions(true);
    try {
      const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);
      
      if (error) throw error;
      
      setTransactions(data);

    } catch (error) {
      toast({ title: "Error", description: "No se pudieron cargar los datos del dashboard.", variant: "destructive" });
    } finally {
      setLoadingTransactions(false);
    }
  }, [user, toast]);

  const checkTransactionLimit = useCallback(async () => {
    if (!user || !userProfile || !userProfile.transaction_limit_enabled) {
      setShowLimitWarning(false);
      return;
    }

    const { data: settings, error: settingsError } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', 'account_level_limits')
      .single();

    if (settingsError || !settings) return;

    const limits = settings.value;
    const userLimit = limits[userProfile.account_level] || 5;

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const { count, error: countError } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', firstDayOfMonth);

    if (countError) return;

    if (count >= userLimit) {
      setShowLimitWarning(true);
    } else {
      setShowLimitWarning(false);
    }
  }, [user, userProfile]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { replace: true });
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (userProfile) {
      fetchDashboardData();
      checkTransactionLimit();
      const welcomeToast = sessionStorage.getItem('welcome_toast_shown');
      if (!welcomeToast && userProfile?.first_name) {
        toast({
          title: `¡Bienvenido, ${userProfile.first_name}!`,
          description: "Tu sesión ha iniciado correctamente.",
        });
        sessionStorage.setItem('welcome_toast_shown', 'true');
      }
    }
  }, [userProfile, fetchDashboardData, checkTransactionLimit, toast]);
  
  const handleSuccess = () => {
    fetchUserProfile();
    fetchDashboardData();
    checkTransactionLimit();
  };

  const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return 'N/A';
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const handleActionClick = (action) => {
    switch(action) {
      case 'transfer':
        setIsTransferModalOpen(true);
        break;
      case 'withdraw':
        setIsWithdrawalModalOpen(true);
        break;
      case 'products':
        toast({ title: "Función Deshabilitada", description: "Contacta a tu asesor para habilitar esta función.", variant: "destructive" });
        break;
      default:
        break;
    }
  };

  const getCardStatusBadge = (status) => {
    switch (status) {
      case 'activa':
        return <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded-full">Activa</span>;
      case 'bloqueada':
        return <span className="text-xs font-medium bg-red-100 text-red-800 px-2 py-1 rounded-full">Bloqueada</span>;
      case 'desactivada':
      default:
        return <span className="text-xs font-medium bg-gray-100 text-gray-800 px-2 py-1 rounded-full">Desactivada</span>;
    }
  };

  if (authLoading || !userProfile) {
    return <div className="flex-1 flex items-center justify-center bg-blue-50/50"><Loader2 className="w-12 h-12 animate-spin text-blue-500" /></div>;
  }

  if (userProfile.verification_status === 'pending') {
    return (
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-lg">
          <Card className="bg-blue-50/50 backdrop-blur-sm shadow-lg rounded-xl border-blue-200/50 p-8">
            <Clock className="w-16 h-16 mx-auto text-blue-500 mb-4" />
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-800">Cuenta en Revisión</h1>
            <p className="text-slate-500 text-lg mt-2">
              Gracias por registrarte. Estamos verificando tus documentos para asegurar tu cuenta.
            </p>
            <p className="text-slate-500 text-sm mt-4">
              Este proceso suele tardar menos de 24 horas. Te notificaremos por correo electrónico una vez que tu cuenta esté activa.
            </p>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - Drex Solutions</title>
        <meta name="description" content="Gestiona tu cuenta bancaria de Drex Solutions." />
      </Helmet>

      <div className="flex-1 p-4 sm:p-6 md:p-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-800">¡Hola, {userProfile.first_name}!</h1>
          <p className="text-slate-500 text-lg">Bienvenido a tu centro de control financiero.</p>
        </motion.div>
        
        {showLimitWarning && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <Card className="bg-yellow-50 border-yellow-400">
              <CardContent className="p-4 flex items-center space-x-4">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
                <div>
                  <h3 className="font-bold text-yellow-800">Límite de Movimientos Alcanzado</h3>
                  <p className="text-sm text-yellow-700">Has alcanzado el límite de tu cuenta. Contacta a un ejecutivo para seguir operando.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="bg-blue-50/50 backdrop-blur-sm shadow-lg rounded-xl border-blue-200/50">
                <CardHeader>
                  <CardTitle className="text-slate-600">Balance Disponible</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-800">
                      {showBalance ? formatCurrency(userProfile.balance) : '••••••'}
                    </h2>
                    <Button variant="ghost" size="icon" onClick={() => setShowBalance(!showBalance)} className="text-slate-500 hover:bg-slate-100">
                      {showBalance ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <div className="block lg:hidden">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Card className="bg-blue-50/50 backdrop-blur-sm shadow-lg rounded-xl border-blue-200/50">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-slate-600">Tarjeta Digital</CardTitle>
                    {getCardStatusBadge(userProfile.digital_card_status)}
                  </CardHeader>
                  <CardContent>
                    <DigitalCard user={userProfile} />
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="bg-blue-50/50 backdrop-blur-sm shadow-lg rounded-xl border-blue-200/50">
                  <CardHeader><CardTitle className="text-slate-600">Acciones Rápidas</CardTitle></CardHeader>
                  <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    <ActionButton action="transfer" icon={Send} label="Enviar" color="text-blue-500" onClick={handleActionClick} isEnabled={userProfile.transfers_enabled} />
                    <ActionButton action="receive" icon={Download} label="Recibir" color="text-green-500" onClick={() => setIsReceiveInfoOpen(true)} isEnabled={true} />
                    <ActionButton action="withdraw" icon={Landmark} label="Retiro" color="text-purple-500" onClick={handleActionClick} isEnabled={userProfile.withdrawals_enabled} />
                    <ActionButton action="products" icon={Award} label="Productos" color="text-orange-500" onClick={handleActionClick} isEnabled={false} />
                    <ActionButton action="profile" icon={User} label="Mi Perfil" color="text-indigo-500" onClick={() => navigate('/dashboard/profile')} isEnabled={true} />
                  </CardContent>
                </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              {loadingTransactions ? <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div> : <RecentTransactions transactions={transactions} />}
            </motion.div>
          </div>

          <div className="lg:col-span-1 hidden lg:block">
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Card className="bg-blue-50/50 backdrop-blur-sm shadow-lg rounded-xl border-blue-200/50">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-slate-600">Tarjeta Digital</CardTitle>
                    {getCardStatusBadge(userProfile.digital_card_status)}
                  </CardHeader>
                  <CardContent>
                    <DigitalCard user={userProfile} />
                  </CardContent>
                </Card>
              </motion.div>
          </div>
        </div>
      </div>
      
      <TransferModal isOpen={isTransferModalOpen} onClose={() => setIsTransferModalOpen(false)} onTransferSuccess={handleSuccess} />
      <WithdrawalModal isOpen={isWithdrawalModalOpen} onClose={() => setIsWithdrawalModalOpen(false)} onWithdrawalSuccess={handleSuccess} />

      <Dialog open={isProductsModalOpen} onOpenChange={setIsProductsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Nuestros Productos</DialogTitle>
            <DialogDescription>Descubre los productos financieros que tenemos para ti.</DialogDescription>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-6 pt-4">
            <Card>
              <CardHeader><CardTitle>Crédito Personal</CardTitle><CardDescription>Financia tus proyectos y metas.</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start"><Check className="w-4 h-4 mr-2 mt-1 text-green-500" /><span>Desde $5,000 hasta $100,000 MXN.</span></li>
                  <li className="flex items-start"><Check className="w-4 h-4 mr-2 mt-1 text-green-500" /><span>Plazos de 6 a 36 meses.</span></li>
                  <li className="flex items-start"><Check className="w-4 h-4 mr-2 mt-1 text-green-500" /><span>Tasa de interés competitiva.</span></li>
                </ul>
                <h4 className="font-semibold pt-2">Requisitos:</h4>
                <ul className="space-y-1 text-xs text-gray-500"><li>- Buen historial crediticio.</li><li>- Comprobante de ingresos.</li><li>- Identificación oficial.</li></ul>
                <Button className="w-full mt-4" onClick={() => toast({ title: "Próximamente" })}>Solicitar ahora</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Tarjeta de Crédito Drex</CardTitle><CardDescription>Tu aliada para compras y beneficios.</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-gray-600">
                   <li className="flex items-start"><Check className="w-4 h-4 mr-2 mt-1 text-green-500" /><span>Cashback en todas tus compras.</span></li>
                   <li className="flex items-start"><Check className="w-4 h-4 mr-2 mt-1 text-green-500" /><span>Meses sin intereses en comercios.</span></li>
                   <li className="flex items-start"><Check className="w-4 h-4 mr-2 mt-1 text-green-500" /><span>Seguros de viaje y compras.</span></li>
                </ul>
                 <h4 className="font-semibold pt-2">Requisitos:</h4>
                <ul className="space-y-1 text-xs text-gray-500"><li>- Ingreso mínimo mensual de $10,000.</li><li>- Sin historial negativo grave.</li><li>- Identificación oficial.</li></ul>
                <Button className="w-full mt-4" onClick={() => toast({ title: "Próximamente" })}>Conocer más</Button>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isReceiveInfoOpen} onOpenChange={setIsReceiveInfoOpen}>
        <DialogContent><ReceiveInfo user={userProfile} /></DialogContent>
      </Dialog>

    </>
  );
};

export default DashboardPage;