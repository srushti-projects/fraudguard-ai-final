import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ScannerCard from './ScannerCard';

const SCANNERS = [
  'SMS/Chat', 'Email', 'URL', 'Image',
  'Audio', 'Video', 'Prompt Injection', 'Jailbreak'
];

// Mathematical spatial variants mapping the 3D Fan layout for 8 items
const fanVariants = {
  0: { x: 0, y: 0, scale: 1, zIndex: 100, opacity: 1, filter: 'blur(0px)' },
  1: { x: 260, y: -20, scale: 0.85, zIndex: 90, opacity: 0.8, filter: 'blur(1px)' },
  2: { x: 460, y: -60, scale: 0.65, zIndex: 80, opacity: 0.4, filter: 'blur(3px)' },
  3: { x: 260, y: -100, scale: 0.5, zIndex: 70, opacity: 0.1, filter: 'blur(5px)' },
  4: { x: 0, y: -120, scale: 0.45, zIndex: 60, opacity: 0, filter: 'blur(8px)' },
  5: { x: -260, y: -100, scale: 0.5, zIndex: 70, opacity: 0.1, filter: 'blur(5px)' },
  6: { x: -460, y: -60, scale: 0.65, zIndex: 80, opacity: 0.4, filter: 'blur(3px)' },
  7: { x: -260, y: -20, scale: 0.85, zIndex: 90, opacity: 0.8, filter: 'blur(1px)' }
};

export default function FanCards({ onLaunch }) {
  const [rotationIndex, setRotationIndex] = useState(0);

  const handleNext = () => setRotationIndex(r => r + 1);
  const handlePrev = () => setRotationIndex(r => r - 1);

  const handleCardClick = (index, slot, type) => {
    if (slot === 0) {
      // Trigger modal launch if already completely in front
      onLaunch(type);
    } else {
      // Auto-rotate the clicked background card directly into the front slot
      const total = SCANNERS.length;
      let offset = slot;
      if (slot > total / 2) {
         offset = slot - total; 
      }
      setRotationIndex(r => r + offset);
    }
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto h-[500px] flex items-center justify-center">
      {/* Absolute Side Controls */}
      <div className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-12 z-50">
        <button onClick={handlePrev} className="p-3 rounded-full bg-cyber-dark/80 border border-green-500/30 text-green-400 hover:bg-green-500/20 hover:border-green-400 transition-all backdrop-blur-md shadow-[0_0_15px_rgba(0,255,157,0.2)] hover:shadow-[0_0_25px_rgba(0,255,157,0.5)] active:scale-95">
          <ChevronLeft className="w-8 h-8" />
        </button>
      </div>

      <div className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-12 z-50">
        <button onClick={handleNext} className="p-3 rounded-full bg-cyber-dark/80 border border-green-500/30 text-green-400 hover:bg-green-500/20 hover:border-green-400 transition-all backdrop-blur-md shadow-[0_0_15px_rgba(0,255,157,0.2)] hover:shadow-[0_0_25px_rgba(0,255,157,0.5)] active:scale-95">
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>

      {SCANNERS.map((type, index) => {
        const total = SCANNERS.length;
        const normalizedRotation = ((rotationIndex % total) + total) % total;
        const slot = (index - normalizedRotation + total) % total;
        const isActive = slot === 0;

        return (
          <motion.div
            key={type}
            initial={false}
            animate={fanVariants[slot]}
            transition={{ type: 'spring', stiffness: 90, damping: 14 }}
            className="absolute top-10 w-[300px] h-[380px]"
          >
            <ScannerCard 
              type={type} 
              isActive={isActive} 
              onClick={() => handleCardClick(index, slot, type)} 
            />
          </motion.div>
        );
      })}
    </div>
  );
}
