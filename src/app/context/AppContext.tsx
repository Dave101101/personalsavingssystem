import React, { createContext, useContext, useState, useEffect } from 'react';
import { userApi, accountsApi, transactionsApi, savingsApi, circlesApi, settingsApi } from '@/services/api';

interface Transaction {
  label: string;
  date: string;
  amount: string;
  type: 'in' | 'out';
}

interface UserProfile {
  name: string;
  email: string;
  age?: number;
  savingsGoal?: number;
}

interface Circle {
  id: string;
  name: string;
  members: number;
  target: string;
  joined: boolean;
}

interface Plan {
  name: string;
  amount: string;
  progress: number;
  color: string;
}

interface AppState {
  totalBalance: number;
  stashBalance: number;
  user: UserProfile;
  transactions: Transaction[];
  circles: Circle[];
  plans: Plan[];
  settings: {
    emailNotifications: boolean;
    pushNotifications: boolean;
  };
}

interface AppContextType extends AppState {
  addSavings: (amount: number) => void;
  topUpStash: (amount: number) => void;
  withdrawStash: (amount: number) => void;
  updateUser: (profile: Partial<UserProfile>) => void;
  toggleSetting: (key: keyof AppState['settings']) => void;
  joinCircle: (id: string) => void;
  createCircle: (name: string, target: string) => void;
  createPlan: (name: string, target: string, color: string) => void;
  refreshData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [totalBalance, setTotalBalance] = useState(0.00);
  const [stashBalance, setStashBalance] = useState(24000.00);
  const [user, setUser] = useState<UserProfile>({
    name: 'Ibukun Diamond Great Tola',
    email: 'ibukun.diamond@example.com',
  });
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
  });
  const [transactions, setTransactions] = useState<Transaction[]>([
    { label: 'Stash Top Up', date: 'Aug 04, 2026', amount: '+₦10,000.00', type: 'in' },
    { label: 'Transfer to House Rent', date: 'Aug 01, 2026', amount: '-₦5,000.00', type: 'out' },
    { label: 'Stash Top Up', date: 'July 28, 2026', amount: '+₦15,000.00', type: 'in' },
  ]);
  const [circles, setCircles] = useState<Circle[]>([
    { id: '1', name: 'Tech Titans', members: 45, target: '₦5.0M', joined: false },
    { id: '2', name: 'Real Estate Pros', members: 12, target: '₦12.0M', joined: true },
    { id: '3', name: 'Crypto Kings', members: 89, target: '₦25.0M', joined: false },
  ]);
  const [plans, setPlans] = useState<Plan[]>([
    { name: 'House Rent', amount: '₦450,000', progress: 80, color: 'bg-blue-500' },
    { name: 'Tuition Fees', amount: '₦200,000', progress: 45, color: 'bg-indigo-500' },
    { name: 'Emergency Fund', amount: '₦100,000', progress: 100, color: 'bg-emerald-500' },
    { name: 'New Laptop', amount: '₦65,000', progress: 20, color: 'bg-orange-500' },
  ]);

  // Fetch data from backend on mount
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    try {
      // Fetch user profile
      const userResponse = await userApi.getProfile();
      if (userResponse.success && userResponse.data) {
        setUser({
          name: userResponse.data.name,
          email: userResponse.data.email,
        });
      }

      // Fetch accounts
      const accountsResponse = await accountsApi.getAccounts();
      if (accountsResponse.success && accountsResponse.data) {
        const mainAccount = accountsResponse.data.find((acc: any) => acc.account_type === 'main');
        const stashAccount = accountsResponse.data.find((acc: any) => acc.account_type === 'stash');
        
        if (mainAccount) setTotalBalance(parseFloat(mainAccount.balance));
        if (stashAccount) setStashBalance(parseFloat(stashAccount.balance));
      }

      // Fetch transactions
      const transactionsResponse = await transactionsApi.getTransactions();
      if (transactionsResponse.success && transactionsResponse.data) {
        const formattedTransactions = transactionsResponse.data.slice(0, 10).map((t: any) => ({
          label: t.description || t.category,
          date: new Date(t.transaction_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          amount: `${t.type === 'credit' ? '+' : '-'}₦${parseFloat(t.amount).toLocaleString()}`,
          type: t.type === 'credit' ? 'in' : 'out',
        }));
        setTransactions(formattedTransactions);
      }

      // Fetch savings plans
      const plansResponse = await savingsApi.getPlans('active');
      if (plansResponse.success && plansResponse.data) {
        const formattedPlans = plansResponse.data.map((p: any) => ({
          name: p.plan_name,
          amount: `₦${parseFloat(p.target_amount).toLocaleString()}`,
          progress: Math.round((parseFloat(p.current_amount) / parseFloat(p.target_amount)) * 100),
          color: p.color || 'bg-blue-500',
        }));
        setPlans(formattedPlans);
      }

      // Fetch circles
      const circlesResponse = await circlesApi.getCircles();
      if (circlesResponse.success && circlesResponse.data) {
        const formattedCircles = circlesResponse.data.map((c: any) => ({
          id: c.id.toString(),
          name: c.circle_name,
          members: c.member_count,
          target: `₦${parseFloat(c.target_amount).toLocaleString()}`,
          joined: c.is_member || false,
        }));
        setCircles(formattedCircles);
      }

      // Fetch settings
      const settingsResponse = await settingsApi.getSettings();
      if (settingsResponse.success && settingsResponse.data) {
        const settingsData = settingsResponse.data.reduce((acc: any, item: any) => {
          acc[item.setting_key] = item.setting_value === 'true' || item.setting_value === '1';
          return acc;
        }, {});
        setSettings({
          emailNotifications: settingsData.emailNotifications ?? true,
          pushNotifications: settingsData.pushNotifications ?? false,
        });
      }
    } catch (error) {
      console.error('Error fetching data from backend:', error);
      // Continue with default/cached data if API fails
    }
  };

  const addSavings = async (amount: number) => {
    try {
      const response = await accountsApi.updateBalance({
        account_type: 'main',
        amount,
        operation: 'add',
        category: 'Savings',
        description: 'Added to savings',
      });
      
      if (response.success) {
        setTotalBalance(prev => prev + amount);
        refreshData(); // Refresh to get updated data
      }
    } catch (error) {
      console.error('Error adding savings:', error);
      // Fallback to local state update
      setTotalBalance(prev => prev + amount);
    }
  };

  const topUpStash = async (amount: number) => {
    try {
      const response = await accountsApi.updateBalance({
        account_type: 'stash',
        amount,
        operation: 'add',
        category: 'Stash Top Up',
        description: 'Stash top up',
      });
      
      if (response.success) {
        setStashBalance(prev => prev + amount);
        setTransactions(prev => [
          {
            label: 'Stash Top Up',
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            amount: `+₦${amount.toLocaleString()}`,
            type: 'in'
          },
          ...prev
        ]);
        refreshData();
      }
    } catch (error) {
      console.error('Error topping up stash:', error);
      // Fallback to local state update
      setStashBalance(prev => prev + amount);
      setTransactions(prev => [
        {
          label: 'Stash Top Up',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          amount: `+₦${amount.toLocaleString()}`,
          type: 'in'
        },
        ...prev
      ]);
    }
  };

  const withdrawStash = async (amount: number) => {
    if (stashBalance >= amount) {
      try {
        const response = await accountsApi.updateBalance({
          account_type: 'stash',
          amount,
          operation: 'subtract',
          category: 'Stash Withdrawal',
          description: 'Stash withdrawal',
        });
        
        if (response.success) {
          setStashBalance(prev => prev - amount);
          setTransactions(prev => [
            {
              label: 'Stash Withdrawal',
              date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
              amount: `-₦${amount.toLocaleString()}`,
              type: 'out'
            },
            ...prev
          ]);
          refreshData();
        }
      } catch (error) {
        console.error('Error withdrawing from stash:', error);
        // Fallback to local state update
        setStashBalance(prev => prev - amount);
        setTransactions(prev => [
          {
            label: 'Stash Withdrawal',
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            amount: `-₦${amount.toLocaleString()}`,
            type: 'out'
          },
          ...prev
        ]);
      }
    }
  };

  const updateUser = async (profile: Partial<UserProfile>) => {
    try {
      const response = await userApi.updateProfile({
        name: profile.name,
        email: profile.email,
      });
      
      if (response.success) {
        setUser(prev => ({ ...prev, ...profile }));
      }
    } catch (error) {
      console.error('Error updating user:', error);
      // Fallback to local state update
      setUser(prev => ({ ...prev, ...profile }));
    }
  };

  const toggleSetting = async (key: keyof AppState['settings']) => {
    const newValue = !settings[key];
    try {
      await settingsApi.updateSetting(key, newValue ? '1' : '0');
      setSettings(prev => ({ ...prev, [key]: newValue }));
    } catch (error) {
      console.error('Error updating setting:', error);
      // Fallback to local state update
      setSettings(prev => ({ ...prev, [key]: newValue }));
    }
  };

  const joinCircle = async (id: string) => {
    try {
      await circlesApi.joinCircle(parseInt(id));
      setCircles(prev => prev.map(c => c.id === id ? { ...c, joined: true, members: c.members + 1 } : c));
      refreshData();
    } catch (error) {
      console.error('Error joining circle:', error);
      // Fallback to local state update
      setCircles(prev => prev.map(c => c.id === id ? { ...c, joined: true, members: c.members + 1 } : c));
    }
  };

  const createCircle = async (name: string, target: string) => {
    try {
      const targetAmount = parseFloat(target.replace(/[^0-9.]/g, ''));
      await circlesApi.createCircle({
        circle_name: name,
        target_amount: targetAmount,
        is_public: true,
      });
      refreshData();
    } catch (error) {
      console.error('Error creating circle:', error);
      // Fallback to local state update
      const newCircle: Circle = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        target,
        members: 1,
        joined: true
      };
      setCircles(prev => [newCircle, ...prev]);
    }
  };

  const createPlan = async (name: string, target: string, color: string) => {
    try {
      const targetAmount = parseFloat(target.replace(/[^0-9.]/g, ''));
      const today = new Date();
      const endDate = new Date(today.setFullYear(today.getFullYear() + 1));
      
      await savingsApi.createPlan({
        plan_name: name,
        target_amount: targetAmount,
        frequency: 'monthly',
        start_date: new Date().toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        color,
      });
      refreshData();
    } catch (error) {
      console.error('Error creating plan:', error);
      // Fallback to local state update
      const newPlan: Plan = {
        name,
        amount: `₦${parseInt(target).toLocaleString()}`,
        progress: 0,
        color
      };
      setPlans(prev => [newPlan, ...prev]);
    }
  };

  return (
    <AppContext.Provider value={{ 
      totalBalance, 
      stashBalance, 
      user, 
      transactions, 
      circles, 
      plans,
      settings,
      addSavings, 
      topUpStash, 
      withdrawStash, 
      updateUser,
      toggleSetting,
      joinCircle,
      createCircle,
      createPlan,
      refreshData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
