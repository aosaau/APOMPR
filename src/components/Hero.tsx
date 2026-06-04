import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface HeroProps {
  mode: 'physical' | 'digital';
}

export function Hero({ mode }: HeroProps) {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 pt-32 lg:pt-32 lg:pb-24 overflow-hidden perspective-[2000px]">
      
      {/* Background Map layer */}
      <div className="absolute inset-0 z-0 flex justify-center items-center pointer-events-none overflow-hidden">
        <motion.div 
           initial={{ opacity: 0, scale: 1.05 }}
           animate={{ opacity: mode === 'physical' ? 0.3 : 0.1, scale: 1 }}
           transition={{ duration: 2, ease: 'easeOut' }}
           className="relative w-full max-w-[1200px] aspect-square lg:aspect-video grayscale"
           style={{ maskImage: 'radial-gradient(ellipse at center, black 10%, transparent 60%)', WebkitMaskImage: 'radial-gradient(ellipse at center, black 10%, transparent 60%)' }}
        >
          <img 
            src="https://res.cloudinary.com/dkgqxred2/image/upload/v1780589210/openart-image_1780588779518_f9cfdecf_1780588781165_6d04e001_ofll2v.png"
            alt="Andamooka Topography"
            className={cn("w-full h-full object-cover mix-blend-multiply dark:mix-blend-screen opacity-80", mode === 'physical' ? "contrast-125 sepia-[.2]" : "hue-rotate-180 invert")}
          />
        </motion.div>
      </div>

      <div className="flex flex-col items-center justify-center text-center z-10 w-full max-w-5xl mx-auto my-auto py-12">
        
        <div className="flex flex-col relative z-20 mt-4 lg:mt-0 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="flex items-center justify-center gap-4 mb-4 md:mb-8">
              <div className={cn("w-2 h-2 rounded-full animate-pulse", mode === 'physical' ? "bg-red-600" : "bg-digital-accent")} />
              <span className={cn(
                "micro-label tracking-widest uppercase",
                mode === 'digital' && "text-digital-accent"
              )}>A New Asset Class Infrastructure</span>
            </div>

            <h1 className={cn(
              "font-serif text-5xl md:text-7xl lg:text-[7rem] leading-[0.9] tracking-tight mb-8",
              mode === 'digital' && "text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-digital-accent drop-shadow-md"
            )}>
              {mode === 'physical' ? (
                <><b>Every</b> opal<br/>carries a story.<br></br>This one begins<br/>in <b>Andamooka</b></>
              ) : (
                <>To the <span className="font-sans font-medium tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-digital-accent via-white to-digital-accent text-glow">immutability<br/>of the ledger.</span></>
              )}
            </h1>

            <p className={cn(
              "text-lg md:text-xl lg:text-2xl max-w-2xl mx-auto font-sans font-light leading-relaxed mb-8",
              mode === 'physical' ? "text-physical-ink/70" : "text-white/60"
            )}>
              Andamooka's famous Matrix Opal.<br/>100 million-year-old stories<br/>Written in light, locked in stone.<br/>To unlock its true value, we <b>must</b> make its story visible.
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="hidden md:flex absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-4 z-10 transition-opacity opacity-50 hover:opacity-100">
        <span className="vertical-text micro-label opacity-70">Scroll</span>
        <div className={cn(
          "w-px h-12 md:h-16",
          mode === 'physical' ? "bg-physical-ink" : "bg-digital-accent"
        )} />
      </div>

    </section>
  );
}

