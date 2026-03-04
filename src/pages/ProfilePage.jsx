import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Save, Loader2, Edit } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { toast } from '@/components/ui/use-toast';
import ProfileInfoForm from '@/components/profile/ProfileInfoForm';
import PasswordForm from '@/components/profile/PasswordForm';
import VerificationStatus from '@/components/profile/VerificationStatus';
import { supabase } from '@/lib/customSupabaseClient.js';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  .pp-wrap { padding:2rem; font-family:'DM Sans',sans-serif; max-width:860px; margin:0 auto; }
  @media(max-width:640px){ .pp-wrap{ padding:1rem; } }
  .pp-tag { font-size:0.7rem; font-weight:700; letter-spacing:0.15em; text-transform:uppercase; color:#B8892E; display:flex; align-items:center; gap:0.5rem; margin-bottom:0.4rem; }
  .pp-tag::before { content:''; width:20px; height:2px; background:#B8892E; }
  .pp-tabs { display:flex; border-bottom:1px solid #E8E5DF; margin-bottom:2rem; gap:0; }
  .pp-tab { font-family:'DM Sans',sans-serif; font-size:0.78rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; padding:0.875rem 1.5rem; background:none; border:none; border-bottom:2px solid transparent; cursor:pointer; color:#9B9B9B; transition:all 0.2s; margin-bottom:-1px; }
  .pp-tab:hover { color:#0D1F3C; }
  .pp-tab.active { color:#0D1F3C; border-bottom-color:#C9A455; }
  .pp-card { background:#fff; border:1px solid #E8E5DF; position:relative; overflow:hidden; }
  .pp-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,#C9A455,rgba(201,164,85,0.15)); }
  .pp-card-header { padding:1.5rem 1.75rem 1rem; border-bottom:1px solid #F0EDE8; display:flex; align-items:flex-start; justify-content:space-between; }
  .pp-card-title { font-family:'Cormorant Garamond',serif; font-size:1.2rem; font-weight:700; color:#0D1F3C; margin:0; }
  .pp-card-sub { font-size:0.8rem; color:#9B9B9B; margin:0.2rem 0 0; }
  .pp-card-body { padding:1.75rem; }
  .pp-btn-primary { font-family:'DM Sans',sans-serif; font-size:0.75rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; padding:0.6rem 1.25rem; background:#0D1F3C; color:#fff; border:none; cursor:pointer; transition:background 0.2s; display:flex; align-items:center; gap:0.4rem; flex-shrink:0; }
  .pp-btn-primary:hover:not(:disabled) { background:#C9A455; color:#0D1F3C; }
  .pp-btn-primary:disabled { opacity:0.6; cursor:not-allowed; }
  .pp-btn-outline { font-family:'DM Sans',sans-serif; font-size:0.75rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; padding:0.6rem 1.25rem; background:transparent; color:#0D1F3C; border:1px solid #0D1F3C; cursor:pointer; transition:all 0.2s; display:flex; align-items:center; gap:0.4rem; flex-shrink:0; }
  .pp-btn-outline:hover { background:#0D1F3C; color:#fff; }
`;

const TABS = [
  { id:'profile',      label:'Información' },
  { id:'security',     label:'Seguridad'   },
  { id:'verification', label:'Verificación'},
];

const ProfilePage = () => {
  const { user, userProfile, loading: authLoading, fetchUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving]   = useState(false);
  const [profileData, setProfileData] = useState({ first_name:'', last_name:'', phone:'', address:'', country:'' });

  useEffect(() => {
    if (!authLoading && userProfile) {
      setProfileData({
        first_name: userProfile.first_name || '',
        last_name:  userProfile.last_name  || '',
        phone:      userProfile.phone      || '',
        address:    userProfile.address    || '',
        country:    userProfile.country    || '',
      });
    }
  }, [userProfile, authLoading]);

  const handleProfileChange = (e) => setProfileData({ ...profileData, [e.target.name]: e.target.value });

  const handleSaveProfile = async () => {
    setIsSaving(true);
    const { error } = await supabase.from('profiles').update(profileData).eq('id', user.id);
    setIsSaving(false);
    if (error) toast({ title:"Error al guardar", description:error.message, variant:"destructive" });
    else { toast({ title:"Perfil actualizado", description:"Tus datos se han guardado." }); await fetchUserProfile(); setIsEditing(false); }
  };

  if (authLoading || !userProfile) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'60vh' }}>
      <Loader2 style={{ color:'#C9A455', width:'28px', height:'28px', animation:'spin 1s linear infinite' }} />
    </div>
  );

  return (
    <>
      <Helmet><title>Mi Perfil — Drex Solutions</title></Helmet>
      <style>{STYLES}</style>
      <div className="pp-wrap">
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} style={{ marginBottom:'1.75rem' }}>
          <div className="pp-tag">Cuenta</div>
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'2rem', fontWeight:700, color:'#0D1F3C', lineHeight:1.1, margin:0 }}>
            Mi Perfil
          </h1>
          <p style={{ fontSize:'0.875rem', color:'#9B9B9B', marginTop:'0.25rem' }}>
            Gestiona tu información personal y configuración de cuenta.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="pp-tabs">
          {TABS.map(t => (
            <button key={t.id} className={`pp-tab ${activeTab===t.id?'active':''}`} onClick={() => setActiveTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Información */}
        {activeTab === 'profile' && (
          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}>
            <div className="pp-card">
              <div className="pp-card-header">
                <div>
                  <div className="pp-tag" style={{ marginBottom:'0.2rem' }}>Datos Personales</div>
                  <p className="pp-card-title">Información Personal</p>
                  <p className="pp-card-sub">Actualiza tus datos personales</p>
                </div>
                {isEditing ? (
                  <div style={{ display:'flex', gap:'0.5rem' }}>
                    <button className="pp-btn-outline" onClick={() => setIsEditing(false)}>Cancelar</button>
                    <button className="pp-btn-primary" onClick={handleSaveProfile} disabled={isSaving}>
                      {isSaving ? <Loader2 style={{ width:'13px', height:'13px', animation:'spin 1s linear infinite' }} /> : <Save style={{ width:'13px', height:'13px' }} />}
                      Guardar
                    </button>
                  </div>
                ) : (
                  <button className="pp-btn-outline" onClick={() => setIsEditing(true)}>
                    <Edit style={{ width:'13px', height:'13px' }} /> Editar
                  </button>
                )}
              </div>
              <div className="pp-card-body">
                <ProfileInfoForm user={userProfile} profileData={profileData} handleProfileChange={handleProfileChange} isEditing={isEditing} />
              </div>
            </div>
          </motion.div>
        )}

        {/* Seguridad */}
        {activeTab === 'security' && (
          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}>
            <div className="pp-card">
              <div className="pp-card-header">
                <div>
                  <div className="pp-tag" style={{ marginBottom:'0.2rem' }}>Acceso</div>
                  <p className="pp-card-title">Seguridad de la Cuenta</p>
                  <p className="pp-card-sub">Cambia tu contraseña</p>
                </div>
              </div>
              <div className="pp-card-body">
                <PasswordForm />
              </div>
            </div>
          </motion.div>
        )}

        {/* Verificación */}
        {activeTab === 'verification' && (
          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}>
            <div className="pp-card">
              <div className="pp-card-header">
                <div>
                  <div className="pp-tag" style={{ marginBottom:'0.2rem' }}>KYC</div>
                  <p className="pp-card-title">Verificación de Cuenta</p>
                  <p className="pp-card-sub">Verifica tu identidad y correo electrónico</p>
                </div>
              </div>
              <div className="pp-card-body">
                <VerificationStatus user={user} userProfile={userProfile} onUpdate={fetchUserProfile} />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default ProfilePage;