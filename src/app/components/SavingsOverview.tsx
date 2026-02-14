import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from './GlassCard';
import { ChevronRight, Calendar, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

export const SavingsOverview = () => {
  const [target, setTarget] = useState(50);
  const [period, setPeriod] = useState<'daily' | 'weekly'>('daily');
  
  const savedAmount = 2450;
  const goalAmount = 5000;
  const progress = (savedAmount / goalAmount) * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-8 md:px-16 max-w-7xl mx-auto">
      {/* Main Progress Card */}
      <GlassCard className="lg:col-span-8 p-12" hover={false}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2 block">Current Progress</span>
            <h3 className="font-serif text-4xl text-white">Academic Reserve</h3>
            <p className="font-sans text-[10px] text-white/20 uppercase tracking-widest mt-2">Tier: Platinum Student</p>
          </div>
          <div className="text-right">
            <span className="font-sans text-xs text-white/40 block mb-1">Target Completion</span>
            <span className="font-sans text-xl text-white tracking-tighter">Sept 2026</span>
          </div>
        </div>

        <div className="relative h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-8">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-white/20 to-white/80"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-white/30 block mb-2">Saved</span>
            <span className="font-sans text-2xl text-white tracking-tight">${savedAmount.toLocaleString()}</span>
          </div>
          <div>
            <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-white/30 block mb-2">Goal</span>
            <span className="font-sans text-2xl text-white/60 tracking-tight">${goalAmount.toLocaleString()}</span>
          </div>
          <div>
            <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-white/30 block mb-2">Remaining</span>
            <span className="font-sans text-2xl text-white/60 tracking-tight">${(goalAmount - savedAmount).toLocaleString()}</span>
          </div>
          <div>
            <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-white/30 block mb-2">Growth</span>
            <span className="font-sans text-2xl text-white tracking-tight text-emerald-400/80">+12%</span>
          </div>
        </div>
      </GlassCard>

      {/* Target Setting Card */}
      <GlassCard className="lg:col-span-4 p-10 flex flex-col justify-between">
        <div>
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-white/40 mb-8 block">Discipline Engine</span>
          
          <div className="flex gap-2 mb-10 bg-white/5 p-1 rounded-full w-fit">
            <button 
              onClick={() => setPeriod('daily')}
              className={cn(
                "px-4 py-1.5 rounded-full text-[10px] uppercase tracking-wider transition-all duration-500",
                period === 'daily' ? "bg-white text-black" : "text-white/40 hover:text-white"
              )}
            >
              Daily
            </button>
            <button 
              onClick={() => setPeriod('weekly')}
              className={cn(
                "px-4 py-1.5 rounded-full text-[10px] uppercase tracking-wider transition-all duration-500",
                period === 'weekly' ? "bg-white text-black" : "text-white/40 hover:text-white"
              )}
            >
              Weekly
            </button>
          </div>

          <div className="mb-8">
            <span className="font-sans text-xs text-white/30 block mb-4">Set your commitment</span>
            <div className="flex items-end gap-2">
              <span className="font-serif text-5xl text-white">${target}</span>
              <span className="font-sans text-sm text-white/40 mb-2">/ {period}</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="500" 
              step="10"
              value={target}
              onChange={(e) => setTarget(parseInt(e.target.value))}
              className="w-full mt-6 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white"
            />
          </div>
        </div>

        <button className="w-full py-4 rounded-xl bg-white text-black font-sans text-[11px] uppercase tracking-[0.2em] hover:bg-white/90 transition-all flex items-center justify-center gap-2 group">
          Adjust Commitment
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </GlassCard>
    </div>
  );
};
