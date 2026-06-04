import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { Hexagon } from 'lucide-react';

const LOW_EVALUATIONS = [
  { id: 1, role: "The Trade", price: "$1.50/ct", text: "Similar material $5 per ct. Best offer I got on here is $1.50 per ct." },
  { id: 2, role: "The Broker", price: "$3–$5/ct", text: "Nobody's gonna pay $15,000... market is likely somewhere in the $3–$5 per carat range." },
  { id: 3, role: "The Realist", price: "$2,400 total", text: "Not gonna happen. Coober Pedy maybe $2400." },
];

const HIGH_EVALUATIONS = [
  { id: 4, role: "The Veteran", price: "$50/g", text: "Last I saw show price was $15-40/g for CP whites of that type... $50/g would be top price." },
  { id: 5, role: "The Speculator", price: "24k USD", text: "So he wants 24k USD for the two chunks?" },
  { id: 6, role: "The Observer", price: "50k AUD", text: "Basically 50k AUD... I'd have a long hard think about that." },
];

export function MarketBroken({ mode }: { mode: 'physical' | 'digital' }) {
  const isPhysical = mode === 'physical';

  return (
    <div className="w-full mt-24 mb-32 relative z-10 max-w-[1400px] mx-auto px-6">
      
      {/* Pristine Header */}
      <div className="mb-20 text-left flex flex-col items-start">
         <div className={cn(
             "micro-label mb-6 flex items-center justify-start gap-3 px-4 py-2 rounded-full border", 
             isPhysical ? "border-stone-200 text-stone-500 bg-white shadow-sm" : "border-digital-accent/20 text-digital-accent bg-digital-accent/5 backdrop-blur-md"
         )}>
            <Hexagon className="w-3.5 h-3.5" />
            <span>Pricing Variance Analysis</span>
         </div>
         <h3 className={cn("text-3xl md:text-5xl font-serif tracking-tight mb-6 max-w-4xl", isPhysical ? "text-stone-900" : "text-white")}>
            A real-world extraction of a pricing dispute. One asset. Zero consensus.
         </h3>
         <div className={cn("text-base font-sans max-w-2xl leading-relaxed", isPhysical ? "text-stone-500" : "text-white/50")}>
            The absence of an objective standard reduces professional evaluation to absolute chaos. We bring order through cryptographically verified physical tracking.
         </div>
      </div>

      {/* Symmetrical Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Extreme Undervaluation */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className={cn("text-xs font-mono uppercase tracking-widest text-center lg:text-right mb-4 opacity-50", isPhysical ? "text-stone-800" : "text-white")}>Low Probability</div>
            {LOW_EVALUATIONS.map((evalItem, i) => (
               <motion.div
                 key={evalItem.id}
                 initial={{ opacity: 0, x: -20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                 className={cn(
                     "p-6 rounded-2xl border text-left lg:text-right transition-all duration-500",
                     isPhysical ? "bg-white border-stone-100 shadow-sm hover:shadow-md" : "bg-[#030712] border-white/5 hover:border-white/10"
                 )}
               >
                 <div className={cn("font-mono text-2xl font-medium tracking-tight mb-3", isPhysical ? "text-stone-900" : "text-white")}>{evalItem.price}</div>
                 <div className={cn("font-sans text-sm leading-relaxed mb-4", isPhysical ? "text-stone-600" : "text-white/60")}>"{evalItem.text}"</div>
                 <div className={cn("micro-label opacity-40")}>{evalItem.role}</div>
               </motion.div>
            ))}
          </div>

          {/* Center Column: The Contested Asset */}
          <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                  "lg:col-span-4 p-6 rounded-[32px] border relative mx-auto w-full max-w-md",
                  isPhysical ? "bg-stone-50 border-stone-200 shadow-2xl shadow-stone-200" : "bg-[#0B0F19] border-white/10 shadow-[0_0_80px_rgba(0,255,213,0.07)]"
              )}
          >
              <div className="flex items-center justify-between mb-6 px-2">
                  <div className={cn("text-[10px] font-mono uppercase tracking-[0.2em] opacity-50", isPhysical ? "text-stone-800" : "text-white")}>
                      Subject A
                  </div>
                  <div className={cn("text-[10px] font-mono tracking-widest flex items-center gap-2", isPhysical ? "text-red-500" : "text-digital-accent")}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                      UNVERIFIED
                  </div>
              </div>
              <div className={cn("w-full aspect-[4/5] rounded-2xl overflow-hidden relative mb-6", isPhysical ? "bg-white" : "bg-black")}>
                  <img src="/images/CPopal.png" alt="Contested Rough Opal" className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal transform transition-transform duration-1000 hover:scale-105" />
              </div>
              <div className="text-center px-4">
                 <p className={cn("font-sans text-lg font-medium leading-snug mb-2", isPhysical ? "text-stone-900" : "text-white")}>
                     "What would you guys value these two chunks at?"
                 </p>
                 <p className={cn("font-mono text-xs uppercase tracking-widest opacity-40", isPhysical ? "text-stone-800" : "text-white")}>
                     Posted 3 days ago
                 </p>
              </div>
          </motion.div>

          {/* Right Column: Extreme Overvaluation */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className={cn("text-xs font-mono uppercase tracking-widest text-center lg:text-left mb-4 opacity-50", isPhysical ? "text-stone-800" : "text-white")}>High Probability</div>
            {HIGH_EVALUATIONS.map((evalItem, i) => (
               <motion.div
                 key={evalItem.id}
                 initial={{ opacity: 0, x: 20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                 className={cn(
                     "p-6 rounded-2xl border text-left transition-all duration-500",
                     isPhysical ? "bg-white border-stone-100 shadow-sm hover:shadow-md" : "bg-[#030712] border-white/5 hover:border-white/10"
                 )}
               >
                 <div className={cn("font-mono text-2xl font-medium tracking-tight mb-3", isPhysical ? "text-stone-900" : "text-white")}>{evalItem.price}</div>
                 <div className={cn("font-sans text-sm leading-relaxed mb-4", isPhysical ? "text-stone-600" : "text-white/60")}>"{evalItem.text}"</div>
                 <div className={cn("micro-label opacity-40")}>{evalItem.role}</div>
               </motion.div>
            ))}
          </div>

      </div>

    </div>
  );
}
