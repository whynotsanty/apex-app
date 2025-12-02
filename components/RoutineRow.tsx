import React, { useState, useEffect } from 'react';
import { Routine, Language } from '../types';
import { Check, Briefcase, Zap, Heart, Brain, Flame, Trash2, RefreshCcw } from 'lucide-react';

interface RoutineRowProps {
  routine: Routine;
  onToggleDay: (routineId: string, dayIndex: number) => void;
  onDelete: (routineId: string) => void;
  onReset: (routineId: string) => void;
  lang: Language;
}

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const CategoryIcon = ({ category, colorClass }: { category: string; colorClass: string }) => {
  let Icon = Zap;
  if (category === 'Career') Icon = Briefcase;
  if (category === 'Health') Icon = Heart;
  if (category === 'Mindset') Icon = Brain;

  return (
    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-lg shadow-black/20`}>
      <Icon className="text-white w-5 h-5" />
    </div>
  );
};

export const RoutineRow: React.FC<RoutineRowProps> = ({ routine, onToggleDay, onDelete, onReset }) => {
  const [xpAnimationIndex, setXpAnimationIndex] = useState<number | null>(null);

  useEffect(() => {
    if (xpAnimationIndex !== null) {
        const timer = setTimeout(() => {
            setXpAnimationIndex(null);
        }, 1000); // Match CSS animation duration
        return () => clearTimeout(timer);
    }
  }, [xpAnimationIndex]);

  const handleDayClick = (index: number, isCompleted: boolean) => {
      // Only animate if we are checking the box (adding XP)
      if (!isCompleted) {
          setXpAnimationIndex(index);
      }
      onToggleDay(routine.id, index);
  };

  return (
    <div className="bg-white dark:bg-[#111] rounded-3xl p-5 mb-4 border border-gray-100 dark:border-zinc-800/50 shadow-sm relative overflow-hidden group hover:border-gray-300 dark:hover:border-zinc-700/50 transition-all duration-300">
        {/* Subtle glow effect behind card */}
        <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${routine.iconColor} opacity-50`}></div>

      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <CategoryIcon category={routine.category} colorClass={routine.iconColor} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
                {routine.category}
              </span>
              {routine.streak > 0 && (
                <div className="flex items-center gap-1 bg-orange-100 dark:bg-orange-500/10 px-1.5 py-0.5 rounded-full border border-orange-200 dark:border-orange-500/20">
                    <Flame size={10} className="text-orange-500 fill-orange-500" />
                    <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400">{routine.streak}</span>
                </div>
              )}
            </div>
            <h3 className="text-gray-900 dark:text-white font-semibold text-lg leading-tight">{routine.title}</h3>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2 relative z-10">
                 <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onReset(routine.id);
                    }}
                    className="text-gray-400 hover:text-blue-500 dark:text-zinc-700 dark:hover:text-blue-500 transition-all p-2 cursor-pointer active:scale-95"
                    title="Reset Week (Keep Streak)"
                >
                    <RefreshCcw size={16} />
                </button>
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(routine.id);
                    }}
                    className="text-gray-400 hover:text-red-500 dark:text-zinc-700 dark:hover:text-red-500 transition-colors p-2 cursor-pointer active:scale-95"
                    title="Delete Habit"
                >
                    <Trash2 size={16} />
                </button>
            </div>
            <div className="text-right">
                <p className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${routine.iconColor}`}>
                    {routine.consistency}%
                </p>
            </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-2 px-1">
        {routine.completedDays.map((completed, index) => (
          <div key={index} className="flex flex-col items-center gap-2 relative group/day">
             <span className={`text-xs font-medium transition-colors ${completed ? 'text-gray-400 dark:text-zinc-400' : 'text-gray-300 dark:text-zinc-700'}`}>
                {DAYS[index]}
             </span>
             <button
                onClick={() => handleDayClick(index, completed)}
                className={`relative w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center transition-all duration-300 group/btn ${
                  completed
                    ? `bg-gradient-to-br ${routine.iconColor} text-white shadow-lg shadow-blue-500/20 animate-check-pop`
                    : 'bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-zinc-800 text-transparent hover:border-gray-300 dark:hover:border-zinc-600'
                }`}
             >
                <Check 
                    className={`w-5 h-5 ${completed ? 'scale-100' : 'scale-50 opacity-0'} transition-all duration-300`} 
                    strokeWidth={3} 
                />
             </button>
             {/* XP Popup Animation */}
             {xpAnimationIndex === index && (
                <span className="absolute -top-6 left-1/2 text-[10px] font-bold text-blue-500 pointer-events-none animate-xp-float whitespace-nowrap z-20">
                    +10 XP
                </span>
             )}
          </div>
        ))}
      </div>
    </div>
  );
};