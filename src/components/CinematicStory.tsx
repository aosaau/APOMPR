import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Hero } from './Hero';
import { Intelligence } from './Intelligence';
import { AosaOriginTerminal } from './AosaOriginTerminal';
import { Passport } from './Passport';
import { Vault } from './Vault';
import { Marketplace } from './Marketplace';
import { UrgencyAct } from './UrgencyAct';
import { AndamookaStandard } from './AndamookaStandard';
import { LegibilityAct } from './LegibilityAct';
import { EmploymentAct } from './EmploymentAct';
import { ArrowDown, ScanLine } from 'lucide-react';

interface CinematicStoryProps {
  mode: 'physical' | 'digital';
  setMode: (mode: 'physical' | 'digital') => void;
}

function SectionIntro({ title, subtitle, description, mode, align = 'center' }: { title: string, subtitle?: string, description: string | React.ReactNode, mode: 'physical'|'digital', align?: 'left'|'center'|'right' }) {
  return (
    <div className={cn(
      "w-full max-w-4xl mx-auto py-32 px-6 lg:px-12 relative z-20 flex flex-col justify-center min-h-[50vh]",
      align === 'center' ? "items-center text-center" : align === 'left' ? "items-start text-left" : "items-end text-right",
      mode === 'physical' ? "text-physical-ink" : "text-white"
    )}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-3xl"
      >
        {subtitle && (
          <span className={cn(
            "micro-label mb-6 block opacity-60",
            mode === 'digital' && "text-digital-accent drop-shadow-[0_0_8px_rgba(0,255,213,0.5)]"
          )}>{subtitle}</span>
        )}
        <h2 className={cn(
          "text-5xl md:text-7xl lg:text-[6rem] mb-8 leading-[0.9] tracking-tight",
          mode === 'physical' ? "font-serif" : "font-sans font-medium"
        )} dangerouslySetInnerHTML={{ __html: title }} />
        <p className="text-lg md:text-xl lg:text-2xl opacity-70 font-sans font-light leading-relaxed max-w-2xl mx-auto" dangerouslySetInnerHTML={{ __html: description as string }} />
      </motion.div>
    </div>
  );
}

export function CinematicStory({ mode, setMode }: CinematicStoryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [empActive, setEmpActive] = useState(false);
  const [scanData, setScanData] = useState<any>(null);

  const handleMintPress = (data: any) => {
    setEmpActive(true);
    setScanData(data);
    setMode('digital');
    setTimeout(() => setEmpActive(false), 2000);
  };

  return (
    <div ref={containerRef} className="w-full flex flex-col relative bg-transparent">
      <AnimatePresence>
        {empActive && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 50, opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="fixed top-1/2 left-1/2 w-[100px] h-[100px] -ml-[50px] -mt-[50px] rounded-full bg-digital-accent pointer-events-none z-[200] mix-blend-screen shadow-[0_0_100px_50px_rgba(0,255,213,0.8)]"
          />
        )}
      </AnimatePresence>

      <Hero mode={mode} />
      
      {/* Act I & II: Problem */}
      <section className="relative w-full" id="act-2">
        <SectionIntro 
          mode={mode}
          title="The market is <b>broken</b>"
          description={mode === 'physical' ? "Pricing is inconsistent. Provenance is absent.<br>The true value of geological assets is hidden by fragmented trust and subjective grading.<br>No standard exists. No one agrees.<br/>No trust. <em>Locked value.</em>" : "Value unlocked. Information consistent and grading verifiable.<br/>Every stone can be trusted, understood, and valued with confidence."}
        />
        
        <Intelligence mode={mode} />
      </section>

      {/* Act III: Urgency */}
      <section className="relative w-full mt-16" id="act-3">
         <SectionIntro 
          mode={mode}
          title={mode === 'physical' ? "A change<br/>is coming." : "The infrastructure<br/>is ready."}
          description={mode === 'physical' ? "Whether we act or not. Three forces are converging that make the next two years the most consequential in Andamooka's modern history." : "For the first time, every stone can carry proof of where it came from. Matrix opal will change from a speculative purchase into a verifiable asset.."}
        />
        <UrgencyAct mode={mode} />
      </section>

      {/* Act IV: The Standard */}
      <section className="relative w-full mt-16" id="act-4-standard">
        <SectionIntro 
          mode={mode}
          title="Introducing the<br/>Andamooka Standard™"
          description="For 100 million years, Matrix Opal has carried the geological story of Andamooka.<br/><br/>We have the opportunity to define how that story is measured and valued.<br><br/><b>Not governments. Not corporations.</b> But by the people who mine it, cut it and build their lives around it.<br/><br/><b>The Andamooka Standard is more than a grading system.</b><br/><br/>It is a declaration that the community will set the value of its own natural resource."
        />
        <AndamookaStandard mode={mode} />
      </section>

      {/* Act V: Technology (AosaOriginTerminal) - Available in BOTH modes, but triggers mode change */}
      <section className="relative w-full mt-16" id="act-5">
        <SectionIntro 
          mode={mode}
          title="The digital<br/>fingerprint."
          description="Replacing subjective human assessment with edge-computed neural networks and spectral rarity scores. Absolute certainty at scale."
        />
        <AosaOriginTerminal mode={mode} onMint={handleMintPress} />
      </section>

      {/* Appears AFTER switching to Digital */}
      {mode === 'digital' && (
        <>
          <section className="relative w-full" id="passport">
            <Passport mode={mode} scanData={scanData} />
          </section>

          {/* Act IV: Legibility (Bridging to Digital) - Digital Only */}
          <section className="relative w-full mt-16" id="act-4">
             <SectionIntro 
              mode={mode}
              title="This is a<br/>proven pattern."
              description="From GIA diamonds to authenticated Rolexes. Provenance drives premiums. OPN brings this proven financialisation model to the world stage."
            />
            <LegibilityAct mode={mode} />
          </section>

          {/* Act VI: Employment & Infrastructure */}
          <section className="relative w-full mt-16" id="act-8">
            <SectionIntro 
              mode={mode}
              title="Turning trust into value."
              description="Every verified stone strengthens a network of confidence—making Andamooka opal easier to value, easier to trade, and harder to ignore."
            />
            <EmploymentAct mode={mode} />
          </section>

          {/* FINAL EMOTIONAL MESSAGE - Digital Only */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.5 }}
            className={cn(
              "w-full min-h-screen flex flex-col items-center justify-center text-center px-6 relative overflow-hidden mt-16",
              "bg-[#030508] text-white"
            )}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-digital-accent/5 blur-[100px] rounded-full pointer-events-none" />
            
            <h1 className="text-5xl md:text-7xl lg:text-[90px] leading-none mb-16 z-10 font-sans font-medium tracking-tighter">
              Change is coming.<br/>
              <em className="not-italic text-transparent bg-clip-text bg-gradient-to-r from-digital-accent to-white text-3xl md:text-5xl lg:text-[60px] block mt-6 font-light">The question is whether Andamooka<br/>will lead, or follow.</em>
            </h1>
            
            <div className="max-w-2xl p-8 border-t border-b lg:border rounded-none lg:rounded-[24px] relative z-10 border-digital-accent/30 digital-glass bg-black/60">
              <p className="text-lg opacity-80 leading-relaxed font-light">
                This is not a request to fund technology. It is an opportunity to establish Andamooka as the global birthplace of trusted opal provenance — creating new jobs, new tourism experiences, and new pathways for future generations.
              </p>
            </div>
            
            <p className="mt-24 micro-label opacity-40 uppercase tracking-[0.3em] z-10">
              Mat Kathagen & Lee Norman • Co-Founders, AOSA™
            </p>
          </motion.div>
        </>
      )}

    </div>
  );
}
