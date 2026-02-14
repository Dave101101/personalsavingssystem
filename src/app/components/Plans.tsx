import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Target, 
  ShieldCheck, 
  Briefcase, 
  Home, 
  Car, 
  Heart, 
  ChevronRight,
  TrendingUp,
  X,
  Crown,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';

export const Plans = () => {
  const { plans, createPlan, user } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showGetStarted, setShowGetStarted] = useState(false);
  
  const [newPlan, setNewPlan] = useState({ name: '', target: '', color: 'bg-white' });

  const filteredPlans = plans.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlan.name || !newPlan.target) {
      toast.error("Please fill in all fields");
      return;
    }
    createPlan(newPlan.name, newPlan.target, newPlan.color);
    setShowCreateModal(false);
    setNewPlan({ name: '', target: '', color: 'bg-white' });
    toast.success("Wealth strategy initiated.");
  };

  const handleCreateEmergency = () => {
    createPlan("Stability Fund", "1000000", "bg-zinc-400");
    toast.success("Stability Fund added to portfolio.");
  };

  if (showGetStarted) {
    return (
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto">
        <button onClick={() => setShowGetStarted(false)} className="text-white/40 hover:text-white transition-colors text-[10px] uppercase tracking-[0.3em] font-bold flex items-center gap-3">
          <ArrowRight className="w-3.5 h-3.5 rotate-180" /> Return to Strategy
        </button>
        <header className="space-y-4">
          <h1 className="text-5xl font-serif italic text-white tracking-tight">Financial Legacy Blueprint</h1>
          <p className="text-white/30 text-sm font-light tracking-wide italic">Tailored wealth roadmap for {user.name}</p>
        </header>
        <div className="glass rounded-[3rem] p-16 space-y-16 border-white/5">
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-bold">Phase 01</span>
              <div className="h-[1px] flex-1 bg-white/5" />
            </div>
            <h3 className="text-3xl font-serif text-white tracking-tight italic">The Reserve Threshold</h3>
            <p className="text-white/40 text-sm leading-relaxed max-w-2xl font-light">Establish a liquid reserve equivalent to six months of luxury expenditure. This provides the psychological and financial floor necessary for aggressive market positioning.</p>
          </section>
          
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-bold">Phase 02</span>
              <div className="h-[1px] flex-1 bg-white/5" />
            </div>
            <h3 className="text-3xl font-serif text-white tracking-tight italic">Portfolio Diversification</h3>
            <p className="text-white/40 text-sm leading-relaxed max-w-2xl font-light">Upon securing your threshold, allocate 35% of surplus capital into institutional-grade mutual funds and high-yield arbitrage instruments.</p>
          </section>

          <button onClick={() => setShowGetStarted(false)} className="w-full py-6 bg-white text-black rounded-2xl font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-zinc-200 transition-all duration-500">Acknowledge Strategy</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-serif italic text-blue-900 tracking-tight">Wealth Portfolios</h1>
          <p className="text-blue-600 text-xs tracking-[0.1em] font-light italic">Refining assets for <span className="text-blue-900 font-bold">{user.name}</span></p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleCreateEmergency}
            className="px-8 py-4 rounded-full border border-white/5 bg-white/5 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white/10 transition-all duration-300"
          >
            Create Stability Fund
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all duration-300 shadow-2xl active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Establish New Goal
          </button>
        </div>
      </header>

      <div className="relative max-w-lg group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400 group-focus-within:text-blue-600 transition-colors" />
        <input 
          type="text" 
          placeholder="Locate specific wealth plan..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-blue-200 rounded-2xl px-14 py-4 text-sm focus:outline-none focus:border-blue-400 transition-all text-blue-900 placeholder:text-blue-400 tracking-wide font-light"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Recommendation Card */}
        <div className="bg-white border border-blue-200 rounded-[2.5rem] p-12 text-blue-900 relative overflow-hidden group shadow-lg hover:shadow-xl transition-all">
          <div className="relative z-10 space-y-8">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-200">
              <Crown className="w-6 h-6 text-blue-600" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-serif italic tracking-tight text-blue-900">Precision Automation</h3>
              <p className="text-blue-600 text-xs leading-relaxed font-light">Elite clients utilizing automated capital distribution reach targets 3.4x more efficiently.</p>
            </div>
            <button 
              onClick={() => setShowGetStarted(true)}
              className="w-full py-4 bg-blue-50 border border-blue-200 text-blue-900 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all duration-500"
            >
              Consult Blueprint
            </button>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/30 rounded-full -mr-32 -mt-32 blur-[100px] group-hover:bg-blue-200/40 transition-all duration-1000" />
        </div>

        {/* Dynamic Plans */}
        {filteredPlans.map((plan, i) => (
          <motion.div 
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border border-blue-200 p-12 rounded-[2.5rem] hover:bg-blue-50 hover:border-blue-400 transition-all duration-500 cursor-pointer group flex flex-col h-full shadow-lg hover:shadow-xl"
          >
            <div className="flex justify-between items-start mb-10">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center bg-blue-50 border border-blue-200")}>
                <Target className={cn("w-6 h-6", plan.color.replace('bg-', 'text-'))} />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-blue-600 border border-blue-200 px-4 py-1.5 rounded-full bg-blue-50">Executing</span>
            </div>
            
            <div className="space-y-1 mb-10">
              <h4 className="text-[10px] uppercase tracking-[0.3em] text-blue-600 font-bold">{plan.name}</h4>
              <p className="text-4xl font-serif italic text-blue-900 tracking-tight">{plan.amount}</p>
            </div>
            
            <div className="mt-auto space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-[9px] uppercase tracking-[0.2em] font-bold">
                  <span className="text-blue-600">Accrued Progress</span>
                  <span className="text-blue-900">{plan.progress}%</span>
                </div>
                <div className="h-[2px] w-full bg-blue-200 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${plan.progress}%` }}
                    className={cn("h-full", plan.color)}
                  />
                </div>
              </div>
              <button className="w-full py-4 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">Inject Capital</button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative glass-light w-full max-w-lg p-12 rounded-[3rem] border border-white/10 shadow-2xl"
            >
              <button onClick={() => setShowCreateModal(false)} className="absolute top-8 right-8 p-2 text-white/20 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
              <div className="space-y-2 mb-10">
                <h2 className="text-3xl font-serif italic text-white tracking-tight">Initiate Wealth Strategy</h2>
                <p className="text-white/30 text-xs font-light">Define the parameters of your next capital objective.</p>
              </div>
              <form onSubmit={handleCreatePlan} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 px-1">Strategy Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Continental Estate" 
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-white/30 transition-all font-light"
                    value={newPlan.name}
                    onChange={(e) => setNewPlan({...newPlan, name: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 px-1">Capital Target (₦)</label>
                  <input 
                    type="number" 
                    placeholder="1,000,000" 
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-white/30 transition-all font-light"
                    value={newPlan.target}
                    onChange={(e) => setNewPlan({...newPlan, target: e.target.value})}
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 px-1">Aesthetic Signifier</label>
                  <div className="grid grid-cols-5 gap-3">
                    {['bg-white', 'bg-zinc-400', 'bg-neutral-600', 'bg-stone-500', 'bg-slate-400'].map(c => (
                      <button 
                        key={c}
                        type="button"
                        onClick={() => setNewPlan({...newPlan, color: c})}
                        className={cn("h-10 rounded-lg transition-all", c, newPlan.color === c ? "ring-2 ring-white ring-offset-4 ring-offset-[#080808]" : "opacity-40 hover:opacity-100")} 
                      />
                    ))}
                  </div>
                </div>
                <button type="submit" className="w-full py-5 bg-white text-black rounded-2xl font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-zinc-200 transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.1)]">Initialize Strategy</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};