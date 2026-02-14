import React from 'react';
import { motion } from 'motion/react';

export const Hero = () => {
  return (
    <section className="relative pt-40 pb-20 px-8 md:px-16 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="font-sans text-[10px] uppercase tracking-[0.4em] text-white/40 mb-6">
          Established for the future
        </h2>
        <h1 className="font-serif italic text-5xl md:text-7xl lg:text-8xl text-white mb-8 leading-[1.1] tracking-tight">
          Save with <br /> 
          <span className="not-italic text-white/20">intention.</span>
        </h1>
        <p className="max-w-xl mx-auto font-sans text-sm md:text-base text-white/50 leading-relaxed tracking-wide font-light">
          A disciplined environment for students who seek clarity, growth, and the quiet confidence of financial maturity.
        </p>
      </motion.div>
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-white/5 rounded-[100%] blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[300px] h-[300px] bg-white/[0.02] rounded-full blur-[100px] -z-10 pointer-events-none" />
    </section>
  );
};
