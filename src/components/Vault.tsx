import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { runVerifyAIEngine } from '../lib/verifyAI';
import { opalsData } from '../data/opals';
import { Lock, Hexagon, Activity, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

interface VaultProps {
  mode: 'physical' | 'digital';
}

export function Vault({ mode }: VaultProps) {
  const vaultAssets = [...opalsData].sort((a, b) => b.mk_grade - a.mk_grade);
  const [activeIndex, setActiveIndex] = useState(0);

  const nextCard = () => setActiveIndex((prev) => (prev + 1) % vaultAssets.length);
  const prevCard = () => setActiveIndex((prev) => (prev === 0 ? vaultAssets.length - 1 : prev - 1));

  return (
    <section className="relative px-6 md:px-12 py-32 z-10 w-full bg-black min-h-screen flex flex-col justify-center overflow-hidden" id="vault">
      <div className={cn(
        "absolute inset-0 transition-opacity duration-1000",
        mode === 'physical' ? "opacity-100 bg-[#141414]" : "opacity-0"
      )} />
      <div className={cn(
        "absolute inset-0 transition-opacity duration-1000",
        mode === 'digital' ? "opacity-100 bg-[#0a0502]" : "opacity-0"
      )}>
        <div className="absolute inset-0 bg-digital-accent/5 backdrop-blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-end mb-16 border-b border-white/10 pb-8">
          <div>
            <span className="micro-label opacity-60 mb-4 block text-white/60">Asset Registry</span>
            <h2 className={cn(
              "text-5xl md:text-7xl lg:text-[6rem] leading-[0.9] tracking-tight mb-8",
              mode === 'physical' ? "font-serif text-white" : "font-sans font-medium text-white"
            )}>
              Your Vault
            </h2>
          </div>
          <div className="flex flex-col items-end">
            <span className="micro-label text-white/50 mb-2">Total Portfolio Value</span>
            <span className={cn(
              "font-mono text-3xl",
              mode === 'digital' ? "text-digital-accent" : "text-white"
            )}>
              $3,482,000
            </span>
          </div>
        </div>

        <div className="flex-1 relative flex items-center justify-center min-h-[600px] perspective-[2000px]">
           <div className="absolute top-1/2 left-8 md:left-24 -translate-y-1/2 z-50">
             <button onClick={prevCard} className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors backdrop-blur-md">
               <ChevronLeft className="w-6 h-6" />
             </button>
           </div>
           
           <div className="absolute top-1/2 right-8 md:right-24 -translate-y-1/2 z-50">
             <button onClick={nextCard} className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors backdrop-blur-md">
               <ChevronRight className="w-6 h-6" />
             </button>
           </div>

           <div className="relative w-[340px] h-[520px] md:w-[420px] md:h-[640px] preserve-3d">
              <AnimatePresence mode="popLayout">
                {vaultAssets.map((opal, index) => {
                  const isActive = index === activeIndex;
                  const offset = index - activeIndex;
                  const absOffset = Math.abs(offset);
                  
                  // Only render cards that are close to the active index for performance
                  if (absOffset > 3 && index !== 0 && index !== vaultAssets.length - 1) return null;

                  // Normalize offset for wrapping behavior conceptually (simplified here to just absolute distance backing up)
                  const visualOffset = offset;
                  
                  return (
                    <TactileCard 
                      key={opal.id} 
                      opal={opal} 
                      mode={mode} 
                      isActive={isActive}
                      visualOffset={visualOffset}
                      zIndex={100 - absOffset}
                    />
                  )
                })}
              </AnimatePresence>
           </div>
        </div>
      </div>
    </section>
  );
}

function TactileCard({ opal, mode, isActive, visualOffset, zIndex }: { key?: React.Key, opal: typeof opalsData[0], mode: 'physical'|'digital', isActive: boolean, visualOffset: number, zIndex: number }) {
  const analysis = runVerifyAIEngine(opal);
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Hover effect values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);
  const background = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.4) 0%, transparent 60%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isActive || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Stack positioning math
  const xTranslate = visualOffset * 40;
  const zTranslate = Math.abs(visualOffset) * -60;
  function getGradeEffects(grade: number) {
    if (grade >= 9) return { glow: "shadow-[0_0_80px_rgba(255,215,0,0.3)]", border: "border-[#D4AF37]/50", light: "bg-yellow-500/10" };
    if (grade >= 7) return { glow: "shadow-[0_0_60px_rgba(0,255,213,0.2)]", border: "border-digital-accent/40", light: "bg-digital-accent/5" };
    if (grade >= 4) return { glow: "shadow-[0_0_40px_rgba(255,255,255,0.1)]", border: "border-white/20", light: "bg-white/5" };
    return { glow: "shadow-2xl", border: "border-white/10", light: "bg-transparent" };
  }
  const gradeEffects = getGradeEffects(opal.mk_grade);

  const rotateYOffset = visualOffset * -5;
  const scaleOffset = 1 - Math.abs(visualOffset) * 0.05;
  const opacityOffset = isActive ? 1 : Math.max(1 - Math.abs(visualOffset) * 0.3, 0);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, x: visualOffset > 0 ? 100 : -100, scale: 0.8 }}
      animate={{ 
        opacity: opacityOffset, 
        x: xTranslate, 
        z: zTranslate,
        rotateY: isActive ? rotateY : `${rotateYOffset}deg`,
        rotateX: isActive ? rotateX : 0,
        scale: scaleOffset
      }}
      exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
      transition={{ type: "spring", stiffness: 200, damping: 25, mass: 1 }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex,
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        pointerEvents: isActive ? 'auto' : 'none',
      }}
    >
      <div className={cn(
        "w-full h-full rounded-[32px] overflow-hidden flex flex-col transition-colors border-2 relative",
        mode === 'physical' 
          ? "bg-white border-black/10 shadow-black/40 shadow-2xl" 
          : `bg-[#030712] ${gradeEffects.border} ${gradeEffects.glow}`
      )}>
        {/* Holographic Glare */}
        {isActive && mode === 'digital' && (
          <motion.div 
            className="absolute inset-0 z-50 pointer-events-none mix-blend-screen opacity-50"
            style={{ background }}
          />
        )}

        <div className="relative h-[55%] shrink-0 overflow-hidden bg-black">
          <img 
            src={opal.img}
            alt={opal.name}
            className={cn(
              "w-full h-full object-cover",
              mode === 'digital' && "mix-blend-luminosity opacity-70"
            )}
            referrerPolicy="no-referrer"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
          
          <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-10">
             <div className="backdrop-blur-md bg-black/40 px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-2">
               <Eye className="w-3 h-3 text-white/70" />
               <span className="micro-label text-xs text-white">M{opal.mk_grade}</span>
             </div>
             <div className="backdrop-blur-md bg-black/40 w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
               {mode === 'physical' ? <Lock className="w-4 h-4 text-white" /> : <Hexagon className="w-4 h-4 text-digital-accent" />}
             </div>
          </div>
        </div>
        
        <div className={cn(
          "flex-1 p-8 flex flex-col z-20 relative",
          mode === 'physical' ? "text-physical-ink" : "text-white"
        )}>
          {/* Subtle noise texture */}
          {mode === 'physical' && (
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          )}

          <div className="mt-auto">
            <span className={cn(
              "micro-label mb-2 block",
              mode === 'digital' ? "text-digital-accent" : "text-physical-ink/50"
            )}>{opal.id.toString().padStart(4, '0')}</span>
            
            <h3 className={cn(
              "text-3xl mb-6 leading-none",
              mode === 'physical' ? "font-serif" : "font-sans tracking-tight font-medium"
            )}>{opal.name}</h3>

            <div className="grid grid-cols-2 gap-y-4 gap-x-8 border-t border-current/10 pt-6 micro-label">
              <div className="flex flex-col gap-1">
                <span className="opacity-50">Weight</span>
                <span className="font-mono text-sm">{opal.ct} ct</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="opacity-50">Value</span>
                <span className={cn(
                  "font-mono text-sm",
                  mode === 'digital' && "text-digital-accent shadow-digital-accent"
                )}>${Math.round(analysis.impliedFairValue).toLocaleString()}</span>
              </div>
              <div className="flex flex-col gap-1 col-span-2">
                <span className="opacity-50">Rarity Score</span>
                <div className="w-full h-1 bg-current/10 rounded-full overflow-hidden mt-2">
                  <div 
                    className={cn("h-full rounded-full relative", mode === 'physical' ? "bg-physical-ink" : "bg-digital-accent")} 
                    style={{ width: `${analysis.rarityPercentile}%` }} 
                  >
                    {mode === 'digital' && (
                      <div className="absolute top-0 right-0 w-4 h-full bg-white blur-[2px]" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
