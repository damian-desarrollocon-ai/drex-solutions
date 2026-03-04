import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import ProfilePage from '@/pages/ProfilePage';
import { AuthProvider, useAuth } from '@/contexts/SupabaseAuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminTransactions from '@/pages/admin/AdminTransactions';
import AdminBalances from '@/pages/admin/AdminBalances';
import AdminSettings from '@/pages/admin/AdminSettings';
import AdminCodes from '@/pages/admin/AdminCodes';
import AdminVerifications from '@/pages/admin/AdminVerifications';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Loader2 } from 'lucide-react';
import { HelmetProvider } from 'react-helmet-async';
import TransactionsPage from '@/pages/TransactionsPage';

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-100">
    <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
  </div>
);

const ProtectedRoute = () => {
  const { user, loading, userProfile } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user || !userProfile) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

const AdminRoute = () => {
  const { user, loading, userProfile } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user || userProfile?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};


const AdminRoutes = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="transactions" element={<AdminTransactions />} />
        <Route path="balances" element={<AdminBalances />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="codes" element={<AdminCodes />} />
        <Route path="verifications" element={<AdminVerifications />} />
      </Routes>
    </AdminLayout>
  );
};

const UserRoutes = () => {
  return (
    <DashboardLayout>
       <Routes>
        <Route index element={<DashboardPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="transactions" element={<TransactionsPage />} />
      </Routes>
    </DashboardLayout>
  )
}

function App() {
  return (
    <HelmetProvider>
      <Router>
        <AuthProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard/*" element={<UserRoutes />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>

              <Route element={<AdminRoute />}>
                <Route path="/admin/*" element={<AdminRoutes />} />
              </Route>

            </Routes>
          <Toaster />
        </AuthProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;