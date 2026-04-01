import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, MessageSquare, Mail, Link as LinkIcon, Image as ImageIcon, Mic, Video, Terminal, AlertOctagon } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, XAxis, Tooltip, YAxis, CartesianGrid } from 'recharts';
import { API_ROUTES } from '../config/api';

const CONFIG = {
  sms: { label: 'SMS/Chat', icon: MessageSquare, color: '#22d3ee' }, // Cyan
  email: { label: 'Phishing Email', icon: Mail, color: '#fb923c' }, // Orange
  url: { label: 'Malicious URL', icon: LinkIcon, color: '#4ade80' }, // Green
  image: { label: 'Deepfake Image', icon: ImageIcon, color: '#c084fc' }, // Purple
  audio: { label: 'Audio Scam', icon: Mic, color: '#f472b6' }, // Pink
  video: { label: 'Video Deepfake', icon: Video, color: '#60a5fa' }, // Blue
  prompt: { label: 'Prompt Injection', icon: Terminal, color: '#facc15' }, // Yellow
  jailbreak: { label: 'Jailbreak', icon: AlertOctagon, color: '#f87171' } // Red
};

const CustomChartTooltip = ({ active, payload, label, node }) => {
  if (active && payload && payload.length) {
    let changePct = 0;
    if (payload[0].payload.v > 0) {
      // Calculate a pseudo % change just for UI detail
      changePct = ((payload[0].value - 10) / 10).toFixed(1);
    }
    return (
      <div className="glass-panel bg-cyber-dark/95 border border-white/10 p-3 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.8)] font-orbitron text-xs z-50 relative">
        <p className="text-gray-400 mb-1">{label} ({node.label})</p>
        <p className="font-bold text-white tracking-wider flex items-center justify-between gap-4">
          <span>Vol: <span style={{ color: node.color, textShadow: `0 0 10px ${node.color}` }}>{payload[0].value}</span></span>
          <span className="text-gray-500 font-inter text-[10px]">Δ {changePct}%</span>
        </p>
      </div>
    );
  }
  return null;
};

// Simple hook for counting animation
const useAnimatedNumber = (value, duration = 1000) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let startTimestamp = null;
    const startValue = displayValue;
    const endValue = value;
    
    if (startValue === endValue) return;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // easeOutQuart
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(Math.floor(startValue + (endValue - startValue) * easeProgress));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(endValue);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [value, duration]);

  return displayValue;
};

const AnimatedCount = ({ value }) => {
  const animatedValue = useAnimatedNumber(value);
  return <>{animatedValue}</>;
};

export default function Dashboard() {
  const [trends, setTrends] = useState({});
  const [dataSource, setDataSource] = useState('community');

  useEffect(() => {
    const endpoint = dataSource === 'community' 
      ? API_ROUTES.trends
      : API_ROUTES.redditTrends;

    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
         // Sort to ensure all 8 appear in a consistent predictable order based on CONFIG
         const finalTrends = {};
         Object.keys(CONFIG).forEach(k => {
           if(data[k]) finalTrends[k] = data[k];
         });
         setTrends(finalTrends);
      })
      .catch(err => console.error("Error fetching live trends:", err));
  }, [dataSource]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col w-full min-h-screen pt-28 px-6 pb-16 relative overflow-hidden"
    >
      {/* Background Floating Grid/Particles (Visual Depth) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative w-full max-w-7xl mx-auto z-10 flex flex-col gap-8">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 bg-black/40 p-6 rounded-2xl glass-panel border border-white/5 shadow-xl">
          <div>
            <h1 className="text-4xl font-orbitron font-bold text-white tracking-wider drop-shadow-lg flex items-center gap-3">
              <Activity className="w-8 h-8 text-green-400" /> Live Scam Trends
            </h1>
            <p className="font-inter text-gray-400 mt-2 text-sm tracking-wide max-w-lg">
              Real-time threat insights aggregated seamlessly from global ML scans and community reporting endpoints.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Segmented Toggle Control */}
            <div className="flex items-center bg-black/50 border border-white/10 rounded-xl p-1 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
              <button
                onClick={() => setDataSource('community')}
                className={`relative px-4 py-1.5 rounded-lg font-orbitron font-semibold text-xs tracking-wider transition-all duration-300 z-10 ${
                  dataSource === 'community' ? 'text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                {dataSource === 'community' && (
                  <motion.div
                    layoutId="toggleHighlight"
                    initial={false}
                    animate={{ backgroundColor: '#00E68A', boxShadow: '0 0 15px rgba(0,255,157,0.5)' }}
                    className="absolute inset-0 rounded-lg -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                COMMUNITY
              </button>
              <button
                onClick={() => setDataSource('reddit')}
                className={`relative px-5 py-1.5 rounded-lg font-orbitron font-semibold text-xs tracking-wider transition-all duration-300 z-10 ${
                  dataSource === 'reddit' ? 'text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                {dataSource === 'reddit' && (
                  <motion.div
                    layoutId="toggleHighlight"
                    initial={false}
                    animate={{ backgroundColor: '#00E68A', boxShadow: '0 0 15px rgba(0,255,157,0.5)' }}
                    className="absolute inset-0 rounded-lg -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                REDDIT
              </button>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-black/50 border border-green-500/30 rounded-lg">
               <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="font-orbitron font-semibold text-xs text-green-400 tracking-widest uppercase">System Online</span>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.keys(trends).length === 0 ? (
            <div className="col-span-full h-64 flex items-center justify-center font-orbitron text-sage-400 animate-pulse">
              Syncing Threat Telemetry...
            </div>
          ) : (
            Object.keys(trends).map(key => {
              const data = trends[key];
              const node = CONFIG[key] || { label: key, icon: Activity, color: '#fff' };
              const Icon = node.icon;

              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 100 }}
                  key={key}
                  className="glass-panel backdrop-blur-xl rounded-2xl p-5 border shadow-md bg-cyber-dark/60 group hover:bg-black/60 transition-all duration-300"
                  style={{ borderColor: `rgba(255,255,255,0.05)`, borderTopColor: node.color }}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-4 border-b border-white/5 pb-3 relative">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-black/40 border border-white/5 transition-transform duration-300" style={{ boxShadow: `0 0 10px ${node.color}10` }}>
                        <Icon className="w-5 h-5" style={{ color: node.color }} />
                      </div>
                      <div>
                        <h3 className="font-orbitron font-bold text-sm text-white tracking-widest uppercase">{node.label}</h3>
                        <p className="font-inter text-[10px] text-gray-500 tracking-widest mt-0.5 line-clamp-1" dangerouslySetInnerHTML={{ __html: data.insight }} />
                      </div>
                    </div>
                    {/* Exceedingly subtle source label overlay */}
                    <AnimatePresence mode="wait">
                      <motion.span 
                        key={dataSource} 
                        initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} 
                        className="absolute right-0 top-0 text-[8px] font-orbitron uppercase text-white/20 tracking-widest"
                      >
                        {dataSource}
                      </motion.span>
                    </AnimatePresence>
                  </div>

                  <div className="mb-2">
                    <div className="font-orbitron font-bold text-xl text-white tracking-wider" style={{ textShadow: `0 0 5px ${node.color}30` }}>
                      <AnimatedCount value={data.count} /> <span className="text-[10px] text-gray-500 tracking-widest uppercase font-inter">Scans</span>
                    </div>
                  </div>

                  {/* Chart UI Container */}
                  <div className="w-full h-[100px] relative mt-1 group-hover:scale-[1.01] transition-transform duration-500">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data.data} margin={{ top: 5, right: 0, bottom: 0, left: -25 }}>
                        <defs>
                          <linearGradient id={`lineGradient-${key}`} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={node.color} stopOpacity={0.15} />
                            <stop offset="100%" stopColor={node.color} stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="rgba(255,255,255,0.02)" strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                          dataKey="name" 
                          stroke="transparent" 
                          tick={false} 
                        />
                        <YAxis 
                          stroke="transparent" 
                          tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 9, fontFamily: 'monospace' }} 
                        />
                        <Tooltip 
                          content={<CustomChartTooltip node={node} />} 
                          cursor={{ fill: 'transparent', stroke: 'rgba(255,255,255,0.05)', strokeWidth: 1 }} 
                        />
                        <Line 
                          type="linear" 
                          dataKey="v" 
                          stroke={node.color} 
                          strokeWidth={1.5} 
                          dot={false}
                          activeDot={{ fill: '#fff', stroke: node.color, strokeWidth: 1.5, r: 3 }}
                          isAnimationActive={true}
                          animationDuration={600}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </motion.div>
  );
}
