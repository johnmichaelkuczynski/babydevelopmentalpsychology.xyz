import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),   // adaptive practice
      setTimeout(() => setPhase(2), 4000),  // AI-graded coursework
      setTimeout(() => setPhase(3), 7000),  // integrity detection
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center bg-bg-muted"
      initial={{ opacity: 0, scale: 1.2 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: "circOut" }}
    >
      
      {/* P1: Adaptive Practice */}
      <motion.div 
        className="absolute flex items-center gap-8"
        initial={{ x: 0, opacity: 0 }}
        animate={
          phase === 1 ? { x: 0, opacity: 1, scale: 1 } : 
          phase > 1 ? { x: '-30vw', opacity: 0.2, scale: 0.6 } : 
          { x: 0, opacity: 0 }
        }
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      >
        <img 
          src={`${import.meta.env.BASE_URL}images/ai-tutor.png`} 
          alt="Adaptive practice engine" 
          className="w-[20vw] h-[20vw] object-contain drop-shadow-2xl rounded-full bg-white p-4"
        />
        <div className="bg-white p-8 rounded-3xl rounded-tl-none shadow-xl border-2 border-primary/20">
          <p className="text-[3vw] font-bold text-text-primary">Practice that adapts.</p>
          <p className="text-[2vw] text-text-secondary mt-2">Harder on a streak, support after a miss.</p>
        </div>
      </motion.div>

      {/* P2: AI-graded coursework */}
      <motion.div 
        className="absolute right-[10vw] flex flex-col gap-6 w-[40vw]"
        initial={{ x: '20vw', opacity: 0 }}
        animate={
          phase === 2 ? { x: 0, opacity: 1 } : 
          phase > 2 ? { y: '-20vh', opacity: 0 } : 
          { x: '20vw', opacity: 0 }
        }
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      >
        <h2 className="text-[4vw] font-black text-text-primary leading-tight">AI-graded coursework.</h2>
        <div className="flex gap-4 items-end h-[20vh]">
          <motion.div className="w-1/3 bg-secondary rounded-t-xl pb-4 flex items-end justify-center font-bold text-white text-[1.5vw]" 
            initial={{ height: 0 }} animate={phase >= 2 ? { height: '40%' } : { height: 0 }} transition={{ delay: 0.1 }}>Homework</motion.div>
          <motion.div className="w-1/3 bg-primary rounded-t-xl pb-4 flex items-end justify-center font-bold text-white text-[1.5vw]" 
            initial={{ height: 0 }} animate={phase >= 2 ? { height: '70%' } : { height: 0 }} transition={{ delay: 0.2 }}>Test</motion.div>
          <motion.div className="w-1/3 bg-accent rounded-t-xl pb-4 flex items-end justify-center font-bold text-white text-[1.5vw]" 
            initial={{ height: 0 }} animate={phase >= 2 ? { height: '100%' } : { height: 0 }} transition={{ delay: 0.3 }}>Final</motion.div>
        </div>
      </motion.div>

      {/* P3: Integrity Detection */}
      <motion.div 
        className="absolute inset-0 flex flex-col items-center justify-center bg-bg-light z-20"
        initial={{ clipPath: 'circle(0% at 50% 50%)' }}
        animate={phase >= 3 ? { clipPath: 'circle(150% at 50% 50%)' } : { clipPath: 'circle(0% at 50% 50%)' }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        <h2 className="text-[5vw] font-black text-primary drop-shadow-md">Two-layer integrity detection.</h2>
        <p className="text-[2.5vw] text-text-secondary mt-4 font-bold">A text classifier and a keystroke detector</p>
        <p className="text-[2.5vw] text-text-secondary mt-2 font-bold">screen every submission for AI authorship.</p>
        
        <div className="flex gap-6 mt-10">
          {[1,2,3,4,5].map((i) => (
            <motion.div 
              key={i}
              className="w-12 h-12 bg-accent rounded-lg"
              initial={{ scale: 0, rotate: 0 }}
              animate={phase >= 3 ? { scale: [0, 1.2, 1], rotate: [0, 90, 180] } : {}}
              transition={{ delay: 0.5 + (i * 0.1), duration: 0.5 }}
            />
          ))}
        </div>
      </motion.div>

    </motion.div>
  );
}
