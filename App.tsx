
import React, { useState, useEffect, useMemo } from 'react';
import { RoutineRow } from './components/RoutineRow';
import { RadialProgress } from './components/RadialProgress';
import { AddRoutineModal } from './components/AddRoutineModal';
import { LandingPage } from './components/LandingPage';
import { BottomNav } from './components/BottomNav';
import { ToDoList } from './components/ToDoList';
import { GuruChat } from './components/GuruChat';
import { PaywallModal } from './components/PaywallModal';
import { FocusTimer } from './components/FocusTimer';
import { AnalyticsHub } from './components/AnalyticsHub';
import { Journal } from './components/Journal';
import { Routine, Language, Tab, Task, JournalEntry } from './types';
import { Plus, BellRing, Trophy, Zap, Crown, Share2, BarChart3, Quote, ChevronRight } from 'lucide-react';

const INITIAL_ROUTINES: Routine[] = [
  {
    id: '1',
    title: 'Get a Promotion',
    category: 'Career',
    type: 'positive',
    consistency: 57,
    completedDays: [true, true, true, true, false, false, false],
    iconColor: 'from-cyan-500 to-blue-600',
    streak: 4,
    frequency: [0,1,2,3,4,5,6]
  },
  {
    id: '2',
    title: 'Wake up at 5am',
    category: 'Growth',
    type: 'positive',
    consistency: 57,
    completedDays: [true, true, true, true, false, false, false],
    iconColor: 'from-pink-500 to-orange-500',
    streak: 4,
    frequency: [0,1,2,3,4,5,6]
  }
];

const QUOTES = [
    "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    "He who has a why to live can bear almost any how.",
    "Discipline is doing what needs to be done, even if you don't want to.",
    "The obstacle is the way.",
    "Waste no more time arguing what a good man should be. Be one.",
    "It does not matter how slowly you go as long as you do not stop.",
    "Your future is created by what you do today, not tomorrow."
];

const LEVELS = [
    { name: 'Novice', threshold: 0, color: 'text-gray-400' },
    { name: 'Apprentice', threshold: 100, color: 'text-emerald-400' },
    { name: 'Architect', threshold: 300, color: 'text-blue-400' },
    { name: 'Executioner', threshold: 600, color: 'text-purple-400' },
    { name: 'Titan', threshold: 1000, color: 'text-amber-400' },
    { name: 'God Mode', threshold: 2000, color: 'text-red-500' },
];

export default function App() {
  const language: Language = 'en';

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
      if (saved) {
          const parsed = JSON.parse(saved);
          return parsed.map((r: any) => ({ ...r, type: r.type || 'positive' }));
      }
      return INITIAL_ROUTINES;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
      const saved = localStorage.getItem('apex_tasks');
      return saved ? JSON.parse(saved) : [];
  });

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
      const saved = localStorage.getItem('apex_journal');
      return saved ? JSON.parse(saved) : [];
  });
  
  const [dailyQuote, setDailyQuote] = useState("");

  useEffect(() => {
      setDailyQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  useEffect(() => {
      localStorage.setItem('apex_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
      localStorage.setItem('apex_journal', JSON.stringify(journalEntries));
  }, [journalEntries]);

  const [xp, setXp] = useState<number>(() => {
      const saved = localStorage.getItem('apex_xp');
      return saved ? parseInt(saved) : 0;
  });

  const [isPro, setIsPro] = useState<boolean>(() => {
      return localStorage.getItem('apex_is_pro') === 'true';
  });

  const [activeTab, setActiveTab] = useState<Tab>('tracker');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isFocusTimerOpen, setIsFocusTimerOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }
    localStorage.setItem('apex_theme', theme);
  }, [theme]);

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
      const next = LEVELS[levelIdx + 1] || { threshold: xp * 1.5, name: 'Legend', color: 'text-red-500' };
      
      const xpInLevel = xp - current.threshold;
      const xpNeeded = next.threshold - current.threshold;
      const progress = Math.min(100, Math.round((xpInLevel / xpNeeded) * 100));

      return {
          level: levelIdx + 1,
          title: current.name,
          progress,
          xp,
          nextThreshold: next.threshold,
          color: current.color
      };
  }, [xp]);

  const stats = useMemo(() => {
    let totalScheduled = 0;
    let completedScheduled = 0;

    routines.filter(r => r.type === 'positive').forEach(r => {
        const activeDays = r.frequency || [0,1,2,3,4,5,6];
        totalScheduled += activeDays.length;
        completedScheduled += r.completedDays.filter((done, idx) => done && activeDays.includes(idx)).length;
    });

    const percentage = totalScheduled === 0 ? 0 : Math.round((completedScheduled / totalScheduled) * 100);
    const onTrack = routines.filter(r => r.consistency >= 80).length;

    return { completedTasks: completedScheduled, totalTasks: totalScheduled, percentage, onTrack };
  }, [routines]);

  const handleToggleDay = (routineId: string, dayIndex: number) => {
    setRoutines(prev => prev.map(routine => {
      if (routine.id !== routineId) return routine;

      const newDays = [...routine.completedDays];
      const isNowCompleted = !newDays[dayIndex];
      newDays[dayIndex] = isNowCompleted;

      const activeDays = routine.frequency || [0,1,2,3,4,5,6];
      const activeCompletions = newDays.filter((done, idx) => done && activeDays.includes(idx)).length;
      const newConsistency = activeDays.length > 0 
         ? Math.round((activeCompletions / activeDays.length) * 100)
         : 0;
      
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

  const handleAddTask = (newTask: Task) => {
      setTasks(prev => [newTask, ...prev]);
  };

  const handleToggleTask = (id: string) => {
      setTasks(prev => prev.map(t => {
          if (t.id === id) {
              const newState = !t.completed;
              handleTaskXp(newState ? 5 : -5);
              return { ...t, completed: newState };
          }
          return t;
      }));
  };

  const handleDeleteTask = (id: string) => {
      setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleDeleteRoutine = (id: string) => {
      setRoutines(prev => prev.filter(r => r.id !== id));
      setToastMessage("Routine deleted.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
  };

  const handleResetRoutine = (id: string) => {
      setRoutines(prev => prev.map(routine => {
          if (routine.id !== id) return routine;
          if (routine.type === 'negative') return { ...routine, startDate: Date.now() };
          return {
              ...routine,
              completedDays: [false, false, false, false, false, false, false], 
              consistency: 0,
          };
      }));
      setToastMessage("Week reset! Streak preserved.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
  }

  const handleSaveNote = (id: string, note: string) => {
      const targetRoutine = routines.find(r => r.id === id);
      if (!targetRoutine) return;

      setRoutines(prev => prev.map(r => r.id === id ? { ...r, notes: note } : r));

      const today = new Date().toISOString().split('T')[0];
      setJournalEntries(prev => {
          const existingEntryIndex = prev.findIndex(e => e.date === today);
          const newHabitNote = {
              routineId: id,
              routineTitle: targetRoutine.title,
              note: note,
              timestamp: Date.now()
          };

          if (existingEntryIndex >= 0) {
              const updated = [...prev];
              const existingLog = updated[existingEntryIndex].habitLog || [];
              updated[existingEntryIndex] = {
                  ...updated[existingEntryIndex],
                  habitLog: [...existingLog, newHabitNote]
              };
              return updated;
          } else {
              return [...prev, {
                  date: today,
                  content: '',
                  mood: 'neutral',
                  habitLog: [newHabitNote]
              }];
          }
      });

      setToastMessage("Note Saved to Journal");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
  };

  const handleSaveJournalEntry = (entry: JournalEntry) => {
      setJournalEntries(prev => {
          const idx = prev.findIndex(e => e.date === entry.date);
          if (idx >= 0) {
              const updated = [...prev];
              updated[idx] = entry;
              return updated;
          }
          return [...prev, entry];
      });
      setToastMessage("Journal Updated");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
  };

  const handleAddRoutines = (newRoutines: Routine[]) => {
      setRoutines(prev => [...prev, ...newRoutines]);
      setActiveTab('tracker'); 
      setToastMessage("Add Routine Success");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
  };

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleUpgrade = () => {
      setIsPro(true);
      setIsPaywallOpen(false);
      setToastMessage("Welcome to Apex Pro");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
  };

  const handleEnter = () => setHasEntered(true);

  const handleShare = () => {
      const text = `🔥 Apex Tracker Update\nLevel: ${currentLevelInfo.title}\nXP: ${currentLevelInfo.xp}\nActive Habits: ${routines.length}\n\nJoin me on Apex.`;
      if (navigator.share) {
          navigator.share({ title: 'My Apex Stats', text: text }).catch(console.error);
      } else {
          navigator.clipboard.writeText(text);
          setToastMessage("Stats copied to clipboard!");
          setShowToast(true);
          setTimeout(() => setShowToast(false), 2000);
      }
  };

  const handleFocusComplete = (minutes: number) => {
      setXp(prev => prev + 50);
      setToastMessage(`Focus Session Complete! +50 XP`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
  };

  if (!hasEntered) return <LandingPage onEnter={handleEnter} lang={language} />;

  return (
    <div className="h-[100dvh] bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-white selection:bg-blue-500/30 animate-in fade-in duration-500 flex flex-col transition-colors duration-300 overflow-hidden">
      
      {showToast && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-white text-black px-6 py-3 rounded-full shadow-xl font-semibold flex items-center gap-2 animate-in slide-in-from-top-4 fade-in pointer-events-none text-sm whitespace-nowrap border dark:border-zinc-800">
              <BellRing size={16} className="text-blue-500" />
              {toastMessage}
          </div>
      )}

      {/* Header (Gamified HUD) */}
      <header className="flex-shrink-0 w-full z-10 bg-white/90 dark:bg-[#050505]/90 backdrop-blur-md border-b border-gray-200 dark:border-zinc-900/50 transition-colors duration-300">
        <div className="max-w-md mx-auto px-5 h-20 flex items-center justify-between gap-4">
           
           {/* Brand & Theme */}
           <div className="flex flex-col gap-0.5 flex-shrink-0">
               <div className="flex items-center gap-2">
                   <span className="font-bold text-xl tracking-tight flex items-center gap-2">
                     <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6]"></div>
                     Apex.
                   </span>
                   {isPro && (
                       <span className="bg-amber-500/10 text-amber-500 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-500/20 flex items-center gap-1">
                           <Crown size={8} /> PRO
                       </span>
                   )}
               </div>
               <button onClick={toggleTheme} className="text-[10px] text-gray-400 dark:text-zinc-500 hover:text-black dark:hover:text-white flex items-center gap-1">
                   {theme === 'dark' ? 'Dark' : 'Light'}
               </button>
           </div>

           {/* XP HUD - Always Visible */}
           <div className="flex-1 flex items-center justify-end gap-3">
                <div className="flex flex-col items-end min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-black uppercase tracking-tighter ${currentLevelInfo.color}`}>
                            {currentLevelInfo.title}
                        </span>
                        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-800">
                            <Zap size={10} className="text-blue-500 fill-blue-500" />
                            <span className="text-[10px] font-bold text-gray-600 dark:text-zinc-400">{currentLevelInfo.xp} XP</span>
                        </div>
                    </div>
                    <div className="w-24 h-1.5 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-700 ease-out shadow-[0_0_8px_rgba(59,130,246,0.4)]"
                            style={{ width: `${currentLevelInfo.progress}%` }}
                        />
                    </div>
                </div>

                {/* Level Hexagon Emblema */}
                <div 
                  onClick={() => setIsAnalyticsOpen(true)}
                  className="w-12 h-12 flex-shrink-0 cursor-pointer relative group flex items-center justify-center"
                >
                    <div className={`absolute inset-0 bg-gradient-to-br ${currentLevelInfo.color.replace('text-', 'from-').replace('-400', '-500')} to-blue-600 rounded-xl rotate-45 group-hover:rotate-90 transition-transform duration-500 shadow-lg opacity-20`}></div>
                    <div className="relative z-10 flex flex-col items-center">
                        <span className="text-[10px] font-black leading-none text-gray-400 dark:text-zinc-500 uppercase">LVL</span>
                        <span className="text-xl font-black leading-none text-gray-900 dark:text-white">{currentLevelInfo.level}</span>
                    </div>
                    {/* Small pulse for "level up" vibe */}
                    <div className="absolute inset-0 border-2 border-blue-500/20 rounded-xl rotate-45 animate-pulse"></div>
                </div>
           </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar w-full">
        <div className="max-w-md mx-auto px-5 py-6 pb-32">
        
        {activeTab === 'tracker' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-zinc-100 to-white dark:from-zinc-900 dark:to-[#111] border border-gray-100 dark:border-zinc-800 flex gap-3 items-start">
                    <Quote size={20} className="text-blue-500/50 flex-shrink-0 mt-0.5 fill-current" />
                    <div>
                        <p className="text-sm text-gray-700 dark:text-zinc-300 font-medium italic leading-relaxed">"{dailyQuote}"</p>
                    </div>
                </div>

                <section className="bg-white dark:bg-[#111] rounded-[2.5rem] p-6 mb-8 border border-gray-100 dark:border-zinc-800 shadow-xl relative overflow-hidden transition-colors duration-300">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-blue-600/10 dark:bg-blue-600/20 blur-[60px] rounded-full pointer-events-none"></div>
                    
                    <div className="absolute top-4 right-4 flex gap-2">
                        <button onClick={() => setIsAnalyticsOpen(true)} className="text-gray-300 dark:text-zinc-700 hover:text-blue-500 transition-colors p-1"><BarChart3 size={18} /></button>
                        <button onClick={handleShare} className="text-gray-300 dark:text-zinc-700 hover:text-blue-500 transition-colors p-1"><Share2 size={18} /></button>
                    </div>

                    <div className="flex items-center justify-between gap-6 relative z-10">
                        <RadialProgress percentage={stats.percentage} theme={theme} />
                        <div className="flex-1 space-y-6">
                            <div>
                                <p className="text-[10px] text-gray-500 dark:text-zinc-500 uppercase tracking-widest font-semibold mb-1">Weekly Volume</p>
                                <p className="text-3xl font-bold text-blue-600 dark:text-blue-500 leading-none">
                                    {stats.completedTasks}<span className="text-gray-400 dark:text-zinc-600 text-xl font-normal">/{stats.totalTasks}</span>
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 dark:text-zinc-500 uppercase tracking-widest font-semibold mb-1">On Track</p>
                                <p className="text-3xl font-bold text-cyan-600 dark:text-cyan-400 leading-none">
                                    {stats.onTrack}<span className="text-gray-400 dark:text-zinc-600 text-xl font-normal">/{routines.filter(r => r.type === 'positive').length}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    {routines.map(routine => (
                        <RoutineRow 
                            key={routine.id} routine={routine} onToggleDay={handleToggleDay}
                            onDelete={handleDeleteRoutine} onReset={handleResetRoutine}
                            onSaveNote={handleSaveNote} lang={language}
                        />
                    ))}
                    {routines.length === 0 && (
                        <div className="text-center py-10 opacity-50 text-gray-500"><p>No routines yet. Start your journey.</p></div>
                    )}
                </section>

                <div className="mt-8">
                    <button onClick={() => setIsModalOpen(true)} className="group w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-300 hover:text-black dark:hover:text-white rounded-2xl p-4 flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all active:scale-95 shadow-sm">
                        <Plus className="w-5 h-5" />
                        <span className="font-semibold">Add Routine</span>
                    </button>
                    {!isPro && <p className="text-center text-[10px] text-zinc-500 mt-2">Free Plan: {routines.length}/10 Habits used</p>}
                </div>
            </div>
        )}

        {activeTab === 'journal' && <Journal entries={journalEntries} onSaveEntry={handleSaveJournalEntry} tasks={tasks} />}
        {activeTab === 'tasks' && (
            <ToDoList 
                lang={language} onStartFocus={() => setIsFocusTimerOpen(true)}
                tasks={tasks} onAddTask={handleAddTask}
                onToggleTask={handleToggleTask} onDeleteTask={handleDeleteTask}
            />
        )}
        {activeTab === 'guru' && (
            <GuruChat 
                lang={language} onAddRoutines={handleAddRoutines} isPro={isPro}
                onShowPaywall={() => setIsPaywallOpen(true)} currentRoutineCount={routines.length}
            />
        )}
        </div>
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} onOpenPro={() => setIsPaywallOpen(true)} isPro={isPro} />
      <AddRoutineModal 
        isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddRoutines={handleAddRoutines}
        lang={language} currentRoutineCount={routines.length} isPro={isPro} onShowPaywall={() => setIsPaywallOpen(true)}
      />
      <PaywallModal isOpen={isPaywallOpen} onClose={() => setIsPaywallOpen(false)} onUpgrade={handleUpgrade} />
      <FocusTimer isOpen={isFocusTimerOpen} onClose={() => setIsFocusTimerOpen(false)} onComplete={handleFocusComplete} />
      <AnalyticsHub isOpen={isAnalyticsOpen} onClose={() => setIsAnalyticsOpen(false)} routines={routines} tasks={tasks} xp={xp} level={currentLevelInfo.level} />
    </div>
  );
}
