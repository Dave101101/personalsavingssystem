import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Plus, 
  ArrowUpRight, 
  Target, 
  Trophy, 
  Search, 
  Filter,
  MessageCircle,
  ShieldCheck,
  ChevronRight,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';

export const Circles = () => {
  const { circles, joinCircle, createCircle } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCircle, setNewCircle] = useState({ name: '', target: '' });
  const [filter, setFilter] = useState('all');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCircle.name || !newCircle.target) {
      toast.error("Please fill in all fields");
      return;
    }
    createCircle(newCircle.name, newCircle.target);
    setShowCreateModal(false);
    setNewCircle({ name: '', target: '' });
    toast.success("Circle created! Time to invite friends.");
  };

  const handleJoinChallenge = (name: string) => {
    toast.success(`Joined ${name} Challenge! Let's hit that goal.`);
  };

  const filteredCircles = circles.filter(c => {
    if (filter === 'joined') return c.joined;
    if (filter === 'explore') return !c.joined;
    return true;
  });

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Circles</h1>
          <p className="text-muted-foreground text-sm">Save with friends, family, and communities.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Create a Circle
          </button>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border p-6 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Active Circles</p>
            <p className="text-xl font-bold">{circles.length}</p>
          </div>
        </div>
        <div className="bg-card border border-border p-6 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Total Members</p>
            <p className="text-xl font-bold">1,240</p>
          </div>
        </div>
        <div className="bg-card border border-border p-6 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Completed Goals</p>
            <p className="text-xl font-bold">84</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">My Communities</h3>
            <div className="flex bg-muted p-1 rounded-lg">
              {['all', 'joined', 'explore'].map((f) => (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "px-4 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all",
                    filter === f ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCircles.map((circle, i) => (
              <motion.div 
                key={circle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border p-6 rounded-[2rem] hover:shadow-lg transition-all shadow-sm group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Target</p>
                    <p className="font-bold text-sm">{circle.target}</p>
                  </div>
                </div>
                <h4 className="font-bold text-lg mb-1">{circle.name}</h4>
                <p className="text-xs text-muted-foreground mb-6">{circle.members} members saving together</p>
                
                <div className="flex gap-2">
                  {circle.joined ? (
                    <button className="flex-1 py-3 bg-secondary text-primary rounded-xl text-xs font-bold hover:bg-primary hover:text-white transition-all">Chat</button>
                  ) : (
                    <button 
                      onClick={() => joinCircle(circle.id)}
                      className="flex-1 py-3 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 transition-all"
                    >
                      Join Circle
                    </button>
                  )}
                  <button onClick={() => toast.info("Circle details opening...")} className="px-4 py-3 bg-muted rounded-xl text-xs font-bold hover:bg-border transition-all">Details</button>
                </div>
              </motion.div>
            ))}
          </div>
          
          <button 
            onClick={() => toast.info("Loading more communities...")}
            className="w-full py-4 border-2 border-dashed border-border rounded-[2rem] text-sm font-bold text-muted-foreground hover:border-primary/20 hover:text-primary transition-all"
          >
            See More Communities
          </button>
        </div>

        <div className="space-y-6">
          <section className="bg-primary rounded-[2.5rem] p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <Trophy className="w-12 h-12 mb-6 text-white/40" />
              <h3 className="text-xl font-bold mb-2">Savings Challenges</h3>
              <p className="text-white/70 text-sm mb-8">Join monthly challenges and earn rewards for consistency.</p>
              
              <div className="space-y-4 mb-8">
                {[
                  { name: 'Aug Fast Saver', prize: '₦5k Bonus', members: '12k' },
                  { name: 'Student Grind', prize: 'Scholarship Info', members: '4k' },
                ].map((challenge, i) => (
                  <div key={i} className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-bold text-sm">{challenge.name}</p>
                      <span className="text-[10px] bg-emerald-500 px-2 py-0.5 rounded-full">{challenge.prize}</span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-[10px] text-white/60 uppercase font-bold">{challenge.members} joining</p>
                      <button 
                        onClick={() => handleJoinChallenge(challenge.name)}
                        className="text-[10px] font-bold uppercase tracking-widest text-white hover:underline"
                      >
                        Join Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full py-4 bg-white text-primary rounded-2xl font-bold text-sm">View All Challenges</button>
            </div>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-16 -mb-16 blur-2xl" />
          </section>

          <div className="bg-card border border-border rounded-[2rem] p-8 shadow-sm">
            <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-6">Circle Guidelines</h3>
            <div className="space-y-6 text-sm">
              <div className="flex gap-4">
                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                <p className="text-muted-foreground leading-relaxed">All funds are held in secure escrow until the goal is met.</p>
              </div>
              <div className="flex gap-4">
                <Users className="w-5 h-5 text-blue-500 shrink-0" />
                <p className="text-muted-foreground leading-relaxed">Invite only trusted friends for private circles.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-card w-full max-w-md p-8 rounded-[2rem] border border-border shadow-2xl"
            >
              <button onClick={() => setShowCreateModal(false)} className="absolute top-6 right-6 p-2 hover:bg-muted rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold mb-6">Start a New Savings Circle</h2>
              <form onSubmit={handleCreate} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Circle Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Travel Junkies" 
                    className="w-full bg-muted border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 ring-primary/20"
                    value={newCircle.name}
                    onChange={(e) => setNewCircle({...newCircle, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Target Goal (₦)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 1,000,000" 
                    className="w-full bg-muted border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 ring-primary/20"
                    value={newCircle.target}
                    onChange={(e) => setNewCircle({...newCircle, target: e.target.value})}
                  />
                </div>
                <button type="submit" className="w-full py-4 bg-primary text-white rounded-2xl font-bold">Launch Circle</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
