import * as React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { FileBadge, Eye, Database, ScanLine, Fingerprint, MapPin, Activity, History, Link, Hexagon } from 'lucide-react';
import { opalsData } from '../data/opals';
import { runVerifyAIEngine } from '../lib/verifyAI';

interface ScanData {
  image: string;
  className: string;
  grade: string;
  weightGrams: string;
  valuation?: number;
}

interface PassportProps {
  mode: 'physical' | 'digital';
  scanData?: ScanData | null;
}

export function Passport({ mode, scanData }: PassportProps) {
  const opal = opalsData[0]; // Display the M9 hero asset
  const analysis = runVerifyAIEngine(opal);
  
  const displayImage = scanData?.image || opal.img;
  const displayName = scanData?.className || opal.name;
  const displayGrade = scanData?.grade || `M${opal.mk_grade}`;
  const displayWeight = scanData?.weightGrams ? `${scanData.weightGrams} g` : `${opal.ct} ct`;
  
  const todayStr = new Date().toISOString().split('T')[0].replace(/-/g, '.');
  const baseValue = scanData?.valuation || 155000;

  return (
    <section className="relative px-6 md:px-12 py-32 z-10 w-full" id="passport">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-16 border-b border-current/10 pb-8">
          <div>
            <span className="micro-label opacity-60 mb-4 block">Asset #0001</span>
            <h2 className={cn(
              "text-5xl md:text-7xl lg:text-[6rem] leading-[0.9] tracking-tight mb-8",
              mode === 'physical' ? "font-serif" : "font-sans font-medium"
            )}>
              The Stone Passport
            </h2>
          </div>
          <div className="flex flex-col items-end">
             <span className="micro-label opacity-50 mb-2">Cryptographic Seal</span>
             <span className={cn(
               "font-mono text-sm uppercase px-3 py-1 border rounded",
               mode === 'physical' ? "border-physical-ink/20" : "border-digital-accent/50 text-digital-accent bg-digital-accent/10"
             )}>
               AOSA-VERIFIED-TRUE
             </span>
          </div>
        </div>

        <div className={cn(
          "grid grid-cols-1 lg:grid-cols-12 gap-px overflow-hidden rounded-[32px] border",
          mode === 'physical' ? "bg-physical-ink/10 border-physical-ink/20 shadow-2xl" : "bg-digital-accent/20 border-white/10 shadow-[0_0_50px_rgba(0,255,213,0.1)] digital-glass"
        )}>
          {/* Main Visual & Core Identity */}
          <div className={cn(
            "lg:col-span-5 p-8 md:p-12",
            mode === 'physical' ? "bg-[#fdfcfb]" : "bg-[#050a15]"
          )}>
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-8 shadow-2xl">
              <img src={displayImage} alt={displayName} loading="lazy" className={cn(
                "w-full h-full object-cover",
                mode === 'digital' && "shadow-[0_0_20px_rgba(0,255,213,0.3)]"
              )} />
              <div className="absolute inset-0 border border-white/20 rounded-2xl pointer-events-none mix-blend-overlay" />
              {mode === 'digital' && (
                <div className="absolute inset-0 bg-digital-accent/10 mix-blend-color" />
              )}
              {/* Scanline overlay */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-50" />
            </div>

            <div>
              <div className="flex justify-between items-start mb-6">
                 <div>
                   <span className="micro-label opacity-50 mb-2 block">Registered Name</span>
                   <h3 className={cn(
                     "text-3xl",
                     mode === 'physical' ? "font-serif" : "font-sans tracking-tight font-medium"
                   )}>{displayName}</h3>
                 </div>
                 <div className="text-right">
                   <span className="micro-label opacity-50 mb-2 block">Grade</span>
                   <span className={cn(
                     "text-3xl font-mono",
                     mode === 'digital' && "text-digital-accent drop-shadow-md"
                   )}>{displayGrade}</span>
                 </div>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-current/10">
                 <div className="flex flex-col gap-1">
                   <span className="micro-label opacity-50 uppercase text-xs">Origin Coordinates</span>
                   <span className="font-mono text-sm flex items-center gap-1 opacity-90"><MapPin className="w-3 h-3" />29°02'S 134°40'E</span>
                 </div>
                 <div className="flex flex-col gap-1">
                   <span className="micro-label opacity-50 uppercase text-xs">Discovery</span>
                   <span className="font-mono text-sm tracking-tight opacity-90">{scanData ? '2026' : '2014'} (Andamooka, SA)</span>
                 </div>
                 <div className="flex flex-col gap-1">
                   <span className="micro-label opacity-50 uppercase text-xs">Base Weight</span>
                   <span className="font-mono text-sm tracking-tight opacity-90">{displayWeight}</span>
                 </div>
              </div>
            </div>
          </div>

          {/* Data & Ledgers */}
          <div className={cn(
            "lg:col-span-7 flex flex-col gap-px",
            mode === 'physical' ? "bg-physical-ink/10" : "bg-digital-accent/20"
          )}>
            
            {/* Top row: Twin & XRF */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px flex-1">
              {/* Digital Twin Widget */}
               <div className={cn("p-8 relative overflow-hidden flex flex-col h-full", mode === 'physical' ? "bg-white" : "bg-[#030712]")}>
                 <div className="flex items-center justify-between mb-8 shrink-0">
                   <div className="flex items-center gap-3">
                     <div className={cn("w-8 h-8 rounded-full flex items-center justify-center border", mode === 'physical' ? "border-physical-ink/20" : "border-digital-accent/30")}>
                       <Hexagon className="w-4 h-4 opacity-70" />
                     </div>
                     <span className="micro-label opacity-60">Digital Twin Identity</span>
                   </div>
                 </div>
                 
                 <div className="flex-1 flex flex-col items-center justify-center py-4">
                   <div className="relative w-40 h-40 mb-12 perspective-[1000px]">
                     <motion.div 
                       animate={{ rotateY: 360 }}
                       transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                       className="w-full h-full transform-style-3d"
                     >
                       <div className={cn("absolute inset-0 rounded border-2 border-dashed", mode === 'physical' ? "border-physical-ink/20" : "border-digital-accent/50 opacity-80 shadow-[0_0_20px_rgba(0,255,213,0.3)]")} />
                       <div className={cn("absolute inset-0 rounded border border-solid", mode === 'physical' ? "border-physical-ink/40" : "border-digital-accent opacity-50")} style={{ transform: "translateZ(30px)" }} />
                     </motion.div>
                   </div>
                   
                   <div className="w-full space-y-2 font-mono text-sm text-center mt-auto shrink-0">
                     <div className="opacity-50 text-xs uppercase tracking-widest">Metadata Hash</div>
                     <div className="truncate w-full opacity-80">0x7F9a2B4c...88B29C4F</div>
                     <div className={cn("mt-4 text-xs font-sans", mode === 'digital' && "text-digital-accent")}>Forged: Oct 2024</div>
                   </div>
                 </div>
               </div>

               {/* XRF Visualization */}
               <div className={cn("p-8 relative overflow-hidden", mode === 'physical' ? "bg-white" : "bg-[#030712]")}>
                 <div className="flex justify-between items-start mb-6">
                   <div className="flex items-center gap-3">
                     <div className={cn("w-8 h-8 rounded-full flex items-center justify-center border", mode === 'physical' ? "border-physical-ink/20" : "border-digital-accent/30")}>
                       <ScanLine className="w-4 h-4 opacity-70" />
                     </div>
                     <div className="flex flex-col">
                       <span className="micro-label opacity-60 uppercase text-xs">XRF Spectral Fingerprint</span>
                       <span className={cn("font-mono text-xs mt-1", mode === 'digital' ? "text-digital-accent" : "text-physical-ink/70")}>100% Andamooka Match</span>
                     </div>
                   </div>
                   <div className="text-right flex flex-col items-end">
                     <span className="font-mono text-xs uppercase opacity-50">Depth Signature</span>
                     <span className="font-mono text-sm mt-1">7-13m B.S.L</span>
                   </div>
                 </div>
                 
                 {/* Heatmap Grid */}
                 <div className="relative w-full aspect-[2/1] mb-6 grid grid-cols-12 grid-rows-6 gap-px border border-white/5 bg-white/5">
                    {Array.from({ length: 72 }).map((_, i) => {
                      // Generate a heat map pattern showing a dense "core" signature
                      const x = i % 12;
                      const y = Math.floor(i / 12);
                      const distanceToCore = Math.sqrt(Math.pow(x - 8, 2) + Math.pow(y - 3, 2));
                      const isHot = distanceToCore < 3;
                      const isWarm = distanceToCore < 5;
                      
                      let bgClass = "bg-transparent";
                      if (mode === 'digital') {
                        if (isHot) bgClass = "bg-[#00ffd5]/60 shadow-[0_0_8px_rgba(0,255,213,0.8)]";
                        else if (isWarm) bgClass = "bg-[#00ffd5]/20";
                        else bgClass = "bg-[#00ffd5]/5";
                      } else {
                        if (isHot) bgClass = "bg-physical-ink/60";
                        else if (isWarm) bgClass = "bg-physical-ink/20";
                        else bgClass = "bg-physical-ink/5";
                      }

                      return (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ duration: 0.5, delay: i * 0.01 }}
                          viewport={{ once: true }}
                          className={cn("w-full h-full rounded-[1px]", bgClass)}
                        />
                      )
                    })}
                    
                    {/* Targeting reticle over the "hot" zone */}
                    <div className={cn("absolute right-[16%] top-[33%] w-[25%] h-[33%] border border-dashed rounded-sm pointer-events-none mix-blend-screen animate-pulse", mode === 'digital' ? "border-[#00ffd5]" : "border-physical-ink")} />
                 </div>
                 
                 <div className="grid grid-cols-4 gap-2 font-mono text-xs uppercase opacity-70">
                   <div className="flex flex-col gap-1 border-l border-current/20 pl-2">
                     <span>SiO2</span>
                     <span className={cn("text-xs font-medium", mode === 'digital' && "text-white")}>92.4%</span>
                   </div>
                   <div className="flex flex-col gap-1 border-l border-current/20 pl-2">
                     <span>H2O</span>
                     <span className={cn("text-xs font-medium", mode === 'digital' && "text-white")}>6.1%</span>
                   </div>
                   <div className="flex flex-col gap-1 border-l border-current/20 pl-2">
                     <span>Al2O3</span>
                     <span className={cn("text-xs font-medium", mode === 'digital' && "text-white")}>1.2%</span>
                   </div>
                   <div className="flex flex-col gap-1 border-l border-current/20 pl-2">
                     <span>Trace</span>
                     <span className={cn("text-xs font-medium text-digital-accent", mode === 'physical' && "text-physical-ink font-bold")}>0.3%</span>
                   </div>
                 </div>
               </div>
            </div>

            {/* Bottom row: Ownership Chain */}
            <div className={cn("p-8 flex-1 border-t", mode === 'physical' ? "bg-[#fdfcfb] border-physical-ink/10" : "bg-[#050a15] border-white/10")}>
               <div className="flex items-center gap-3 mb-8">
                 <div className={cn("w-8 h-8 rounded-full flex items-center justify-center border", mode === 'physical' ? "border-physical-ink/20" : "border-digital-accent/30")}>
                   <History className="w-4 h-4 opacity-70" />
                 </div>
                 <span className="micro-label opacity-60">Immutable Ownership Chain</span>
               </div>

               <div className="space-y-6">
                 <OwnershipRow date={scanData ? todayStr : "2026.06.02"} owner="AOSA Vault Escrow" status="Digitally Minted" mode={mode} current />
               </div>

               {mode === 'digital' && (
                 <div className="mt-12 pt-8 border-t border-white/10 relative">
                   <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37]/5 to-transparent pointer-events-none" />
                   <span className="micro-label opacity-70 mb-6 block uppercase text-xs tracking-widest">Asset Financialization</span>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end relative z-10">
                     <div className="flex flex-col border-l-2 border-white/10 pl-6 h-full justify-center">
                       <span className="font-mono text-xs opacity-50 uppercase tracking-widest block mb-2">Pre-Minting Val (Raw)</span>
                       <div className="text-3xl font-serif text-white/40 line-through decoration-white/20 truncate">
                         ${Math.round(baseValue).toLocaleString()}
                       </div>
                     </div>
                     <div className="flex flex-col border-l-2 border-[#d4af37]/40 pl-6 py-2 bg-gradient-to-r from-[#d4af37]/10 to-transparent">
                       <span className="font-mono text-xs text-[#d4af37] opacity-80 uppercase tracking-widest block mb-1">Minted Value (Global Liquidity)</span>
                       <div className="text-5xl lg:text-6xl font-serif text-[#ffd700] drop-shadow-[0_0_25px_rgba(212,175,55,0.8)] truncate whitespace-nowrap leading-none tracking-tight">
                         ${(Math.round(baseValue) * 1.6).toLocaleString()}
                       </div>
                       <div className="mt-3 inline-flex items-center gap-2">
                         <div className="px-2 py-0.5 bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#ffd700] font-mono text-xs sm:text-xs font-bold tracking-widest uppercase shadow-[0_0_10px_rgba(212,175,55,0.3)]">
                           +60% Provenance Premium
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
               )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

function OwnershipRow({ date, owner, status, current, mode }: { date: string, owner: string, status: string, current?: boolean, mode: 'physical'|'digital' }) {
  return (
    <div className="flex items-center gap-6 group">
      <div className="font-mono text-xs opacity-50 w-24 shrink-0">{date}</div>
      <div className="flex-1 flex items-center gap-4 border-b border-current/10 pb-2">
        <div className={cn(
          "w-2 h-2 rounded-full",
          current ? (mode === 'physical' ? "bg-physical-ink" : "bg-digital-accent shadow-[0_0_10px_rgba(0,255,213,1)]") : "bg-current/20"
        )} />
        <span className={cn(
          "font-sans font-medium opacity-90",
          current && mode === 'digital' && "text-white"
        )}>{owner}</span>
      </div>
      <div className={cn(
        "font-mono text-xs uppercase tracking-widest w-20 text-right opacity-50",
        current && mode === 'digital' && "text-digital-accent opacity-100"
      )}>{status}</div>
    </div>
  )
}
