import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StreamingText } from '../StreamingText';

export function Scene5({ setCursorPos, setIsClicking }: { setCursorPos: (pos: {x: string, y: string}) => void, setIsClicking: (val: boolean) => void }) {
  const [phase, setPhase] = useState(0);
  const [typedAnswer, setTypedAnswer] = useState("");

  useEffect(() => {
    // 0-2.0s: Settles, streams problem 1.
    // 2.0-3.5s: Cursor to textarea, types "8".
    // 3.5-4.5s: Cursor to Submit, clicks, loading.
    // 4.5-6.0s: Red pill streams explanation. Score 0/1.
    // 6.0-7.0s: Toast down.
    // 7.0-8.5s: Problem 2 streams.
    // 8.5-10.5s: Cursor types the continuous-variable answer into the answer box.
    // 10.5-11.5s: Cursor clicks Submit.
    // 11.5-14s: Green pill, toast up.

    setCursorPos({ x: '40vw', y: '65vh' }); // Start where Scene 4 left off
    
    const t1 = setTimeout(() => setPhase(1), 500); // Start problem 1 stream

    const t2 = setTimeout(() => {
      setCursorPos({ x: '50vw', y: '60vh' }); // Move to textarea
    }, 2000);

    const t3 = setTimeout(() => {
      setTypedAnswer("Their inborn nature.");
    }, 3000);

    const t4 = setTimeout(() => {
      setCursorPos({ x: '70vw', y: '60vh' }); // Move to Submit
    }, 3500);

    const t5 = setTimeout(() => {
      setIsClicking(true);
    }, 4200);

    const t6 = setTimeout(() => {
      setIsClicking(false);
      setPhase(2); // Show red pill
    }, 4500);

    const t7 = setTimeout(() => setPhase(3), 6000); // Toast down
    const t8 = setTimeout(() => {
      setPhase(4); // Problem 2
      setTypedAnswer("");
    }, 7000);

    const t9 = setTimeout(() => {
      setCursorPos({ x: '35vw', y: '82vh' }); // move into answer box
      setTypedAnswer("Even with");
    }, 8500);
    const t10 = setTimeout(() => setTypedAnswer("Even with the same home,"), 9000);
    const t11 = setTimeout(() => setTypedAnswer("Even with the same home, their temperaments"), 9500);
    const t12 = setTimeout(() => setTypedAnswer("Even with the same home, their temperaments and experiences differed."), 10000);

    const t13 = setTimeout(() => {
      setCursorPos({ x: '70vw', y: '60vh' }); // Move to Submit
    }, 10500);

    const t14 = setTimeout(() => setIsClicking(true), 11200);
    const t15 = setTimeout(() => {
      setIsClicking(false);
      setPhase(5); // Green pill + Toast up
    }, 11500);

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
      clearTimeout(t5); clearTimeout(t6); clearTimeout(t7); clearTimeout(t8);
      clearTimeout(t9); clearTimeout(t10); clearTimeout(t11); clearTimeout(t12);
      clearTimeout(t13); clearTimeout(t14); clearTimeout(t15);
    };
  }, [setCursorPos, setIsClicking]);

  return (
    <motion.div 
      className="absolute inset-0 w-full h-full bg-background p-12 overflow-hidden flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Toast notifications */}
      <AnimatePresence>
        {phase === 3 && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute bottom-8 right-12 z-50 bg-slate-800 text-white px-4 py-3 rounded-lg shadow-xl text-sm flex items-center space-x-2"
          >
            <span>↓</span>
            <span>Difficulty adjusted to <span className="font-semibold">Very easy</span></span>
          </motion.div>
        )}
        {phase === 5 && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="absolute bottom-8 right-12 z-50 bg-slate-800 text-white px-4 py-3 rounded-lg shadow-xl text-sm flex items-center space-x-2"
          >
            <span>↑</span>
            <span>Difficulty adjusted to <span className="font-semibold">Easy</span></span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto w-full">
        <div className="text-xs font-bold text-muted-foreground tracking-widest uppercase mb-4">Topic Practice</div>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-4xl font-serif text-primary mb-2">Nature vs. nurture</h1>
            <div className="text-sm text-muted-foreground">Unit 1 · 1 prior attempt · 1% accuracy · <span className="text-emerald-600 font-semibold">STRONG</span></div>
          </div>
          <div className="text-sm font-medium border border-border px-3 py-1 rounded-md bg-white">
            Session score: {phase < 2 ? '0/0' : phase < 5 ? '0/1' : '1/2'}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-8 text-sm text-blue-900 flex items-start space-x-3">
          <div className="mt-0.5 text-blue-500">ℹ</div>
          <div><span className="font-semibold">Starting at very easy</span> · Your accuracy is 1% — starting with foundational problems. Difficulty will adapt as you go.</div>
        </div>

        <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[400px]">
          <div className="p-8 flex-1 border-b border-border text-lg text-primary font-medium leading-relaxed">
            {phase >= 1 && phase < 4 && (
              <StreamingText text="An infant cries whenever a parent leaves the room, but is happy when they return. Is this better explained by the infant's inborn nature or by what they've learned? Explain." delay={0} />
            )}
            {phase >= 4 && (
              <StreamingText text="Two siblings are raised in the same home, but grow up with very different personalities. Why can a shared upbringing still lead to different paths?" delay={0} />
            )}
          </div>
          
          <div className="p-6 bg-muted/20">
            <div className="flex space-x-4 mb-4">
              <div className="flex-1 relative">
                <div className="w-full h-14 bg-white border border-border rounded-lg px-4 flex items-center shadow-inner text-lg">
                  {typedAnswer || <span className="text-muted-foreground text-sm">Type your answer here...</span>}
                  {((phase >= 1 && phase < 2) || (phase >= 4 && phase < 5)) && <motion.div className="w-0.5 h-6 bg-primary ml-1" animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} />}
                </div>
              </div>
              <div className={`px-8 h-14 rounded-lg flex items-center justify-center font-medium text-white transition-all ${phase === 2 || phase === 5 ? 'bg-primary/50' : 'bg-primary cursor-pointer'}`}>
                Submit
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              {phase >= 2 && phase < 4 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 bg-red-50 border border-red-100 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-2 text-red-600 font-bold text-sm mb-2 uppercase tracking-wide">
                    <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-xs">✕</div>
                    <span>Not quite</span>
                  </div>
                  <div className="text-sm text-red-900 leading-relaxed">
                    <StreamingText text="Not quite. Crying when a parent leaves and calming when they return is learned through the bond of attachment — it's not simply inborn nature. Development comes from nature and nurture working together." delay={0} />
                  </div>
                </motion.div>
              )}
              {phase >= 5 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-4 bg-emerald-50 border border-emerald-100 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-2 text-emerald-600 font-bold text-sm mb-2 uppercase tracking-wide">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-xs">✓</div>
                    <span>Correct!</span>
                  </div>
                  <div className="text-sm text-emerald-900 leading-relaxed">
                    <StreamingText text="Correct! A shared home isn't the whole story. Different temperaments, experiences, and relationships shape siblings in different ways — which is why people from the same household can grow up so differently. That's nature and nurture together." delay={0} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-4">
              <div className="flex space-x-2 border-b border-border pb-2 mb-3 overflow-x-auto text-xs font-medium">
                <div className="px-3 py-1 border-b-2 border-primary text-primary">Nature & nurture</div>
                {['Attachment', 'Object permanence', 'Piaget', 'Language', 'The teenage brain', 'Aging'].map(t => (
                  <div key={t} className="px-3 py-1 text-muted-foreground">{t}</div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {/* No tools for this section */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}