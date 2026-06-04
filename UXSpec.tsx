import { motion } from 'motion/react';
import * as React from 'react';
import { cn } from '../lib/utils';
import { ArrowLeft, Box, Hexagon, Component, MousePointerClick, Zap } from 'lucide-react';

interface UXSpecProps {
  mode: 'physical' | 'digital';
}

export function UXSpec({ mode }: UXSpecProps) {
  return (
    <div className={cn(
      "min-h-screen pt-32 pb-24 px-6 md:px-12",
      mode === 'physical' ? "bg-[#f5f2ed] text-physical-ink" : "bg-[#030712] text-digital-ink digital-glass min-h-screen relative overflow-hidden"
    )}>
      {mode === 'digital' && <div className="digital-atmosphere !opacity-100" />}
      <div className="max-w-4xl mx-auto relative z-10">
        
        <div className="mb-16">
          <span className="micro-label opacity-60 mb-4 block">Design Specs</span>
          <h1 className={cn(
            "text-5xl md:text-6xl mb-6",
            mode === 'physical' ? "font-serif" : "font-sans font-medium tracking-tight"
          )}>
            AOSA UX Architecture
          </h1>
          <p className="text-xl font-light opacity-80 leading-relaxed max-w-2xl">
            A comprehensive overview of the design system, typography, color architecture, and motion principles bridging the institutional and the spectral.
          </p>
        </div>

        {/* 1. UI System */}
        <SpecSection title="1. UI System & Typography" icon={<Component />} mode={mode}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="p-6 rounded-2xl border border-current/10 bg-white/5">
              <h3 className="micro-label opacity-50 mb-4 text-xs">Physical Mode (Institutional)</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-4xl font-serif mb-1">Cormorant Garamond</div>
                  <div className="micro-label opacity-50">Headings & Prestige Elements</div>
                </div>
                <div>
                  <div className="text-lg font-sans font-light mb-1">Inter Light</div>
                  <div className="micro-label opacity-50">Body copy & descriptions</div>
                </div>
                <div>
                  <div className="text-sm font-mono mb-1">JetBrains Mono</div>
                  <div className="micro-label opacity-50">Data, Grades & Metadata</div>
                </div>
              </div>
            </div>
            
            <div className={cn(
              "p-6 rounded-2xl border",
              mode === 'digital' ? "border-digital-accent/30 bg-digital-accent/5" : "border-current/10 bg-black/5"
            )}>
              <h3 className="micro-label opacity-50 mb-4 text-xs">Digital Twins (Gamified)</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-sans font-medium tracking-tight mb-1">Inter Medium (Tight)</div>
                  <div className="micro-label opacity-50">Headings & Concept Names</div>
                </div>
                <div>
                  <div className="text-lg font-sans font-light mb-1">Inter Light</div>
                  <div className="micro-label opacity-50">Body copy</div>
                </div>
                <div>
                  <div className={cn("text-sm font-mono mb-1", mode === 'digital' && "text-digital-accent")}>JetBrains Mono (Colored)</div>
                  <div className="micro-label opacity-50">Ledger Data & Variables</div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-4">
            <ColorBox label="Physical Background" color="#f5f2ed" text="#1a1a1a" />
            <ColorBox label="Physical Ink" color="#1a1a1a" text="#ffffff" />
            <ColorBox label="Digital Background" color="#030712" text="#ffffff" />
            <ColorBox label="Digital Accent" color="#00ffd5" text="#030712" />
            <ColorBox label="Digital Surface" color="rgba(255,255,255,0.05)" text="#ffffff" />
          </div>
        </SpecSection>

        {/* 2. Vault Hierachy */}
        <SpecSection title="2. Grading & Vault Hierarchy" icon={<Box />} mode={mode}>
          <div className="prose prose-invert max-w-none font-light opacity-80 mb-6">
            <p>The Vault operates as a pristine institutional wallet. Assets are treated as high-value financial instruments rather than simple NFTs. The grading system (M1-M9) dictates the visual weight of the asset card.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="p-6 rounded-2xl border border-current/10 bg-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 micro-label opacity-30">M9</div>
                <h3 className="font-serif text-2xl mb-2">Heroic Asset Layout</h3>
                <ul className="list-disc pl-5 font-light opacity-80 space-y-2 text-sm mt-4">
                  <li>Full width span (lg:col-span-2 or dedicated hero)</li>
                  <li>Prominent implied value & liquidity score</li>
                  <li>Cinematic 20s ease-in-out subtle zoom on hover</li>
                  <li>In digital mode: aggressive digital accent borders and extreme glow effects.</li>
                </ul>
             </div>
             <div className="p-6 rounded-2xl border border-current/10 bg-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 micro-label opacity-30">M1-M8</div>
                <h3 className="font-serif text-xl mb-2">Standard Asset Layout</h3>
                <ul className="list-disc pl-5 font-light opacity-80 space-y-2 text-sm mt-4">
                  <li>Minimal, tight aspect-ratio (3/4) bento grid.</li>
                  <li>Data-dense overlays focusing on weight, value, rarity %.</li>
                  <li>Subdued hover effects to maintain institutional calm.</li>
                  <li>In digital mode: luminosity blend modes to create spectral xray aesthetics.</li>
                </ul>
             </div>
          </div>
        </SpecSection>

        {/* 3. Motion Principles */}
        <SpecSection title="3. Motion & Transition Principles" icon={<Zap />} mode={mode}>
          <ul className="space-y-6">
            <MotionSpecItem 
              title="State Toggle (Physical -> Digital)"
              desc="The core toggle triggers a 1.5s global backdrop curve. Layout remains strictly identical. Colors invert, typography weights shift, and image blend-modes swap from normal to luminosity, generating a 'blueprint/xray' aesthetic."
            />
            <MotionSpecItem 
              title="Minting Flow / Scanning Phase"
              desc="VerifyAI uses a 360-rotating border with micro-label 'EXTRACTING EMBEDDINGS' to simulate heavy logic processing. This anchors the user in the 'Palantir meets Luxury' mindset, creating anticipation."
            />
            <MotionSpecItem 
              title="Hover States (Cinematic Restraint)"
              desc="Hovering over an M9 asset invokes a slow 10-20s transform scale. No instant pops. Everything feels heavy, expensive, and deliberate. Buttons use micro-label springs."
            />
          </ul>
        </SpecSection>

        {/* 4. Screen Ledger */}
        <SpecSection title="4. Screen & Component Architecture" icon={<MousePointerClick />} mode={mode}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 micro-label">
            <div className="p-4 border border-current/10 rounded-lg">1. Hero (Landing)</div>
            <div className="p-4 border border-current/10 rounded-lg">2. Intelligence (Variance Dashboards)</div>
            <div className="p-4 border border-current/10 rounded-lg">3. VerifyAI (Valuation Engine)</div>
            <div className="p-4 border border-current/10 rounded-lg">4. Marketplace (Inter-exchange)</div>
            <div className="p-4 border border-current/10 rounded-lg">5. The Vault (Asset UI)</div>
            <div className="p-4 border border-current/10 rounded-lg">6. Passport (Trust / Legitimacy)</div>
          </div>
        </SpecSection>

      </div>
    </div>
  );
}

function SpecSection({ title, icon, mode, children }: { title: string, icon: React.ReactNode, mode: 'physical'|'digital', children: React.ReactNode }) {
  return (
    <div className="mb-16 border-t border-current/10 pt-12">
      <div className="flex items-center gap-3 mb-8">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center",
          mode === 'physical' ? "bg-black/10 text-black" : "bg-digital-accent/20 text-digital-accent"
        )}>
          {icon}
        </div>
        <h2 className={cn(
          "text-2xl",
          mode === 'physical' ? "font-serif" : "font-sans font-medium tracking-tight"
        )}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function ColorBox({ label, color, text }: { label: string, color: string, text: string }) {
  return (
    <div className="rounded-xl overflow-hidden shadow-sm border border-black/10">
      <div className="h-20 w-full" style={{ backgroundColor: color }} />
      <div className="p-3 bg-white text-black micro-label text-xs flex flex-col gap-1">
        <span className="opacity-50 truncate">{label}</span>
        <span>{color}</span>
      </div>
    </div>
  );
}

function MotionSpecItem({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-current/5 border border-current/10">
      <h3 className="font-mono text-sm uppercase tracking-widest mb-3 opacity-90">{title}</h3>
      <p className="font-light opacity-70 leading-relaxed text-sm">{desc}</p>
    </div>
  )
}
