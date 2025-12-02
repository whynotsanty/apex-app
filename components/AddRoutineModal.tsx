
import React, { useState, useEffect } from 'react';
import { X, Sparkles, Loader2, Plus, Settings2, Edit3, Check, CheckSquare, Square, Crown, Lock, BookOpen } from 'lucide-react';
import { generateRoutineSuggestions } from '../services/geminiService';
import { Routine, Language, Blueprint } from '../types';

interface AddRoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRoutines: (routines: Routine[]) => void;
  currentRoutineCount: number;
  isPro: boolean;
  onShowPaywall: () => void;
  lang: Language;
}

type Mode = 'ai' | 'manual' | 'titans';

// Predefined Titans Data
const TITAN_BLUEPRINTS: Blueprint[] = [
    {
        id: 'titan-1',
        author: 'Elon Musk',
        title: 'Tech Titan Protocol',
        description: 'Maximize efficiency with 5-minute time blocks and rapid execution.',
        routines: [
            { title: 'Email Triage (5 min blocks)', category: 'Career', iconColor: 'from-cyan-500 to-blue-600' },
            { title: 'Skip Breakfast', category: 'Health', iconColor: 'from-orange-400 to-red-500' },
            { title: 'Critical Design Review', category: 'Career', iconColor: 'from-cyan-500 to-blue-600' },
            { title: 'Sleep 6 Hours', category: 'Health', iconColor: 'from-purple-500 to-indigo-600' }
        ]
    },
    {
        id: 'titan-2',
        author: 'David Goggins',
        title: 'Stay Hard Routine',
        description: 'Callous your mind. Do what you hate.',
        routines: [
            { title: '4:00 AM Run (10 miles)', category: 'Health', iconColor: 'from-orange-400 to-red-500' },
            { title: 'Stretch (2 hours)', category: 'Health', iconColor: 'from-pink-500 to-rose-500' },
            { title: 'Study / Work', category: 'Career', iconColor: 'from-cyan-500 to-blue-600' },
            { title: 'Visualization', category: 'Mindset', iconColor: 'from-purple-500 to-indigo-600' }
        ]
    },
    {
        id: 'titan-3',
        author: 'Marcus Aurelius',
        title: 'Stoic Emperor',
        description: 'Find stillness in chaos. Logic over emotion.',
        routines: [
            { title: 'Morning Journaling', category: 'Mindset', iconColor: 'from-purple-500 to-indigo-600' },
            { title: 'Cold Bath / Wash', category: 'Health', iconColor: 'from-blue-400 to-cyan-500' },
            { title: 'Eat Plainly', category: 'Health', iconColor: 'from-green-500 to-emerald-600' },
            { title: 'Evening Reflection', category: 'Mindset', iconColor: 'from-purple-500 to-indigo-600' }
        ]
    },
    {
        id: 'titan-4',
        author: 'Cristiano Ronaldo',
        title: 'CR7 Consistency',
        description: 'Elite performance via polyphasic sleep and strict nutrition.',
        routines: [
            { title: '90min Sleep Cycle', category: 'Health', iconColor: 'from-purple-500 to-indigo-600' },
            { title: 'Clean Eating (6 meals)', category: 'Health', iconColor: 'from-green-500 to-emerald-600' },
            { title: 'Ice Bath Recovery', category: 'Health', iconColor: 'from-blue-400 to-cyan-500' },
            { title: 'Technical Drills', category: 'Career', iconColor: 'from-cyan-500 to-blue-600' }
        ]
    }
];

export const AddRoutineModal: React.FC<AddRoutineModalProps> = ({ 
    isOpen, onClose, onAddRoutines, currentRoutineCount, isPro, onShowPaywall 
}) => {
  const [mode, setMode] = useState<Mode>('ai');
  
  // AI State
  const [goal, setGoal] = useState('');
  const [routineCount, setRoutineCount] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Partial<Routine>[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  // Manual State
  const [manualTitle, setManualTitle] = useState('');
  const [manualCategory, setManualCategory] = useState<Routine['category']>('Growth');

  const resetAndClose = () => {
    onClose();
    setGoal('');
    setSuggestions([]);
    setSelectedIndices([]);
    setRoutineCount(3);
    setManualTitle('');
    setManualCategory('Growth');
    setMode('ai');
  };

  useEffect(() => {
    if (!isOpen) {
        resetAndClose();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // --- Limit Check Logic ---
  const MAX_FREE_HABITS = 10;
  const isLimitReached = !isPro && currentRoutineCount >= MAX_FREE_HABITS;

  const handleGenerate = async () => {
    if (isLimitReached) {
        onShowPaywall();
        return;
    }
    if (!goal.trim()) return;
    setIsLoading(true);
    const results = await generateRoutineSuggestions(goal, routineCount);
    setSuggestions(results);
    setSelectedIndices(results.map((_, i) => i));
    setIsLoading(false);
  };

  const toggleSelection = (index: number) => {
      setSelectedIndices(prev => 
        prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
      );
  };

  const handleAcceptAI = () => {
    // Double check limit before adding
    if (isLimitReached) {
        onShowPaywall();
        return;
    }

    const selectedSuggestions = suggestions.filter((_, i) => selectedIndices.includes(i));
    
    // If adding these exceeds limit? We let them add up to the limit or block? 
    // For simplicity, just block if they are ALREADY at limit.
    
    const newRoutines: Routine[] = selectedSuggestions.map(s => ({
        id: s.id!,
        title: s.title!,
        category: s.category as any,
        consistency: 0,
        completedDays: [false, false, false, false, false, false, false],
        iconColor: s.iconColor!,
        streak: 0
    }));
    onAddRoutines(newRoutines);
    resetAndClose();
  };

  const handleAddManual = () => {
      if (isLimitReached) {
          onShowPaywall();
          return;
      }

      if (!manualTitle.trim()) return;
      
      const categoryColors: Record<string, string> = {
        'Career': 'from-cyan-500 to-blue-600',
        'Growth': 'from-pink-500 to-rose-500',
        'Health': 'from-orange-400 to-red-500',
        'Mindset': 'from-purple-500 to-indigo-600',
      };

      const newRoutine: Routine = {
          id: `manual-${Date.now()}`,
          title: manualTitle,
          category: manualCategory,
          consistency: 0,
          completedDays: [false, false, false, false, false, false, false],
          iconColor: categoryColors[manualCategory] || 'from-gray-500 to-gray-700',
          streak: 0
      };

      onAddRoutines([newRoutine]);
      resetAndClose();
  };

  const handleImportTitan = (blueprint: Blueprint) => {
      if (!isPro) {
          onShowPaywall();
          return;
      }
      
      // Map blueprint routines to full routines
      const newRoutines: Routine[] = blueprint.routines.map((r, i) => ({
        id: `titan-${blueprint.id}-${i}-${Date.now()}`,
        title: r.title || 'Titan Habit',
        category: (r.category as any) || 'Growth',
        consistency: 0,
        completedDays: [false, false, false, false, false, false, false],
        iconColor: r.iconColor || 'from-gray-500 to-gray-700',
        streak: 0
      }));

      onAddRoutines(newRoutines);
      resetAndClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-zinc-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] transition-colors duration-300">
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[50px] pointer-events-none"></div>

        <button 
            onClick={resetAndClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-black dark:text-zinc-500 dark:hover:text-white transition-colors z-10"
        >
            <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">New Protocol</h2>

        {/* Limit Warning */}
        {isLimitReached && (
            <div onClick={onShowPaywall} className="mb-4 bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-amber-500/20 transition-colors">
                <Crown size={20} className="text-amber-500 flex-shrink-0" />
                <div className="flex-1">
                    <p className="text-xs font-bold text-amber-500 uppercase">Free Limit Reached (10/10)</p>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Upgrade to Pro for unlimited habits.</p>
                </div>
                <Lock size={14} className="text-amber-500" />
            </div>
        )}

        {/* Tabs */}
        <div className="flex bg-gray-100 dark:bg-zinc-900 rounded-xl p-1 mb-6 border border-gray-200 dark:border-zinc-800 flex-shrink-0">
            <button 
                onClick={() => setMode('ai')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all ${
                    mode === 'ai' 
                    ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-500 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300'
                }`}
            >
                <Sparkles size={14} />
                AI
            </button>
            <button 
                onClick={() => setMode('manual')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all ${
                    mode === 'manual' 
                    ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-500 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300'
                }`}
            >
                <Edit3 size={14} />
                Manual
            </button>
            <button 
                onClick={() => setMode('titans')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all ${
                    mode === 'titans' 
                    ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-500 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300'
                }`}
            >
                <Crown size={14} className={mode === 'titans' ? 'text-amber-500' : ''} />
                Titans
            </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-1 min-h-0">
            {mode === 'ai' && (
                /* AI Mode Content */
                <div className="space-y-5 pb-4">
                    {suggestions.length === 0 && (
                    <div>
                        <label className="text-xs font-semibold text-gray-500 dark:text-zinc-500 uppercase tracking-wider mb-2 block">Main Goal</label>
                        <input
                            type="text"
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            placeholder="e.g. Become a marathon runner"
                            disabled={isLimitReached}
                            className="w-full bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                        />
                    </div>
                    )}

                    {suggestions.length === 0 && (
                    <div className="bg-gray-50 dark:bg-zinc-900/30 p-4 rounded-xl border border-gray-200 dark:border-zinc-800/50">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                                <Settings2 size={14} className="text-gray-400 dark:text-zinc-400" />
                                <label className="text-sm text-gray-600 dark:text-zinc-300 font-medium">Intensity</label>
                            </div>
                            <span className="text-xs font-bold bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-500/20">
                                {routineCount} Habits
                            </span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="5"
                            step="1"
                            value={routineCount}
                            onChange={(e) => setRoutineCount(parseInt(e.target.value))}
                            disabled={isLimitReached}
                            className="w-full h-1.5 bg-gray-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-50"
                        />
                    </div>
                    )}

                    {suggestions.length === 0 && (
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading || !goal || isLimitReached}
                            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 mt-4"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : "Generate with AI"}
                        </button>
                    )}

                    {suggestions.length > 0 && (
                        <div className="space-y-3 mt-0 animate-in slide-in-from-bottom-4 duration-300">
                            <div className="flex justify-between items-end mb-2">
                                <p className="text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-wider">Suggested Protocol</p>
                                <p className="text-[10px] text-gray-400 dark:text-zinc-600">{selectedIndices.length} Selected</p>
                            </div>
                            
                            <div className="space-y-2">
                            {suggestions.map((s, index) => {
                                const isSelected = selectedIndices.includes(index);
                                return (
                                    <div 
                                        key={s.id} 
                                        onClick={() => toggleSelection(index)}
                                        className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                                            isSelected 
                                            ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/30' 
                                            : 'bg-white dark:bg-zinc-900/80 border-gray-200 dark:border-zinc-800 opacity-60 hover:opacity-100'
                                        }`}
                                    >
                                        <div className={`flex-shrink-0 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-300 dark:text-zinc-600'}`}>
                                            {isSelected ? <CheckSquare size={20} /> : <Square size={20} />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${s.iconColor}`} />
                                                <p className={`text-sm font-medium ${isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-zinc-500'}`}>{s.title}</p>
                                            </div>
                                            <p className="text-[10px] text-gray-400 dark:text-zinc-600 uppercase tracking-wide pl-3.5">{s.category}</p>
                                        </div>
                                    </div>
                                );
                            })}
                            </div>
                            <button
                                onClick={handleAcceptAI}
                                disabled={selectedIndices.length === 0 || isLimitReached}
                                className="w-full mt-4 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(255,255,255,0.1)] sticky bottom-0 z-10"
                            >
                                <Check size={20} />
                                Add Selected ({selectedIndices.length})
                            </button>
                        </div>
                    )}
                </div>
            )}
            
            {mode === 'manual' && (
                /* Manual Mode Content */
                <div className="space-y-5">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 dark:text-zinc-500 uppercase tracking-wider mb-2 block">Routine Title</label>
                        <input
                            type="text"
                            value={manualTitle}
                            onChange={(e) => setManualTitle(e.target.value)}
                            placeholder="e.g. Read 10 pages"
                            disabled={isLimitReached}
                            className="w-full bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            onKeyDown={(e) => e.key === 'Enter' && handleAddManual()}
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-500 dark:text-zinc-500 uppercase tracking-wider mb-2 block">Category</label>
                        <div className="grid grid-cols-2 gap-3">
                            {['Career', 'Growth', 'Health', 'Mindset'].map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setManualCategory(cat as any)}
                                    disabled={isLimitReached}
                                    className={`p-3 rounded-xl text-sm font-medium border transition-all ${
                                        manualCategory === cat 
                                        ? 'bg-gray-100 dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-white shadow-sm' 
                                        : 'bg-gray-50 dark:bg-zinc-900/30 border-gray-200 dark:border-zinc-800/50 text-gray-500 dark:text-zinc-500 hover:border-gray-300 dark:hover:border-zinc-700'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleAddManual}
                        disabled={!manualTitle || isLimitReached}
                        className="w-full mt-8 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-zinc-200 disabled:opacity-50 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                    >
                        <Plus size={20} />
                        Create Routine
                    </button>
                </div>
            )}

            {mode === 'titans' && (
                /* Titans Mode Content */
                <div className="space-y-4">
                     {!isPro && (
                         <div className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20 p-4 rounded-xl flex items-start gap-3 mb-4">
                             <Crown size={20} className="text-amber-500 mt-0.5" />
                             <div>
                                 <p className="text-sm font-bold text-white mb-1">Pro Feature</p>
                                 <p className="text-xs text-zinc-400">Unlock the Library of Titans to replicate the routines of the world's highest performers.</p>
                             </div>
                         </div>
                     )}

                     {TITAN_BLUEPRINTS.map(titan => (
                         <div 
                            key={titan.id}
                            onClick={() => handleImportTitan(titan)}
                            className={`group relative overflow-hidden rounded-2xl border bg-zinc-900 p-5 transition-all cursor-pointer ${
                                !isPro ? 'opacity-75 grayscale hover:grayscale-0' : 'hover:border-blue-500/50'
                            } border-zinc-800`}
                         >
                            {!isPro && (
                                <div className="absolute top-3 right-3 z-10 bg-black/50 p-1.5 rounded-full">
                                    <Lock size={14} className="text-zinc-400" />
                                </div>
                            )}

                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-white text-lg">{titan.author}</h3>
                            </div>
                            <p className="text-xs font-medium text-blue-400 uppercase tracking-wide mb-2">{titan.title}</p>
                            <p className="text-sm text-zinc-400 mb-4 line-clamp-2">{titan.description}</p>
                            
                            <div className="flex flex-wrap gap-2">
                                {titan.routines.slice(0, 3).map((r, i) => (
                                    <span key={i} className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-1 rounded-md border border-zinc-700">
                                        {r.title}
                                    </span>
                                ))}
                                {titan.routines.length > 3 && (
                                    <span className="text-[10px] bg-zinc-800 text-zinc-500 px-2 py-1 rounded-md border border-zinc-700">
                                        +{titan.routines.length - 3}
                                    </span>
                                )}
                            </div>
                         </div>
                     ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
