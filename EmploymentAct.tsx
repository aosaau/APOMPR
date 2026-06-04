import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { Camera, Beaker, FileBadge, Database, Layers } from 'lucide-react';

interface Props {
  mode: 'physical' | 'digital';
}

export function EmploymentAct({ mode }: Props) {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-24">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-24 relative">
        {/* Network Flow Line for Digital Mode */}
        {mode === 'digital' && (
          <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-px bg-digital-accent/20 z-0">
             <motion.div 
                animate={{ left: ['0%', '100%'] }}
                transition={{ duration: 3, ease: 'linear', repeat: Infinity }}
                className="absolute top-[-1px] w-32 h-[3px] bg-digital-accent shadow-[0_0_15px_rgba(0,255,213,0.8)]"
             />
          </div>
        )}

        {[
          { role: 'Origin', title: 'Miner', desc: mode === 'physical' ? 'Andamooka matrix opal extracted and registered at source' : 'Asset origin anchored cryptographically to the source claim' },
          { role: 'Manufacturing', title: 'Fabricator', desc: mode === 'physical' ? 'Steel housing from reclaimed local mining infrastructure' : 'Physical twin secured in tamper-proof housing' },
          { role: 'Craft', title: 'Artisan', desc: mode === 'physical' ? 'Paracord assembly, lapidary work, setting' : 'XRF geological signature bound to the physical object' },
          { role: 'Media', title: 'Creator', desc: mode === 'physical' ? 'Photography, video, community archive documentation' : 'High-fidelity contextual data minted to the digital twin' },
          { role: 'Experience', title: 'Operator', desc: mode === 'physical' ? 'Tourism guide, assay station, visitor engagement' : 'Global asset verification and liquidity gateway' }
        ].map((node, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "p-6 rounded-[20px] relative border flex flex-col z-10",
              mode === 'physical' ? "bg-white border-black/10 shadow-lg" : "digital-glass border-digital-accent/20 bg-black/80"
            )}
          >
            <div className={cn("micro-label mb-4", mode === 'digital' ? "text-digital-accent drop-shadow-md" : "text-black/50")}>{node.role}</div>
            <h3 className={cn("text-xl mb-4", mode === 'physical' ? "font-sans tracking-tight text-physical-ink" : "font-sans tracking-tight text-white")}>{node.title}</h3>
            <p className="opacity-70 text-sm leading-relaxed mt-auto">{node.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="max-w-4xl">
        <h3 className={cn("text-2xl mb-8", mode === 'physical' ? "font-sans tracking-tight" : "font-sans font-medium")}>Infrastructure Allocation</h3>
        <div className="space-y-6">
          {[
            { tag: 'Assay Station', title: 'XRF Unit + Training', desc: "Establishes Andamooka's first AOSA Assay Station. Creates the geological archive. Generates the data that underpins every grade, every record, every digital twin." },
            { tag: 'Legal', title: 'Worldwide Patents', desc: "Secures legal protection around the Andamooka Standard. When this reaches national and international attention, no corporate actor can appropriate what this community built." },
            { tag: 'Digital', title: 'Network Infrastructure', desc: "Builds the digital backbone connecting the assay station, grading standard, provenance records and marketplace into a single functioning system." }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col md:flex-row gap-6 md:gap-12 pb-6 border-b border-current/10"
            >
              <div className="w-full md:w-1/3">
                <div className="text-xl font-medium mb-2">{item.title}</div>
                <div className={cn("micro-label", mode === 'digital' ? "text-digital-accent" : "text-black/50")}>{item.tag}</div>
              </div>
              <div className="w-full md:w-2/3 opacity-80 leading-relaxed font-light">
                {item.desc}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
