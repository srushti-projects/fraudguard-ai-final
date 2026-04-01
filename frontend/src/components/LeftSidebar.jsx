import React, { useState, useEffect } from 'react';
import { Shield, Activity, Users, AlertTriangle, CheckCircle2, ChevronRight, Target, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TIPS = [
  "Never click suspicious links.",
  "Always verify sender identity.",
  "Avoid urgent payment requests.",
  "Check domain spelling carefully."
];

const SCAM_KEYWORDS = [
  "OTP Scam", "Fake Delivery Link", "KYC Update Fraud", "UPI Request",
  "Bank Verification", "Urgent Payment", "Lottery Scam", "Job Offer Scam",
  "Fake Support Call", "Phishing Link Detected", "Account Suspended Alert"
];

export default function LeftSidebar() {
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % TIPS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Safety Tips */}
      <div className="bg-gradient-to-br from-[#0f172a]/80 to-[#020617]/80 backdrop-blur-md rounded-xl border border-white/5 p-5 shadow-lg relative overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
          <h3 className="font-orbitron font-bold text-white tracking-wide">Safety Tips</h3>
        </div>
        
        <div className="h-16 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTip}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-start gap-3 bg-black/20 p-3 rounded-lg border border-cyan-500/20 shadow-[inset_0_0_15px_rgba(34,211,238,0.05)]"
            >
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5 shadow-[0_0_5px_currentColor]" />
              <p className="font-inter text-xs text-gray-300 leading-relaxed font-medium">{TIPS[currentTip]}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        
        <a 
          href="https://cybercrime.gov.in/Webform/Crime_OnlineSafetyTips.aspx"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full mt-4 py-1 text-[11px] font-orbitron font-medium text-cyan-400/70 hover:text-cyan-400 flex items-center justify-center gap-1 transition-colors uppercase tracking-wider"
        >
          More Tips <ChevronRight className="w-3 h-3" />
        </a>
      </div>

      {/* Platform Stats */}
      <div className="bg-gradient-to-br from-[#0f172a]/80 to-[#020617]/80 backdrop-blur-md rounded-xl border border-white/5 p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
          <h3 className="font-orbitron font-bold text-white tracking-wide">Platform Stats</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-black/40 rounded-lg p-3 border border-white/5 hover:border-orange-500/30 hover:shadow-[0_0_15px_rgba(251,146,60,0.1)] transition-all flex flex-col items-center justify-center text-center group">
            <AlertTriangle className="w-4 h-4 text-orange-400 mb-2 group-hover:drop-shadow-[0_0_5px_currentColor]" />
            <span className="text-[9px] text-gray-400 font-inter uppercase tracking-widest mb-1">Reports Today</span>
            <span className="text-lg font-orbitron font-bold text-white group-hover:text-orange-400 transition-colors">1,248</span>
          </div>
          <div className="bg-black/40 rounded-lg p-3 border border-white/5 hover:border-red-500/30 hover:shadow-[0_0_15px_rgba(248,113,113,0.1)] transition-all flex flex-col items-center justify-center text-center group">
            <Target className="w-4 h-4 text-red-400 mb-2 group-hover:drop-shadow-[0_0_5px_currentColor]" />
            <span className="text-[9px] text-gray-400 font-inter uppercase tracking-widest mb-1">Detected</span>
            <span className="text-lg font-orbitron font-bold text-white group-hover:text-red-400 transition-colors">842</span>
          </div>
          <div className="bg-black/40 rounded-lg p-3 border border-white/5 hover:border-blue-500/30 hover:shadow-[0_0_15px_rgba(96,165,250,0.1)] transition-all flex flex-col items-center justify-center text-center group">
            <Users className="w-4 h-4 text-blue-400 mb-2 group-hover:drop-shadow-[0_0_5px_currentColor]" />
            <span className="text-[9px] text-gray-400 font-inter uppercase tracking-widest mb-1">Active Nodes</span>
            <span className="text-lg font-orbitron font-bold text-white group-hover:text-blue-400 transition-colors">312</span>
          </div>
          <div className="bg-black/40 rounded-lg p-3 border border-white/5 hover:border-sage-500/30 hover:shadow-[0_0_15px_rgba(0,255,157,0.1)] transition-all flex flex-col items-center justify-center text-center group">
            <TrendingUp className="w-4 h-4 text-sage-400 mb-2 group-hover:drop-shadow-[0_0_5px_currentColor]" />
            <span className="text-[9px] text-gray-400 font-inter uppercase tracking-widest mb-1">Accuracy</span>
            <span className="text-lg font-orbitron font-bold text-sage-400 group-hover:drop-shadow-[0_0_8px_currentColor]">94.2%</span>
          </div>
        </div>
      </div>

      {/* Live Scam Keywords */}
      <div className="bg-gradient-to-br from-[#0f172a]/80 to-[#020617]/80 backdrop-blur-md rounded-xl border border-white/5 p-5 shadow-lg relative overflow-hidden flex-1 flex flex-col mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.6)]" />
          <h3 className="font-orbitron font-bold text-white tracking-wide text-sm">Live Scam Keywords</h3>
        </div>
        
        <div className="relative w-full flex-1 flex flex-wrap gap-2 content-start pt-2">
          {SCAM_KEYWORDS.map((word, idx) => (
            <motion.span
              key={idx}
              animate={{
                y: [0, -3, 0, 3, 0],
                x: [0, 2, 0, -2, 0]
              }}
              transition={{
                duration: 5 + (idx % 3),
                repeat: Infinity,
                ease: "easeInOut",
                delay: idx * 0.2
              }}
              className="px-2.5 py-1.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-inter text-gray-400 hover:text-sage-400 hover:bg-sage-500/10 hover:border-sage-500/30 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.5)] cursor-default hover:shadow-[0_0_10px_rgba(0,255,157,0.2)]"
            >
              {word}
            </motion.span>
          ))}
        </div>
      </div>
      
    </div>
  );
}
