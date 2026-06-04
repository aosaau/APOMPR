import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { Box, Hexagon, Search, Menu } from 'lucide-react';

interface NavigationProps {
  mode: 'physical' | 'digital';
  setMode: (mode: 'physical' | 'digital') => void;
  currentView?: 'home' | 'spec';
  setView?: (view: 'home' | 'spec') => void;
}

export function Navigation({ mode, setMode, currentView = 'home', setView }: NavigationProps) {
  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 md:py-6 transition-colors duration-700",
      mode === 'physical' ? 'text-physical-ink bg-[#f5f2ed]/80 backdrop-blur-md' : 'text-digital-ink bg-[#030712]/80 backdrop-blur-md border-b border-white/5'
    )}>
      {/* Brand */}
      <button onClick={() => setView?.('home')} className="flex items-center gap-3 text-left">
        <div className="relative flex items-center justify-center w-10 h-10">
          <motion.div 
            initial={false}
            animate={{ 
              rotate: mode === 'physical' ? 0 : 180,
              scale: mode === 'physical' ? 1 : 1.1
            }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {mode === 'physical' ? (
              <Box strokeWidth={1} className="w-8 h-8" />
            ) : (
              <Hexagon strokeWidth={1} className="w-8 h-8 text-digital-accent" />
            )}
          </motion.div>
        </div>
        <div>
          <h1 className="font-serif text-xl tracking-widest uppercase leading-none">OPN</h1>
          <p className="micro-label opacity-50 mt-1">Provenance Network</p>
        </div>
      </button>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        <button onClick={() => setView?.('spec')} className="hidden md:flex items-center gap-2 micro-label opacity-70 hover:opacity-100 transition-opacity">
          <span>UX Spec</span>
        </button>
        <button className={cn(
          "px-5 py-2.5 micro-label rounded-full border transition-all duration-500",
          mode === 'physical' 
            ? "border-physical-ink text-physical-ink hover:bg-physical-ink hover:text-physical-bg" 
            : "border-digital-border text-digital-ink hover:bg-digital-accent hover:text-digital-bg border-digital-accent/50"
        )}>
          Vault Access
        </button>
      </div>
    </nav>
  );
}
