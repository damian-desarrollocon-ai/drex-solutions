import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Loader2, Search, Trash2, Settings, Lock, Unlock, ChevronDown, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/customSupabaseClient.js';
import { toast } from '@/components/ui/use-toast';
import UserEditDialog from '@/components/admin/UserEditDialog';

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=DM+Sans:wght@400;500;600;700&display=swap');
  .pg-tag{font-size:.7rem;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:#B8892E;display:flex;align-items:center;gap:.5rem;margin-bottom:.4rem}
  .pg-tag::before{content:'';width:20px;height:2px;background:#B8892E}
  .pg-card{background:#fff;border:1px solid #E8E5DF;position:relative;overflow:hidden}
  .pg-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#C9A455,rgba(201,164,85,.15))}
  .pg-card-hd{padding:1.25rem 1.75rem 1rem;border-bottom:1px solid #F0EDE8}
  .pg-search{position:relative;margin-top:1rem}
  .pg-search-input{font-family:'DM Sans',sans-serif!important;border-radius:0!important;border:1px solid #D6D3CD!important;background:#FAFAF8!important;color:#0D1F3C!important;height:42px!important;padding-left:2.5rem!important}
  .pg-search-input:focus{border-color:#C9A455!important;box-shadow:0 0 0 2px rgba(201,164,85,.12)!important;outline:none!important}
  .tbl{width:100%;border-collapse:collapse}
  .tbl th{font-family:'DM Sans',sans-serif;font-size:.62rem;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:#9B9B9B;padding:.875rem 1.25rem;text-align:left;border-bottom:2px solid #F0EDE8;white-space:nowrap}
  .tbl td{font-family:'DM Sans',sans-serif;font-size:.82rem;color:#0D1F3C;padding:.875rem 1.25rem;border-bottom:1px solid #F5F4F0;vertical-align:middle}
  .tbl tr:last-child td{border-bottom:none}
  .tbl tr:hover td{background:#FAFAF8}
  .u-av{width:36px;height:36px;background:#0D1F3C;border:1px solid rgba(201,164,85,.3);display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .v-badge{font-size:.62rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:.2rem .6rem}
  .v-approved{color:#059669;background:rgba(5,150,105,.08);border:1px solid rgba(5,150,105,.2)}
  .v-rejected {color:#DC2626;background:rgba(220,38,38,.08);border:1px solid rgba(220,38,38,.2)}
  .v-pending  {color:#D97706;background:rgba(217,119,6,.08);border:1px solid rgba(217,119,6,.2)}
  .act{width:28px;height:28px;display:flex;align-items:center;justify-content:center;border:1px solid #E8E5DF;background:transparent;cursor:pointer;color:#6B6B6B;transition:all .18s}
  .act:hover{border-color:#0D1F3C;color:#0D1F3C}
  .act.danger:hover{border-color:#DC2626;color:#DC2626}
  .act.warn:hover{border-color:#D97706;color:#D97706}
  .act.ok:hover{border-color:#059669;color:#059669}
  .pg-empty{display:flex;flex-direction:column;align-items:center;gap:.75rem;padding:3rem;color:#9B9B9B;text-align:center}
  .perm-row{display:flex;align-items:center;justify-content:space-between;padding:.875rem;border:1px solid #E8E5DF;margin-bottom:.5rem}
  .perm-row.warn{border-color:rgba(217,119,6,.3);background:rgba(217,119,6,.04)}
  .dlg-btn{font-family:'DM Sans',sans-serif;font-size:.75rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:.65rem 1.5rem;border:none;cursor:pointer;transition:all .2s}
  .dlg-btn.primary{background:#0D1F3C;color:#fff}.dlg-btn.primary:hover{background:#C9A455;color:#0D1F3C}
  .dlg-btn.secondary{background:transparent;color:#0D1F3C;border:1px solid #D6D3CD}.dlg-btn.secondary:hover{border-color:#0D1F3C}
`;

const fmt = (a) => new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(a);

const vInfo = (s) => ({
  approved:{text:'Aprobado',cls:'v-approved'},
  rejected:{text:'Rechazado',cls:'v-rejected'},
}[s]||{text:'Pendiente',cls:'v-pending'});

const PermissionsDialog = ({ user, onUpdate, isOpen, onOpenChange }) => {
  const [perms, setPerms] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    if(user) setPerms({
      digital_card_active:       user.digital_card_active       || false,
      digital_card_status:       user.digital_card_status       || 'desactivada',
      transfers_enabled:         user.transfers_enabled         || false,
      withdrawals_enabled:       user.withdrawals_enabled       || false,
      transaction_limit_enabled: user.transaction_limit_enabled !== false,
      automatic_reversal_enabled:user.automatic_reversal_enabled|| false,
    });
  },[user]);

  const toggle = (k,v) => setPerms(p=>({...p,[k]:v}));
  const handleSave = async () => {
    setLoading(true);
    await onUpdate(user.id, perms);
    setLoading(false); onOpenChange(false);
  };

  if(!user) return null;
  const switchRows = [
    {key:'digital_card_active',       label:'Habilitar Tarjeta',          sub:'Permite al usuario ver su tarjeta por primera vez.'},
    {key:'transfers_enabled',         label:'Transferencias',              sub:'Permite realizar transferencias a otros.'},
    {key:'withdrawals_enabled',       label:'Retiros sin Tarjeta',         sub:'Permite generar códigos para retiros en comercios.'},
    {key:'transaction_limit_enabled', label:'Límite de 5 Movimientos',     sub:'Activa el límite mensual de transacciones.'},
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent style={{borderRadius:0,border:'1px solid #E8E5DF',fontFamily:"'DM Sans',sans-serif",maxWidth:480}}>
        <div style={{height:2,background:'linear-gradient(90deg,#C9A455,transparent)',position:'absolute',top:0,left:0,right:0}}/>
        <DialogHeader>
          <DialogTitle style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.3rem',fontWeight:700,color:'#0D1F3C'}}>Gestionar Permisos</DialogTitle>
          <DialogDescription style={{fontSize:'.82rem',color:'#9B9B9B'}}>
            Configuración de {user.first_name} {user.last_name}
          </DialogDescription>
        </DialogHeader>
        <div style={{padding:'1rem 0',maxHeight:'55vh',overflowY:'auto',display:'flex',flexDirection:'column',gap:'.5rem'}}>
          {switchRows.map(r=>(
            <div key={r.key} className="perm-row">
              <div style={{flex:1,marginRight:'1rem'}}>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'.82rem',fontWeight:600,color:'#0D1F3C',margin:0}}>{r.label}</p>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'.72rem',color:'#9B9B9B',margin:'3px 0 0'}}>{r.sub}</p>
              </div>
              <Switch checked={perms[r.key]||false} onCheckedChange={v=>toggle(r.key,v)}/>
            </div>
          ))}
          <div className="perm-row" style={{flexDirection:'column',alignItems:'flex-start',gap:'.75rem'}}>
            <div>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'.82rem',fontWeight:600,color:'#0D1F3C',margin:0}}>Estado de Tarjeta</p>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'.72rem',color:'#9B9B9B',margin:'3px 0 0'}}>Controla el uso de la tarjeta digital.</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',padding:'.5rem .75rem',border:'1px solid #D6D3CD',background:'#FAFAF8',cursor:'pointer',fontFamily:"'DM Sans',sans-serif",fontSize:'.82rem',color:'#0D1F3C'}}>
                <span>{perms.digital_card_status?.charAt(0).toUpperCase()+perms.digital_card_status?.slice(1)||'—'}</span>
                <ChevronDown style={{width:14,height:14}}/>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {['activa','desactivada','bloqueada'].map(s=>(
                  <DropdownMenuItem key={s} onClick={()=>toggle('digital_card_status',s)}>{s.charAt(0).toUpperCase()+s.slice(1)}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="perm-row warn">
            <div style={{flex:1,marginRight:'1rem'}}>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'.82rem',fontWeight:700,color:'#92400E',margin:0}}>Reversión Automática</p>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'.72rem',color:'#B45309',margin:'3px 0 0'}}>Las futuras transferencias de este usuario se revertirán en 5 minutos.</p>
            </div>
            <Switch checked={perms.automatic_reversal_enabled||false} onCheckedChange={v=>toggle('automatic_reversal_enabled',v)}/>
          </div>
        </div>
        <DialogFooter style={{gap:'.5rem'}}>
          <button className="dlg-btn secondary" onClick={()=>onOpenChange(false)}>Cancelar</button>
          <button className="dlg-btn primary" onClick={handleSave} disabled={loading}>
            {loading ? <Loader2 style={{width:14,height:14,animation:'spin 1s linear infinite',display:'inline'}}/> : 'Guardar Cambios'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isPermsOpen, setIsPermsOpen] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('profiles_with_email').select('*').order('created_at',{ascending:false});
    if (error) toast({title:"Error",description:error.message,variant:"destructive"});
    else { setUsers(data); setFilteredUsers(data); }
    setLoading(false);
  },[]);

  useEffect(()=>{ loadData(); },[loadData]);

  useEffect(()=>{
    setFilteredUsers(users.filter(u=>
      u.first_name?.toLowerCase().includes(searchTerm.toLowerCase())||
      u.last_name?.toLowerCase().includes(searchTerm.toLowerCase())||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())||
      u.account_number?.includes(searchTerm)
    ));
  },[searchTerm,users]);

  const handleUpdateUser = async (userId, data) => {
    const { error } = await supabase.from('profiles').update(data).eq('id',userId);
    if (error) toast({title:"Error",description:error.message,variant:"destructive"});
    else { toast({title:"Éxito",description:"Usuario actualizado."}); loadData(); }
  };

  // ✅ CORREGIDO: usa RPC en lugar de Edge Function
  const handleDeleteUser = async (userId) => {
    if(!window.confirm('¿Eliminar este usuario? Esta acción es irreversible.')) return;
    const { error } = await supabase.rpc('delete_user_by_id', { user_id: userId });
    if (error) toast({title:"Error",description:error.message,variant:"destructive"});
    else { toast({title:"Usuario eliminado",description:"El usuario ha sido eliminado correctamente."}); loadData(); }
  };

  return (
    <>
      <Helmet><title>Usuarios — Admin</title></Helmet>
      <style>{S}</style>

      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} style={{marginBottom:'2rem'}}>
        <div className="pg-tag">Base de Datos</div>
        <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'2rem',fontWeight:700,color:'#0D1F3C',lineHeight:1.1,margin:'0 0 .25rem'}}>Gestión de Usuarios</h1>
        <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'.875rem',color:'#9B9B9B'}}>Busca, edita y gestiona todos los clientes del sistema.</p>
      </motion.div>

      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.05}}>
        <div className="pg-card">
          <div className="pg-card-hd">
            <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between'}}>
              <div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.15rem',fontWeight:700,color:'#0D1F3C'}}>Clientes Registrados</div>
                <div style={{fontSize:'.8rem',color:'#9B9B9B',marginTop:'.15rem'}}>Base de datos de usuarios del sistema</div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:'.5rem'}}>
                <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.75rem',fontWeight:700,color:'#0D1F3C'}}>{filteredUsers.length}</span>
                <span style={{fontSize:'.72rem',color:'#9B9B9B',lineHeight:1.3}}>usuarios</span>
              </div>
            </div>
            <div className="pg-search">
              <Search style={{position:'absolute',left:'.75rem',top:'50%',transform:'translateY(-50%)',width:16,height:16,color:'#9B9B9B'}}/>
              <Input placeholder="Buscar por nombre, email o cuenta..." className="pg-search-input" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}/>
            </div>
          </div>
          {loading
            ? <div style={{display:'flex',justifyContent:'center',padding:'3rem'}}><Loader2 style={{color:'#C9A455',width:28,height:28,animation:'spin 1s linear infinite'}}/></div>
            : filteredUsers.length===0
              ? <div className="pg-empty"><Users style={{width:36,height:36,color:'#C9A455'}}/><p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'.875rem'}}>No se encontraron usuarios.</p></div>
              : (
                <div style={{overflowX:'auto'}}>
                  <table className="tbl">
                    <thead>
                      <tr>
                        <th>Usuario</th>
                        <th>Cuenta</th>
                        <th style={{textAlign:'right'}}>Saldo</th>
                        <th style={{textAlign:'center'}}>Verificación</th>
                        <th style={{textAlign:'center'}}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(u => {
                        const v = vInfo(u.verification_status);
                        return (
                          <tr key={u.id}>
                            <td>
                              <div style={{display:'flex',alignItems:'center',gap:'.75rem'}}>
                                <div className="u-av"><span style={{fontFamily:"'DM Sans',sans-serif",fontSize:'.6rem',fontWeight:700,color:'#C9A455'}}>{u.first_name?.[0]}{u.last_name?.[0]}</span></div>
                                <div>
                                  <p style={{fontWeight:600,color:'#0D1F3C',margin:0,fontSize:'.85rem'}}>{u.first_name} {u.last_name}</p>
                                  <p style={{color:'#9B9B9B',margin:0,fontSize:'.72rem'}}>{u.email}</p>
                                </div>
                              </div>
                            </td>
                            <td>
                              <p style={{margin:0,fontSize:'.82rem'}}>••••{u.account_number?.slice(-4)}</p>
                              <p style={{margin:0,fontSize:'.72rem',color:'#9B9B9B'}}>CLABE: ••••{u.clabe?.slice(-4)}</p>
                            </td>
                            <td style={{textAlign:'right'}}>
                              <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.1rem',fontWeight:700}}>{fmt(u.balance||0)}</span>
                            </td>
                            <td style={{textAlign:'center'}}>
                              <span className={`v-badge ${v.cls}`}>{v.text}</span>
                            </td>
                            <td>
                              <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'.3rem'}}>
                                <UserEditDialog user={u} onUpdateUser={handleUpdateUser}/>
                                <button className="act" title="Permisos" onClick={()=>{setSelectedUser(u);setIsPermsOpen(true);}}>
                                  <Settings style={{width:12,height:12}}/>
                                </button>
                                <button className={`act ${u.is_active?'warn':'ok'}`} title={u.is_active?'Bloquear':'Activar'} onClick={()=>handleUpdateUser(u.id,{is_active:!u.is_active})}>
                                  {u.is_active ? <Lock style={{width:12,height:12}}/> : <Unlock style={{width:12,height:12}}/>}
                                </button>
                                <button className="act danger" title="Eliminar" onClick={()=>handleDeleteUser(u.id)}>
                                  <Trash2 style={{width:12,height:12}}/>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )
          }
        </div>
      </motion.div>

      <PermissionsDialog user={selectedUser} onUpdate={handleUpdateUser} isOpen={isPermsOpen} onOpenChange={setIsPermsOpen}/>
    </>
  );
};

export default AdminUsers;