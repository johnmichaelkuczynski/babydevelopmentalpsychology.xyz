import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),   // "Three depths per lesson."
      setTimeout(() => setPhase(2), 3000),  // "Brief. Standard. In-depth."
      setTimeout(() => setPhase(3), 5500),  // "A section-scoped AI tutor."
      setTimeout(() => setPhase(4), 7800),  // exit
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center bg-bg-light"
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: '0%' }}
      exit={{ opacity: 0, x: '-50%', filter: 'blur(10px)' }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
    >
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/40 via-bg-light to-bg-light" />

      <div className="relative z-10 w-full max-w-[80vw] h-[50vh]">
        {/* Phase 1: Asking */}
        <motion.div 
          className="absolute top-0 left-0 bg-white p-8 rounded-3xl shadow-2xl border-4 border-secondary"
          initial={{ scale: 0, opacity: 0, x: '-20vw', y: '10vh' }}
          animate={
            phase === 1 ? { scale: 1, opacity: 1, x: '10vw', y: '10vh', rotate: -5 } :
            phase > 1 ? { scale: 0.8, opacity: 0.5, x: '5vw', y: '5vh', rotate: -10 } :
            { scale: 0, opacity: 0, x: '-20vw', y: '10vh' }
          }
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <h2 className="text-[4vw] font-black text-secondary">Three depths per lesson.</h2>
        </motion.div>

        {/* Phase 2: Noticing */}
        <motion.div 
          className="absolute top-0 right-0 bg-white p-8 rounded-3xl shadow-2xl border-4 border-primary"
          initial={{ scale: 0, opacity: 0, x: '20vw', y: '20vh' }}
          animate={
            phase === 2 ? { scale: 1, opacity: 1, x: '-10vw', y: '20vh', rotate: 5 } :
            phase > 2 ? { scale: 0.8, opacity: 0.5, x: '-5vw', y: '15vh', rotate: 10 } :
            { scale: 0, opacity: 0, x: '20vw', y: '20vh' }
          }
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <h2 className="text-[4vw] font-black text-primary">Brief. Standard. In-depth.</h2>
          <div className="flex gap-2 mt-4">
            {[1, 2, 3].map(i => (
              <motion.div key={i} className="w-6 h-6 rounded-full bg-primary" 
                animate={{ y: [0, -10, 0] }} 
                transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
              />
            ))}
          </div>
        </motion.div>

        {/* Phase 3: Telling */}
        <motion.div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-white p-8 rounded-3xl shadow-2xl border-4 border-accent"
          initial={{ scale: 0, opacity: 0, y: '20vh' }}
          animate={
            phase === 3 ? { scale: 1.2, opacity: 1, y: '0vh', rotate: 0 } :
            { scale: 0, opacity: 0, y: '20vh' }
          }
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <h2 className="text-[4vw] font-black text-accent text-center">A section-scoped<br/>AI tutor.</h2>
        </motion.div>
      </div>
    </motion.div>
  );
}
