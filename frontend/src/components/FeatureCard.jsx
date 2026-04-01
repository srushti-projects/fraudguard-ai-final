import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function FeatureCard({ icon: Icon, title, description, color }) {
  const [isHovered, setIsHovered] = useState(false);

  const neonColor = color || '#00FF9D';

  return (
    <motion.div
      layout
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      className="glass-panel rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-default relative overflow-hidden transition-all duration-300 min-h-[180px]"
      style={{
        backgroundColor: `rgba(255,255,255,0.02)`,
        backgroundImage: `linear-gradient(to bottom right, ${neonColor}15, transparent)`,
        borderColor: isHovered ? neonColor : `${neonColor}40`,
        borderWidth: '1px',
        borderStyle: 'solid',
        boxShadow: isHovered ? `0 0 25px ${neonColor}40` : 'none',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <motion.div layout className="flex flex-col items-center gap-4 w-full relative z-10">
        <Icon 
          className="w-14 h-14 transition-all duration-300"
          style={{
            color: isHovered ? neonColor : `${neonColor}B0`,
            filter: isHovered ? `drop-shadow(0 0 15px ${neonColor})` : 'none',
            transform: isHovered ? 'scale(1.1)' : 'scale(1)'
          }}
        />
        <motion.h3 layout className="font-orbitron font-semibold text-lg text-white tracking-wide mt-2">
          {title}
        </motion.h3>
      </motion.div>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="text-gray-300 text-sm leading-relaxed font-light px-2 relative z-10"
          >
            {description}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
