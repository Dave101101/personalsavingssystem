import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  ArrowUpRight, 
  TrendingUp, 
  ShieldCheck, 
  Clock,
  ExternalLink,
  Eye,
  EyeOff,
  Zap,
  ArrowRightLeft,
  Smartphone,
  Crown,
  Lock,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';

export const Dashboard = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [savingsAmount, setSavingsAmount] = useState('');
  const navigate = useNavigate();
  const { totalBalance, addSavings, user, plans, stashBalance } = useApp();

  const handleAddSavings = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(savingsAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    addSavings(amount);
    setSavingsAmount('');
    toast.success(`₦${amount.toLocaleString()} added to your total balance!`);
  };

  const firstName = user.name.split(' ')[0];

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-serif tracking-tight text-blue-900 italic">Welcome, {firstName}</h1>
            <div className="px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-[9px] uppercase tracking-[0.2em] text-blue-600 font-medium">
              Private Client
            </div>
          </div>
          <p className="text-blue-600 text-xs tracking-wider font-light">Your financial portfolio is performing optimally.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/plans')}
            className="group flex items-center gap-3 px-8 py-3.5 rounded-full bg-blue-600 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all duration-300 active:scale-95 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Establish New Plan
          </button>
        </div>
      </header>

      {/* Primary Financial Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent rounded-[2.5rem] -m-1 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative overflow-hidden glass rounded-[2.5rem] p-12 h-full flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-600">Total Net Worth</span>
                  <button 
                    onClick={() => setShowBalance(!showBalance)}
                    className="p-1.5 hover:bg-blue-100 rounded-full transition-colors duration-300"
                  >
                    {showBalance ? <Eye className="w-3.5 h-3.5 text-blue-400" /> : <EyeOff className="w-3.5 h-3.5 text-blue-400" />}
                  </button>
                </div>
                <div className="flex items-baseline gap-4">
                  <h2 className="text-6xl font-serif tracking-tight text-blue-900 leading-none">
                    {showBalance ? `₦${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '₦ • • • • •'}
                  </h2>
                  <div className="flex items-center gap-1 text-emerald-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-[11px] font-bold tracking-widest">+4.2%</span>
                  </div>
                </div>
              </div>
              <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-full backdrop-blur-xl">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-blue-700">Currency: NGN</p>
              </div>
            </div>

            <div className="mt-16 flex flex-col md:flex-row items-end justify-between gap-8">
              <form onSubmit={handleAddSavings} className="w-full max-w-sm space-y-4">
                <p className="text-[10px] text-blue-600 uppercase tracking-[0.2em] font-medium px-1">Instant Wealth Addition</p>
                <div className="flex gap-3">
                  <div className="flex-1 relative group/input">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-400 text-sm font-light italic">₦</span>
                    <input 
                      type="number"
                      value={savingsAmount}
                      onChange={(e) => setSavingsAmount(e.target.value)}
                      placeholder="Amount to secure"
                      className="w-full bg-white border border-blue-200 rounded-2xl px-10 py-4 text-sm text-blue-900 placeholder:text-blue-300 focus:outline-none focus:border-blue-400 transition-all duration-300"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="bg-blue-600 text-white px-8 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all duration-500 active:scale-95 shadow-md"
                  >
                    Secure
                  </button>
                </div>
              </form>

              <div className="flex gap-12 text-right">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-blue-600 mb-1">Portfolio Value</p>
                  <p className="text-xl font-serif text-blue-800">₦{(totalBalance * 1.25).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-blue-600 mb-1">Global Liquidity</p>
                  <p className="text-xl font-serif text-blue-800">${(totalBalance / 1500).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                </div>
              </div>
            </div>
            
            {/* Ambient luxury lines */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/10 rounded-full -mr-32 -mt-32 blur-[100px] pointer-events-none" />
          </div>
        </div>

        <div className="glass rounded-[2.5rem] p-10 flex flex-col justify-between border-blue-200 hover:border-blue-300 transition-colors duration-500">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-200">
              <Lock className="w-5 h-5 text-blue-600" />
            </div>
            <button 
              onClick={() => navigate('/stash')}
              className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 hover:text-blue-900 transition-all duration-300"
            >
              Access Vault <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
          
          <div className="mt-8">
            <p className="text-[10px] text-blue-600 uppercase tracking-[0.3em] font-bold mb-2">Vault Stash</p>
            <p className="text-4xl font-serif text-blue-900 tracking-tight">₦{stashBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>

          <div className="mt-12 space-y-4">
            <div className="h-[1px] bg-blue-200 w-full" />
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-[10px] text-blue-600 uppercase tracking-widest font-medium">Scheduled Yield: <span className="text-blue-800 font-bold">Aug 15</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Actions */}
      <section className="space-y-6">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-400 px-2">Strategic Operations</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Asset Management', icon: Zap, path: '/plans' },
            { label: 'Marketplace', icon: TrendingUp, path: '/invest' },
            { label: 'Global Transfer', icon: ArrowRightLeft, path: '/stash' },
            { label: 'Service Settlements', icon: Smartphone, path: '/bills' },
          ].map((action, i) => (
            <button 
              key={i}
              onClick={() => navigate(action.path)}
              className="glass p-8 rounded-[2rem] flex flex-col items-center gap-5 hover:bg-blue-50 hover:border-blue-300 transition-all duration-500 active:scale-95 group border-blue-200"
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-500">
                <action.icon className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors duration-500" />
              </div>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] group-hover:text-blue-900 transition-colors duration-300">{action.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Plans Portfolio */}
      <section className="space-y-8">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-xl font-serif text-blue-900 tracking-tight italic">Investment Portfolio</h3>
          <button 
            onClick={() => navigate('/plans')}
            className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 hover:text-blue-900 transition-all duration-300"
          >
            Review All Assets <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -8 }}
              onClick={() => navigate('/plans')}
              className="glass p-8 rounded-[2rem] hover:bg-blue-50 transition-all duration-500 cursor-pointer group border-blue-200 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-10">
                <div className={cn("w-1.5 h-1.5 rounded-full", plan.color)} />
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                </div>
              </div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-blue-600 mb-2 font-medium">{plan.name}</p>
              <p className="text-2xl font-serif text-blue-900 tracking-tight mb-8 italic">{plan.amount}</p>
              
              <div className="space-y-3">
                <div className="flex justify-between text-[9px] text-blue-500 uppercase tracking-[0.2em] font-bold">
                  <span>Maturity</span>
                  <span>{plan.progress}%</span>
                </div>
                <div className="h-[2px] w-full bg-blue-200 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${plan.progress}%` }}
                    className={cn("h-full", plan.color)}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Elite Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-light rounded-[3rem] p-12 border-blue-200 flex flex-col md:flex-row items-center justify-between overflow-hidden relative group">
          <div className="relative z-10 space-y-6 md:max-w-[65%]">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-blue-600" />
              <h4 className="text-blue-900 font-serif text-2xl tracking-tight italic">Wealth Assessment</h4>
            </div>
            <p className="text-blue-600 text-xs font-light leading-relaxed tracking-wide">Optimize your high-net-worth portfolio with a comprehensive risk evaluation tailored for private banking clients.</p>
            <button 
              onClick={() => navigate('/security')}
              className="group flex items-center gap-3 px-8 py-4 bg-blue-100 border border-blue-200 text-blue-900 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all duration-500"
            >
              Initialize Assessment
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
          <div className="mt-12 md:mt-0 relative">
            <TrendingUp className="w-48 h-48 text-blue-200/40 group-hover:text-blue-300/60 transition-colors duration-700" />
          </div>
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200/20 rounded-full -mr-32 -mt-32 blur-3xl" />
        </div>

        <div className="glass-light rounded-[3rem] p-12 border-blue-200 flex flex-col md:flex-row items-center justify-between overflow-hidden relative group">
          <div className="relative z-10 space-y-6 md:max-w-[65%]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <h4 className="text-blue-900 font-serif text-2xl tracking-tight italic">Capital Markets</h4>
            </div>
            <p className="text-blue-600 text-xs font-light leading-relaxed tracking-wide">Secure exclusive entry to premium institutional mutual funds and global arbitrage opportunities.</p>
            <button 
              onClick={() => navigate('/invest')}
              className="group flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-blue-700 transition-all duration-500 shadow-lg"
            >
              Explore Markets
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          <div className="mt-12 md:mt-0">
            <ArrowRightLeft className="w-48 h-48 text-blue-200/40 group-hover:text-blue-300/60 transition-colors duration-700" />
          </div>
        </div>
      </div>
    </div>
  );
};
