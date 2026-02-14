import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const GlassCard = ({ children, className, hover = true }: GlassCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      whileHover={hover ? { y: -4, backgroundColor: 'rgba(255, 255, 255, 0.08)' } : {}}
      className={cn(
        "relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-2xl transition-colors duration-500 group",
        className
      )}
    >
      {/* Subtle shine effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -inset-[100%] bg-[conic-gradient(from_0deg,transparent_0,transparent_25%,white/5_50%,transparent_75%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 animate-[spin_8s_linear_infinite] pointer-events-none" />
      <div className="relative z-10 group">{children}</div>
    </motion.div>
  );
};
