import React, { useState } from 'react';
import { Bell, Search, User, LogOut, CreditCard, ChevronDown, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';

export const TopNav = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useApp();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase();
    
    // Simple keyword matching
    if (query.includes('plan') || query.includes('saving') || query.includes('goal')) {
      navigate('/plans');
      toast.info('Opening Savings Plans...');
    } else if (query.includes('invest') || query.includes('market') || query.includes('stock')) {
      navigate('/invest');
      toast.info('Opening Marketplace...');
    } else if (query.includes('circle') || query.includes('group') || query.includes('community')) {
      navigate('/circles');
      toast.info('Opening Circles...');
    } else if (query.includes('bill') || query.includes('payment')) {
      navigate('/bills');
      toast.info('Opening Bills...');
    } else if (query.includes('security') || query.includes('safe') || query.includes('password')) {
      navigate('/security');
      toast.info('Opening Security...');
    } else if (query.includes('stash') || query.includes('vault') || query.includes('wallet')) {
      navigate('/stash');
      toast.info('Opening Stash...');
    } else if (query.includes('setting') || query.includes('profile') || query.includes('preference')) {
      navigate('/settings');
      toast.info('Opening Settings...');
    } else {
      toast.info('No results found. Try: plans, invest, circles, bills, security, stash, or settings');
    }
    
    setSearchQuery('');
  };

  return (
    <header className="h-24 border-b border-blue-200 bg-white/80 backdrop-blur-xl sticky top-0 z-20 flex items-center justify-between px-12 shadow-sm">
      <div className="flex items-center flex-1 max-w-xl">
        <form onSubmit={handleSearch} className="w-full">
          <div className={cn(
            "flex items-center gap-4 px-6 py-3 rounded-full bg-blue-50 border border-blue-200 w-full transition-all duration-500 group",
            isSearchFocused && "bg-white border-blue-400 shadow-lg"
          )}>
            <Search className={cn(
              "w-4 h-4 transition-colors duration-300",
              isSearchFocused ? "text-blue-600" : "text-blue-400"
            )} />
            <input 
              type="text" 
              placeholder="Search accounts, transactions, or services..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-[13px] w-full placeholder:text-blue-400 text-blue-900 font-light tracking-wide"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </div>
        </form>
      </div>

      <div className="flex items-center gap-10">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-blue-600 font-medium">Market Open</span>
        </div>

        <button 
          onClick={() => toast.info('No new notifications')}
          className="relative p-2 text-blue-600 hover:text-blue-900 transition-all duration-300 group"
        >
          <Bell className="w-5 h-5 group-hover:scale-110" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-600 rounded-full ring-4 ring-white" />
        </button>

        <div className="h-10 w-[1px] bg-blue-200" />

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-4 outline-none group cursor-pointer">
            <div className="text-right hidden md:block">
              <p className="text-[11px] font-bold text-blue-900 uppercase tracking-widest leading-none mb-1">{user.name}</p>
              <p className="text-[9px] text-blue-600 uppercase tracking-[0.2em]">Platinum Tier</p>
            </div>
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 p-[1px] group-hover:from-blue-500 transition-all duration-500 shadow-md">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                <User className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-blue-400 group-data-[state=open]:rotate-180 transition-transform duration-300" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 mt-4 bg-white border-blue-200 text-blue-900 shadow-xl">
            <DropdownMenuLabel className="text-[10px] uppercase tracking-[0.2em] text-blue-600 font-normal px-4 py-3">Client Session</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-blue-100" />
            <DropdownMenuItem 
              onClick={() => navigate('/settings')}
              className="cursor-pointer py-3 px-4 focus:bg-blue-50 focus:text-blue-900"
            >
              <User className="mr-3 h-4 w-4 text-blue-600" />
              <span className="text-xs uppercase tracking-widest">Private Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => navigate('/plans')}
              className="cursor-pointer py-3 px-4 focus:bg-blue-50 focus:text-blue-900"
            >
              <CreditCard className="mr-3 h-4 w-4 text-blue-600" />
              <span className="text-xs uppercase tracking-widest">Wealth Accounts</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => navigate('/security')}
              className="cursor-pointer py-3 px-4 focus:bg-blue-50 focus:text-blue-900"
            >
              <Settings className="mr-3 h-4 w-4 text-blue-600" />
              <span className="text-xs uppercase tracking-widest">System Preferences</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-blue-100" />
            <DropdownMenuItem 
              onClick={() => toast.info('Session ended. See you soon!')}
              className="cursor-pointer py-3 px-4 text-red-600 focus:bg-red-50 focus:text-red-700"
            >
              <LogOut className="mr-3 h-4 w-4" />
              <span className="text-xs uppercase tracking-widest">End Session</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};