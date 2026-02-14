import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  ArrowUpRight, 
  Globe, 
  PieChart, 
  Wallet, 
  ShieldCheck, 
  ChevronRight,
  Info,
  DollarSign,
  Briefcase,
  X,
  User,
  Crown,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';

export const Investments = () => {
  const { user, updateUser } = useApp();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({ name: user.name, age: '25', savingsGoal: '1000000' });

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name: profileData.name,
      age: parseInt(profileData.age),
      savingsGoal: parseInt(profileData.savingsGoal)
    });
    setShowProfileModal(false);
    toast.success("Client profile synchronized.");
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-serif italic text-blue-900 tracking-tight">Marketplace</h1>
          <p className="text-blue-600 text-xs tracking-[0.1em] font-light italic">Strategic capital allocation for <span className="text-blue-900 font-bold">{user.name}</span></p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-6 py-3 rounded-full flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] shadow-md">
          <TrendingUp className="w-4 h-4" />
          +14.8% Global Yield
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Portfolio Composition */}
          <div className="bg-white border border-blue-200 rounded-[3rem] p-12 relative overflow-hidden group shadow-lg">
            <div className="flex justify-between items-center mb-12">
              <div className="flex items-center gap-3">
                <PieChart className="w-5 h-5 text-blue-600" />
                <h3 className="text-xl font-serif text-blue-900 italic tracking-tight">Asset Composition</h3>
              </div>
              <button 
                onClick={() => setShowProfileModal(true)}
                className="text-[10px] font-bold text-blue-600 hover:text-blue-900 transition-all uppercase tracking-[0.2em] flex items-center gap-2 group/btn"
              >
                Refine Profile <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="flex items-center gap-10">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-[2px] border-blue-200 flex items-center justify-center p-2">
                    <div className="w-full h-full rounded-full border-[3px] border-blue-600 border-t-transparent border-r-transparent animate-[spin_10s_linear_infinite]" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <p className="text-[9px] text-blue-400 font-bold uppercase tracking-widest">Ratio</p>
                    <p className="text-xl font-serif text-blue-900 italic">1.4:1</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Institutional Funds', color: 'bg-blue-600', value: '45%' },
                    { label: 'Dollar Arbitrage', color: 'bg-blue-400', value: '30%' },
                    { label: 'Emerging Equity', color: 'bg-indigo-500', value: '25%' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className={cn("w-2 h-2 rounded-full shadow-md", item.color)} />
                      <span className="text-[10px] text-blue-600 uppercase tracking-widest font-medium">{item.label} ({item.value})</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col justify-center text-right md:border-l border-blue-200 md:pl-16">
                <p className="text-[10px] text-blue-400 uppercase tracking-[0.3em] font-bold mb-2">Portfolio Valuation</p>
                <p className="text-5xl font-serif text-blue-900 italic tracking-tight">₦485,200</p>
                <div className="mt-6 flex items-center justify-end gap-2 text-emerald-600 font-bold text-[10px] uppercase tracking-widest">
                  <TrendingUp className="w-4 h-4" />
                  +₦32,150 Cycle Yield
                </div>
              </div>
            </div>
            {/* Background luxury accent */}
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-100/30 rounded-full blur-[80px]" />
          </div>

          <section className="space-y-6">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-400 px-4">Elite Instruments</h3>
            <div className="space-y-4">
              {[
                { title: 'Global Discovery Fund', type: 'Institutional', return: '+18.2%', risk: 'Strategic', color: 'bg-blue-600' },
                { title: 'Sterling Sovereign Index', type: 'Sovereign', return: '+12.4%', risk: 'Conservative', color: 'bg-indigo-600' },
                { title: 'Lagos Equity Prime', type: 'Regional', return: '+9.8%', risk: 'Dynamic', color: 'bg-blue-500' },
              ].map((inv, i) => (
                <div key={i} className="bg-white border border-blue-200 p-8 rounded-[2rem] flex items-center justify-between hover:bg-blue-50 hover:border-blue-400 transition-all duration-500 cursor-pointer group shadow-md">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-200 group-hover:bg-blue-600 group-hover:scale-105 transition-all duration-500">
                      <Briefcase className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-serif italic text-blue-900 tracking-wide">{inv.title}</h4>
                      <p className="text-[9px] text-blue-600 uppercase tracking-[0.2em] font-bold">{inv.type} Instrument</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-16">
                    <div className="text-right hidden sm:block">
                      <p className="text-emerald-600 font-serif italic text-lg">{inv.return}</p>
                      <p className="text-[9px] text-blue-400 font-bold uppercase tracking-[0.2em]">Projected</p>
                    </div>
                    <div className="text-right hidden md:block">
                      <p className="text-blue-900 font-serif italic text-lg">{inv.risk}</p>
                      <p className="text-[9px] text-blue-400 font-bold uppercase tracking-[0.2em]">Profile</p>
                    </div>
                    <button 
                      onClick={() => toast.info('Coming soon')}
                      className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center border border-blue-200 group-hover:bg-blue-600 group-hover:text-white text-blue-600 transition-all duration-500"
                    >
                      <ArrowUpRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <div className="bg-white border border-blue-200 rounded-[3rem] p-12 text-blue-900 relative overflow-hidden group shadow-lg">
            <div className="relative z-10 space-y-8">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-200">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-serif italic tracking-tight text-blue-900">Global Liquidity</h3>
                <p className="text-blue-600 text-xs font-light leading-relaxed">Hedge against local volatility by securing assets in stable currency instruments.</p>
              </div>
              <button 
                onClick={() => toast.info("Foreign exchange terminal initializing...")}
                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-blue-700 transition-all duration-500 shadow-md"
              >
                Initialize FX
              </button>
            </div>
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-100/20 rounded-full -mr-24 -mt-24 blur-3xl group-hover:bg-blue-200/30 transition-all" />
          </div>

          <div className="bg-white border border-blue-200 rounded-[3rem] p-12 space-y-10 shadow-lg">
            <div className="flex items-center gap-3">
              <Lock className="w-4 h-4 text-blue-400" />
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-400">Private Insight</h3>
            </div>
            <div className="space-y-8">
              {[
                'Strategic patience yields maximum returns.',
                'Portfolio diversity is the ultimate security.',
                'Long-horizon thinking (5+ years).',
              ].map((tip, i) => (
                <div key={i} className="flex gap-5 group/tip">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-300 mt-2 shrink-0 group-hover/tip:bg-blue-600 transition-colors shadow-md" />
                  <p className="text-xs text-blue-600 font-light leading-relaxed italic group-hover/tip:text-blue-900 transition-colors tracking-wide">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowProfileModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative glass-light w-full max-w-lg p-12 rounded-[3.5rem] border border-white/10 shadow-2xl"
            >
              <button onClick={() => setShowProfileModal(false)} className="absolute top-10 right-10 p-2 text-white/20 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
              <div className="space-y-2 mb-12">
                <div className="flex items-center gap-3">
                  <Crown className="w-5 h-5 text-white/40" />
                  <h2 className="text-3xl font-serif italic text-white tracking-tight">Client Mandate</h2>
                </div>
                <p className="text-white/30 text-xs font-light tracking-wide">Refine your strategic investment parameters.</p>
              </div>
              <form onSubmit={handleUpdateProfile} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 px-1">Legal Designation</label>
                  <input 
                    type="text" 
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-white/30 transition-all font-light"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 px-1">Seniority</label>
                    <input 
                      type="number" 
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-white/30 transition-all font-light"
                      value={profileData.age}
                      onChange={(e) => setProfileData({...profileData, age: e.target.value})}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 px-1">Growth Target</label>
                    <input 
                      type="number" 
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-white/30 transition-all font-light"
                      value={profileData.savingsGoal}
                      onChange={(e) => setProfileData({...profileData, savingsGoal: e.target.value})}
                    />
                  </div>
                </div>
                <button type="submit" className="w-full py-6 bg-white text-black rounded-2xl font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-zinc-200 transition-all duration-500">Synchronize Mandate</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};