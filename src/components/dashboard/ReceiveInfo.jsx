import React from 'react';
import { Copy } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=DM+Sans:wght@400;500;600;700&display=swap');
  .ri-wrap { padding:1.75rem; font-family:'DM Sans',sans-serif; }
  .ri-tag { font-size:0.68rem; font-weight:700; letter-spacing:0.15em; text-transform:uppercase; color:#B8892E; display:flex; align-items:center; gap:0.45rem; margin-bottom:0.35rem; }
  .ri-tag::before { content:''; width:18px; height:2px; background:#B8892E; }
  .ri-title { font-family:'Cormorant Garamond',serif; font-size:1.3rem; font-weight:700; color:#0D1F3C; margin:0 0 0.2rem; }
  .ri-sub { font-size:0.8rem; color:#9B9B9B; margin:0 0 1.5rem; }
  .ri-field { margin-bottom:1.1rem; }
  .ri-label { font-size:0.68rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:#0D1F3C; display:block; margin-bottom:0.4rem; }
  .ri-row { display:flex; align-items:center; gap:0.5rem; }
  .ri-value { flex:1; font-family:'DM Sans',sans-serif; font-size:0.875rem; color:#0D1F3C; background:#FAFAF8; border:1px solid #D6D3CD; padding:0.6rem 0.875rem; font-weight:500; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .ri-copy { width:36px; height:36px; flex-shrink:0; display:flex; align-items:center; justify-content:center; border:1px solid #D6D3CD; background:transparent; cursor:pointer; color:#6B6B6B; transition:all 0.18s; }
  .ri-copy:hover { border-color:#C9A455; color:#C9A455; background:rgba(201,164,85,0.06); }
`;

const InfoRow = ({ label, value }) => {
  const handleCopy = () => {
    if (!value || value === 'No disponible') {
      toast({ title: 'No disponible', description: 'Este dato no está disponible.', variant: 'destructive' });
      return;
    }
    navigator.clipboard.writeText(value);
    toast({ title: 'Copiado', description: `${label} copiado al portapapeles.` });
  };
  return (
    <div className="ri-field">
      <label className="ri-label">{label}</label>
      <div className="ri-row">
        <div className="ri-value">{value || 'No disponible'}</div>
        <button className="ri-copy" onClick={handleCopy} title="Copiar">
          <Copy style={{ width:'14px', height:'14px' }} />
        </button>
      </div>
    </div>
  );
};

const ReceiveInfo = ({ user }) => (
  <>
    <style>{STYLES}</style>
    <div className="ri-wrap">
      <div className="ri-tag">Datos de Cobro</div>
      <h2 className="ri-title">Recibir Dinero</h2>
      <p className="ri-sub">Comparte esta información para recibir transferencias en tu cuenta.</p>
      <InfoRow label="Beneficiario"        value={`${user?.first_name || ''} ${user?.last_name || ''}`.trim()} />
      <InfoRow label="CLABE Interbancaria" value={user?.clabe} />
      <InfoRow label="Número de Tarjeta"   value={user?.account_number} />
      <InfoRow label="Banco"               value="STP Drex Bank" />
    </div>
  </>
);

export default ReceiveInfo;