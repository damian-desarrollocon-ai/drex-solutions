import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ShieldCheck, ArrowRight, Upload, Camera, Eye, EyeOff, Loader2, UserCheck } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient.js';
import LandingHeader from '@/components/landing/LandingHeader';

// ── Shared styles ──────────────────────────────────────────────
const S = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700;400i&family=DM+Sans:wght@300;400;500;600&display=swap');

  .reg-bg {
    min-height: 100vh;
    background: #0D1F3C;
    background-image:
      linear-gradient(rgba(201,164,85,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(201,164,85,0.04) 1px, transparent 1px);
    background-size: 60px 60px;
    position: relative;
  }
  .reg-bg::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 60% 40%, rgba(26,58,107,0.6) 0%, transparent 65%);
    pointer-events: none;
  }
  .reg-card {
    background: #fff !important;
    border-radius: 0 !important;
    border: 1px solid #E8E5DF !important;
    box-shadow: 0 32px 80px rgba(0,0,0,0.35) !important;
    overflow: hidden;
    position: relative;
  }
  .reg-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, #C9A455, rgba(201,164,85,0.3));
  }
  .reg-label {
    font-family: 'DM Sans', sans-serif !important;
    font-size: 0.72rem !important;
    font-weight: 600 !important;
    letter-spacing: 0.08em !important;
    text-transform: uppercase !important;
    color: #0D1F3C !important;
    display: block;
    margin-bottom: 0.4rem;
  }
  .reg-input {
    font-family: 'DM Sans', sans-serif !important;
    font-size: 0.88rem !important;
    border-radius: 0 !important;
    border: 1px solid #D6D3CD !important;
    background: #FAFAF8 !important;
    color: #0D1F3C !important;
    height: 42px !important;
    transition: border-color 0.2s !important;
  }
  .reg-input:focus {
    border-color: #C9A455 !important;
    box-shadow: 0 0 0 2px rgba(201,164,85,0.15) !important;
    outline: none !important;
  }
  .reg-select-trigger {
    font-family: 'DM Sans', sans-serif !important;
    border-radius: 0 !important;
    border: 1px solid #D6D3CD !important;
    background: #FAFAF8 !important;
    color: #0D1F3C !important;
    height: 42px !important;
  }
  .reg-btn-primary {
    font-family: 'DM Sans', sans-serif !important;
    font-size: 0.78rem !important;
    font-weight: 700 !important;
    letter-spacing: 0.1em !important;
    text-transform: uppercase !important;
    background: #0D1F3C !important;
    color: #fff !important;
    border-radius: 0 !important;
    height: 44px !important;
    border: 1px solid #0D1F3C !important;
    transition: all 0.25s !important;
  }
  .reg-btn-primary:hover:not(:disabled) {
    background: #C9A455 !important;
    border-color: #C9A455 !important;
    color: #0D1F3C !important;
  }
  .reg-btn-primary:disabled { opacity: 0.6 !important; }

  .reg-btn-outline {
    font-family: 'DM Sans', sans-serif !important;
    font-size: 0.78rem !important;
    font-weight: 600 !important;
    letter-spacing: 0.08em !important;
    text-transform: uppercase !important;
    background: transparent !important;
    color: #0D1F3C !important;
    border-radius: 0 !important;
    height: 44px !important;
    border: 1px solid #0D1F3C !important;
    transition: all 0.25s !important;
  }
  .reg-btn-outline:hover:not(:disabled) {
    background: #0D1F3C !important;
    color: #fff !important;
  }

  .reg-btn-success {
    font-family: 'DM Sans', sans-serif !important;
    font-size: 0.78rem !important;
    font-weight: 700 !important;
    letter-spacing: 0.1em !important;
    text-transform: uppercase !important;
    background: #C9A455 !important;
    color: #0D1F3C !important;
    border-radius: 0 !important;
    height: 44px !important;
    border: 1px solid #C9A455 !important;
    transition: all 0.25s !important;
  }
  .reg-btn-success:hover:not(:disabled) {
    background: #0D1F3C !important;
    color: #fff !important;
    border-color: #0D1F3C !important;
  }
  .reg-btn-success:disabled { opacity: 0.6 !important; }

  .reg-upload-btn {
    font-family: 'DM Sans', sans-serif !important;
    font-size: 0.78rem !important;
    font-weight: 600 !important;
    letter-spacing: 0.06em !important;
    text-transform: uppercase !important;
    border: 1px dashed #C9A455 !important;
    border-radius: 0 !important;
    height: 44px !important;
    color: #6B6B6B !important;
    background: #FAFAF8 !important;
    transition: all 0.2s !important;
    width: 100% !important;
  }
  .reg-upload-btn:hover {
    background: rgba(201,164,85,0.06) !important;
    color: #0D1F3C !important;
    border-color: #0D1F3C !important;
    border-style: solid !important;
  }

  .reg-progress-bar {
    height: 3px;
    background: #E8E5DF;
    margin: 1rem 0 0;
    position: relative;
    overflow: hidden;
  }
  .reg-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #0D1F3C, #C9A455);
    transition: width 0.5s ease;
  }

  .reg-step-badge {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #C9A455;
    background: rgba(201,164,85,0.1);
    border: 1px solid rgba(201,164,85,0.3);
    padding: 0.3rem 0.75rem;
    display: inline-block;
  }

  .reg-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, #E8E5DF, transparent);
    margin: 1.25rem 0;
  }
`;

// ── Utility: same as original ──────────────────────────────────
const fileToBuffer = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = (error) => {
      console.error("FileReader Error:", error);
      reject(new Error("Error de lectura del archivo (NotReadableError). Por favor, intenta de nuevo y usa una imagen de menor tamaño o tomada directamente desde la cámara del dispositivo."));
    };
    reader.readAsArrayBuffer(file);
  });
};

// ── SelfieGuide (functional unchanged, style updated) ──────────
const SelfieGuide = ({ onCapture, onCancel }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [feedback, setFeedback] = useState("Centra tu rostro en el óvalo");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let intervalId;
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          intervalId = setInterval(() => {
            const feedbacks = ["Acércate un poco más", "Aléjate un poco", "¡Perfecto! Quédate quieto"];
            const randomFeedback = feedbacks[Math.floor(Math.random() * feedbacks.length)];
            setFeedback(randomFeedback);
            setIsReady(randomFeedback === "¡Perfecto! Quédate quieto");
          }, 2000);
        }
      } catch (err) {
        toast({ title: "Error de cámara", description: "No se pudo acceder a la cámara.", variant: "destructive" });
        onCancel();
      }
    };
    startCamera();
    return () => {
      if (intervalId) clearInterval(intervalId);
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [onCancel]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      canvas.toBlob(blob => { onCapture(blob); }, 'image/jpeg', 0.9);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(7,15,30,0.95)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', zIndex: 50, padding: '1rem',
      fontFamily: "'DM Sans', sans-serif"
    }}>
      {/* Top accent */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, #C9A455, transparent)' }} />
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C9A455' }}>
          Verificación Biométrica
        </span>
      </div>
      <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
        <video ref={videoRef} autoPlay playsInline style={{ width: '100%', border: '1px solid rgba(201,164,85,0.3)' }}></video>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <div style={{ width: '75%', height: '90%', border: '2px dashed rgba(201,164,85,0.7)', borderRadius: '50%' }}></div>
        </div>
      </div>
      <p style={{ color: '#E8C97A', fontSize: '0.9rem', fontWeight: 600, marginTop: '1.25rem', textAlign: 'center' }}>
        {feedback}
      </p>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
        <button onClick={onCancel} style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', fontWeight: 600,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          padding: '0.75rem 1.5rem', background: 'transparent',
          color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.2)',
          cursor: 'pointer', transition: 'all 0.2s'
        }}>
          Cancelar
        </button>
        <button onClick={handleCapture} disabled={!isReady} style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', fontWeight: 700,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          padding: '0.75rem 1.5rem', background: isReady ? '#C9A455' : 'rgba(201,164,85,0.3)',
          color: isReady ? '#0D1F3C' : 'rgba(255,255,255,0.3)', border: 'none',
          cursor: isReady ? 'pointer' : 'not-allowed', transition: 'all 0.2s',
          display: 'flex', alignItems: 'center', gap: '0.5rem'
        }}>
          <Camera style={{ width: '14px', height: '14px' }} /> Tomar Foto
        </button>
      </div>
      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  );
};

// ── Step forms (functional unchanged, labels styled) ──────────
const Step1Form = ({ formData, handleChange, showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword, countries }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div><label className="reg-label">Nombre(s)</label><Input name="firstName" value={formData.firstName} onChange={handleChange} className="reg-input" /></div>
      <div><label className="reg-label">Apellidos</label><Input name="lastName" value={formData.lastName} onChange={handleChange} className="reg-input" /></div>
    </div>
    <div><label className="reg-label">CURP (Opcional)</label><Input name="curp" value={formData.curp} onChange={handleChange} maxLength={18} className="reg-input" /></div>
    <div>
      <label className="reg-label">País de Origen</label>
      <Select value={formData.country} onValueChange={(v) => handleChange({ target: { name: 'country', value: v } })}>
        <SelectTrigger className="reg-select-trigger"><SelectValue placeholder="Selecciona tu país" /></SelectTrigger>
        <SelectContent>{countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
      </Select>
    </div>
    <div><label className="reg-label">Correo Electrónico</label><Input name="email" type="email" value={formData.email} onChange={handleChange} className="reg-input" /></div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="reg-label">Contraseña</label>
        <div className="relative">
          <Input name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} className="reg-input" style={{ paddingRight: '3rem' }} />
          <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3" style={{ borderRadius: 0 }} onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>
      </div>
      <div>
        <label className="reg-label">Confirmar Contraseña</label>
        <div className="relative">
          <Input name="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleChange} className="reg-input" style={{ paddingRight: '3rem' }} />
          <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3" style={{ borderRadius: 0 }} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
    <div><label className="reg-label">Teléfono</label><Input name="phone" value={formData.phone} onChange={handleChange} className="reg-input" /></div>
    <div><label className="reg-label">Dirección</label><Input name="address" value={formData.address} onChange={handleChange} className="reg-input" /></div>
  </div>
);

const Step2Form = ({ formData, handleChange }) => (
  <div style={{ padding: '1rem 0' }}>
    <div style={{
      padding: '1.5rem', background: 'rgba(13,31,60,0.04)',
      border: '1px solid #E8E5DF', marginBottom: '1.5rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <div style={{ width: '32px', height: '32px', background: '#0D1F3C', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <ShieldCheck style={{ color: '#C9A455', width: '16px', height: '16px' }} />
        </div>
        <div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem', fontWeight: 600, color: '#0D1F3C', margin: 0 }}>Acceso por Invitación</p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: '#6B6B6B', margin: 0, fontWeight: 300 }}>Este código te lo proporciona un administrador</p>
        </div>
      </div>
    </div>
    <div>
      <label className="reg-label">Código de Invitación</label>
      <Input
        name="registrationCode"
        value={formData.registrationCode}
        onChange={handleChange}
        placeholder="Ingresa tu código único"
        className="reg-input"
        style={{ letterSpacing: '0.1em', fontSize: '1rem' }}
      />
    </div>
  </div>
);

const Step3Form = ({ formData, handleFileChange, previews, onSelfieClick, onTermsChange }) => (
  <div className="space-y-5">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div>
        <label className="reg-label">INE (Frente)</label>
        <Input id="ineFront" name="ineFront" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        <button type="button" className="reg-upload-btn" onClick={() => document.getElementById('ineFront').click()}>
          <Upload style={{ display: 'inline', width: '14px', height: '14px', marginRight: '0.5rem' }} />
          Subir Frente
        </button>
        {previews.ineFront && (
          <img src={previews.ineFront} alt="Vista previa INE frente"
            style={{ marginTop: '0.75rem', width: '100%', height: '120px', objectFit: 'contain', border: '1px solid #E8E5DF', padding: '4px' }} />
        )}
      </div>
      <div>
        <label className="reg-label">INE (Reverso)</label>
        <Input id="ineBack" name="ineBack" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        <button type="button" className="reg-upload-btn" onClick={() => document.getElementById('ineBack').click()}>
          <Upload style={{ display: 'inline', width: '14px', height: '14px', marginRight: '0.5rem' }} />
          Subir Reverso
        </button>
        {previews.ineBack && (
          <img src={previews.ineBack} alt="Vista previa INE reverso"
            style={{ marginTop: '0.75rem', width: '100%', height: '120px', objectFit: 'contain', border: '1px solid #E8E5DF', padding: '4px' }} />
        )}
      </div>
    </div>

    <div>
      <label className="reg-label">Selfie (Biometría)</label>
      <button type="button" className="reg-upload-btn" onClick={onSelfieClick}>
        <Camera style={{ display: 'inline', width: '14px', height: '14px', marginRight: '0.5rem' }} />
        Verificación Facial
      </button>
      {previews.selfie && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1rem', gap: '0.5rem' }}>
          <img src={previews.selfie} alt="Vista previa selfie"
            style={{ width: '96px', height: '96px', objectFit: 'cover', border: '3px solid #C9A455', borderRadius: '50%' }} />
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <UserCheck style={{ width: '14px', height: '14px' }} /> Selfie capturada
          </span>
        </div>
      )}
    </div>

    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem', background: '#FAFAF8', border: '1px solid #E8E5DF' }}>
      <Checkbox id="acceptTerms" checked={formData.acceptTerms} onCheckedChange={onTermsChange} style={{ marginTop: '2px' }} />
      <label htmlFor="acceptTerms" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem', color: '#4A4A4A', lineHeight: 1.6, cursor: 'pointer' }}>
        Acepto los{' '}
        <button type="button" style={{ background: 'none', border: 'none', color: '#C9A455', fontWeight: 600, cursor: 'pointer', padding: 0, fontSize: '0.82rem', fontFamily: "'DM Sans', sans-serif", textDecoration: 'underline' }}>términos</button>
        {' '}y la{' '}
        <button type="button" style={{ background: 'none', border: 'none', color: '#C9A455', fontWeight: 600, cursor: 'pointer', padding: 0, fontSize: '0.82rem', fontFamily: "'DM Sans', sans-serif", textDecoration: 'underline' }}>política de privacidad</button>.
      </label>
    </div>
  </div>
);

// ── Main RegisterPage ──────────────────────────────────────────
const RegisterPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', curp: '', country: 'México', email: '',
    password: '', confirmPassword: '', phone: '', address: '',
    registrationCode: '', acceptTerms: false, ineFront: null, ineBack: null, selfie: null,
  });
  const [previews, setPreviews] = useState({ ineFront: null, ineBack: null, selfie: null });
  const [isTakingSelfie, setIsTakingSelfie] = useState(false);

  const countries = ['México', 'Estados Unidos', 'Canadá', 'España', 'Argentina', 'Colombia'];

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }, []);

  const handleFileChange = useCallback((e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      const maxFileSize = 5 * 1024 * 1024;
      if (!file.type.startsWith('image/')) {
        toast({ title: "Formato inválido", description: "Por favor, sube solo archivos de imagen.", variant: "destructive" });
        return;
      }
      if (file.size > maxFileSize) {
        toast({ title: "Archivo muy grande", description: `El archivo excede el límite de ${maxFileSize / 1024 / 1024}MB.`, variant: "destructive" });
        return;
      }
      setFormData(prev => ({ ...prev, [name]: file }));
      setPreviews(prev => ({ ...prev, [name]: URL.createObjectURL(file) }));
    }
  }, []);

  const handleSelfieCapture = useCallback((blob) => {
    const selfieFile = new File([blob], "selfie.jpeg", { type: "image/jpeg" });
    setFormData(prev => ({ ...prev, selfie: selfieFile }));
    setPreviews(prev => ({ ...prev, selfie: URL.createObjectURL(blob) }));
    setIsTakingSelfie(false);
  }, []);

  const onTermsChange = useCallback((checked) => {
    setFormData(prev => ({ ...prev, acceptTerms: checked }));
  }, []);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateCURP = (curp) => /^[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$/i.test(curp);
  const validatePassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{8,}$/.test(password);

  const validateStep1 = useCallback(() => {
    const { firstName, lastName, country, email, password, confirmPassword, phone, address } = formData;
    if (!firstName || !lastName || !country || !email || !password || !confirmPassword || !phone || !address) {
      toast({ title: "Campos requeridos", description: "Por favor completa todos los campos obligatorios.", variant: "destructive" });
      return false;
    }
    if (!validateEmail(email)) { toast({ title: "Correo inválido", description: "Por favor ingresa un correo electrónico válido.", variant: "destructive" }); return false; }
    const trimmedCurp = formData.curp.trim();
    if (trimmedCurp.length > 0 && !validateCURP(trimmedCurp)) { toast({ title: "CURP inválido", description: "El formato del CURP no es válido.", variant: "destructive" }); return false; }
    if (!validatePassword(password)) { toast({ title: "Contraseña débil", description: "Debe tener 8+ caracteres, Mayúscula, minúscula y un número.", variant: "destructive" }); return false; }
    if (password !== confirmPassword) { toast({ title: "Error en contraseña", description: "Las contraseñas no coinciden.", variant: "destructive" }); return false; }
    return true;
  }, [formData]);

  const validateStep2 = useCallback(async () => {
    const code = formData.registrationCode.trim();
    if (!code) { toast({ title: "Código requerido", description: "Por favor, ingresa un código de invitación.", variant: "destructive" }); return false; }
    setIsVerifyingCode(true);
    const { data, error } = await supabase.from('referral_codes').select('id, is_used').eq('code', code).single();
    setIsVerifyingCode(false);
    if (error || !data) { toast({ title: "Código inválido", description: "El código de invitación no existe.", variant: "destructive" }); return false; }
    if (data.is_used) { toast({ title: "Código ya utilizado", description: "Este código de invitación ya ha sido utilizado.", variant: "destructive" }); return false; }
    return true;
  }, [formData.registrationCode]);

  const validateStep3 = useCallback(() => {
    const { ineFront, ineBack, selfie, acceptTerms } = formData;
    if (!ineFront || !ineBack || !selfie) { toast({ title: "Documentos requeridos", description: "Por favor, sube todos los documentos de identidad.", variant: "destructive" }); return false; }
    if (!acceptTerms) { toast({ title: "Términos y condiciones", description: "Debes aceptar los términos y condiciones.", variant: "destructive" }); return false; }
    return true;
  }, [formData]);

  const handleNext = async () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2) {
      const isValid = await validateStep2();
      if (!isValid) return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const uploadFile = async (file, path) => {
    const { data, error } = await supabase.storage.from('verification_documents').upload(path, file, { upsert: true });
    if (error) {
      if (error.message.includes('ERR_UPLOAD_FILE_CHANGED') || error.message.includes('Failed to fetch')) {
        throw new Error("Error de red/memoria del dispositivo. Intenta de nuevo y asegúrate de usar imágenes pequeñas.");
      }
      if (error.message.includes('violates row-level security policy')) {
        throw new Error("Error de seguridad: La política de Supabase no permite subir documentos después del registro.");
      }
      throw error;
    }
    return data?.path;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep3()) return;
    setCurrentStep(4);
    setIsLoading(true);
    let createdUser = null;
    try {
      const [ineFrontBuffer, ineBackBuffer, selfieBuffer] = await Promise.all([
        fileToBuffer(formData.ineFront),
        fileToBuffer(formData.ineBack),
        fileToBuffer(formData.selfie)
      ]);
      const ineFrontFile = new File([ineFrontBuffer], formData.ineFront.name, { type: formData.ineFront.type });
      const ineBackFile = new File([ineBackBuffer], formData.ineBack.name, { type: formData.ineBack.type });
      const selfieFile = new File([selfieBuffer], "selfie.jpeg", { type: 'image/jpeg' });
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email: formData.email, password: formData.password });
      if (signUpError) throw signUpError;
      if (!signUpData.user) throw new Error("No se pudo crear el usuario en el sistema de autenticación.");
      createdUser = signUpData.user;
      const timestamp = Date.now();
      const ineFrontExt = ineFrontFile.name.split('.').pop();
      const ineBackExt = ineBackFile.name.split('.').pop();
      let ineFrontPath = `${createdUser.id}/ine_front_${timestamp}.${ineFrontExt}`;
      let ineBackPath = `${createdUser.id}/ine_back_${timestamp}.${ineBackExt}`;
      let selfiePath = `${createdUser.id}/selfie_${timestamp}.jpeg`;
      await uploadFile(ineFrontFile, ineFrontPath);
      await uploadFile(ineBackFile, ineBackPath);
      await uploadFile(selfieFile, selfiePath);
      const profileDataToUpdate = {
        first_name: formData.firstName, last_name: formData.lastName,
        curp: formData.curp.toUpperCase().trim(), country: formData.country,
        phone: formData.phone, address: formData.address,
        ine_front_url: ineFrontPath, ine_back_url: ineBackPath,
        selfie_url: selfiePath, email: formData.email,
      };
      const { error: functionError } = await supabase.functions.invoke('complete-profile-data', {
        body: { userId: createdUser.id, profileData: profileDataToUpdate }
      });
      if (functionError) throw new Error(`Error al completar el perfil: ${functionError.message || JSON.stringify(functionError)}`);
      await supabase.from('referral_codes').update({ is_used: true, used_at: new Date().toISOString(), assigned_to_user_id: createdUser.id }).eq('code', formData.registrationCode.trim());
      toast({ title: "¡Registro completo!", description: "Tu cuenta ha sido creada correctamente. Revisa tu correo para verificarla." });
      navigate('/login');
    } catch (error) {
      console.error("Error detallado en el registro:", error);
      toast({ title: "Error en el registro", description: error.message || "Ocurrió un problema. Por favor, inténtalo de nuevo.", variant: "destructive" });
      setCurrentStep(1);
    } finally {
      setIsLoading(false);
    }
  };

  const stepLabels = ['Datos Personales', 'Código de Acceso', 'Verificación'];
  const progressPct = currentStep < 4 ? Math.round((currentStep / 3) * 100) : 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return <Step1Form formData={formData} handleChange={handleChange} showPassword={showPassword} setShowPassword={setShowPassword} showConfirmPassword={showConfirmPassword} setShowConfirmPassword={setShowConfirmPassword} countries={countries} />;
      case 2: return <Step2Form formData={formData} handleChange={handleChange} />;
      case 3: return <Step3Form formData={formData} handleFileChange={handleFileChange} previews={previews} onSelfieClick={() => setIsTakingSelfie(true)} onTermsChange={onTermsChange} />;
      case 4: return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div style={{ width: '64px', height: '64px', border: '1px solid rgba(201,164,85,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', background: '#0D1F3C' }}>
            <Loader2 style={{ color: '#C9A455', width: '28px', height: '28px', animation: 'spin 1s linear infinite' }} />
          </div>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 700, color: '#0D1F3C', marginBottom: '0.5rem' }}>
            Creando tu cuenta...
          </h3>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.875rem', color: '#6B6B6B', fontWeight: 300 }}>
            Estamos preparando todo para ti. ¡Un momento!
          </p>
        </motion.div>
      );
      default: return null;
    }
  };

  return (
    <>
      <Helmet><title>Registro - Drex Solutions</title></Helmet>
      <style>{S}</style>
      <LandingHeader />
      {isTakingSelfie && <SelfieGuide onCapture={handleSelfieCapture} onCancel={() => setIsTakingSelfie(false)} />}

      <div className="reg-bg flex items-center justify-center p-4 pt-24 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl z-10 relative"
        >
          {/* Top label */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A455' }}>
              Registro Seguro · Drex Solutions
            </span>
          </div>

          <div className="reg-card">
            {/* Header */}
            <div style={{ padding: '2.5rem 2.5rem 1.5rem', textAlign: 'center', borderBottom: '1px solid #F0EDE8' }}>
              <div style={{ width: '52px', height: '52px', border: '1px solid rgba(201,164,85,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', background: '#0D1F3C' }}>
                <ShieldCheck style={{ color: '#C9A455', width: '22px', height: '22px' }} />
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.75rem', fontWeight: 700, color: '#0D1F3C', lineHeight: 1.15, marginBottom: '0.5rem' }}>
                {currentStep < 4 ? 'Crear Cuenta Segura' : 'Finalizando Registro'}
              </h2>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', color: '#6B6B6B', fontWeight: 400, marginBottom: '1rem' }}>
                {currentStep === 1 && "Completa tu información personal para empezar."}
                {currentStep === 2 && "Ingresa el código de invitación para continuar."}
                {currentStep === 3 && "Un último paso para asegurar completamente tu cuenta."}
                {currentStep === 4 && "¡Casi listo! Estamos configurando tu nuevo panel financiero."}
              </p>

              {/* Step indicators */}
              {currentStep < 4 && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    {stepLabels.map((label, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <div style={{
                          width: '22px', height: '22px', borderRadius: '50%',
                          border: `1px solid ${i + 1 <= currentStep ? '#C9A455' : '#D6D3CD'}`,
                          background: i + 1 < currentStep ? '#0D1F3C' : i + 1 === currentStep ? '#C9A455' : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontFamily: "'DM Sans', sans-serif", fontSize: '0.65rem', fontWeight: 700,
                          color: i + 1 <= currentStep ? (i + 1 === currentStep ? '#0D1F3C' : '#fff') : '#9B9B9B',
                          flexShrink: 0
                        }}>
                          {i + 1 < currentStep ? '✓' : i + 1}
                        </div>
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.68rem', fontWeight: 500, color: i + 1 === currentStep ? '#0D1F3C' : '#9B9B9B', display: i > 0 ? 'none' : 'none' }}>
                          {label}
                        </span>
                        {i < 2 && <div style={{ width: '24px', height: '1px', background: i + 1 < currentStep ? '#C9A455' : '#E8E5DF' }} />}
                      </div>
                    ))}
                  </div>
                  {/* Progress bar */}
                  <div className="reg-progress-bar">
                    <motion.div
                      className="reg-progress-fill"
                      animate={{ width: `${progressPct}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.68rem', color: '#9B9B9B', marginTop: '0.4rem' }}>
                    Paso {currentStep} de 3 — {stepLabels[currentStep - 1]}
                  </div>
                </div>
              )}
            </div>

            {/* Form content */}
            <div style={{ padding: '2rem 2.5rem' }}>
              <form onSubmit={handleSubmit}>
                {renderStepContent()}

                {currentStep < 4 && (
                  <>
                    <div className="reg-divider" style={{ marginTop: '1.75rem' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <button
                        type="button"
                        className="reg-btn-outline"
                        style={{ minWidth: '120px' }}
                        onClick={() => currentStep > 1 ? setCurrentStep(s => s - 1) : navigate('/')}
                        disabled={isLoading}
                      >
                        {currentStep > 1 ? 'Anterior' : 'Cancelar'}
                      </button>

                      {currentStep < 3 ? (
                        <button
                          type="button"
                          className="reg-btn-primary"
                          style={{ minWidth: '140px' }}
                          onClick={handleNext}
                          disabled={isVerifyingCode}
                        >
                          {isVerifyingCode
                            ? <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Loader2 style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} />
                                Verificando...
                              </span>
                            : <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                Siguiente
                                <ArrowRight style={{ width: '14px', height: '14px' }} />
                              </span>
                          }
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="reg-btn-success"
                          style={{ minWidth: '160px' }}
                          disabled={isLoading}
                        >
                          {isLoading
                            ? <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Loader2 style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} />
                                Registrando...
                              </span>
                            : 'Finalizar Registro'
                          }
                        </button>
                      )}
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '1.25rem', fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem', color: '#6B6B6B' }}>
                      ¿Ya tienes cuenta?{' '}
                      <button
                        type="button"
                        onClick={() => navigate('/login')}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0D1F3C', fontWeight: 600, fontSize: '0.82rem', fontFamily: "'DM Sans', sans-serif", textDecoration: 'underline', textUnderlineOffset: '3px' }}
                      >
                        Inicia sesión
                      </button>
                    </div>
                  </>
                )}
              </form>
            </div>
          </div>

          {/* Bottom cert bar */}
          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            {[
              { icon: '🔒', text: 'SSL 256-bit' },
              { icon: '✓', text: 'ISO 27001' },
              { icon: '⚡', text: 'Registro Seguro' },
            ].map((item, i) => (
              <span key={i} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
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

export default RegisterPage;