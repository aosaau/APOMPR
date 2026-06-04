import { useState } from 'react';
import { cn } from './lib/utils';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Intelligence } from './components/Intelligence';
import { Vault } from './components/Vault';
import { Passport } from './components/Passport';
import { Marketplace } from './components/Marketplace';
import { UXSpec } from './components/UXSpec';
import { CinematicStory } from './components/CinematicStory';

export default function App() {
  const [mode, setMode] = useState<'physical' | 'digital'>('physical');
  const [currentView, setCurrentView] = useState<'home' | 'spec'>('home');

  return (
    <main className={cn(
      "min-h-screen w-full relative transition-colors duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] font-sans antialiased overflow-x-hidden",
      mode === 'physical' ? 'mode-physical' : 'mode-digital'
    )}>
      {/* Dynamic Atmosphere Background for Digital Mode */}
      <div className="digital-atmosphere" />
      
      {/* Noise overlay for texture */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <Navigation mode={mode} setMode={setMode} currentView={currentView} setView={setCurrentView} />
      
      {currentView === 'home' ? (
        <CinematicStory mode={mode} setMode={setMode} />
      ) : (
        <div className="relative z-10 w-full flex flex-col">
          <UXSpec mode={mode} />
        </div>
      )}

      {/* Footer */}
      <footer className={cn(
        "relative z-10 border-t py-12 px-6 md:px-12 transition-colors duration-1000",
        mode === 'physical' ? "border-physical-ink/10" : "border-digital-border/30 bg-black/50 backdrop-blur-md text-white/70"
      )}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex flex-col gap-2">
            <h2 className="font-serif text-2xl uppercase tracking-widest leading-none">AOSA™</h2>
            <p className="micro-label opacity-50">Australian Opal Standards Authority</p>
          </div>
          
          <div className="flex gap-12 micro-label opacity-60">
            <div className="flex flex-col gap-4">
              <a href="#" className="hover:opacity-100 uppercase transition-opacity">The Registry</a>
              <a href="#" className="hover:opacity-100 uppercase transition-opacity">Market Intelligence</a>
            </div>
            <div className="flex flex-col gap-4">
              <a href="#" className="hover:opacity-100 uppercase transition-opacity">Scientific Methodology</a>
              <a href="#" className="hover:opacity-100 uppercase transition-opacity">Infrastructure Platform</a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-current/10 flex justify-between micro-label opacity-40">
          <span>© {new Date().getFullYear()} AOSA OPN. All rights reserved.</span>
          <span>Bloomberg Terminal for Geological Assets</span>
        </div>
      </footer>
    </main>
  );
}
