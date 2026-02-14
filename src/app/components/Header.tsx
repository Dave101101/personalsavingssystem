import React from 'react';
import { motion } from 'motion/react';
import { Shield, Menu } from 'lucide-react';

export const Header = () => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 md:px-16"
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
          <Shield className="w-4 h-4 text-black" />
        </div>
        <span className="font-serif text-xl tracking-widest uppercase text-white/90">Aura</span>
      </div>
      
      <nav className="hidden md:flex items-center gap-12 text-[11px] uppercase tracking-[0.2em] text-white/50 font-sans">
        <a href="#" className="hover:text-white transition-colors">Private</a>
        <a href="#" className="hover:text-white transition-colors">Vault</a>
        <a href="#" className="hover:text-white transition-colors">Growth</a>
        <a href="#" className="hover:text-white transition-colors">Access</a>
      </nav>

      <div className="flex items-center gap-6">
        <button className="text-white/80 hover:text-white transition-colors">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </motion.header>
  );
};
