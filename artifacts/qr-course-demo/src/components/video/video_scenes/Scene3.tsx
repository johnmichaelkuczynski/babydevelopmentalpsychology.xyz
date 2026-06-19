import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TypewriterText } from '../TypewriterText';
import { StreamingText } from '../StreamingText';
import { TypingIndicator } from '../TypingIndicator';

export function Scene3({ setCursorPos, setIsClicking }: { setCursorPos: (pos: {x: string, y: string}) => void, setIsClicking: (val: boolean) => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // 0-2.0s Cursor into textarea, types "Why isn't a normative claim just an opinion?"
    // 2.0-2.5s Cursor to send button, clicks.
    // 2.5-3.5s Pulsing dots.
    // 3.5-10s AI response streams.
    // 10-12s Cursor types "What about intrinsic value?"

    setCursorPos({ x: '60vw', y: '16vh' }); // Start at Tutor tab
    
    const t1 = setTimeout(() => {
      setCursorPos({ x: '60vw', y: '85vh' }); // Move to textarea
      setPhase(1); // Start typing question 1
    }, 500);

    const t2 = setTimeout(() => {
      setCursorPos({ x: '92vw', y: '88vh' }); // Move to send button
    }, 2000);

    const t3 = setTimeout(() => {
      setIsClicking(true);
      setPhase(2); // Show user bubble, start AI typing
    }, 2400);

    const t4 = setTimeout(() => {
      setIsClicking(false);
      setPhase(3); // AI streaming
    }, 3400);

    const t5 = setTimeout(() => {
      setCursorPos({ x: '65vw', y: '90vh' }); // Move back to textarea
    }, 10000);

    const t6 = setTimeout(() => {
      setPhase(4); // Start typing question 2
    }, 10500);

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      clearTimeout(t4); clearTimeout(t5); clearTimeout(t6);
    };
  }, [setCursorPos, setIsClicking]);

  return (
    <motion.div 
      className="absolute inset-0 w-full h-full bg-background flex"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Left Pane (Static from previous) */}
      <div className="w-1/2 h-full border-r border-border p-12 overflow-hidden flex flex-col relative opacity-50">
        <div className="text-xs font-bold tracking-widest text-muted-foreground mb-4">UNIT 1</div>
        <h1 className="text-3xl font-serif text-primary mb-8">1.1 What developmental psychology is</h1>
        <div className="prose prose-sm max-w-none text-foreground/80 space-y-6">
          <h2 className="font-serif text-2xl text-primary">What developmental psychology is</h2>
          <p>Developmental psychology is the study of how people grow and change — from infancy and childhood, through the teenage years, all the way into old age.</p>
        </div>
      </div>

      {/* Right Pane: Tutor Chat */}
      <div className="w-1/2 h-full bg-white flex flex-col relative">
        <div className="flex border-b border-border px-4 pt-4 bg-background">
          <div className="px-6 py-3 font-medium text-sm border-b-2 border-primary text-primary">Ask the tutor</div>
          <div className="px-6 py-3 font-medium text-sm border-b-2 border-transparent text-muted-foreground">Practice on this</div>
        </div>

        <div className="flex-1 p-8 relative flex flex-col overflow-hidden">
          
          <div className="flex-1 overflow-y-auto space-y-6 flex flex-col">
            {phase < 2 && (
              <motion.div exit={{ opacity: 0, y: -20 }} className="mt-auto">
                <div className="mb-4 text-xs font-semibold text-muted-foreground uppercase tracking-widest">Starter questions for this section</div>
                <div className="flex flex-wrap gap-2 mb-6">
                  <div className="px-3 py-1.5 rounded-full border border-border text-sm text-primary bg-muted/30">Why do infants cry when a parent leaves the room?</div>
                </div>
              </motion.div>
            )}

            {phase >= 2 && (
              <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.95 }} 
                animate={{ opacity: 1, y: 0, scale: 1 }} 
                className="self-end max-w-[85%] bg-primary text-white p-4 rounded-2xl rounded-tr-sm shadow-sm mt-auto"
              >
                Why do infants cry when a parent leaves the room?
              </motion.div>
            )}

            {phase === 2 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="self-start max-w-[85%]"
              >
                <TypingIndicator />
              </motion.div>
            )}

            {phase >= 3 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="self-start w-[85%] bg-muted/30 border border-border p-5 rounded-2xl rounded-tl-sm text-[15px] leading-relaxed shadow-sm"
              >
                <StreamingText text="Great question. Very young infants act as if things they can't see no longer exist — so when a parent leaves the room, it can feel like they've vanished for good. As object permanence develops, infants learn that people still exist when out of sight, which is closely tied to their growing attachment." delay={0} />
              </motion.div>
            )}
          </div>

          <div className="mt-6 w-full min-h-24 border border-border rounded-xl bg-background p-3 flex items-end shadow-inner relative z-10">
            <div className="w-full flex justify-between items-center pr-2">
              <div className="text-foreground text-[15px] font-medium pl-2 relative w-full h-full flex items-center">
                {phase === 1 && <TypewriterText text="Why do infants cry when a parent leaves the room?" speed={25} />}
                {phase >= 2 && phase < 4 && <span className="text-muted-foreground font-normal">Ask a question about this section...</span>}
                {phase >= 4 && <TypewriterText text="So when do infants learn that hidden things still exist?" speed={20} />}
                {((phase >= 1 && phase < 2) || phase >= 4) && (
                  <motion.div className="w-0.5 h-5 bg-primary ml-1" animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} />
                )}
              </div>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors shrink-0 ${phase === 1 ? 'bg-primary text-white cursor-pointer shadow-md' : 'bg-muted text-muted-foreground opacity-50'}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </div>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}