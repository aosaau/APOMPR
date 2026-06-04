import { useState, useEffect } from 'react';
import { motion, useInView, useSpring, useTransform } from 'motion/react';
import { useRef } from 'react';
import { cn } from '../lib/utils';
import { AlertTriangle, Clock, TrendingUp, ExternalLink } from 'lucide-react';

interface Props {
  mode: 'physical' | 'digital';
}

function Counter({ target, suffix = '', duration = 2 }: { target: number, suffix?: string, duration?: number }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const stepTime = Math.abs(Math.floor(duration * 1000 / target));
      let timer = setInterval(() => {
        start += 1;
        setValue(Math.ceil((start / target) * target));
        if (start === target) clearInterval(timer);
      }, stepTime || 10);
      return () => clearInterval(timer);
    }
  }, [target, duration, isInView]);

  return <span ref={ref}>{value}{suffix}</span>;
}

export function UrgencyAct({ mode }: Props) {
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    const deadline = new Date('2026-07-01').getTime();
    const now = new Date().getTime();
    setDaysLeft(Math.ceil((deadline - now) / 86400000));
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-24 relative">
      {/* Ambient Lighting Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden blur-[120px] opacity-30 mix-blend-screen transition-opacity duration-1000">
         <div className="absolute top-1/4 left-[10%] w-[400px] h-[400px] bg-red-600/30 rounded-full" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/20 rounded-full" />
         <div className="absolute bottom-1/4 right-[10%] w-[400px] h-[400px] bg-emerald-500/20 rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        
        {/* Signal 1: Banks */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={cn(
            "group p-8 lg:p-10 rounded-[28px] border relative overflow-hidden flex flex-col justify-between transition-all duration-700",
            "threat-breathe threat-breathe-1 bg-[#0a0a0a]",
            "hover:shadow-[0_0_40px_rgba(220,38,38,0.25)] border-white/5",
            mode === 'digital' && "border-digital-accent/20 hover:bg-black/90"
          )}
        >
          <div className="system-scan-line text-red-500" />
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 via-red-500/0 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center h-full text-center text-white">
            <div className="flex justify-center mb-6 opacity-80">
              <AlertTriangle className={cn("w-8 h-8", mode === 'digital' ? "text-digital-accent" : "text-white")} />
            </div>

            <div className="text-7xl lg:text-8xl font-sans tracking-tight mb-4 text-white">
              {mode === 'physical' ? <Counter target={36} suffix="%" duration={1.5} /> : '$4.2T'}
            </div>
            
            <div className={cn("micro-label uppercase tracking-widest text-xs mb-8 opacity-60", mode === 'digital' && "text-digital-accent")}>
              {mode === 'physical' ? 'Regional branches closed since 2017' : 'Global institutional capital ready'}
            </div>

            <p className="opacity-70 text-sm font-sans font-light leading-relaxed mb-12 max-w-sm mx-auto">
              {mode === 'physical' 
                ? 'Cash-dependent industries in remote Australia face increasing structural pressure. The safety net for undocumented cash trading is disappearing.'
                : 'Digital ledgers align beautifully with modern institutional capital. Standardized data invites global liquidity that physical cash cannot access.'}
            </p>
            
            <div className="mt-auto w-full pt-8 relative">
              <div className="absolute top-0 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <h3 className="text-2xl md:text-[28px] leading-tight font-sans font-medium tracking-tight mb-6 micro-glitch">
                {mode === 'physical' ? 'Banking infrastructure is declining.' : 'Capital seeks compliance.'}
              </h3>
              <a href="https://www.abc.net.au/news/2025-02-11/regional-bank-agreement-2027-big-four/104921834" target="_blank" rel="noopener noreferrer" 
                 className="flex items-center justify-center gap-2 micro-label opacity-40 hover:opacity-100 transition-opacity text-xs">
                <ExternalLink className="w-3 h-3" />
                ABC News: Regional Bank Agreement
              </a>
            </div>
          </div>
        </motion.div>

        {/* Signal 2: Law Countdown */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={cn(
            "group p-8 lg:p-10 rounded-[28px] border relative overflow-hidden flex flex-col justify-between transition-all duration-700 z-10",
            "threat-breathe threat-breathe-2 bg-[#0a0a0a]",
            "hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] border-white/5",
            mode === 'digital' && "border-digital-accent/40 shadow-[0_0_30px_rgba(0,255,213,0.15)] hover:bg-[#050505]"
          )}
        >
          {mode === 'digital' && <div className="absolute inset-0 bg-digital-accent/5 pointer-events-none" />}
          <div className="system-scan-line text-blue-300" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none mix-blend-overlay" />

          <div className="relative z-10 flex flex-col items-center h-full text-center text-white">
            <div className="flex justify-center mb-6 opacity-80">
              <Clock className={cn("w-8 h-8", mode === 'digital' ? "text-digital-accent" : "text-white")} />
            </div>

            <div className="text-7xl lg:text-8xl font-sans tracking-tight mb-4 text-white flex items-center justify-center">
              {mode === 'physical' ? <><Counter target={daysLeft} duration={1.5} /><span className="text-4xl opacity-50 ml-2 relative -top-4 font-sans uppercase">d</span></> : '100%'}
            </div>
            
            <div className={cn("micro-label uppercase tracking-widest text-xs mb-8 opacity-60", mode === 'digital' && "text-digital-accent")}>
              {mode === 'physical' ? 'Days until compliance required' : 'Auditable chain of custody'}
            </div>

            <p className="opacity-70 text-sm font-sans font-light leading-relaxed mb-12 max-w-sm mx-auto">
              {mode === 'physical' 
                ? 'Precious stone dealers enter AML/CTF from July 1, 2026. Non-compliance carries significant civil penalties. This is already law.'
                : 'Built from the ground up for AML/CTF reporting. XRF origin verification and blockchain immutability make auditing instant and mathematically provable.'}
            </p>
            
            <div className="mt-auto w-full pt-8 relative">
              <div className="absolute top-0 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <h3 className="text-2xl md:text-[28px] leading-tight font-sans font-medium tracking-tight mb-6 micro-glitch">
                {mode === 'physical' ? 'Record-keeping is a legal requirement.' : 'The network is fully compliant.'}
              </h3>
              <a href="https://www.austrac.gov.au/industry-and-business/about-amlctf-reforms/about-reforms" target="_blank" rel="noopener noreferrer" 
                 className="flex items-center justify-center gap-2 micro-label opacity-40 hover:opacity-100 transition-opacity text-xs">
                <ExternalLink className="w-3 h-3" />
                AUSTRAC: AML/CTF Reforms
              </a>
            </div>
          </div>
        </motion.div>

        {/* Signal 3: Premium */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={cn(
            "group p-8 lg:p-10 rounded-[28px] border relative overflow-hidden flex flex-col justify-between transition-all duration-700",
            "threat-breathe threat-breathe-3 bg-[#0a0a0a]",
            "hover:shadow-[0_0_40px_rgba(16,185,129,0.2)] border-white/5",
            mode === 'digital' && "border-digital-accent/20 hover:bg-black/90"
          )}
        >
          <div className="system-scan-line text-emerald-500" />
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 via-green-500/0 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none mix-blend-multiply" />

          <div className="relative z-10 flex flex-col items-center h-full text-center text-white">
            <div className="flex justify-center mb-6 opacity-80">
              <TrendingUp className={cn("w-8 h-8", mode === 'digital' ? "text-digital-accent" : "text-white")} />
            </div>

            <div className="text-7xl lg:text-8xl font-sans tracking-tight mb-4 text-white">
              {mode === 'physical' ? <Counter target={73} suffix="%" duration={1.5} /> : '200×'}
            </div>
            
            <div className={cn("micro-label uppercase tracking-widest text-xs mb-8 opacity-60", mode === 'digital' && "text-digital-accent")}>
              {mode === 'physical' ? 'Affluent buyers pay provenance premium' : 'Value uplift with provenance'}
            </div>

            <p className="opacity-70 text-sm font-sans font-light leading-relaxed mb-12 max-w-sm mx-auto">
              {mode === 'physical'
                ? 'Luxury markets increasingly reward traceability, ownership history and proof of origin.'
                : 'Verified digital twins allow sellers to capture the provenance margin. Assets trade securely, backed by the integrity of the Andamooka Standard.'}
            </p>
            
            <div className="mt-auto w-full pt-8 relative">
              <div className="absolute top-0 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <h3 className="text-2xl md:text-[28px] leading-tight font-sans font-medium tracking-tight mb-6 micro-glitch">
                {mode === 'physical' ? 'Traceability commands a massive premium.' : 'Assets verified.'}
              </h3>
              <a href="https://www.prnewswire.com/news-releases/new-research-highlights-generational-shift-in-attitudes-towards-provenance-of-luxury-goods-301425480.html" target="_blank" rel="noopener noreferrer" 
                 className="flex items-center justify-center gap-2 micro-label opacity-40 hover:opacity-100 transition-opacity text-xs">
                <ExternalLink className="w-3 h-3" />
                PR Newswire: Generational Shift
              </a>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
