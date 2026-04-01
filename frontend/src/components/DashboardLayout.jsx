import React, { useState } from 'react';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import { Menu, Info, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function DashboardLayout({ children }) {
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);

  return (
    <div className="w-full flex justify-center max-w-[1500px] 2xl:max-w-[1700px] mx-auto relative px-4 xl:px-8 gap-8 items-start z-20">
      
      {/* Mobile Toggles */}
      <div className="xl:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-4 bg-[#0f172a]/90 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
        <button onClick={() => setLeftOpen(true)} className="flex items-center gap-2 text-sage-400 hover:text-white transition-colors">
          <Menu className="w-5 h-5" />
          <span className="text-xs font-orbitron font-bold uppercase tracking-wider">Network</span>
        </button>
        <div className="w-px h-6 bg-white/20" />
        <button onClick={() => setRightOpen(true)} className="flex items-center gap-2 text-blue-400 hover:text-white transition-colors">
          <span className="text-xs font-orbitron font-bold uppercase tracking-wider">Intel</span>
          <Info className="w-5 h-5" />
        </button>
      </div>

      {/* Left Drawer Mobile */}
      <AnimatePresence>
        {leftOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm xl:hidden"
            onClick={() => setLeftOpen(false)}
          >
            <motion.div 
              initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="absolute left-0 top-0 bottom-0 w-[280px] sm:w-[320px] bg-[#020617] border-r border-white/10 p-6 overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <span className="text-sage-400 font-orbitron font-bold tracking-widest">NETWORK</span>
                <button onClick={() => setLeftOpen(false)} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
              </div>
              <LeftSidebar />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right Drawer Mobile */}
      <AnimatePresence>
        {rightOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm xl:hidden"
            onClick={() => setRightOpen(false)}
          >
            <motion.div 
              initial={{ x: 300 }} animate={{ x: 0 }} exit={{ x: 300 }} transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="absolute right-0 top-0 bottom-0 w-[320px] sm:w-[360px] bg-[#020617] border-l border-white/10 p-6 overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <span className="text-blue-400 font-orbitron font-bold tracking-widest">INTEL</span>
                <button onClick={() => setRightOpen(false)} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
              </div>
              <RightSidebar />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Left Sidebar: Fixed Width, 100vh Height, Sticky, No Scroll */}
      <div className="hidden xl:flex flex-col w-[280px] shrink-0 sticky top-0 h-screen overflow-hidden pt-28 pb-10">
        <LeftSidebar />
      </div>

      {/* Center Main Content: 100vh Height, Auto Vertical Scroll */}
      <main className="w-full flex-1 max-w-[750px] mx-auto flex flex-col h-screen overflow-y-auto pt-28 pb-24">
        {children}
      </main>

      {/* Desktop Right Sidebar: Fixed Width, 100vh Height, Sticky, No Scroll */}
      <div className="hidden xl:flex flex-col w-[320px] shrink-0 sticky top-0 h-screen overflow-hidden pt-28 pb-10">
        <RightSidebar />
      </div>
      
    </div>
  );
}
