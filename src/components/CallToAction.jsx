import React from 'react';
import { motion } from 'framer-motion';

const CallToAction = () => (
  <motion.h1
    initial={{ opacity:0, y:12 }}
    animate={{ opacity:1, y:0 }}
    transition={{ duration:0.6, delay:0.4 }}
    style={{
      fontFamily:"'Cormorant Garamond',serif",
      fontSize:'clamp(2rem, 5vw, 3.5rem)',
      fontWeight:700,
      color:'#fff',
      lineHeight:1.1,
      letterSpacing:'-0.01em',
      width:'100%',
      margin:0,
    }}
  >
    Convierte tus ideas<br/>
    <span style={{ color:'#C9A455' }}>en realidad financiera.</span>
  </motion.h1>
);

export default CallToAction;