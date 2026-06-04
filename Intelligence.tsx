import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ArrowUpDown } from 'lucide-react';
import { MarketBroken } from './MarketBroken';

interface IntelligenceProps {
  mode: 'physical' | 'digital';
}

type ViewState = 'market' | 'variance';

const viewOptions: { id: ViewState, label: string, colorClassName?: string }[] = [
  { id: 'market', label: 'Actual Market (Baseline)', colorClassName: 'bg-[#64748b]' },
  { id: 'variance', label: 'The Variance Gap (Subjectivity)', colorClassName: 'bg-[#f18081]' },
];

const COLORS = {
  market: '#64748b',
  miner: '#80dd8e',
  seller: '#f18081',
};

const marketVarianceData = Array.from({ length: 25 }).map((_, i) => {
  const p = i / 24;
  return {
    name: `${i + 1}`,
    market: i === 24 ? 2469 : Math.round(1500 + p * 969 + Math.sin(i * 12) * 150),
    miner: i === 24 ? 5018 : Math.round(1800 + Math.pow(p, 1.5) * 3218),
    seller: i === 24 ? 8095 : Math.round(2000 + Math.pow(p, 2) * 6095),
  };
});

const tableData = [
  {n:1,  name:"7.9ct Rare Red Pinfire",                    date:"23 Apr 2026", sold:7.35,   k:7.9,    r:150},
  {n:2,  name:"142.5cts Multicolour Bars/Fires",           date:"20 Apr 2026", sold:63.96,  k:142,    r:800},
  {n:3,  name:"11.55cts Orange/Gold/Blue Rough",           date:"20 Apr 2026", sold:58.32,  k:11.5,   r:100},
  {n:4,  name:"25.5cts Offcuts/Slices/Rough Red/Greens",   date:"20 Apr 2026", sold:95.94,  k:25.5,   r:1275},
  {n:5,  name:"3.35ct Sea-Foam Green & Indigo",            date:"16 Apr 2026", sold:9.58,   k:10.05,  r:30},
  {n:6,  name:"1.15ct Neon Green Flash Cabochon",          date:"16 Apr 2026", sold:3.48,   k:34.5,   r:10},
  {n:7,  name:"164cts Rough/Chips/Offcuts Multicolour",    date:"13 Apr 2026", sold:126.42, k:164,    r:800},
  {n:8,  name:"19ct Natural — Collector's Choice",         date:"11 Apr 2026", sold:95,     k:285,    r:190},
  {n:9,  name:"27.1cts Offcuts/Chips Lots of Fires",       date:"6 Apr 2026",  sold:84.65,  k:27.1,   r:250},
  {n:10, name:"41.4cts Slices/Offcuts Red/Green/Blue",     date:"6 Apr 2026",  sold:88.42,  k:41.4,   r:1250},
  {n:11, name:"147cts Chips/Offcuts Fires/Multicolours",   date:"6 Apr 2026",  sold:77.13,  k:147,    r:250},
  {n:12, name:"422ct Large Multicolour 75×36×10mm",        date:"30 Mar 2026", sold:880,    k:633,    r:400},
  {n:13, name:"18.92g Rainbow Slab — Cabbing Specimens",   date:"27 Mar 2026", sold:83.49,  k:37.84,  r:200},
  {n:14, name:"343cts Rough/Treated Parcel Reddish Base",  date:"16 Mar 2026", sold:48.91,  k:411.6,  r:100},
  {n:15, name:"37ct Natural Matrix — Jewelry/Gift",        date:"15 Mar 2026", sold:26,     k:18.5,   r:100},
  {n:16, name:"87.16cts Rough/Treated Specimen",           date:"2 Mar 2026",  sold:39.5,   k:17.43,  r:250},
  {n:17, name:"197cts Freeform Green/Blue Cut/Treated",    date:"9 Feb 2026",  sold:48.91,  k:59.1,   r:450},
  {n:18, name:"7.90ct Kucina Opals — Jewelry Makers",      date:"11 Apr 2026", sold:28.29,  k:3.95,   r:50},
  {n:19, name:"31.7ct Kucina Matrix — Jewelry Makers",     date:"31 Mar 2026", sold:87.76,  k:792.5,  r:200},
  {n:20, name:"31.45ct Kucina Natural — Jewelry Makers",   date:"27 Mar 2026", sold:78.66,  k:877.5,  r:150},
  {n:21, name:"35.10ct Kucina Natural — Jewelry Makers",   date:"25 Mar 2026", sold:33.81,  k:351,    r:70},
  {n:22, name:"5.30ct Kucina Natural — Jewelry Makers",    date:"22 Mar 2026", sold:44.85,  k:53,     r:20},
  {n:23, name:"15.6ct Kucina Natural — Jewelry Makers",    date:"12 Mar 2026", sold:49.68,  k:156,    r:100},
  {n:24, name:"9.15ct Kucina Natural — Jewelry Makers",    date:"11 Mar 2026", sold:211.84, k:228.75, r:450},
  {n:25, name:"19.3ct Kucina Natural — Jewelry Makers",    date:"25 Feb 2026", sold:97.99,  k:482.5,  r:450},
].map(r => ({
  ...r,
  kVar: r.k - r.sold,
  rVar: r.r - r.sold,
  gap: Math.abs(r.k - r.r)
}));

type SortKey = 'default' | 'sold' | 'gap' | 'kVar' | 'rVar';

function fmtSign(n: number) {
  const sign = n >= 0 ? '+' : '−';
  return `${sign}$${Math.abs(n).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
}

export function Intelligence({ mode }: IntelligenceProps) {
  const [viewState, setViewState] = useState<ViewState>('variance');
  const [sortKey, setSortKey] = useState<SortKey>('default');

  const sortedData = useMemo(() => {
    const data = [...tableData];
    switch (sortKey) {
      case 'sold': return data.sort((a, b) => b.sold - a.sold);
      case 'gap': return data.sort((a, b) => b.gap - a.gap);
      case 'kVar': return data.sort((a, b) => Math.abs(b.kVar) - Math.abs(a.kVar));
      case 'rVar': return data.sort((a, b) => Math.abs(b.rVar) - Math.abs(a.rVar));
      default: return data.sort((a, b) => a.n - b.n);
    }
  }, [sortKey]);

  const maxKVar = Math.max(...tableData.map(r => Math.abs(r.kVar)));
  const maxRVar = Math.max(...tableData.map(r => Math.abs(r.rVar)));

  const renderBar = (variance: number, maxV: number, colorOverride: string) => {
    const pct = Math.min((Math.abs(variance) / maxV) * 100, 100);
    const isPos = variance >= 0;

    return (
      <div className="flex items-center gap-3 justify-end w-full group-hover/row:opacity-100 opacity-80 transition-opacity">
        <div className="w-16 h-[6px] bg-white/10 rounded-none overflow-hidden flex relative">
           <div className={cn("absolute top-0 bottom-0", colorOverride)} style={{ width: `${pct}%`, [isPos ? 'left' : 'right']: '50%' }} />
           <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/50" />
        </div>
        <span className={cn("font-mono text-xs min-w-[64px] text-right text-white")}>
          {fmtSign(variance)}
        </span>
      </div>
    );
  };

  return (
    <section className="relative px-6 md:px-12 py-32 z-10">
      <div className="max-w-7xl mx-auto">


        <MarketBroken mode={mode} />

        <div className="h-px w-full my-24 bg-current opacity-10" />

        <AnimatePresence mode="wait">
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-8"
          >
            <div className="mb-8">
              <span className="micro-label opacity-60 mb-4 block">MARKET FRAGMENTATION</span>
              <h2 className={cn(
                "text-4xl md:text-5xl lg:text-6xl max-w-2xl leading-[0.9] tracking-tight mb-6",
                mode === 'physical' ? "font-serif text-physical-ink" : "font-sans font-medium text-white"
              )}>
                The valuation problem, quantified.
              </h2>
              <p className={cn(
                "text-lg font-sans font-light leading-relaxed opacity-70 max-w-2xl",
                mode === 'physical' ? "text-physical-ink" : "text-white"
              )}>
                25 Matrix stones sold on eBay. Two experienced valuers. One market price. The massive variance exposes the necessity of the Andamooka Standard.
              </p>
            </div>

            {/* Joined Chart and Breakdown Area */}
            <div className={cn(
              "relative flex flex-col group backdrop-blur-xl transition-all duration-700 border",
              mode === 'physical' 
                ? "bg-white border-stone-200 text-stone-900 shadow-xl" 
                : "bg-[#02050a]/80 border-digital-accent/30 shadow-[0_0_30px_rgba(0,255,213,0.05)] text-white"
            )}>
              {/* Sharp Sci-Fi Brackets */}
              <div className={cn("absolute top-0 left-0 w-8 h-8 border-t-[3px] border-l-[3px]", mode === 'physical' ? "border-stone-300" : "border-digital-accent/70")} />
              <div className={cn("absolute top-0 right-0 w-8 h-8 border-t-[3px] border-r-[3px]", mode === 'physical' ? "border-stone-300" : "border-digital-accent/70")} />
              <div className={cn("absolute bottom-0 left-0 w-8 h-8 border-b-[3px] border-l-[3px]", mode === 'physical' ? "border-stone-300" : "border-digital-accent/70")} />
              <div className={cn("absolute bottom-0 right-0 w-8 h-8 border-b-[3px] border-r-[3px]", mode === 'physical' ? "border-stone-300" : "border-digital-accent/70")} />

              <div className="p-8 lg:p-10 border-b border-current/10">
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-12 relative z-10 w-full gap-6">
                  <div>
                    <h3 className="font-mono text-sm tracking-widest uppercase opacity-70 mb-2">
                      Matrix Opal Market Price Variance
                    </h3>
                    <div className={cn("px-3 py-1.5 rounded-none inline-flex text-xs uppercase tracking-widest border-l-[3px] shrink-0 font-mono", mode === 'physical' ? "bg-red-50 text-red-600 border-red-500" : "bg-red-500/10 text-red-400 border-red-500")}>
                      Subjective Value Leakage
                    </div>
                  </div>
                  
                  {/* Dashboard Controls */}
                  <div className="flex flex-wrap gap-3">
                    {viewOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setViewState(opt.id)}
                        className={cn(
                          "px-6 py-2.5 rounded-none font-mono text-xs uppercase tracking-widest transition-all duration-300 border flex items-center gap-2",
                          viewState === opt.id 
                            ? (mode === 'physical' ? "bg-stone-900 text-white border-stone-900 shadow-md" : "bg-digital-accent text-black border-digital-accent shadow-[0_0_15px_rgba(0,255,213,0.3)]")
                            : (mode === 'physical' ? "bg-transparent text-stone-500 border-stone-200 hover:border-stone-400 hover:text-stone-900" : "bg-transparent text-white/50 border-white/20 hover:border-white/40 hover:text-white")
                        )}
                      >
                        {opt.colorClassName && (
                          <span className={cn("w-2 h-2 rounded-full", opt.colorClassName)} />
                        )}
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

              <div className="h-[400px] w-full -ml-4 shrink-0 mt-4 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={marketVarianceData} margin={{ top: 10, right: 10, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={mode === 'physical' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'} />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: mode === 'physical' ? '#57534e' : 'rgba(255,255,255,0.5)' }} 
                      dy={15}
                      label={{ value: 'STONE NUMBER', position: 'insideBottom', offset: -15, fontFamily: 'var(--font-mono)', fontSize: 10, fill: mode === 'physical' ? '#57534e' : 'rgba(255,255,255,0.5)' }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: mode === 'physical' ? '#57534e' : 'rgba(255,255,255,0.5)' }}
                      tickFormatter={(val) => `$${val}`}
                      dx={-10}
                      width={80}
                      label={{ value: 'VALUE (USD)', angle: -90, position: 'insideLeft', offset: 0, fontFamily: 'var(--font-mono)', fontSize: 10, fill: mode === 'physical' ? '#57534e' : 'rgba(255,255,255,0.5)' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: mode === 'physical' ? '#ffffff' : '#0a0f16',
                        borderColor: mode === 'physical' ? 'rgba(0,0,0,0.1)' : 'rgba(0,255,213,0.3)',
                        borderRadius: '0px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12px',
                        color: mode === 'physical' ? '#000000' : '#ffffff',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                      }}
                      formatter={(value: number, name: string) => {
                         const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
                         return [`$${value.toLocaleString()}`, formattedName];
                      }}
                      labelFormatter={(label) => `Stone ${label}`}
                    />
                    {(viewState === 'market' || viewState === 'variance') && (
                      <Line 
                        type="monotone" 
                        dataKey="market" 
                        name="Actual Market"
                        stroke={COLORS.market} 
                        strokeWidth={viewState === 'market' ? 3 : 2} 
                        dot={false} 
                        strokeOpacity={viewState === 'variance' ? 0.6 : 1} 
                        animationDuration={1500}
                        activeDot={{ r: 6, fill: COLORS.market }}
                      />
                    )}
                    {(viewState === 'miner' || viewState === 'variance') && (
                      <Line 
                        type="monotone" 
                        dataKey="miner" 
                        name="Miner Estimate"
                        stroke={COLORS.miner} 
                        strokeWidth={viewState === 'miner' ? 3 : 2} 
                        dot={false} 
                        strokeOpacity={viewState === 'variance' ? 0.6 : 1} 
                        animationDuration={1500} 
                        activeDot={{ r: 6, fill: COLORS.miner }}
                      />
                    )}
                    {(viewState === 'seller' || viewState === 'variance') && (
                      <Line 
                        type="monotone" 
                        dataKey="seller" 
                        name="Cutter/Seller Estimate"
                        stroke={COLORS.seller} 
                        strokeWidth={viewState === 'seller' ? 3 : 2} 
                        dot={false} 
                        strokeOpacity={viewState === 'variance' ? 0.6 : 1} 
                        animationDuration={1500}
                        activeDot={{ r: 6, fill: COLORS.seller }}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Biggest Divergence Section */}
            <div className={cn("p-8 lg:p-12 relative overflow-hidden border-t", mode === 'physical' ? "border-physical-ink/10" : "border-white/10")}>
               {/* Background Decorative Mesh Filter */}
              <div className={cn("absolute inset-0 pointer-events-none z-0", mode === 'physical' ? "bg-[#f5f2ed]" : "bg-[#030508]")} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 relative z-10">
                <div className="flex flex-col justify-between">
                  <div>
                    <div className={cn("font-mono text-xs uppercase tracking-widest mb-6 inline-flex px-3 py-1.5 border", mode === 'physical' ? "border-physical-ink/20 text-physical-ink" : "border-white/20 text-white")}>
                      Biggest divergence &mdash; item #4 of 25
                    </div>
                    <h4 className={cn("text-3xl lg:text-4xl font-serif leading-tight tracking-tight mb-2", mode === 'physical' ? "text-physical-ink" : "text-white")}>
                      Andamooka Matrix Rough Slices
                    </h4>
                    <div className={cn("font-mono text-sm tracking-widest uppercase opacity-50 mb-8", mode === 'physical' ? "text-physical-ink" : "text-white")}>25.5cts</div>
                    
                    {/* Opal Image - elegant, clean presentation */}
                    <div className={cn("relative w-full aspect-[4/3] my-8 overflow-hidden rounded-2xl shadow-2xl", mode === 'physical' ? "bg-black/5" : "bg-white/5 border border-white/10")}>
                       <img src="/images/matrixe.png" alt="Opal Item 4" className="w-full h-full object-cover mix-blend-normal" />
                    </div>
                    
                    <div className={cn("flex flex-col gap-2 py-4 border-t", mode === 'physical' ? "border-physical-ink/10 text-physical-ink" : "border-white/10 text-white")}>
                      <div className="text-xs font-mono uppercase tracking-widest opacity-50">Sold 20 April 2026</div>
                      <div className="flex items-baseline gap-3">
                        <span className="text-sm font-sans opacity-70">Market Paid</span>
                        <span className="text-3xl font-serif font-medium">$95.94</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-8 lg:pt-16">
                  {/* Miner Valuation */}
                  <div className={cn("pb-8 border-b", mode === 'physical' ? "border-physical-ink/10 text-physical-ink" : "border-white/10 text-white")}>
                    <div className="font-mono text-xs uppercase tracking-widest opacity-50 mb-4">Miner Valuation</div>
                    <div className="text-5xl font-serif tracking-tight mb-4">$25.50</div>
                    <div className="flex items-center gap-3 font-mono text-sm">
                      <span className={cn(mode === 'physical' ? "text-[#b23b3b]" : "text-[#ff4e4e]")}>−$70.44</span>
                      <span className="opacity-30">•</span>
                      <span className="opacity-70">73% Undervalued</span>
                    </div>
                  </div>

                  {/* Cutter Valuation */}
                  <div className={cn("pb-8 border-b", mode === 'physical' ? "border-physical-ink/10 text-physical-ink" : "border-white/10 text-white")}>
                     <div className="font-mono text-xs uppercase tracking-widest opacity-50 mb-4">Cutter/Seller Valuation</div>
                     <div className="text-5xl font-serif tracking-tight mb-4">$1,275.00</div>
                    <div className="flex items-center gap-3 font-mono text-sm">
                      <span className={cn(mode === 'physical' ? "text-[#008f6b]" : "text-[#00ffd5]")}>+$1,179</span>
                      <span className="opacity-30">•</span>
                      <span className="opacity-70">1,228% Overvalued</span>
                    </div>
                  </div>

                  {/* Total Divergence */}
                  <div className={cn(
                    "p-8 lg:p-12 rounded-2xl flex flex-col gap-4 mt-4",
                    mode === 'physical' ? "bg-white border border-physical-ink/10 shadow-lg text-physical-ink" : "bg-[#0a0f18] border border-digital-accent/20 shadow-[0_0_30px_rgba(0,255,213,0.05)] text-white"
                  )}>
                    <div className="font-mono text-xs uppercase tracking-widest opacity-50">Total Divergence</div>
                    <div className="text-6xl font-serif tracking-tight">$1,249.50</div>
                    <div className="text-lg font-sans mt-2 opacity-80 leading-relaxed font-light">
                      Two experts, $1,249 apart.<br/>One absent standard.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>

          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
