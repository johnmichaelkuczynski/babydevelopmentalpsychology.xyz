import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center bg-bg-dark text-white"
      initial={{ opacity: 0, y: '50vh' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, filter: 'blur(20px)' }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div 
        className="text-[5vw] font-black tracking-tight leading-none text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={phase >= 1 ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <span className="text-primary block mb-2">BASIC DEVELOPMENTAL</span>
        <span className="text-white">PSYCHOLOGY</span>
      </motion.div>

      <motion.div 
        className="mt-8 flex flex-col items-center gap-2 text-[2.5vw] font-bold text-white/80"
        initial={{ opacity: 0, y: 20 }}
        animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8 }}
      >
        <p>One unit. Eight topics. Three reading depths.</p>
        <p>From what the field is to aging across the lifespan.</p>
      </motion.div>

      {/* Decorative stars */}
      <motion.div 
        className="absolute top-[20%] left-[15%] text-accent text-[4vw]"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      >
        ✦
      </motion.div>
      <motion.div 
        className="absolute bottom-[20%] right-[15%] text-secondary text-[3vw]"
        animate={{ scale: [1, 1.5, 1], rotate: [0, -180, -360] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      >
        ✦
      </motion.div>
    </motion.div>
  );
}
