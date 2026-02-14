import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Target, 
  TrendingUp, 
  Wallet, 
  Users, 
  BadgeCheck, 
  Settings,
  ShieldCheck,
  ChevronRight,
  User,
  Crown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '../context/AppContext';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Target, label: 'Savings Plans', path: '/plans' },
  { icon: TrendingUp, label: 'Marketplace', path: '/invest' },
  { icon: Wallet, label: 'Vault Stash', path: '/stash' },
  { icon: Users, label: 'Elite Circles', path: '/circles' },
];

const secondaryItems = [
  { icon: ShieldCheck, label: 'Security', path: '/security' },
  { icon: Settings, label: 'Preferences', path: '/settings' },
];

export const Sidebar = () => {
  const { user } = useApp();

  return (
    <aside className="w-64 border-r border-blue-200 bg-white h-screen flex flex-col fixed left-0 top-0 z-30 shadow-lg">
      <div className="p-10">
        <div className="flex flex-col gap-1 mb-12">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 flex items-center justify-center rounded-sm shadow-md">
              <span className="text-white font-serif text-xl font-bold">F</span>
            </div>
            <span className="font-serif text-lg tracking-[0.1em] font-medium text-blue-900">FIRST GROUPS</span>
          </div>
          <span className="text-[9px] tracking-[0.4em] text-blue-600/60 uppercase ml-12 -mt-1">Accounting</span>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-300 group",
                isActive 
                  ? "bg-blue-50 text-blue-900 border border-blue-200" 
                  : "text-blue-600/60 hover:text-blue-900 hover:bg-blue-50/50"
              )}
            >
              <div className="flex items-center gap-4">
                <item.icon className={cn(
                  "w-4 h-4 transition-transform duration-300 group-hover:scale-110",
                  "text-current"
                )} />
                <span className="text-xs uppercase tracking-widest font-medium">{item.label}</span>
              </div>
              <ChevronRight className={cn(
                "w-3 h-3 transition-all duration-300",
                "opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
              )} />
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-10 pt-0">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-blue-200 to-transparent mb-8" />
        <nav className="space-y-2 mb-8">
          {secondaryItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300",
                isActive 
                  ? "bg-blue-50 text-blue-900 border border-blue-200" 
                  : "text-blue-600/60 hover:text-blue-900 hover:bg-blue-50/50"
              )}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-xs uppercase tracking-widest font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4 p-4 rounded-xl border border-blue-200 bg-blue-50/30 hover:bg-blue-50 transition-colors cursor-pointer group">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <Crown className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
          <div className="overflow-hidden">
            <p className="text-[10px] font-bold text-blue-900 truncate uppercase tracking-wider">{user.name}</p>
            <p className="text-[8px] text-blue-600/60 uppercase tracking-[0.2em]">Private Client</p>
          </div>
        </div>
      </div>
    </aside>
  );
};