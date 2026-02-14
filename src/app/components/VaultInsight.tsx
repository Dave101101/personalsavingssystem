import React from 'react';
import { GlassCard } from './GlassCard';
import { Lock, EyeOff, ShieldCheck, ArrowDownRight } from 'lucide-react';

export const VaultInsight = () => {
  const transactions = [
    { label: 'Standard Essentials', amount: 42.50, date: 'Today' },
    { label: 'Campus Services', amount: 12.00, date: 'Yesterday' },
    { label: 'Library Access', amount: 5.00, date: 'Feb 3' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-8 md:px-16 max-w-7xl mx-auto py-20">
      <GlassCard className="p-10">
        <div className="flex justify-between items-center mb-10">
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-white/40">Spending Awareness</span>
          <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <span className="text-[9px] text-emerald-400 uppercase tracking-widest font-medium">Safe Zone</span>
          </div>
        </div>
        
        <div className="space-y-6">
          {transactions.map((t, i) => (
            <div key={i} className="flex justify-between items-center pb-6 border-b border-white/5 last:border-0 last:pb-0">
              <div>
                <span className="font-sans text-sm text-white/80 block">{t.label}</span>
                <span className="font-sans text-[10px] text-white/30 uppercase tracking-tighter">{t.date}</span>
              </div>
              <div className="text-right">
                <span className="font-sans text-sm text-white/60 tracking-tight">-${t.amount.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <ArrowDownRight className="w-4 h-4 text-white/60" />
          </div>
          <div>
            <span className="font-sans text-[11px] text-white/40 block">Remaining Allowance</span>
            <span className="font-sans text-lg text-white font-light">$240.00 <span className="text-white/20 text-sm italic">until Monday</span></span>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-10 flex flex-col justify-between">
        <div>
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-white/40 mb-10 block">Security & Trust</span>
          
          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                <Lock className="w-5 h-5 text-white/60" />
              </div>
              <div>
                <h4 className="font-sans text-sm text-white mb-1">Encrypted Vault</h4>
                <p className="font-sans text-xs text-white/40 leading-relaxed font-light">Your savings are protected by institutional-grade encryption, ensuring your financial privacy remains absolute.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                <EyeOff className="w-5 h-5 text-white/60" />
              </div>
              <div>
                <h4 className="font-sans text-sm text-white mb-1">Discrete Analytics</h4>
                <p className="font-sans text-xs text-white/40 leading-relaxed font-light">We focus on growth, not noise. No intrusive trackers, just clear, calm progress towards your goals.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                <ShieldCheck className="w-5 h-5 text-white/60" />
              </div>
              <div>
                <h4 className="font-sans text-sm text-white mb-1">FIPC Insured</h4>
                <p className="font-sans text-xs text-white/40 leading-relaxed font-light">Your assets are backed by the highest standards of financial security and insurance protocols.</p>
              </div>
            </div>
          </div>
        </div>

        <p className="font-serif italic text-white/20 text-sm mt-12">
          "Discipline is the highest form of self-care."
        </p>
      </GlassCard>
    </div>
  );
};
