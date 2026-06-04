import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { Lock, FileSignature, Scale } from 'lucide-react';

const MANIFESTO_POINTS = [
  {
    icon: FileSignature,
    title: "Authored by the Trade",
    text: "Defined by the miners and cutters of Andamooka—grounded in generations of hard-won geological truth."
  },
  {
    icon: Lock,
    title: "Secured by the Ledger",
    text: "Subjectivity is replaced by cryptography. The local standard becomes an immutable global asset."
  }
];

export function AndamookaStandard({ mode }: { mode: 'physical' | 'digital' }) {
  const isPhysical = mode === 'physical';

  return (
    <div className="w-full mt-12 mb-32 relative z-10 max-w-[1400px] mx-auto px-6">
      <div className={cn(
        "relative w-full rounded-[2.5rem] border overflow-hidden p-8 md:p-16 lg:p-24",
        isPhysical ? "bg-stone-50 border-stone-200" : "bg-[#070A11] border-white/10 shadow-[0_0_80px_rgba(0,255,213,0.05)]"
      )}>
        {/* Accent corners */}
        <div className={cn("absolute top-0 left-0 w-32 h-32 border-l border-t opacity-50", isPhysical ? "border-stone-400 rounded-tl-[2.5rem]" : "border-digital-accent rounded-tl-[2.5rem] border-2")} />
         <div className={cn("absolute bottom-0 right-0 w-32 h-32 border-r border-b opacity-50", isPhysical ? "border-stone-400 rounded-br-[2.5rem]" : "border-digital-accent rounded-br-[2.5rem] border-2")} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
           {/* Left side: Manifesto Points */}
           <div className="flex flex-col gap-12 lg:order-1 order-2">
              <div className="flex flex-col gap-4">
                 <div className={cn("text-xs font-mono uppercase tracking-widest opacity-50", isPhysical ? "text-stone-500" : "text-digital-accent")}>
                    The Hybrid Approach
                 </div>
                 <h4 className={cn("text-4xl lg:text-5xl font-serif tracking-tight leading-[1.1]", isPhysical ? "text-stone-900" : "text-white")}>
                    Community consensus meets cryptography.
                 </h4>
              </div>

              <div className="flex flex-col gap-6">
                 {MANIFESTO_POINTS.map((point, i) => (
                     <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.2 }}
                      className={cn(
                         "flex items-start gap-8 p-10 md:p-12 rounded-[2rem] border transition-all duration-300",
                         "bg-[#030508] border-white/5 shadow-[0_0_50px_rgba(255,215,0,0.06)] hover:shadow-[0_0_60px_rgba(255,215,0,0.12)]"
                      )}
                    >
                      <div className="mt-1 shrink-0 text-[#FFD700]/80">
                         <point.icon className="w-8 h-8" />
                      </div>
                      <div className="flex flex-col gap-3">
                         <div className="font-medium font-serif text-2xl text-white tracking-tight">{point.title}</div>
                         <div className="text-lg font-sans leading-relaxed text-balance text-white/70">
                           {point.text}
                         </div>
                      </div>
                    </motion.div>
                 ))}
              </div>
           </div>

           {/* Right side: The standard coins */}
           <motion.div
             initial={{ opacity: 0, lg: { x: 20 }, scale: 0.95 }}
             whileInView={{ opacity: 1, lg: { x: 0 }, scale: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
             className="w-full flex items-center justify-center relative p-4 lg:order-2 order-1"
           >
              <div className={cn(
                "relative z-10 p-2 md:p-8 rounded-[2rem] overflow-hidden group",
                isPhysical ? "bg-none" : "bg-transparent"
              )}>
                 <img 
                   src="https://res.cloudinary.com/dkgqxred2/image/upload/v1780587312/coins_wmc7pz.png" 
                   alt="Andamooka Standard Grading Coins M1-M9" 
                   className={cn(
                     "w-full max-w-[500px] h-auto object-contain transition-transform duration-1000",
                     isPhysical ? "drop-shadow-[0_15px_25px_rgba(0,0,0,0.15)]" : "drop-shadow-[0_0_40px_rgba(0,255,213,0.4)] group-hover:scale-105"
                   )} 
                 />
              </div>
              
              {/* Floating micro-labels */}
              <div className={cn("absolute -top-2 md:-top-6 left-1/2 -translate-x-1/2 micro-label px-4 py-1.5 rounded-md border backdrop-blur-sm shadow-xl z-30", isPhysical ? "bg-white border-stone-200 text-stone-500" : "bg-black/90 border-digital-accent/40 text-digital-accent shadow-[0_0_20px_rgba(0,255,213,0.2)]")}>M1-M9 Grading Scale</div>
              <div className={cn("absolute -bottom-2 md:-bottom-6 left-1/2 -translate-x-1/2 micro-label px-4 py-1.5 rounded-md border backdrop-blur-sm shadow-xl z-30", isPhysical ? "bg-white border-stone-200 text-stone-500" : "bg-black/90 border-digital-accent/40 text-digital-accent shadow-[0_0_20px_rgba(0,255,213,0.2)]")}>Objective Standard</div>
           </motion.div>
        </div>
      </div>
    </div>
  )
}
