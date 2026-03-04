import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Wifi, Lock, XCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const DigitalCard = ({ user }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [cvv, setCvv] = useState('•••');

  const isCardPaid   = user.digital_card_active;
  const cardStatus   = user.digital_card_status || 'desactivada';
  const isCardUsable = isCardPaid && cardStatus === 'activa';

  useEffect(() => {
    if (isFlipped && isCardUsable) {
      const newCvv = Math.floor(100 + Math.random() * 900).toString();
      setCvv(newCvv);
      const t1 = setTimeout(() => setIsFlipped(false), 5000);
      const t2 = setTimeout(() => setCvv('•••'), 4700);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [isFlipped, isCardUsable]);

  const formatCardNumber = (n) => {
    if (typeof n !== 'string' || !n) return '•••• •••• •••• ••••';
    return n.match(/.{1,4}/g)?.join('  ') || '•••• •••• •••• ••••';
  };

  const handleCardClick = () => {
    if (!isCardPaid) {
      toast({ title:'Tarjeta no Habilitada', description:'Contacta a tu ejecutivo para habilitar tu tarjeta digital.', variant:'destructive' });
      return;
    }
    if (cardStatus !== 'activa') {
      toast({ title:`Tarjeta ${cardStatus}`, description:'Tu tarjeta está habilitada pero no activa. Contacta a tu ejecutivo.', variant:'destructive' });
      return;
    }
    setIsFlipped(!isFlipped);
  };

  if (!isCardPaid) return (
    <div style={{ width:'100%', maxWidth:'340px', margin:'0 auto' }}>
      <div style={{ background:'#0D1F3C', border:'1px solid rgba(201,164,85,0.2)', padding:'2rem', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'0.75rem', minHeight:'200px' }}>
        <Lock style={{ color:'rgba(201,164,85,0.5)', width:'32px', height:'32px' }} />
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.875rem', fontWeight:600, color:'rgba(255,255,255,0.7)', margin:0, textAlign:'center' }}>Tarjeta no habilitada</p>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.75rem', color:'rgba(255,255,255,0.35)', margin:0, textAlign:'center' }}>Contacta a tu ejecutivo para habilitarla.</p>
      </div>
    </div>
  );

  return (
    <div style={{ width:'100%', maxWidth:'340px', margin:'0 auto', cursor:'pointer', perspective:'1000px' }} onClick={handleCardClick}>
      <motion.div
        style={{ position:'relative', width:'100%', height:'200px', transformStyle:'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration:0.6, type:'spring', stiffness:100, damping:15 }}
      >
        {/* Front */}
        <div style={{ position:'absolute', width:'100%', height:'100%', backfaceVisibility:'hidden' }}>
          <div style={{ background:'linear-gradient(135deg,#0D1F3C 0%,#162d50 100%)', border:'1px solid rgba(201,164,85,0.25)', color:'#fff', padding:'1.5rem', display:'flex', flexDirection:'column', justifyContent:'space-between', height:'100%', boxSizing:'border-box' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.1rem', fontWeight:700, color:'#C9A455', letterSpacing:'0.1em' }}>DREX</span>
              <Wifi style={{ color:'rgba(255,255,255,0.6)', width:'18px', height:'18px' }} />
            </div>
            <div>
              <div style={{ fontFamily:'monospace', fontSize:'1.1rem', letterSpacing:'0.2em', color:'rgba(255,255,255,0.9)', marginBottom:'1rem' }}>{formatCardNumber(user.account_number)}</div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
                <div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.6rem', color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.1em' }}>TITULAR</div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.8rem', fontWeight:600, color:'#fff', textTransform:'uppercase' }}>{user.first_name} {user.last_name}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.6rem', color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.1em' }}>EXPIRA</div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.8rem', fontWeight:600, color:'#fff' }}>12/28</div>
                </div>
                <ShieldCheck style={{ color:'#C9A455', width:'24px', height:'24px' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Back */}
        <div style={{ position:'absolute', width:'100%', height:'100%', backfaceVisibility:'hidden', transform:'rotateY(180deg)' }}>
          <div style={{ background:'linear-gradient(135deg,#0D1F3C 0%,#162d50 100%)', border:'1px solid rgba(201,164,85,0.25)', color:'#fff', display:'flex', flexDirection:'column', height:'100%', boxSizing:'border-box' }}>
            <div style={{ width:'100%', height:'44px', background:'rgba(0,0,0,0.5)', marginTop:'1.5rem' }} />
            <div style={{ display:'flex', justifyContent:'flex-end', alignItems:'center', padding:'0.875rem 1.25rem', gap:'0.5rem' }}>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.7rem', color:'rgba(255,255,255,0.4)' }}>CVV</span>
              <div style={{ background:'#fff', color:'#0D1F3C', width:'60px', height:'30px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ fontFamily:'monospace', fontWeight:700, letterSpacing:'0.15em', fontSize:'0.875rem' }}>{cvv}</span>
              </div>
            </div>
            <div style={{ flex:1 }} />
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.65rem', color:'rgba(255,255,255,0.3)', textAlign:'center', padding:'0.75rem' }}>CVV dinámico — cambia cada uso.</p>
          </div>
        </div>
      </motion.div>
      <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.72rem', color:'#9B9B9B', textAlign:'center', marginTop:'0.625rem' }}>
        {isCardUsable ? 'Haz clic para ver el CVV' : 'Tarjeta habilitada pero no activa'}
      </p>
    </div>
  );
};

export default DigitalCard;