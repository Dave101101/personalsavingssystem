import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { Dashboard } from './components/Dashboard';
import { Plans } from './components/Plans';
import { Investments } from './components/Investments';
import { Security } from './components/Security';
import { Bills } from './components/Bills';
import { Circles } from './components/Circles';
import { TermsOfUse } from './components/TermsOfUse';
import { Toaster, toast } from 'sonner';
import { cn } from '@/lib/utils';
import { ArrowDownLeft, ArrowUpRight, Plus, User, Mail, Shield, Smartphone, CreditCard } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-blue-50 text-blue-900 font-sans selection:bg-blue-600 selection:text-white">
      <Sidebar />
      <div className="ml-64 flex flex-col min-h-screen relative">
        {/* Abstract background elements for luxury feel */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
        <div className="fixed bottom-0 left-64 w-[300px] h-[300px] bg-blue-300/20 rounded-full blur-[100px] -z-10 -translate-x-1/4 translate-y-1/4" />
        
        <TopNav />
        <main className="flex-1 overflow-y-auto px-8 py-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
        <footer className="px-12 py-10 border-t border-blue-200 mt-auto bg-white/50">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] uppercase tracking-[0.3em] text-blue-600/60 font-medium">
            <div className="flex gap-10">
              <Link to="/terms" className="hover:text-blue-900 transition-colors duration-300">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-blue-900 transition-colors duration-300">Terms of Service</Link>
              <Link to="/terms" className="hover:text-blue-900 transition-colors duration-300">Regulatory Disclosure</Link>
              <Link to="/terms" className="hover:text-blue-900 transition-colors duration-300">Client Support</Link>
            </div>
            <div className="flex items-center gap-4">
              <span>© 2026 First Groups Accounting</span>
              <span className="w-1 h-1 bg-blue-400 rounded-full" />
              <span>Excellence in Personal Finance</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

const SettingsStub = () => {
  const { user, settings, toggleSetting, updateUser } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
  });
  const [profilePicture, setProfilePicture] = useState<string>('');
  
  const handleSaveProfile = () => {
    updateUser(formData);
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
    });
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
        toast.success('Profile picture updated!');
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-blue-900">Settings</h1>
        <p className="text-blue-600 text-sm">Manage your profile and app preferences.</p>
      </header>
      
      <div className="bg-white border border-blue-200 rounded-2xl p-10 shadow-lg">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative mb-6 group">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white shadow-lg overflow-hidden">
              {profilePicture ? (
                <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10" />
              )}
            </div>
            <label htmlFor="profile-upload" className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-all shadow-md">
              <Plus className="w-4 h-4 text-white" />
              <input 
                id="profile-upload" 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
          {!isEditing ? (
            <>
              <h3 className="font-bold text-xl mb-1 text-blue-900">{user.name}</h3>
              <p className="text-sm text-blue-600 mb-6">{user.email}</p>
              <button 
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-full text-xs font-bold hover:bg-blue-700 transition-all shadow-md"
              >
                Edit Profile
              </button>
            </>
          ) : (
            <div className="w-full max-w-md space-y-4">
              <div className="space-y-2">
                <label className="block text-left text-xs font-bold text-blue-900 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 font-medium text-blue-900 focus:outline-none focus:ring-2 ring-blue-400"
                  placeholder="Enter your name"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-left text-xs font-bold text-blue-900 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 font-medium text-blue-900 focus:outline-none focus:ring-2 ring-blue-400"
                  placeholder="Enter your email"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={handleSaveProfile}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-md"
                >
                  Save Changes
                </button>
                <button 
                  onClick={handleCancel}
                  className="flex-1 px-6 py-3 border border-blue-200 text-blue-900 rounded-xl text-sm font-bold hover:bg-blue-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 bg-white border border-blue-200 rounded-2xl flex items-center justify-between shadow-md">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-blue-900">Email Notifications</p>
              <p className="text-xs text-blue-600">Receive weekly reports</p>
            </div>
          </div>
          <button 
            onClick={() => toggleSetting('emailNotifications')}
            className={cn(
              "w-12 h-6 rounded-full transition-all relative p-1",
              settings.emailNotifications ? "bg-blue-600" : "bg-blue-200"
            )}
          >
            <div className={cn(
              "w-4 h-4 bg-white rounded-full transition-transform shadow-sm",
              settings.emailNotifications ? "translate-x-6" : "translate-x-0"
            )} />
          </button>
        </div>

        <div className="p-6 bg-white border border-blue-200 rounded-2xl flex items-center justify-between shadow-md">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-blue-900">Push Notifications</p>
              <p className="text-xs text-blue-600">Real-time alerts</p>
            </div>
          </div>
          <button 
            onClick={() => toggleSetting('pushNotifications')}
            className={cn(
              "w-12 h-6 rounded-full transition-all relative p-1",
              settings.pushNotifications ? "bg-blue-600" : "bg-blue-200"
            )}
          >
            <div className={cn(
              "w-4 h-4 bg-white rounded-full transition-transform shadow-sm",
              settings.pushNotifications ? "translate-x-6" : "translate-x-0"
            )} />
          </button>
        </div>
      </div>
    </div>
  );
};

const StashPage = () => {
  const { stashBalance, topUpStash, withdrawStash, transactions } = useApp();
  const [amount, setAmount] = useState('');

  const handleTopUp = () => {
    const val = parseFloat(amount);
    if (!isNaN(val) && val > 0) {
      topUpStash(val);
      setAmount('');
      toast.success(`₦${val.toLocaleString()} added to Stash!`);
    }
  };

  const handleWithdraw = () => {
    const val = parseFloat(amount);
    if (!isNaN(val) && val > 0) {
      if (val > stashBalance) {
        toast.error("Insufficient funds in Stash");
        return;
      }
      withdrawStash(val);
      setAmount('');
      toast.success(`₦${val.toLocaleString()} withdrawn from Stash!`);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Stash</h1>
        <p className="text-muted-foreground text-sm">Your cash wallet for easy deposits and withdrawals.</p>
      </header>
      <div className="bg-card border border-border rounded-[2rem] p-10 flex flex-col items-center text-center shadow-sm">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">₦</div>
        </div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Available Stash Balance</p>
        <p className="text-4xl font-bold tracking-tighter mb-8">₦{stashBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        
        <div className="w-full max-w-md space-y-4">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">₦</span>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full bg-muted border border-border rounded-2xl px-10 py-4 font-bold text-lg focus:outline-none focus:ring-2 ring-primary/20"
            />
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleTopUp}
              className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold text-sm hover:bg-primary/90 transition-all shadow-md active:scale-95"
            >
              Top Up Stash
            </button>
            <button 
              onClick={handleWithdraw}
              className="flex-1 py-4 bg-secondary text-primary rounded-2xl font-bold text-sm hover:bg-primary hover:text-white transition-all active:scale-95"
            >
              Withdraw
            </button>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Recent Activity</h3>
        {transactions.map((t, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary/20 transition-colors">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                t.type === 'in' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'
              )}>
                {t.type === 'in' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
              </div>
              <div>
                <p className="text-sm font-bold">{t.label}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-tighter">{t.date}</p>
              </div>
            </div>
            <span className={cn("font-bold text-sm", t.type === 'in' ? 'text-emerald-600' : 'text-foreground')}>{t.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AppProvider>
      <Router>
        <Toaster position="top-right" expand={false} richColors />
        <Routes>
          <Route 
            path="/" 
            element={<Layout><Dashboard /></Layout>} 
          />
          <Route 
            path="/plans" 
            element={<Layout><Plans /></Layout>} 
          />
          <Route 
            path="/invest" 
            element={<Layout><Investments /></Layout>} 
          />
          <Route 
            path="/stash" 
            element={<Layout><StashPage /></Layout>} 
          />
          <Route 
            path="/circles" 
            element={<Layout><Circles /></Layout>} 
          />
          <Route path="/security" element={<Layout><Security /></Layout>} />
          <Route path="/bills" element={<Layout><Bills /></Layout>} />
          <Route path="/settings" element={<Layout><SettingsStub /></Layout>} />
          <Route path="/terms" element={<Layout><TermsOfUse /></Layout>} />
          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;