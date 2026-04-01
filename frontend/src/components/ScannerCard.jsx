import { motion } from 'framer-motion';
import { MessageSquare, Mail, Link as LinkIcon, Image as ImageIcon, Mic, Video, Terminal, AlertOctagon } from 'lucide-react';

// Unified UI Color Tokens
const THEME = {
  'SMS/Chat': { icon: MessageSquare, color: 'text-cyan-400', border: 'border-cyan-500/50', shadow: 'shadow-[0_0_30px_rgba(34,211,238,0.3)]' },
  Email: { icon: Mail, color: 'text-orange-400', border: 'border-orange-500/50', shadow: 'shadow-[0_0_30px_rgba(251,146,60,0.3)]' },
  URL: { icon: LinkIcon, color: 'text-green-400', border: 'border-green-500/50', shadow: 'shadow-[0_0_30px_rgba(74,222,128,0.3)]' },
  Image: { icon: ImageIcon, color: 'text-purple-400', border: 'border-purple-500/50', shadow: 'shadow-[0_0_30px_rgba(192,132,252,0.3)]' },
  Audio: { icon: Mic, color: 'text-pink-400', border: 'border-pink-500/50', shadow: 'shadow-[0_0_30px_rgba(244,114,182,0.3)]' },
  Video: { icon: Video, color: 'text-blue-400', border: 'border-blue-500/50', shadow: 'shadow-[0_0_30px_rgba(96,165,250,0.3)]' },
  'Prompt Injection': { icon: Terminal, color: 'text-yellow-400', border: 'border-yellow-500/50', shadow: 'shadow-[0_0_30px_rgba(250,204,21,0.3)]' },
  Jailbreak: { icon: AlertOctagon, color: 'text-red-400', border: 'border-red-500/50', shadow: 'shadow-[0_0_30px_rgba(248,113,113,0.3)]' },
};

export default function ScannerCard({ type, id, isActive, onClick }) {
  const config = THEME[type];
  const Icon = config.icon;

  return (
    <motion.div
      onClick={onClick}
      className={`w-full h-full flex flex-col items-center justify-center p-6 rounded-3xl glass-panel relative cursor-pointer border-2 transition-all duration-500 
      ${isActive ? 'bg-cyber-dark/90 backdrop-blur-2xl scale-[1.05]' : 'bg-cyber-dark/40 backdrop-blur-sm'}`}
      style={{
        borderColor: isActive ? config.color.replace('text-', '').replace('-400', '') : 'rgba(255,255,255,0.05)',
        boxShadow: isActive ? config.shadow.replace('shadow-[', '').replace(']', '') : `0 0 10px ${config.color.replace('text-', '').replace('-400', '')}10`
      }}
      whileHover={{ y: -5, scale: isActive ? 1.05 : 1.02 }}
    >
      <div 
        className={`p-4 rounded-full mb-6 relative z-10 transition-all duration-300 ${isActive ? 'bg-black/60' : 'bg-white/5'}`}
        style={{ boxShadow: isActive ? `0 0 20px ${config.color.replace('text-', '').replace('-400', '')}40` : 'none' }}
      >
        <Icon className={`w-12 h-12 transition-all duration-300 ${isActive ? config.color : 'text-gray-400 opacity-70 group-hover:opacity-100'}`} />
      </div>
      
      <h3 className={`text-xl font-orbitron font-bold text-center tracking-wide transition-colors ${isActive ? config.color : 'text-gray-400'}`}>
        {type} Scanner
      </h3>

      {isActive && (
        <span 
          className="mt-4 px-4 py-1.5 text-[10px] font-orbitron font-bold uppercase tracking-widest bg-black rounded-full"
          style={{ color: '#fff', boxShadow: `0 0 10px ${config.color.replace('text-', '').replace('-400', '')}80`, border: `1px solid ${config.color.replace('text-', '').replace('-400', '')}` }}
        >
          Launch Module
        </span>
      )}
    </motion.div>
  );
}
