import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smartphone, 
  Zap, 
  Tv, 
  Globe, 
  ChevronRight, 
  ArrowLeft, 
  CheckCircle2,
  AlertCircle,
  CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type Step = 'category' | 'details' | 'confirm' | 'success';

export const Bills = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('category');
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const categories = [
    { id: 'airtime', name: 'Airtime', icon: Smartphone, color: 'text-orange-600', bg: 'bg-orange-50' },
    { id: 'data', name: 'Data Bundle', icon: Globe, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'power', name: 'Electricity', icon: Zap, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { id: 'cable', name: 'Cable TV', icon: Tv, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const handleCategorySelect = (cat: any) => {
    setSelectedCategory(cat);
    setStep('details');
  };

  const handleConfirm = () => {
    setStep('success');
    toast.success('Payment successful!');
  };

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-8">
      <header className="flex items-center gap-4">
        {step !== 'category' && step !== 'success' && (
          <button onClick={() => setStep('category')} className="p-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pay Bills</h1>
          <p className="text-muted-foreground text-sm">Quickly pay for services from your Stash.</p>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {step === 'category' && (
          <motion.div 
            key="category"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-2 gap-4"
          >
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat)}
                className="bg-card border border-border p-8 rounded-[2rem] flex flex-col items-center gap-4 hover:border-primary transition-all group shadow-sm"
              >
                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform", cat.bg)}>
                  <cat.icon className={cn("w-8 h-8", cat.color)} />
                </div>
                <span className="font-bold text-sm">{cat.name}</span>
              </button>
            ))}
          </motion.div>
        )}

        {step === 'details' && (
          <motion.div 
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-card border border-border p-8 rounded-[2.5rem] shadow-sm space-y-6"
          >
            <div className="flex items-center gap-4 p-4 bg-muted rounded-2xl">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", selectedCategory?.bg)}>
                <selectedCategory.icon className={cn("w-5 h-5", selectedCategory?.color)} />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Selected Service</p>
                <p className="font-bold">{selectedCategory?.name}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Phone Number / Meter ID</label>
                <input 
                  type="text" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. 08012345678"
                  className="w-full p-4 bg-muted border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Amount (₦)</label>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full p-4 bg-muted border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-xl"
                />
              </div>
            </div>

            <button 
              onClick={() => setStep('confirm')}
              disabled={!amount || !phoneNumber}
              className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:active:scale-100"
            >
              Continue
            </button>
          </motion.div>
        )}

        {step === 'confirm' && (
          <motion.div 
            key="confirm"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border p-8 rounded-[2.5rem] shadow-sm space-y-8"
          >
            <div className="text-center space-y-2">
              <h3 className="font-bold text-lg">Confirm Payment</h3>
              <p className="text-sm text-muted-foreground">Please review your transaction details.</p>
            </div>

            <div className="space-y-3 bg-muted p-6 rounded-2xl">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Service</span>
                <span className="font-bold">{selectedCategory?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Account</span>
                <span className="font-bold">{phoneNumber}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-bold">₦{Number(amount).toLocaleString()}</span>
              </div>
              <div className="pt-3 mt-3 border-t border-border flex justify-between text-sm">
                <span className="text-muted-foreground">Transaction Fee</span>
                <span className="font-bold">₦0.00</span>
              </div>
              <div className="flex justify-between text-base pt-2">
                <span className="font-bold">Total to Pay</span>
                <span className="font-bold text-primary">₦{Number(amount).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl text-blue-700">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed">Payment will be deducted from your Stash balance (Available: ₦24,000.00).</p>
            </div>

            <button 
              onClick={handleConfirm}
              className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg active:scale-95"
            >
              Pay Now
            </button>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border p-12 rounded-[2.5rem] shadow-sm text-center space-y-6"
          >
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold">Payment Successful!</h2>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              Your payment of ₦{Number(amount).toLocaleString()} for {selectedCategory?.name} to {phoneNumber} was successful.
            </p>
            <div className="pt-6 space-y-3">
              <button 
                onClick={() => toast.info('Coming soon')}
                className="w-full py-4 bg-secondary text-primary rounded-2xl font-bold hover:bg-primary hover:text-white transition-all"
              >
                Download Receipt
              </button>
              <button 
                onClick={() => navigate('/')}
                className="w-full py-4 font-bold text-muted-foreground hover:text-foreground transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};