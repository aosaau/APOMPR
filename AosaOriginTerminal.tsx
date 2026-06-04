import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Activity, ShieldCheck, Database, Scan, Hexagon, ArrowRight, Camera, Upload, X, MapPin, Scale, Code, ScanLine } from 'lucide-react';
import * as tmImage from '@teachablemachine/image';

const URL1 = "https://teachablemachine.withgoogle.com/models/h5R6Fqsx3/";
const URL2 = "https://teachablemachine.withgoogle.com/models/7RuAcI1uL/";

interface ScanData {
  image: string;
  className: string;
  grade: string;
  weightGrams: string;
  valuation?: number;
}

interface AosaOriginTerminalProps {
  mode: 'physical' | 'digital';
  onMint?: (data: ScanData) => void;
}

export function AosaOriginTerminal({ mode, onMint }: AosaOriginTerminalProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [model1, setModel1] = useState<tmImage.CustomMobileNet | null>(null);
  const [model2, setModel2] = useState<tmImage.CustomMobileNet | null>(null);
  const [predictions1, setPredictions1] = useState<{className: string, probability: number}[] | null>(null);
  const [predictions2, setPredictions2] = useState<{className: string, probability: number}[] | null>(null);
  
  // Scanning phases:  
  // 0: idle
  // 1: xrf mapping (simulated)
  // 2: predicting (tm running)
  // 3: awaiting weight
  // 4: minting to blockchain
  // 5: digital birth certificate
  const [scanPhase, setScanPhase] = useState<number>(0);
  const [xrfState, setXrfState] = useState<'idle' | 'calibrating' | 'scanning' | 'locked' | 'passed'>('idle');
  const [xrfHeatmap, setXrfHeatmap] = useState(0);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [weightGrams, setWeightGrams] = useState<string>('');

  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [focusPoint, setFocusPoint] = useState<{x: number, y: number, id: number} | null>(null);
  const initialTouchDist = useRef<number | null>(null);

  useEffect(() => {
    let t: any;
    if (xrfState === 'calibrating') {
      t = setTimeout(() => {
        setXrfState('scanning');
      }, 3000);
    }
    return () => clearTimeout(t);
  }, [xrfState]);

  useEffect(() => {
    let t: any;
    if (xrfState === 'scanning') {
      t = setInterval(() => {
        setXrfHeatmap(prev => {
           let next = prev + Math.random() * 20;
           if (next > 100) next = 85 + Math.random() * 15;
           return next;
        });
      }, 400);
    }
    return () => clearInterval(t);
  }, [xrfState]);

  useEffect(() => {
    async function initModels() {
      try {
        const m1 = await tmImage.load(URL1 + "model.json", URL1 + "metadata.json");
        const m2 = await tmImage.load(URL2 + "model.json", URL2 + "metadata.json");
        setModel1(m1);
        setModel2(m2);
      } catch (err) {
        console.error("Failed to load TM models", err);
      }
    }
    initModels();
  }, []);

  const startBrukerXRF = async () => {
    setIsCameraActive(true);
    setXrfState('calibrating');
    setScanPhase(0);
    setCapturedImage(null);
    setPredictions1(null);
    setPredictions2(null);
    setWeightGrams('');
    setXrfHeatmap(0);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Unable to access camera.");
      setIsCameraActive(false);
      setXrfState('idle');
    }
  };

  const startCamera = async () => {
    // This will be phase 2 camera start
    setIsCameraActive(true);
    setScanPhase(0);
    setCapturedImage(null);
    setPredictions1(null);
    setPredictions2(null);
    setWeightGrams('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Unable to access camera.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const getPinchDistance = (e: React.TouchEvent) => {
    if (e.touches.length < 2) return 0;
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleCameraTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      initialTouchDist.current = getPinchDistance(e);
    } else if (e.touches.length === 1 && !(e.target as HTMLElement).closest('button')) {
       const touch = e.touches[0];
       const rect = e.currentTarget.getBoundingClientRect();
       const x = touch.clientX - rect.left;
       const y = touch.clientY - rect.top;
       setFocusPoint({ x, y, id: Date.now() });
       setTimeout(() => setFocusPoint(null), 1500);
    }
  };

  const handleCameraTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2 && initialTouchDist.current) {
      const currentDist = getPinchDistance(e);
      const diff = currentDist - initialTouchDist.current;
      setZoomLevel(prev => {
        const newZoom = prev + (diff * 0.01);
        return Math.max(1, Math.min(4, newZoom));
      });
      initialTouchDist.current = currentDist;
    }
  };

  const handleCameraTouchEnd = () => {
    initialTouchDist.current = null;
  };

  const handleCameraClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setFocusPoint({ x, y, id: Date.now() });
    setTimeout(() => setFocusPoint(null), 1500);
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageUrl = canvas.toDataURL('image/jpeg');
        processCustomImage(imageUrl);
      }
    }
    stopCamera();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          if (isCameraActive) stopCamera();
          processCustomImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const processCustomImage = (imageUrl: string) => {
    setCapturedImage(imageUrl);
    setScanPhase(1); // XRF Simulation
    
    setTimeout(() => {
      setScanPhase(2);
      predictImage(imageUrl);
    }, 4000); 
  };

  const predictImage = async (imageUrl: string) => {
    if (!model1 || !model2) {
      console.warn("Models not loaded yet");
      setPredictions1([{ className: "Unclassified Asset", probability: 1 }]);
      setPredictions2([{ className: "Unclassified", probability: 1 }]);
      setScanPhase(3);
      return;
    }
    
    const img = document.createElement('img');
    img.src = imageUrl;
    img.onload = async () => {
      const preds1 = await model1.predict(img);
      const preds2 = await model2.predict(img);
      setPredictions1(preds1.sort((a,b) => b.probability - a.probability));
      setPredictions2(preds2.sort((a,b) => b.probability - a.probability));
      setScanPhase(3); // Wait for weight
    };
  };

  const topPrediction1 = predictions1?.[0];
  const topPrediction2 = predictions2?.[0];

  const getTreatmentStatus = (pred?: string) => {
    if (!pred) return 'Unknown';
    if (pred.includes('Untreated')) return 'Untreated';
    if (pred.includes('Treated')) return 'Treated';
    return 'Not Opal';
  }

  const treatmentStatus = getTreatmentStatus(topPrediction1?.className);
  const isNotOpal = treatmentStatus === 'Not Opal';
  const displayGrade = isNotOpal ? 'N/A' : (topPrediction2?.className || 'Unknown');
  const displayProb = topPrediction1 ? (topPrediction1.probability * 100).toFixed(1) : '0.0';
  const displayClass = isNotOpal ? 'Not Opal' : `Andamooka Matrix ${treatmentStatus}`;

  const getPricePerGram = (grade: string) => {
    if (grade.includes('M1')) return 250; // $50/carat
    if (grade.includes('M2')) return 200; // $40/carat
    if (grade.includes('M3')) return 150; // $30/carat
    if (grade.includes('M4')) return 100; // $20/carat
    if (grade.includes('M5')) return 75;  // $15/carat
    if (grade.includes('M6')) return 50;  // $10/carat
    return 5; // M7-M9 or Not Opal = $5/g baseline or N/A
  };

  const getValuation = () => {
    if (isNotOpal) return 0;
    const w = parseFloat(weightGrams) || 0;
    return w * getPricePerGram(displayGrade);
  };

  const currentValuation = getValuation();

  const handleMint = () => {
    if (!weightGrams) return alert("Weight in grams is strictly required.");
    setScanPhase(4);
    if (onMint) {
      onMint({
        image: capturedImage || '',
        className: displayClass,
        grade: displayGrade,
        weightGrams: weightGrams,
        valuation: currentValuation
      });
    }
    setTimeout(() => setScanPhase(5), 4500); // Forging delay
  };

  const isM1 = displayGrade === 'M1';
  const isHighGrade = ['M1', 'M2', 'M3', 'M4'].includes(displayGrade);

  return (
    <section 
      id="verify-ai"
      className={cn(
        "z-10 w-full transition-all duration-500",
        isFullScreen 
          ? "fixed inset-0 z-[100] bg-[#0c0c0c] overflow-y-auto px-4 py-8" 
          : "relative px-6 md:px-12 py-32"
      )}
    >
      <div className={cn("mx-auto", isFullScreen ? "max-w-full" : "max-w-7xl")}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <span className="micro-label opacity-60 mb-4 block">AOSA ORIGIN™ Tech</span>
            <h2 className={cn(
              "text-4xl md:text-7xl lg:text-[6rem] leading-[0.9] tracking-tight mb-8",
              mode === 'physical' ? "font-serif text-physical-ink" : "font-sans font-medium text-white"
            )}>
              Provenance Establishment
            </h2>
            <p className="max-w-2xl text-lg md:text-xl font-light opacity-70">
              Captured at the mine. Immutable XRF spectrometry mapping, geospatial locking, and machine learning classification. Creating the foundation for asset parity.
            </p>
          </div>
          <button 
            onClick={() => setIsFullScreen(!isFullScreen)}
            className={cn(
              "shrink-0 px-4 py-2 border rounded-full font-mono text-xs uppercase tracking-widest transition-colors flex items-center gap-2",
              mode === 'physical' ? "border-physical-ink/20 text-physical-ink hover:bg-black/5" : "border-digital-accent/30 text-digital-accent hover:bg-digital-accent/10"
            )}
          >
            {isFullScreen ? "Exit Full Screen" : "Mobile / Full Screen"}
          </button>
        </div>

        <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 gap-6 lg:min-h-[600px]">
          {/* Input Panel */}
          <div className={cn(
            "lg:col-span-4 p-6 rounded-[24px] overflow-y-auto border flex flex-col",
            mode === 'physical' ? "bg-white border-black/10 shadow-xl shadow-black/5" : "digital-glass shadow-digital-accent/5 backdrop-blur-3xl"
          )}>
            <div className="flex gap-2 items-center mb-6 opacity-60 pb-6 border-b border-current/10">
              <Database className="w-4 h-4" />
              <span className="micro-label">Hardware Sensor Intake</span>
            </div>
            
            <div className="flex flex-col gap-4 mb-6">
               <button onClick={startBrukerXRF} className={cn("w-full py-6 border rounded-xl flex flex-col items-center gap-3 transition-colors", mode === 'physical' ? "border-black/10 hover:bg-[#f5f2ed]" : "border-digital-accent/20 hover:bg-digital-accent/10")}>
                 <Activity className="w-6 h-6 opacity-60" />
                 <span className="micro-label text-xs opacity-80 uppercase">Initialize Bruker XRF System</span>
               </button>
               <button onClick={() => fileInputRef.current?.click()} className={cn("w-full py-6 border rounded-xl flex flex-col items-center gap-3 transition-colors", mode === 'physical' ? "border-black/10 hover:bg-[#f5f2ed]" : "border-digital-accent/20 hover:bg-digital-accent/10")}>
                 <Upload className="w-6 h-6 opacity-60" />
                 <span className="micro-label text-xs opacity-80 uppercase">Upload Offline Telemetry</span>
               </button>
               <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
            </div>

            <div className="mt-auto border-t border-current/10 pt-6">
              <div className="flex items-center gap-2 mb-2">
                <div className={cn("w-2 h-2 rounded-full", (model1 && model2) ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" : "bg-red-500")} />
                <span className="font-mono text-xs sm:text-xs uppercase tracking-widest">{(model1 && model2) ? "TM Neural Nets: ONLINE" : "TM Neural Nets: WARMING UP..."}</span>
              </div>
              <div className="font-mono text-xs sm:text-xs uppercase tracking-widest opacity-50 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span>Treatment Model</span>
                  <span>wOj4KodNk</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Grading Model</span>
                  <span>7RuAcI1uL</span>
                </div>
              </div>
            </div>
          </div>

          {/* Core Viewport */}
          <div className={cn(
            "lg:col-span-8 rounded-[24px] overflow-hidden flex flex-col relative border shadow-2xl min-h-[500px] lg:min-h-0",
            mode === 'physical' ? "bg-[#1a1a1a] text-white shadow-black/20 border-white/10" : "bg-black/80 text-digital-ink border-white/10 shadow-digital-accent/10 backdrop-blur-3xl"
          )}>
            {/* Phase 2: Visual Camera View (Original) */}
            {isCameraActive && xrfState === 'passed' && (
              <div 
                className="absolute inset-0 z-40 bg-black overflow-hidden flex flex-col"
                onTouchStart={handleCameraTouchStart}
                onTouchMove={handleCameraTouchMove}
                onTouchEnd={handleCameraTouchEnd}
                onMouseDown={handleCameraClick}
              >
                <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover opacity-70" style={{ transform: `scaleX(-1) scale(${zoomLevel})`, transformOrigin: 'center center', transition: 'transform 0.1s ease-out' }} />
                <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay" style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                
                {/* Geofencing Indicator */}
                <div className="absolute top-6 left-6 z-10 flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00ffd5] animate-pulse shadow-[0_0_8px_#00ffd5]" />
                  <div className="font-mono text-xs uppercase tracking-widest text-[#00ffd5] bg-black/40 px-2 py-1 backdrop-blur-md rounded border border-[#00ffd5]/30">Geofencing Active: Mine Site Bounds</div>
                </div>

                {/* Floating Encrypted Data representation */}
                <div className="absolute top-6 right-6 z-10 flex items-center gap-3 bg-black/60 border border-[#d8a849]/30 rounded-lg p-3 backdrop-blur-md">
                   <Database className="w-5 h-5 text-[#d8a849]" />
                   <div className="flex flex-col">
                     <span className="font-mono text-[10px] uppercase text-[#d8a849] opacity-70 tracking-widest">Awaiting match</span>
                     <span className="font-mono text-xs uppercase text-white tracking-widest flex gap-2"><span>[<span className="text-[#00ffd5]">XRF</span>]</span> <span>[<span className="text-[#d8a849]">GEOF</span>]</span></span>
                   </div>
                </div>

                <div className="flex-1 relative pointer-events-none flex flex-col items-center justify-center">
                  
                  {/* Camera Reticle */}
                  <div className="w-64 h-80 relative flex items-center justify-center group pointer-events-none">
                    {/* Corners */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/60 transition-all duration-500 group-hover:border-[#00ffd5]" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/60 transition-all duration-500 group-hover:border-[#00ffd5]" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/60 transition-all duration-500 group-hover:border-[#00ffd5]" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/60 transition-all duration-500 group-hover:border-[#00ffd5]" />
                    
                    {/* Crosshair */}
                    <div className="absolute w-full h-[1px] bg-white/20" />
                    <div className="absolute h-full w-[1px] bg-white/20" />
                    <div className="w-2 h-2 rounded-full border border-[#00ffd5]" />

                    {/* Leveler UI */}
                    <div className="absolute -right-12 h-32 w-1 border-l-2 border-dotted border-white/30 flex items-center">
                      <div className="w-4 h-[2px] bg-[#00ffd5] -ml-2" />
                    </div>
                  </div>
                </div>

                {/* Focus Ring Indicator */}
                <AnimatePresence>
                  {focusPoint && (
                    <motion.div
                      key={focusPoint.id}
                      initial={{ scale: 1.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute w-24 h-24 pointer-events-none z-50 flex items-center justify-center"
                      style={{ left: focusPoint.x - 48, top: focusPoint.y - 48 }}
                    >
                      {/* Broken corner focus brackets */}
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00ffd5]" />
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00ffd5]" />
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00ffd5]" />
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00ffd5]" />
                      <div className="w-1 h-1 bg-[#00ffd5] rounded-full" />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative z-10 p-8 flex flex-col items-center gap-6 mt-auto pb-12 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none">
                  <div className="text-center pointer-events-auto">
                    <p className="font-mono text-xs uppercase tracking-widest text-white/50 mb-1">Awaiting visual match & geofencing confirmation</p>
                    <p className="font-mono text-xs uppercase tracking-widest text-[#00ffd5]">Verify physical specimen</p>
                  </div>

                  <div className="flex items-center gap-8 pointer-events-auto">
                     <button onClick={stopCamera} className="w-12 h-12 rounded-full border border-white/20 text-white/50 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors">
                       <X className="w-5 h-5" />
                     </button>
                     <button onClick={captureImage} className="w-20 h-20 rounded-full border-4 border-white/50 flex items-center justify-center p-1 active:scale-95 transition-transform hover:border-white">
                       <div className="w-full h-full bg-white rounded-full opacity-80" />
                     </button>
                  </div>
                </div>
              </div>
            )}

            {!capturedImage && scanPhase === 0 && !isCameraActive && xrfState === 'idle' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-40">
                <Scan className="w-16 h-16 mb-6 stroke-1 border border-current p-4 rounded-full" />
                <p className="font-mono text-sm uppercase tracking-widest leading-loose text-center">Equipment Standby<br/><span className="opacity-50 text-xs">Awaiting physical material</span></p>
              </div>
            )}

            {/* Phase 1: Bruker XRF Scanner UI */}
            {isCameraActive && (xrfState === 'calibrating' || xrfState === 'scanning' || xrfState === 'locked') && (
              <div className="absolute inset-0 z-50 bg-black flex flex-col overflow-hidden">
                 {/* Shared Video Background for Scanning + Locked */}
                 <video ref={videoRef} autoPlay playsInline muted className={cn("w-full h-full object-cover scale-x-[-1] absolute inset-0 transition-opacity duration-1000", xrfState === 'locked' ? 'opacity-20 blur-sm' : 'opacity-60')} />
                 
                 {xrfState === 'calibrating' && (
                   <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm z-10">
                     <Activity className="w-12 h-12 text-[#00ffd5] mb-8 animate-pulse" />
                     <h3 className="font-mono text-lg uppercase tracking-widest text-[#00ffd5] mb-4">Calibrating Bruker Spectrometer</h3>
                     <div className="w-64 h-1 bg-white/10 rounded overflow-hidden">
                       <motion.div initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 3, ease: 'linear' }} className="h-full bg-[#00ffd5] shadow-[0_0_10px_#00ffd5]" />
                     </div>
                     <div className="mt-4 font-mono text-xs uppercase opacity-50 flex gap-4">
                       <span className="animate-pulse">Checking sensor focal array...</span>
                     </div>
                   </div>
                 )}

                 {xrfState === 'scanning' && (
                   <div className="absolute inset-0 z-10">
                     {/* Overlay Grid */}
                     <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay" style={{ backgroundImage: 'linear-gradient(to right, #00ffd5 1px, transparent 1px), linear-gradient(to bottom, #00ffd5 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                     {/* Dancing Nodes */}
                     {Array.from({length: 12}).map((_, i) => (
                       <motion.div
                         key={i}
                         className={cn("absolute w-1.5 h-1.5 rounded-full z-20 shadow-[0_0_8px_currentColor]", i%3===0?"bg-pink-500 text-pink-500":i%3===1?"bg-[#00ffd5] text-[#00ffd5]":"bg-green-400 text-green-400")}
                         animate={{
                           x: [Math.random() * 400 - 200, Math.random() * 400 - 200, Math.random() * 400 - 200],
                           y: [Math.random() * 400 - 200, Math.random() * 400 - 200, Math.random() * 400 - 200],
                         }}
                         transition={{ duration: 3 + Math.random()*3, repeat: Infinity, ease: 'easeInOut' }}
                         style={{ left: '50%', top: '40%' }}
                       />
                     ))}

                     {/* Fingerprint UI at bottom */}
                     <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
                        <div className="w-24 h-32 relative mb-6 mix-blend-screen opacity-90 transition-opacity duration-300" style={{ backgroundImage: 'radial-gradient(ellipse at center, rgba(0,255,213,0.3) 0%, transparent 70%)', clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)' }}>
                          <motion.div 
                            className="absolute inset-0 bg-gradient-to-br from-pink-500 via-[#00ffd5] to-green-400 mix-blend-color-dodge opacity-60" 
                            animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.05, 1] }} 
                            transition={{ duration: 2, repeat: Infinity }} 
                          />
                          <ScanLine className="absolute inset-0 w-full h-full text-white opacity-40 mix-blend-overlay p-4" />
                        </div>

                        <div className="flex flex-col items-center gap-4">
                          <div className={cn("font-mono text-xs uppercase tracking-widest px-4 py-2 border backdrop-blur-md transition-all duration-300", xrfHeatmap > 80 ? "bg-[#00ffd5]/20 text-[#00ffd5] border-[#00ffd5]/50 shadow-[0_0_15px_rgba(0,255,213,0.3)]" : "bg-black/60 text-white/70 border-white/20")}>
                            {xrfHeatmap > 80 ? 'Read: Optimal, Hold Steady...' : 'Reading Surface Topology...'}
                          </div>
                          
                          <button 
                            onClick={() => setXrfState('locked')} 
                            className={cn("px-12 py-4 font-mono text-sm font-bold uppercase tracking-widest transition-all duration-300 rounded", xrfHeatmap > 80 ? "bg-[#00ffd5]/80 hover:bg-[#00ffd5] text-black shadow-[0_0_20px_rgba(0,255,213,0.4)]" : "bg-white/10 text-white/30 border border-white/10 pointer-events-none")}
                          >
                            Capture Data
                          </button>
                        </div>
                     </div>
                   </div>
                 )}

                 {xrfState === 'locked' && (
                   <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-8 text-center backdrop-blur-xl z-30">
                     <ShieldCheck className="w-20 h-20 text-[#00ffd5] mb-6 drop-shadow-[0_0_20px_rgba(0,255,213,0.5)]" />
                     <h3 className="font-serif text-3xl text-white mb-4">OPN OriginLock™ Engaged</h3>
                     <p className="font-mono text-sm hover:opacity-100 opacity-60 text-white max-w-md mb-12 uppercase tracking-widest leading-loose">Data has been parametrically encrypted and suspended pending geospatial & visual verification.</p>
                     
                     <button 
                       onClick={() => { setXrfState('passed'); startCamera(); }} 
                       className="px-8 py-5 border border-[#00ffd5]/50 text-[#00ffd5] bg-[#00ffd5]/10 hover:bg-[#00ffd5] hover:text-black hover:shadow-[0_0_30px_rgba(0,255,213,0.4)] transition-all font-mono text-sm uppercase tracking-widest rounded flex items-center gap-3"
                     >
                       Open OriginLock App to complete verification <ArrowRight className="w-4 h-4" />
                     </button>
                   </div>
                 )}
              </div>
            )}

            {/* XRF & Scanning Phase Overlay */}
            {capturedImage && scanPhase > 0 && scanPhase < 3 && (
              <div className="absolute inset-0 flex flex-col z-20 overflow-hidden bg-[#0A0A0A]">
                <div className="flex-1 flex w-full">
                   <div className="w-1/2 p-12 border-r border-white/5 relative">
                     <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, #00ffd5 1px, #00ffd5 2px)', backgroundSize: '100% 4px' }} />
                     <h3 className="font-mono text-xs uppercase text-[#00ffd5] mb-8 tracking-widest relative z-10">Target Material</h3>
                     <img src={capturedImage} className="w-full h-auto object-contain relative z-10 filter sepia-[0.3] hue-rotate-[180deg] contrast-125" />
                     {scanPhase === 1 && (
                       <motion.div initial={{ top: '0%' }} animate={{ top: '100%' }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} className="absolute left-0 right-0 h-1 bg-[#00ffd5] shadow-[0_0_20px_#00ffd5] z-20" />
                     )}
                   </div>
                   <div className="w-1/2 p-12 flex flex-col">
                     <h3 className="font-mono text-xs uppercase text-[#00ffd5] mb-8 tracking-widest flex items-center gap-2">
                       <Activity className="w-4 h-4 animate-pulse" />
                       Real-time XRF Spectrometry
                     </h3>
                     
                     <div className="flex-1 flex flex-col justify-center gap-6">
                       <XrfBar label="Si (Silicon)" pct={scanPhase === 1 ? Math.random()*20 + 70 : 85.3} />
                       <XrfBar label="O (Oxygen)" pct={scanPhase === 1 ? Math.random()*20 + 10 : 13.1} />
                       <XrfBar label="Fe (Iron)" pct={scanPhase === 1 ? Math.random()*2 + 0.5 : 1.2} />
                       <XrfBar label="Al (Aluminum)" pct={scanPhase === 1 ? Math.random()*1 + 0.1 : 0.4} />
                       <XrfBar label="H2O (Water)" pct={scanPhase === 1 ? Math.random()*5 + 5 : 8.1} />
                     </div>
                   </div>
                </div>
                <div className="h-24 border-t border-white/10 flex flex-col justify-center px-6 gap-2 bg-black">
                   <div className="w-full h-1 bg-white/10 rounded overflow-hidden mb-2">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: scanPhase === 1 ? '50%' : '100%' }}
                        className="h-full bg-[#00ffd5] shadow-[0_0_10px_#00ffd5] transition-all duration-700"
                      />
                   </div>
                   <div className="flex items-center justify-between">
                     <div className="flex flex-col">
                       <span className="font-mono text-[10px] uppercase tracking-widest text-[#00ffd5] opacity-50">State</span>
                       <span className="font-mono text-xs uppercase tracking-widest text-[#00ffd5] font-bold">
                         {scanPhase === 1 ? 'Merging Data Sets...' : 'VERIFICATION SUCCESSFUL'}
                       </span>
                     </div>
                     <div className="font-mono text-[10px] uppercase tracking-widest bg-[#00ffd5]/20 text-[#00ffd5] px-2 py-1 border border-[#00ffd5]/50 animate-pulse text-right">
                       {scanPhase === 1 ? 'Awaiting visual layer processing...' : 'Spectral data matches visual proof.'}
                     </div>
                   </div>
                </div>
              </div>
            )}

            {/* Awaiting Details / Minting */}
            {capturedImage && topPrediction1 && scanPhase >= 3 && (
              <div className="flex-1 flex flex-col md:flex-row relative z-20 bg-[#0c0c0c]">
                
                {/* Forging Overlay */}
                {scanPhase >= 4 && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/80">
                    <div className="text-center">
                      <motion.div 
                        animate={scanPhase === 4 ? { rotateY: 1080, scale: [1, 1.2, 1] } : { rotateY: 0, scale: 1 }}
                        transition={{ duration: 4, ease: "circInOut" }}
                        className="w-24 h-24 mx-auto mb-8 flex items-center justify-center transform-style-3d relative"
                      >
                         <Hexagon className={cn("w-20 h-20", scanPhase === 5 ? "text-[#00ffd5] drop-shadow-[0_0_20px_#00ffd5]" : "text-white opacity-50")} strokeWidth={1} />
                         {scanPhase === 4 && (
                           <div className="absolute inset-0 rounded-full border border-t-[#00ffd5] animate-spin" />
                         )}
                      </motion.div>
                      <h3 className="font-mono text-xl tracking-widest uppercase mb-4 text-[#00ffd5]">
                        {scanPhase === 4 ? "Minting Protocol Active" : "Digital Birth Certificate Generated"}
                      </h3>
                      <p className="font-mono text-xs opacity-60 max-w-sm mx-auto leading-relaxed text-white">
                        {scanPhase === 4 
                          ? "Securing XRF telemetry, ML predictions, mass, and geocoordinates to Escrow Contract..."
                          : `Successfully locked ${weightGrams}g of ${displayClass} at [-30.447438, 137.154005].`}
                      </p>
                    </div>
                  </div>
                )}

                <div className={cn("w-full md:w-5/12 border-r flex flex-col relative overflow-hidden", isM1 ? "border-[#d8a849]" : "border-white/10")}>
                  {isM1 && (
                    <motion.div 
                      className="absolute inset-0 z-0 mix-blend-overlay pointer-events-none"
                      animate={{
                        background: [
                          'linear-gradient(45deg, rgba(216,168,73,0) 0%, rgba(216,168,73,0.1) 50%, rgba(216,168,73,0) 100%)',
                          'linear-gradient(45deg, rgba(216,168,73,0.1) 0%, rgba(216,168,73,0.3) 50%, rgba(216,168,73,0.1) 100%)',
                          'linear-gradient(45deg, rgba(216,168,73,0) 0%, rgba(216,168,73,0.1) 50%, rgba(216,168,73,0) 100%)'
                        ]
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  )}
                  {isHighGrade && !isM1 && (
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent z-0 pointer-events-none" />
                  )}
                  <div className="h-64 relative bg-black z-10">
                     <img src={capturedImage} className="w-full h-full object-cover opacity-80" />
                     <div className={cn("absolute top-4 left-4 font-mono text-xs sm:text-xs uppercase tracking-widest backdrop-blur-md px-2 py-1", isM1 ? "bg-[#d8a849]/90 text-black font-bold" : "bg-black/60 text-white")}>AOSA ORIGIN™ SCANNED</div>
                  </div>
                  <div className={cn("p-6 md:p-8 flex-1 flex flex-col z-10", isM1 ? "bg-gradient-to-b from-black to-[#33250b]" : (isHighGrade ? "bg-white/5" : ""))}>
                    <h4 className={cn("font-mono text-xs uppercase tracking-widest mb-2", isM1 ? "text-[#d8a849]" : "text-[#00ffd5]")}>ML Classification Result</h4>
                    <div className={cn("text-3xl font-serif mb-2 leading-tight", isM1 ? "text-[#f3dca1] drop-shadow-[0_0_10px_rgba(216,168,73,0.5)]" : "text-white")}>{displayClass}</div>
                    {!isNotOpal && (
                      <div className={cn("inline-flex px-3 py-1 font-mono text-sm tracking-widest uppercase mb-6 self-start", 
                        isM1 ? "bg-[#d8a849]/20 text-[#f3dca1] border border-[#d8a849]/50 shadow-[0_0_15px_rgba(216,168,73,0.4)] relative" : 
                        isHighGrade ? "bg-white/10 text-white border border-white/30" : 
                        "bg-[#00ffd5]/10 text-[#00ffd5] border border-[#00ffd5]/30")}>
                        {isM1 && <div className="absolute inset-0 bg-[#d8a849]/10 animate-pulse pointer-events-none" />}
                        GRADE: {displayGrade}
                      </div>
                    )}
                    
                    <div className="flex flex-col gap-3 mt-auto">
                      {!isNotOpal && currentValuation > 0 && weightGrams && (
                        <div className={cn("flex justify-between items-end border-b pb-3 mb-1", isM1 ? "border-[#d8a849]/30" : "border-white/10")}>
                          <span className={cn("font-mono text-xs uppercase opacity-70", isM1 ? "text-[#d8a849]" : "text-white")}>Rough Spot Valuation</span>
                          <span className={cn("font-serif text-2xl tracking-tight", isM1 ? "text-[#f3dca1]" : "text-white")}>
                            ${currentValuation.toLocaleString()}
                          </span>
                        </div>
                      )}
                      <div className={cn("flex justify-between items-end border-b pb-2", isM1 ? "border-[#d8a849]/20" : "border-white/10")}>
                        <span className={cn("font-mono text-xs uppercase opacity-50", isM1 ? "text-[#d8a849]" : "text-white")}>Confidence</span>
                        <span className={cn("font-mono font-medium", isM1 ? "text-[#f3dca1]" : "text-white")}>{displayProb}%</span>
                      </div>
                      <div className={cn("flex justify-between items-end border-b pb-2", isM1 ? "border-[#d8a849]/20" : "border-white/10")}>
                        <span className={cn("font-mono text-xs uppercase opacity-50", isM1 ? "text-[#d8a849]" : "text-white")}>XRF Signature</span>
                        <span className={cn("font-mono font-medium text-xs", isM1 ? "text-[#f3dca1]" : "text-white")}>{isNotOpal ? 'FAIL' : 'VERIFIED_MATCH'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-7/12 p-6 md:p-10 flex flex-col justify-between">
                   <div>
                     <h3 className="font-serif text-2xl text-white mb-8">Establish Physical Parity</h3>
                     
                     <div className="grid grid-cols-1 gap-6 mb-8">
                       <div className="bg-white/5 border border-white/10 p-5 rounded-lg flex gap-4 items-start">
                         <MapPin className="w-5 h-5 text-[#00ffd5] mt-1 shrink-0" />
                         <div>
                            <div className="font-mono text-xs uppercase tracking-widest text-white/50 mb-1">Geospatial Lock (Andamooka Mine)</div>
                            <div className="font-mono text-sm text-white">-30.447438, 137.154005</div>
                         </div>
                       </div>
                       
                       <div className="bg-[#00ffd5]/5 border border-[#00ffd5]/20 p-5 rounded-lg flex gap-4 items-start relative overflow-hidden">
                         <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#00ffd5]/10 to-transparent pointer-events-none" />
                         <Scale className="w-5 h-5 text-[#00ffd5] mt-1 shrink-0 relative z-10" />
                         <div className="flex-1 relative z-10">
                            <label className="font-mono text-xs uppercase tracking-widest text-[#00ffd5] mb-2 block">Accurate Mass Input (Grams)</label>
                            <input 
                              type="number" 
                              value={weightGrams} 
                              onChange={(e) => setWeightGrams(e.target.value)} 
                              placeholder="e.g. 25.5" 
                              className="w-full bg-black border border-[#00ffd5]/40 text-white p-3 font-mono text-lg focus:outline-none focus:border-[#00ffd5] tracking-widest rounded"
                            />
                         </div>
                       </div>
                     </div>
                   </div>

                   <button 
                     onClick={handleMint}
                     disabled={!weightGrams}
                     className="w-full py-5 bg-[#00ffd5] text-black font-mono text-sm uppercase tracking-widest font-bold hover:bg-white transition-colors disabled:opacity-50 disabled:bg-white/20 disabled:text-white/50 flex items-center justify-center gap-3 rounded"
                   >
                     <Code className="w-4 h-4" /> Mint Digital Birth Certificate
                   </button>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function XrfBar({ label, pct }: { label: string, pct: number }) {
  return (
    <div>
      <div className="flex justify-between font-mono text-xs sm:text-xs mb-2 text-white">
        <span className="uppercase tracking-widest">{label}</span>
        <span>{pct.toFixed(1)}%</span>
      </div>
      <div className="h-1 bg-white/10 w-full overflow-hidden">
        <motion.div 
          className="h-full bg-[#00ffd5]"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.5, type: 'spring' }}
        />
      </div>
    </div>
  )
}
