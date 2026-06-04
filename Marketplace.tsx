import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { ShieldCheck, ArrowRight, FileBadge, Activity, Globe, Lock } from 'lucide-react';
import { OpalData, opalsData } from '../data/opals';
import { runVerifyAIEngine } from '../lib/verifyAI';

interface MarketplaceProps {
  mode: 'physical' | 'digital';
}

export function Marketplace({ mode }: MarketplaceProps) {
  // Sort opals by grade descending
  const marketOpals = [...opalsData].sort((a, b) => b.mk_grade - a.mk_grade);

  return (
    <section className="relative px-6 md:px-12 py-32 z-10 w-full" id="marketplace">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b border-current/10 pb-8">
          <div>
            <span className="micro-label opacity-60 mb-4 block">AOSA Inter-Exchange</span>
            <h2 className={cn(
              "text-5xl md:text-7xl lg:text-[6rem] leading-[0.9] tracking-tight mb-8",
              mode === 'physical' ? "font-serif" : "font-sans font-medium"
            )}>
              Institutional Marketplace
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className={cn(
              "flex flex-col items-end border-r pr-6",
              mode === 'physical' ? "border-physical-ink/10" : "border-digital-border"
            )}>
              <span className="micro-label opacity-50 mb-1">24h Volume</span>
              <span className="font-mono text-xl tracking-tight">$12.4M</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="micro-label opacity-50 mb-1">Active Bids</span>
              <span className="font-mono text-xl tracking-tight">842</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-12 overflow-x-auto pb-4 micro-label">
          {['All Grades', 'Investment (M7-M9)', 'Premium (M4-M6)', 'Standard (M1-M3)'].map((filter, i) => (
            <button key={filter} className={cn(
              "px-6 py-2 rounded-full whitespace-nowrap transition-colors",
              i === 0 
                ? (mode === 'physical' ? "bg-physical-ink text-white" : "bg-digital-accent text-digital-bg")
                : (mode === 'physical' ? "border border-physical-ink/20 hover:bg-black/5" : "border border-digital-accent/20 hover:bg-white/5")
            )}>
              {filter}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex flex-col gap-4">
          {marketOpals.slice(0, 5).map((opal) => {
            const analysis = runVerifyAIEngine(opal);
            const isHero = opal.mk_grade >= 8;
            
            return (
              <div key={opal.id} className={cn(
                "group grid grid-cols-1 md:grid-cols-12 gap-6 p-6 rounded-2xl transition-all duration-500",
                isHero ? (mode === 'physical' ? "bg-white shadow-xl shadow-black/5 border border-black/5" : "bg-digital-accent/5 border border-digital-accent/30") 
                       : (mode === 'physical' ? "bg-white/50 border border-transparent hover:border-black/5" : "bg-black/40 border border-white/5 hover:border-digital-accent/20")
              )}>
                
                {/* Image col */}
                <div className={cn(
                  "md:col-span-2 relative rounded-xl overflow-hidden aspect-square",
                  isHero ? "md:col-span-3 aspect-[4/3]" : ""
                )}>
                  <img src={opal.img} alt={opal.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110" />
                  {mode === 'digital' && <div className="absolute inset-0 bg-digital-accent/10 mix-blend-overlay" />}
                  {isHero && (
                    <div className={cn(
                      "absolute top-3 left-3 px-2 py-1 text-xs uppercase tracking-wider rounded font-mono",
                      mode === 'physical' ? "bg-white/90 text-black backdrop-blur-md" : "bg-digital-accent text-black shadow-[0_0_10px_rgba(0,255,213,0.5)]"
                    )}>
                      Museum Grade
                    </div>
                  )}
                </div>

                {/* Details col */}
                <div className={cn(
                  "flex flex-col justify-center",
                  isHero ? "md:col-span-4" : "md:col-span-5"
                )}>
                  <div className="flex items-center gap-2 mb-2 micro-label opacity-60">
                    <span className={cn(mode === 'digital' && "text-digital-accent")}>Token: {opal.id.toString().padStart(4, '0')}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> AOSA Verified</span>
                  </div>
                  <h3 className={cn(
                    "mb-4",
                    isHero ? "text-2xl" : "text-lg",
                    mode === 'physical' ? "font-serif" : "font-sans tracking-tight"
                  )}>{opal.name}</h3>
                  
                  <div className="flex gap-6 mt-auto border-t border-current/10 pt-4 micro-label">
                    <div className="flex flex-col gap-1">
                      <span className="opacity-50">Weight</span>
                      <span className="font-mono text-sm">{opal.ct} ct</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="opacity-50">Grade</span>
                      <span className="font-mono text-sm">{analysis.grade}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="opacity-50">Rarity</span>
                      <span className="font-mono text-sm">Top {100 - Math.round(analysis.rarityPercentile)}%</span>
                    </div>
                  </div>
                </div>

                {/* Market col */}
                <div className={cn(
                  "md:col-span-5 flex flex-col justify-center items-end border-l pl-6",
                  mode === 'physical' ? "border-physical-ink/10" : "border-digital-border",
                  isHero ? "md:col-span-5" : ""
                )}>
                  <div className="w-full flex justify-between items-end mb-6">
                    <div className="flex flex-col">
                      <span className="micro-label opacity-50 mb-1">Implied Fair Value</span>
                      <span className="font-mono opacity-80">${Math.round(analysis.impliedFairValue).toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="micro-label opacity-50 mb-1">Current Highest Bid</span>
                      <span className="font-mono text-2xl">${Math.round(analysis.impliedFairValue * 1.05).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="w-full flex justify-between items-center bg-current/5 p-3 rounded-lg border border-current/5">
                    <div className="flex items-center gap-2 micro-label opacity-70 text-xs">
                      <Activity className="w-3 h-3" />
                      <span>Liquidity Score: {analysis.liquidityScore.toFixed(0)}</span>
                    </div>
                    <button className={cn(
                      "px-6 py-2 rounded micro-label transition-all flex items-center gap-2",
                      mode === 'physical' ? "bg-physical-ink text-physical-bg hover:bg-black/80" : "bg-digital-accent/20 text-digital-accent hover:bg-digital-accent hover:text-black border border-digital-accent/50"
                    )}>
                      Place Bid <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
