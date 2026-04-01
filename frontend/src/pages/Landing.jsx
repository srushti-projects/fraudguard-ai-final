import React from 'react';
import { motion } from 'framer-motion';
import Hero from '../sections/Hero';
import Features from '../sections/Features';
import CTA from '../sections/CTA';
import BackgroundTypingEffect from '../components/BackgroundTypingEffect';

export default function Landing() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col w-full"
    >
      <BackgroundTypingEffect />
      <Hero />
      <Features />
      <CTA />
    </motion.div>
  );
}
