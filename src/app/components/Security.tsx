import React, { useState } from 'react';
import { Shield, Smartphone, Key, Fingerprint, Lock, ChevronRight, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export const Security = () => {
  const [securityState, setSecurityState] = useState({
    twoFactor: true,
    biometric: true,
    accountPin: true
  });

  const toggleSecurity = (key: keyof typeof securityState) => {
    setSecurityState(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success(`${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} updated`);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-10">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Security</h1>
        <p className="text-muted-foreground text-sm">Manage your account security and authentication methods.</p>
      </header>

      <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex items-start gap-4">
        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
          <Shield className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h4 className="font-bold text-emerald-900 text-sm mb-1">Your account is well protected</h4>
          <p className="text-emerald-700/80 text-xs">All security features are active. We continue to monitor your account for any suspicious activity.</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Authentication</h3>
        
        <div 
          onClick={() => toast.info('Coming soon')}
          className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between hover:border-primary/30 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold">Change Password</p>
              <p className="text-xs text-muted-foreground">Update your login password regularly</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-muted text-muted-foreground">Last changed 2 months ago</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {[
          { id: 'twoFactor', icon: Smartphone, label: 'Two-Factor Authentication', description: 'Add an extra layer of security' },
          { id: 'biometric', icon: Fingerprint, label: 'Biometric Login', description: 'Use FaceID or TouchID' },
          { id: 'accountPin', icon: Lock, label: 'Account Pin', description: 'Required for all withdrawals' },
        ].map((item) => (
          <div key={item.id} className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between hover:border-primary/30 transition-all shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center text-muted-foreground">
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            </div>
            <button 
              onClick={() => toggleSecurity(item.id as keyof typeof securityState)}
              className={cn(
                "w-12 h-6 rounded-full transition-all relative p-1",
                securityState[item.id as keyof typeof securityState] ? "bg-primary" : "bg-muted"
              )}
            >
              <div className={cn(
                "w-4 h-4 bg-white rounded-full transition-transform",
                securityState[item.id as keyof typeof securityState] ? "translate-x-6" : "translate-x-0"
              )} />
            </button>
          </div>
        ))}
      </div>

      <div className="p-6 border border-red-100 bg-red-50 rounded-2xl">
        <div className="flex items-center gap-2 text-red-600 mb-4">
          <AlertCircle className="w-4 h-4" />
          <h4 className="font-bold text-sm uppercase tracking-wider">Danger Zone</h4>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-red-900">Deactivate Account</p>
            <p className="text-xs text-red-700/70">Temporarily disable your account and all associated services.</p>
          </div>
          <button 
            onClick={() => toast.info('Coming soon')}
            className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors"
          >
            Deactivate
          </button>
        </div>
      </div>
    </div>
  );
};