import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2800),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
      transition={{ duration: 0.8 }}
    >
      <div className="relative z-10 text-center flex flex-col items-center">
        <motion.h1 
          className="text-[6vw] font-black text-text-primary leading-tight"
          initial={{ y: 50, opacity: 0 }}
          animate={phase >= 1 ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          Basic Developmental
        </motion.h1>
        
        <motion.div
          className="bg-primary text-white px-8 py-2 rounded-full mt-4 shadow-xl"
          initial={{ scale: 0, rotate: -10 }}
          animate={phase >= 2 ? { scale: 1, rotate: [-10, 5, 0] } : { scale: 0, rotate: -10 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          <span className="text-[5vw] font-black tracking-wide">PSYCHOLOGY</span>
        </motion.div>
      </div>

      {/* Decorative midground shapes */}
      <motion.div 
        className="absolute w-32 h-32 border-4 border-secondary/30 rounded-full"
        style={{ top: '20%', left: '20%' }}
        animate={{ y: [0, -20, 0], rotate: [0, 90] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div 
        className="absolute w-24 h-24 bg-accent/20 rounded-xl"
        style={{ bottom: '25%', right: '25%' }}
        animate={{ y: [0, 30, 0], rotate: [0, -45] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
      />
    </motion.div>
  );
}
