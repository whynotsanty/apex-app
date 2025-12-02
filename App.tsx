import React, { useState, useEffect, useMemo } from 'react';
import { RoutineRow } from './components/RoutineRow';
import { RadialProgress } from './components/RadialProgress';
import { AddRoutineModal } from './components/AddRoutineModal';
import { LandingPage } from './components/LandingPage';
import { BottomNav } from './components/BottomNav';
import { ToDoList } from './components/ToDoList';
import { GuruChat } from './components/GuruChat';
import { PaywallModal } from './components/PaywallModal';
import { Routine, Language, Tab } from './types';
import { Plus, BellRing, Sun, Moon, Trophy, Zap, Crown, Share2 } from 'lucide-react';

const INITIAL_ROUTINES: Routine[] = [
  {
    id: '1',
    title: 'Get a Promotion',
    category: 'Career',
    consistency: 57,
    completedDays: [true, true, true, true, false, false, false],
    iconColor: 'from-cyan-500 to-blue-600',
    streak: 4
  },
  {
    id: '2',
    title: 'Wake up at 5am',
    category: 'Growth',
    consistency: 57,
    completedDays: [true, true, true, true, false, false, false],
    iconColor: 'from-pink-500 to-orange-500',
    streak: 4
  }
];

const TEXT = {
    weeklyVolume: "Weekly Volume",
    onTrack: "On Track",
    emptyState: "No routines yet. Start your journey.",
    addRoutine: "Add Routine",
    resetWeekMsg: "Week reset! Streak preserved.",
    deleteMsg: "Routine deleted."
};

const LEVELS = [
    { name: 'Novice', threshold: 0 },
    { name: 'Apprentice', threshold: 100 },
    { name: 'Architect', threshold: 300 },
    { name: 'Executioner', threshold: 600 },
    { name: 'Titan', threshold: 1000 },
    { name: 'God Mode', threshold: 2000 },
];

export default function App() {
  // Always English
  const language: Language = 'en';

  // Theme State
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('apex_theme');
        return (saved as 'dark' | 'light') || 'dark';
    }
    return 'dark';
  });

  const [hasEntered, setHasEntered] = useState<boolean>(() => {
      return localStorage.getItem('apex_hasEntered') === 'true';
  });

  const [routines, setRoutines] = useState<Routine[]>(() => {
      const saved = localStorage.getItem('apex_routines');
      return saved ? JSON.parse(saved) : INITIAL_ROUTINES;
  });

  // XP State
  const [xp, setXp] = useState<number>(() => {
      const saved = localStorage.getItem('apex_xp');
      return saved ? parseInt(saved) : 0;
  });

  // PRO State
  const [isPro, setIsPro] = useState<boolean>(() => {
      return localStorage.getItem('apex_is_pro') === 'true';
  });

  const [activeTab, setActiveTab] = useState<Tab>('tracker');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Apply Theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }
    localStorage.setItem('apex_theme', theme);
  }, [theme]);

  // Persistence
  useEffect(() => {
      localStorage.setItem('apex_routines', JSON.stringify(routines));
  }, [routines]);

  useEffect(() => {
      localStorage.setItem('apex_hasEntered', String(hasEntered));
  }, [hasEntered]);

  useEffect(() => {
      localStorage.setItem('apex_xp', String(xp));
  }, [xp]);

  useEffect(() => {
      localStorage.setItem('apex_is_pro', String(isPro));
  }, [isPro]);

  // Notifications Logic
  useEffect(() => {
    if (!hasEntered) return;

    if ('Notification' in window && Notification.permission === 'default') {
        // Notification.requestPermission(); // Move this to user action to avoid browser blocking
    }

    const checkReminder = setInterval(() => {
        // Interval logic
    }, 60000);

    return () => {
        clearInterval(checkReminder);
    };
  }, [hasEntered]);

  // Derived Level Logic
  const currentLevelInfo = useMemo(() => {
      let levelIdx = 0;
      for (let i = 0; i < LEVELS.length; i++) {
          if (xp >= LEVELS[i].threshold) {
              levelIdx = i;
          } else {
              break;
          }
      }
      const current = LEVELS[levelIdx];
      const next = LEVELS[levelIdx + 1] || { threshold: xp * 1.5 }; // Fallback for max level
      
      const xpInLevel = xp - current.threshold;
      const xpNeeded = next.threshold - current.threshold;
      const progress = Math.min(100, Math.round((xpInLevel / xpNeeded) * 100));

      return {
          level: levelIdx + 1,
          title: current.name,
          progress,
          xp,
          nextThreshold: next.threshold
      };
  }, [xp]);

  // Calculate global stats
  const stats = useMemo(() => {
    const totalTasks = routines.length * 7;
    const completedTasks = routines.reduce((acc, curr) => 
      acc + curr.completedDays.filter(Boolean).length, 0
    );
    const percentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
    const onTrack = routines.filter(r => r.consistency >= 80).length;

    return { completedTasks, totalTasks, percentage, onTrack };
  }, [routines]);

  // DAILY STREAK LOGIC & XP
  const handleToggleDay = (routineId: string, dayIndex: number) => {
    setRoutines(prev => prev.map(routine => {
      if (routine.id !== routineId) return routine;

      const newDays = [...routine.completedDays];
      const isNowCompleted = !newDays[dayIndex];
      newDays[dayIndex] = isNowCompleted;

      const completedCount = newDays.filter(Boolean).length;
      const newConsistency = Math.round((completedCount / 7) * 100);
      
      const newStreak = isNowCompleted 
        ? routine.streak + 1 
        : Math.max(0, routine.streak - 1);

      if (isNowCompleted) {
          setXp(c => c + 10);
      } else {
          setXp(c => Math.max(0, c - 10));
      }

      return {
        ...routine,
        completedDays: newDays,
        consistency: newConsistency,
        streak: newStreak
      };
    }));
  };

  const handleTaskXp = (amount: number) => {
      setXp(prev => Math.max(0, prev + amount));
  };

  const handleDeleteRoutine = (id: string) => {
      setRoutines(prev => {
          const updated = prev.filter(r => r.id !== id);
          return updated;
      });
      setToastMessage(TEXT.deleteMsg);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
  };

  const handleResetRoutine = (id: string) => {
      setRoutines(prev => prev.map(routine => {
          if (routine.id !== id) return routine;
          
          return {
              ...routine,
              completedDays: [false, false, false, false, false, false, false], 
              consistency: 0,
              // Streak remains UNTOUCHED.
          };
      }));

      setToastMessage(TEXT.resetWeekMsg);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
  }

  const handleAddRoutines = (newRoutines: Routine[]) => {
      setRoutines(prev => [...prev, ...newRoutines]);
      setActiveTab('tracker'); 
      setToastMessage(TEXT.addRoutine + " Success");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
  };

  const toggleTheme = () => {
      setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  }

  const handleUpgrade = () => {
      setIsPro(true);
      setIsPaywallOpen(false);
      setToastMessage("Welcome to Apex Pro");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
  };

  const handleEnter = () => {
      setHasEntered(true);
      // Request notifications on user interaction to prevent blocking
      if ('Notification' in window && Notification.permission !== 'granted') {
        Notification.requestPermission();
      }
  };

  const handleShare = () => {
      const text = `🔥 Apex Tracker Update\nLevel: ${currentLevelInfo.title}\nXP: ${currentLevelInfo.xp}\nActive Habits: ${routines.length}\n\nJoin me on Apex.`;
      if (navigator.share) {
          navigator.share({
              title: 'My Apex Stats',
              text: text,
          }).catch(console.error);
      } else {
          navigator.clipboard.writeText(text);
          setToastMessage("Stats copied to clipboard!");
          setShowToast(true);
          setTimeout(() => setShowToast(false), 2000);
      }
  };

  if (!hasEntered) {
    return (
        <LandingPage onEnter={handleEnter} lang={language} />
    );
  }

  return (
    <div className="h-[100dvh] bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-white selection:bg-blue-500/30 animate-in fade-in duration-500 flex flex-col transition-colors duration-300 overflow-hidden">
      
      {/* Toast Notification */}
      {showToast && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-white text-black px-6 py-3 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(255,255,255,0.2)] font-semibold flex items-center gap-2 animate-in slide-in-from-top-4 fade-in pointer-events-none text-sm whitespace-nowrap">
              <BellRing size={16} />
              {toastMessage}
          </div>
      )}

      {/* Header (Gamified HUD) */}
      <header className="flex-shrink-0 w-full z-10 bg-white/90 dark:bg-[#050505]/90 backdrop-blur-md border-b border-gray-200 dark:border-zinc-900/50 transition-colors duration-300">
        <div className="max-w-md mx-auto px-5 h-20 flex items-center justify-between">
           
           {/* Brand & Theme */}
           <div className="flex flex-col gap-0.5">
               <div className="flex items-center gap-2">
                   <span className="font-bold text-xl tracking-tight flex items-center gap-2">
                     <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                     Apex.
                   </span>
                   {isPro && (
                       <span className="bg-amber-500/10 text-amber-500 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-500/20 flex items-center gap-1">
                           <Crown size={8} /> PRO
                       </span>
                   )}
               </div>
               <button onClick={toggleTheme} className="text-[10px] text-gray-400 dark:text-zinc-500 hover:text-black dark:hover:text-white flex items-center gap-1">
                   {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
               </button>
           </div>

           {/* XP Bar & Level */}
           <div className="flex-1 max-w-[180px] ml-4">
                <div className="flex justify-between items-center text-xs mb-1.5 font-bold">
                    <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1">
                        <Trophy size={12} />
                        Lvl {currentLevelInfo.level}
                    </span>
                    <span className="text-gray-400 dark:text-zinc-500 uppercase tracking-wider text-[10px]">
                        {currentLevelInfo.title}
                    </span>
                </div>
                {/* Progress Bar Container */}
                <div className="w-full h-2 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden relative">
                    {/* Progress Fill */}
                    <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                        style={{ width: `${currentLevelInfo.progress}%` }}
                    />
                </div>
                <div className="text-[9px] text-right mt-1 text-gray-400 dark:text-zinc-600 font-mono">
                    {currentLevelInfo.xp} / {currentLevelInfo.nextThreshold} XP
                </div>
           </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar w-full">
        <div className="max-w-md mx-auto px-5 py-6 pb-32">
        
        {activeTab === 'tracker' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Dashboard Stats */}
                <section className="bg-white dark:bg-[#111] rounded-[2.5rem] p-6 mb-8 border border-gray-100 dark:border-zinc-800 shadow-xl dark:shadow-2xl relative overflow-hidden transition-colors duration-300">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-blue-600/10 dark:bg-blue-600/20 blur-[60px] rounded-full pointer-events-none"></div>
                    
                    {/* Share Button (New Viral Feature) */}
                    <button 
                        onClick={handleShare}
                        className="absolute top-4 right-4 text-gray-300 dark:text-zinc-700 hover:text-blue-500 dark:hover:text-blue-500 transition-colors"
                        title="Share Stats"
                    >
                        <Share2 size={18} />
                    </button>

                    <div className="flex items-center justify-between gap-6 relative z-10">
                        <RadialProgress percentage={stats.percentage} theme={theme} />
                        <div className="flex-1 space-y-6">
                            <div>
                                <p className="text-[10px] text-gray-500 dark:text-zinc-500 uppercase tracking-widest font-semibold mb-1">{TEXT.weeklyVolume}</p>
                                <p className="text-3xl font-bold text-blue-600 dark:text-blue-500 leading-none">
                                    {stats.completedTasks}<span className="text-gray-400 dark:text-zinc-600 text-xl font-normal">/{stats.totalTasks}</span>
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 dark:text-zinc-500 uppercase tracking-widest font-semibold mb-1">{TEXT.onTrack}</p>
                                <p className="text-3xl font-bold text-cyan-600 dark:text-cyan-400 leading-none">
                                    {stats.onTrack}<span className="text-gray-400 dark:text-zinc-600 text-xl font-normal">/{routines.length}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Routines List */}
                <section className="space-y-4">
                    {routines.map(routine => (
                        <RoutineRow 
                            key={routine.id} 
                            routine={routine} 
                            onToggleDay={handleToggleDay}
                            onDelete={handleDeleteRoutine}
                            onReset={handleResetRoutine}
                            lang={language}
                        />
                    ))}
                    
                    {routines.length === 0 && (
                        <div className="text-center py-10 opacity-50 text-gray-500 dark:text-zinc-500">
                            <p>{TEXT.emptyState}</p>
                        </div>
                    )}
                </section>

                {/* Add Button */}
                <div className="mt-8">
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="group w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-300 hover:text-black dark:hover:text-white rounded-2xl p-4 flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 transition-all active:scale-95 shadow-sm"
                    >
                        <Plus className="w-5 h-5" />
                        <span className="font-semibold">{TEXT.addRoutine}</span>
                    </button>
                    {!isPro && (
                        <p className="text-center text-[10px] text-zinc-500 mt-2">
                            Free Plan: {routines.length}/10 Habits used
                        </p>
                    )}
                </div>
            </div>
        )}

        {activeTab === 'tasks' && <ToDoList lang={language} onXpGain={handleTaskXp} />}
        
        {activeTab === 'guru' && (
            <GuruChat 
                lang={language} 
                onAddRoutines={handleAddRoutines} 
                isPro={isPro}
                onShowPaywall={() => setIsPaywallOpen(true)}
                currentRoutineCount={routines.length}
            />
        )}
        </div>

      </main>

      <BottomNav 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onOpenPro={() => setIsPaywallOpen(true)}
        isPro={isPro}
      />

      <AddRoutineModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAddRoutines={handleAddRoutines}
        lang={language}
        currentRoutineCount={routines.length}
        isPro={isPro}
        onShowPaywall={() => setIsPaywallOpen(true)}
      />

      <PaywallModal 
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        onUpgrade={handleUpgrade}
      />
    </div>
  );
}