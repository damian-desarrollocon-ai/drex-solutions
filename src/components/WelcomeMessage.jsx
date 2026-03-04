import React from 'react';
import { motion } from 'framer-motion';

const WelcomeMessage = () => (
  <motion.p
    initial={{ opacity:0, y:8 }}
    animate={{ opacity:1, y:0 }}
    transition={{ duration:0.5, delay:0.65 }}
    style={{
      fontFamily:"'DM Sans',sans-serif",
      fontSize:'1rem',
      fontWeight:400,
      color:'rgba(255,255,255,0.6)',
      lineHeight:1.65,
      width:'100%',
      margin:0,
    }}
  >
    Escribe en el chat lo que deseas crear o gestionar.
  </motion.p>
);

export default WelcomeMessage;