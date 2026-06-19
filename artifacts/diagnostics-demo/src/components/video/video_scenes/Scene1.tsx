import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sceneTransitions } from '@/lib/video/animations';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col justify-center items-center text-center px-12 z-10"
      {...sceneTransitions.clipPolygon}
    >
      <motion.div 
        className="mb-8 relative"
        initial={{ opacity: 0, scale: 0.8, y: 30 }}
        animate={phase >= 1 ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 30 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <div className="w-[1px] h-16 bg-[var(--color-accent)] mx-auto mb-6" />
        <h2 className="text-[1.5vw] uppercase tracking-[0.3em] text-[var(--color-accent)] font-medium mb-4">Basic Developmental Psychology</h2>
        <h1 className="text-[6vw] font-display text-[var(--color-text-primary)] leading-none italic font-semibold">
          Diagnostic<br />Assessments
        </h1>
      </motion.div>

      <motion.div
        className="w-[40%] h-[1px] bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-30 my-8"
        initial={{ scaleX: 0 }}
        animate={phase >= 2 ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />

      <motion.p
        className="text-[2vw] text-[var(--color-text-secondary)] font-light tracking-wide max-w-[60%]"
        initial={{ opacity: 0, y: 20 }}
        animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        Measuring <span className="text-[var(--color-text-primary)] italic">how</span> you reason,<br/>not just what you know.
      </motion.p>
    </motion.div>
  );
}