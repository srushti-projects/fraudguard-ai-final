import React from 'react';
import { Brain, AlertOctagon, Map, ChevronRight, AlertTriangle, Link2, Mail, Landmark } from 'lucide-react';
import { motion } from 'framer-motion';

const INSIGHTS = [
  { icon: AlertTriangle, text: "78% of scams use urgency keywords", value: 78, color: "text-yellow-400", bg: "bg-yellow-400", shadow: "shadow-[0_0_10px_rgba(250,204,21,0.8)]" },
  { icon: Link2, text: "65% malicious URLs mimic payments", value: 65, color: "text-red-400", bg: "bg-red-400", shadow: "shadow-[0_0_10px_rgba(248,113,113,0.8)]" },
  { icon: Mail, text: "Email scams increased 23% today", value: 23, color: "text-orange-400", bg: "bg-orange-400", shadow: "shadow-[0_0_10px_rgba(251,146,60,0.8)]" },
  { icon: Landmark, text: "Most targeted category: Banking", value: 100, color: "text-blue-400", bg: "bg-blue-400", shadow: "shadow-[0_0_10px_rgba(96,165,250,0.8)]" }
];

export default function RightSidebar() {
  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* AI Insights Card */}
      <div className="bg-gradient-to-br from-[#0f172a]/80 to-[#020617]/80 backdrop-blur-md rounded-xl border border-white/5 p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-5">
          <Brain className="w-5 h-5 text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.6)] animate-pulse" />
          <h3 className="font-orbitron font-bold text-white tracking-wide">AI Insights</h3>
        </div>
        
        <div className="flex flex-col gap-5">
          {INSIGHTS.map((insight, idx) => {
            const Icon = insight.icon;
            return (
              <div key={idx} className="flex flex-col gap-2 group">
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-md bg-black/40 border border-white/5 ${insight.color} transition-colors group-hover:bg-white/5`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-inter text-xs text-gray-300 leading-tight flex-1">{insight.text}</span>
                </div>
                <div className="w-full bg-black/60 rounded-full h-1.5 overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${insight.value}%` }}
                    transition={{ duration: 1.5, delay: idx * 0.2, ease: "easeOut" }}
                    className={`h-full rounded-full ${insight.bg} ${insight.shadow}`} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scam of the Day */}
      <div className="bg-gradient-to-br from-[#0f172a]/80 to-[#020617]/80 backdrop-blur-xl rounded-xl p-5 shadow-[0_0_20px_rgba(239,68,68,0.1)] relative overflow-hidden flex flex-col transition-all hover:shadow-[0_0_30px_rgba(239,68,68,0.15)]" style={{
        boxShadow: "inset 0 0 20px rgba(239,68,68,0.05)",
        border: "1px solid rgba(239,68,68,0.3)"
      }}>
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/20 rounded-full blur-[50px] pointer-events-none" />

        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse" />
            <h3 className="font-orbitron font-bold text-white tracking-wide text-sm">Scam of the Day</h3>
          </div>
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/50 shadow-[0_0_8px_rgba(239,68,68,0.5)] tracking-wider">HIGH</span>
        </div>
        
        <div className="bg-black/40 p-3 rounded-lg border border-red-500/20 mb-4 relative z-10">
          <p className="font-inter text-xs text-gray-200 font-medium italic">
            "Fake courier message asking for delivery fee via an SMS link."
          </p>
        </div>
        
        <div className="flex flex-col gap-2 mb-5 relative z-10">
          <span className="text-[10px] uppercase font-bold text-red-400 tracking-wider">Red Flags:</span>
          <div className="border-l-2 border-red-500/30 pl-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-gray-300 font-inter">• Urgent payment request</span>
            <span className="text-[11px] text-gray-300 font-inter">• Suspicious URL format</span>
            <span className="text-[11px] text-gray-300 font-inter">• Unknown sender ID</span>
          </div>
        </div>
        
        <button className="relative z-10 w-full py-2.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-orbitron font-bold hover:bg-red-500 text-white transition-all border border-red-500/30 flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(239,68,68,0.6)]">
          Learn More <ChevronRight className="w-3 h-3" />
        </button>
      </div>
      
    </div>
  );
}
