import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MailWarning, Link2, ScanFace, Mic, Video, Terminal, Unlock, MessageSquareWarning } from 'lucide-react';
import FeatureCard from '../components/FeatureCard';

const FEATURES = [
  { id: 1, title: 'SMS & Chat Shield', description: 'NLP-driven analysis to identify malicious smishing and chat-based attacks instantly.', icon: MessageSquareWarning, color: '#00FFFF' },
  { id: 2, title: 'Email Phishing Defense', description: 'Advanced heuristic scanning to detect BEC and sophisticated email phishing campaigns.', icon: MailWarning, color: '#FF8A00' },
  { id: 3, title: 'Malicious URL Scanner', description: 'Deep lexical and structural analysis verifying the authenticity of high-risk domains and links.', icon: Link2, color: '#00FF9D' },
  { id: 4, title: 'Image Manipulation Detection', description: 'Advanced spatial anomaly tracing to identify AI-generated images and visual identity fraud.', icon: ScanFace, color: '#B026FF' },
  { id: 5, title: 'Acoustic Audio Deepfakes', description: 'Neural MFCC feature extraction designed to spot AI-cloned voices and synthetic audio fraud.', icon: Mic, color: '#FF007F' },
  { id: 6, title: 'Video & Stream Tracing', description: 'Spatio-temporal frame sequencing to catch deepfakes and advanced visual tampering in media.', icon: Video, color: '#0066FF' },
  { id: 7, title: 'Prompt Injection Firewall', description: 'Real-time LLM input defense identifying intentional semantic payload manipulations.', icon: Terminal, color: '#FFD700' },
  { id: 8, title: 'Jailbreak Neutralization', description: 'Detects and mitigates heuristic bypass behaviors engineered to break foundational AI safety limits.', icon: Unlock, color: '#FF003C' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1, y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 20 }
  }
};

export default function Features() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section className="relative py-24 px-4 bg-cyber-dark z-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-white mb-4 drop-shadow-[0_0_15px_rgba(0,255,157,0.2)]">Core Defenses</h2>
          <p className="text-sage-400 font-inter text-lg">Multi-modal neural protection across all digital vectors.</p>
        </div>

        <motion.div 
          ref={containerRef}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 justify-center"
        >
          {FEATURES.map((feature) => (
             <motion.div key={feature.id} variants={cardVariants} className="w-full"> 
               <FeatureCard {...feature} />
             </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
