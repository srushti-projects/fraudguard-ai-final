import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, User, Mail, Phone, Calendar, ShieldCheck, Activity, Edit3 } from 'lucide-react';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState('https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&q=80&w=200');

  const handleImageChange = (e) => {
    // Dummy image change simulation
    setProfilePic('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200');
  };

  return (
    <div className="pt-32 pb-24 px-6 mx-auto max-w-5xl min-h-[calc(100vh-80px)] flex relative z-10 w-full justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 self-start"
      >
        {/* Left Column: Profile Core Info */}
        <div className="md:col-span-1 flex flex-col gap-8">
          <div className="glass-panel bg-cyber-dark/80 backdrop-blur-xl border border-sage-500/30 rounded-2xl shadow-[0_0_50px_rgba(0,255,157,0.1)] p-8 relative overflow-hidden group flex flex-col items-center">
            {/* Top glowing line */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-sage-400 to-transparent opacity-50 shadow-[0_0_15px_rgba(0,255,157,0.8)]" />
            
            {/* Profile Image */}
            <div className="relative w-32 h-32 rounded-full border border-sage-500/50 shadow-[0_0_20px_rgba(0,255,157,0.1)] group-hover:border-sage-400 group-hover:shadow-[0_0_30px_rgba(0,255,157,0.3)] transition-all duration-500 flex items-center justify-center bg-transparent mb-6">
              <img src={profilePic} alt="Profile" className="w-full h-full object-cover rounded-full" />
              <label className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-10 h-10 flex items-center justify-center bg-sage-500 text-black rounded-full cursor-pointer hover:bg-sage-400 hover:scale-110 shadow-[0_0_15px_rgba(0,255,157,0.5)] transition-all duration-300 border-[3px] border-cyber-dark group/cam">
                <Camera className="w-5 h-5 group-hover/cam:scale-110 transition-transform" />
                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
              </label>
            </div>

            {/* Name & Badge */}
            <h2 className="text-3xl font-orbitron font-bold text-white tracking-wide drop-shadow-[0_0_10px_rgba(255,255,255,0.4)] leading-none text-center">AdminGuardian</h2>
            <p className="text-sage-400 font-inter text-sm font-medium tracking-wide mt-3 mb-8 flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Level 5 Sentinel
            </p>

            {/* Edit Button */}
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="w-full py-3.5 mb-8 rounded-xl bg-white/5 border border-white/10 hover:border-sage-500/50 hover:bg-sage-500/10 hover:shadow-[0_0_20px_rgba(0,255,157,0.2)] text-sage-300 hover:text-white font-orbitron text-xs tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 active:scale-95"
            >
              <Edit3 className="w-4 h-4" />
              {isEditing ? 'Save Profile' : 'Edit Profile'}
            </button>

            {/* Info Section Rows */}
            <div className="w-full flex flex-col gap-6">
              <div className="flex items-center gap-4 w-full">
                <div className="bg-white/5 p-3 rounded-xl border border-white/10 shrink-0 hover:border-sage-500/50 transition-colors">
                   <Mail className="w-5 h-5 text-sage-400" />
                </div>
                <div className="flex flex-col flex-1 justify-center">
                  <p className="text-gray-500 text-[10px] font-orbitron tracking-widest uppercase leading-tight mb-1">Email</p>
                  <p className="text-gray-100 text-sm font-medium leading-none">admin@fraudguard.net</p>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full">
                <div className="bg-white/5 p-3 rounded-xl border border-white/10 shrink-0 hover:border-sage-500/50 transition-colors">
                   <Phone className="w-5 h-5 text-sage-400" />
                </div>
                <div className="flex flex-col flex-1 justify-center">
                  <p className="text-gray-500 text-[10px] font-orbitron tracking-widest uppercase leading-tight mb-1">Phone</p>
                  <p className="text-gray-100 text-sm font-medium leading-none">+1 (555) 019-8372</p>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full">
                <div className="bg-white/5 p-3 rounded-xl border border-white/10 shrink-0 hover:border-sage-500/50 transition-colors">
                   <Calendar className="w-5 h-5 text-sage-400" />
                </div>
                <div className="flex flex-col flex-1 justify-center">
                  <p className="text-gray-500 text-[10px] font-orbitron tracking-widest uppercase leading-tight mb-1">Joined</p>
                  <p className="text-gray-100 text-sm font-medium leading-none">October 2025</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Stats & Bio */}
        <div className="md:col-span-2 flex flex-col gap-8">
          
          {/* Top Card: Operator Bio & Trust Score */}
          <div className="glass-panel bg-cyber-dark/80 backdrop-blur-xl border border-sage-500/30 rounded-2xl shadow-[0_0_50px_rgba(0,255,157,0.1)] p-8 relative overflow-hidden flex flex-col gap-8 group">
             {/* Decorative Background Glow */}
             <div className="absolute -top-32 -right-32 w-96 h-96 bg-sage-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-sage-500/10 transition-colors duration-1000" />
             
             {/* Bio Block */}
             <div className="w-full flex flex-col gap-4">
               <h3 className="font-orbitron font-bold text-xl text-white tracking-wider flex items-center gap-3 drop-shadow-[0_0_5px_rgba(0,255,157,0.2)]">
                 <User className="w-5 h-5 text-sage-400" /> Operator Bio
               </h3>
               <p className="text-gray-400 font-inter text-sm leading-relaxed max-w-2xl">
                 Senior threat analyst reporting from the frontlines. Dedicated to reverse-engineering deceptive architectures and providing actionable intelligence to the FraudGuard neural network. Current focus: SMS-based payload delivery systems.
               </p>
             </div>

             {/* Score Block */}
             <div className="w-full bg-black/40 border border-white/5 rounded-2xl p-6 shadow-inner flex flex-col gap-5">
                <div className="flex items-center justify-between w-full">
                  <h3 className="font-orbitron font-bold text-lg text-white tracking-wider">Trust Score</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="font-orbitron font-black text-3xl text-sage-400 drop-shadow-[0_0_10px_rgba(0,255,157,0.8)]">78</span>
                    <span className="font-orbitron text-gray-500 text-lg">/100</span>
                  </div>
                </div>
                <div className="w-full bg-black/80 rounded-full h-3 border border-white/10 overflow-hidden relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "78%" }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                    className="h-full rounded-full relative bg-gradient-to-r from-[#00cc7d] to-sage-400 border border-sage-400/50 shadow-[0_0_15px_rgba(0,255,157,0.6)]"
                  />
                </div>
                <p className="text-gray-500 font-inter text-xs flex items-center gap-2">
                  <Activity className="w-4 h-4 text-sage-400 opacity-60" />
                  Based on report accuracy and community validation.
                </p>
             </div>
          </div>

          {/* Bottom Card: My Activity Section */}
          <div className="glass-panel bg-cyber-dark/80 backdrop-blur-xl border border-sage-500/30 rounded-2xl shadow-[0_0_50px_rgba(0,255,157,0.1)] p-8 relative overflow-hidden flex-1 flex flex-col gap-6 group hover:border-sage-500/50 transition-colors duration-500">
             <h3 className="font-orbitron font-bold text-xl text-white tracking-wider flex items-center gap-3 drop-shadow-[0_0_5px_rgba(0,255,157,0.2)]">
               <Activity className="w-5 h-5 text-sage-400 group-hover:animate-pulse" /> Recent Intel Activity
             </h3>
             
             <div className="w-full flex-1 flex flex-col gap-4">
                {[
                  { title: "Reported 'UPS Delivery' SMS Scam", time: "2 hours ago", points: "+15 XP" },
                  { title: "Validated Community Threat #892", time: "1 day ago", points: "+5 XP" },
                  { title: "Achieved 'Level 5 Sentinel' Rank", time: "1 week ago", points: "Milestone" }
                ].map((item, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + (i * 0.1) }}
                    key={i} 
                    className="w-full flex justify-between items-center p-5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-sage-500/30 transition-all cursor-pointer shadow-sm"
                  >
                    <div className="flex flex-col gap-1.5">
                      <span className="font-inter font-medium text-gray-200 text-sm leading-none">{item.title}</span>
                      <span className="font-inter text-xs text-sage-500/80 leading-none">{item.time}</span>
                    </div>
                    <span className="shrink-0 font-orbitron font-bold text-xs text-sage-400 bg-sage-500/10 px-4 py-2 rounded-full border border-sage-500/20 shadow-[0_0_10px_rgba(0,255,157,0.1)] hover:scale-105 transition-transform">
                      {item.points}
                    </span>
                  </motion.div>
                ))}
             </div>

             <button className="w-full py-4 mt-2 rounded-xl border border-white/10 bg-transparent text-gray-400 font-orbitron font-semibold text-xs tracking-widest uppercase hover:bg-white/5 hover:text-white hover:border-white/20 transition-all active:scale-[0.98]">
               View Full Matrix
             </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
