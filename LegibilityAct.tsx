import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { ArrowRight, ScanLine } from 'lucide-react';

interface Props {
  mode: 'physical' | 'digital';
}

const legibilityData = {
  diamonds: {
    name: 'Diamonds',
    beforeEra: 'Pre-1990s',
    afterEra: 'Post-GIA standardisation',
    before: [
      { k: 'Origin', v: 'Unknown — verbal claim only' },
      { k: 'Quality', v: "Buyer's eye, no standard" },
      { k: 'Trust', v: 'Local, relationship-based' },
      { k: 'Market', v: 'Fragmented, regional' },
      { k: 'Value', v: 'Inconsistent, risk-discounted' },
    ],
    after: [
      { k: 'Origin', v: 'Certified — Kimberley Process' },
      { k: 'Quality', v: 'GIA 4Cs — universal standard' },
      { k: 'Trust', v: 'Transferable globally' },
      { k: 'Market', v: 'Institutional, $87B annually' },
      { k: 'Value', v: 'Documented, premium-commanding' },
    ],
    result: 'The GIA created a universal grading standard. A common language turned a fragmented trade into a global market.',
    metric: '$87B',
    metricLbl: 'Global market today'
  },
  watches: {
    name: 'Watches',
    beforeEra: 'Undocumented era',
    afterEra: 'With box, papers & service history',
    before: [
      { k: 'Provenance', v: "Verbal — seller's word" },
      { k: 'Condition', v: 'Visual inspection only' },
      { k: 'History', v: 'Previous owners unknown' },
      { k: 'Trust', v: 'Reputation of seller alone' },
      { k: 'Value', v: 'Heavily discounted at resale' },
    ],
    after: [
      { k: 'Provenance', v: 'Original box and papers' },
      { k: 'Condition', v: 'Service records documented' },
      { k: 'History', v: 'Ownership chain on record' },
      { k: 'Trust', v: 'Independently verifiable' },
      { k: 'Value', v: 'Up to 60% resale premium' },
    ],
    result: 'The object did not change. The record did. Watches with papers command up to 60% more at resale than identical models without.',
    metric: '60%',
    metricLbl: 'Resale premium with papers'
  },
  wine: {
    name: 'Wine',
    beforeEra: 'Pre-appellation system',
    afterEra: 'AOC & classification era',
    before: [
      { k: 'Origin', v: 'Label claims — unverifiable' },
      { k: 'Vintage', v: 'Stated, rarely verified' },
      { k: 'Quality', v: 'No consistent standard' },
      { k: 'Market', v: 'Local, low-trust' },
      { k: 'Value', v: 'Commodity, low margin' },
    ],
    after: [
      { k: 'Origin', v: 'AOC — legally protected region' },
      { k: 'Vintage', v: 'Regulated and recorded' },
      { k: 'Quality', v: 'Classification system enforced' },
      { k: 'Market', v: 'Global collector market' },
      { k: 'Value', v: 'Investment-grade premiums' },
    ],
    result: 'The Bordeaux classification created in 1855 still determines pricing today. A single bottle of Pétrus trades at $4,000+ because its origin is irrefutable.',
    metric: '$400B',
    metricLbl: 'Global fine wine market'
  }
};

type Category = keyof typeof legibilityData;

export function LegibilityAct({ mode }: Props) {
  const [activeTab, setActiveTab] = useState<Category>('diamonds');
  const data = legibilityData[activeTab];

  return (
    <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-24">
      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
        {(Object.keys(legibilityData) as Category[]).map(key => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={cn(
              "px-6 py-3 rounded-full text-xs tracking-widest uppercase transition-all duration-300",
              activeTab === key 
                ? (mode === 'physical' ? "bg-physical-ink text-white" : "bg-digital-accent/20 text-digital-accent border border-digital-accent")
                : (mode === 'physical' ? "bg-[#e5e1d8] text-physical-ink/60 hover:bg-black/10" : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10")
            )}
          >
            {legibilityData[key].name}
          </button>
        ))}
      </div>

      <div className={cn(
        "rounded-[24px] overflow-hidden border",
        mode === 'physical' ? "bg-white border-black/10 shadow-2xl" : "digital-glass border-digital-accent/30 shadow-[0_0_40px_rgba(0,255,213,0.1)]"
      )}>
        <div className="grid grid-cols-1 lg:grid-cols-2 relative">
          
          {/* Scanline Divider for Digital */}
          {mode === 'digital' && (
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-white/10 pointer-events-none z-20">
              <motion.div 
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 4, ease: "linear", repeat: Infinity }}
                className="absolute left-1/2 -ml-3 w-6 h-32 bg-gradient-to-b from-transparent via-digital-accent to-transparent opacity-50 blur-sm"
              />
            </div>
          )}
          
          {/* Before */}
          <div className="p-10 lg:p-16 border-b lg:border-b-0 lg:border-r border-current/10 relative">
             <div className="micro-label opacity-50 mb-8 flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-current opacity-40" />
               Before
             </div>
             
             <AnimatePresence mode="wait">
               <motion.div
                 key={`before-${activeTab}`}
                 initial={{ opacity: 0, x: -10 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: 10 }}
                 transition={{ duration: 0.3 }}
               >
                 <h3 className={cn("text-3xl mb-2", mode === 'physical' ? "font-serif" : "font-sans tracking-tight")}>{data.name}</h3>
                 <div className="text-sm opacity-50 mb-12">{data.beforeEra}</div>

                 <div className="space-y-4">
                   {data.before.map((attr, i) => (
                     <div key={i} className="grid grid-cols-3 gap-4 pb-4 border-b border-current/5">
                       <span className="micro-label opacity-40 col-span-1">{attr.k}</span>
                       <span className="text-sm opacity-70 col-span-2">{attr.v}</span>
                     </div>
                   ))}
                 </div>
               </motion.div>
             </AnimatePresence>
          </div>

          {/* After */}
          <div className={cn("p-10 lg:p-16 relative", mode === 'physical' ? "bg-[#f9f8f6]" : "bg-black/40")}>
             <div className="micro-label mb-8 flex items-center gap-3">
               <div className={cn("w-2 h-2 rounded-full", mode === 'physical' ? "bg-green-600" : "bg-digital-accent shadow-[0_0_8px_rgba(0,255,213,0.8)]")} />
               <span className={cn(mode === 'digital' && "text-digital-accent")}>After</span>
             </div>

             <AnimatePresence mode="wait">
               <motion.div
                 key={`after-${activeTab}`}
                 initial={{ opacity: 0, x: 10 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -10 }}
                 transition={{ duration: 0.3 }}
                 className="relative z-10"
               >
                 <h3 className={cn("text-3xl mb-2 text-white", mode === 'physical' ? "font-serif text-black" : "font-sans tracking-tight text-white")}>{data.name}</h3>
                 <div className="text-sm opacity-50 mb-12">{data.afterEra}</div>

                 <div className="space-y-4">
                   {data.after.map((attr, i) => (
                     <div key={i} className="grid grid-cols-3 gap-4 pb-4 border-b border-current/10">
                       <span className="micro-label opacity-40 col-span-1">{attr.k}</span>
                       <span className={cn("text-sm col-span-2 font-medium tracking-wide", mode === 'digital' ? "text-white" : "text-black")}>{attr.v}</span>
                     </div>
                   ))}
                 </div>
               </motion.div>
             </AnimatePresence>

             {/* Background Glow for Digital */}
             {mode === 'digital' && (
               <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-digital-accent/10 blur-[100px] rounded-full pointer-events-none" />
             )}
          </div>
        </div>

        {/* Result Strip */}
        <div className="border-t border-current/10 p-8 lg:p-12 pl-12 relative flex flex-col md:flex-row justify-between items-center gap-8">
           <div className={cn("absolute left-0 top-0 bottom-0 w-2", mode === 'physical' ? "bg-black" : "bg-digital-accent shadow-[0_0_15px_rgba(0,255,213,0.5)]")} />
           <p className={cn("text-xl md:text-2xl max-w-2xl leading-relaxed font-light", mode === 'physical' ? "font-serif" : "font-sans")}>
             {data.result}
           </p>
           <div className="text-right shrink-0">
             <div className={cn("text-4xl md:text-5xl font-light mb-2", mode === 'physical' ? "font-sans tracking-tight text-physical-ink" : "font-sans font-medium text-digital-accent drop-shadow-md")}>
               {data.metric}
             </div>
             <div className="micro-label opacity-50">{data.metricLbl}</div>
           </div>
        </div>

      </div>
    </div>
  );
}
