
import React, { useState, useEffect } from 'react';
import { Routine, Language } from '../types';
import { Check, Briefcase, Zap, Heart, Brain, Flame, Trash2, RefreshCcw, FileText, X, Save, AlertTriangle, ShieldCheck } from 'lucide-react';

interface RoutineRowProps {
  routine: Routine;
  onToggleDay: (routineId: string, dayIndex: number) => void;
  onDelete: (routineId: string) => void;
  onReset: (routineId: string) => void;
  onSaveNote: (routineId: string, note: string) => void;
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

export const RoutineRow: React.FC<RoutineRowProps> = ({ routine, onToggleDay, onDelete, onReset, onSaveNote }) => {
  const [xpAnimationIndex, setXpAnimationIndex] = useState<number | null>(null);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState(routine.notes || '');

  // Calculate days since start for negative habits
  const daysClean = routine.type === 'negative' && routine.startDate
    ? Math.floor((Date.now() - routine.startDate) / (1000 * 60 * 60 * 24))
    : 0;

  useEffect(() => {
    if (xpAnimationIndex !== null) {
        const timer = setTimeout(() => {
            setXpAnimationIndex(null);
        }, 1000); 
        return () => clearTimeout(timer);
    }
  }, [xpAnimationIndex]);

  const handleDayClick = (index: number, isCompleted: boolean) => {
      // Logic for Rest Days
      const activeDays = routine.frequency || [0,1,2,3,4,5,6];
      if (!activeDays.includes(index)) return;

      if (!isCompleted) {
          setXpAnimationIndex(index);
      }
      onToggleDay(routine.id, index);
  };

  const handleSaveNote = () => {
      onSaveNote(routine.id, noteText);
      setIsNoteOpen(false);
  }

  return (
    <div className={`rounded-3xl p-5 mb-4 border shadow-sm relative overflow-hidden group hover:border-gray-300 dark:hover:border-zinc-700/50 transition-all duration-300 ${
        routine.type === 'negative' 
        ? 'bg-red-50 dark:bg-red-950/10 border-red-200 dark:border-red-900/20' 
        : 'bg-white dark:bg-[#111] border-gray-100 dark:border-zinc-800/50'
    }`}>
        {/* Glow effect */}
        <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${routine.iconColor} opacity-50`}></div>

      {/* --- NOTE MODAL OVERLAY --- */}
      {isNoteOpen && (
          <div className="absolute inset-0 z-20 bg-white/95 dark:bg-[#111]/95 backdrop-blur-sm flex flex-col p-4 animate-in fade-in">
              <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <FileText size={14} className="text-blue-500" />
                      Journal / Notes
                  </h4>
                  <button onClick={() => setIsNoteOpen(false)} className="text-gray-400 hover:text-red-500">
                      <X size={16} />
                  </button>
              </div>
              <textarea
                  className="flex-1 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-500/50 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-zinc-600"
                  placeholder="How did it feel? Any observations?"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
              />
              <button 
                onClick={handleSaveNote}
                className="mt-2 w-full bg-black dark:bg-white text-white dark:text-black py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2"
              >
                  <Save size={12} /> Save Note
              </button>
          </div>
      )}

      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          {routine.type === 'negative' ? (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-900 flex items-center justify-center shadow-lg shadow-red-500/20">
                  <ShieldCheck className="text-white w-5 h-5" />
              </div>
          ) : (
              <CategoryIcon category={routine.category} colorClass={routine.iconColor} />
          )}
          
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
                {routine.category}
              </span>
              {routine.streak > 0 && routine.type === 'positive' && (
                <div className="flex items-center gap-1 bg-orange-100 dark:bg-orange-500/10 px-1.5 py-0.5 rounded-full border border-orange-200 dark:border-orange-500/20">
                    <Flame size={10} className="text-orange-500 fill-orange-500" />
                    <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400">{routine.streak}</span>
                </div>
              )}
            </div>
            <h3 className="text-gray-900 dark:text-white font-semibold text-lg leading-tight">{routine.title}</h3>
            {routine.target && routine.type === 'positive' && (
                <p className="text-[10px] text-gray-500 dark:text-zinc-500 mt-0.5">
                    Goal: <span className="font-medium text-gray-900 dark:text-zinc-300">{routine.target.value} {routine.target.unit}</span>
                </p>
            )}
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2 relative z-10">
                 <button
                    onClick={() => setIsNoteOpen(true)}
                    className={`transition-all p-2 cursor-pointer active:scale-95 ${routine.notes ? 'text-blue-500' : 'text-gray-400 dark:text-zinc-700 hover:text-blue-500 dark:hover:text-blue-500'}`}
                    title="Add Note"
                 >
                     <FileText size={16} className={routine.notes ? 'fill-blue-500/20' : ''} />
                 </button>
                 
                 {routine.type === 'positive' && (
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
                 )}

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
            
            {routine.type === 'positive' && (
                <div className="text-right">
                    <p className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${routine.iconColor}`}>
                        {routine.consistency}%
                    </p>
                </div>
            )}
        </div>
      </div>

      {/* RENDER BODY */}
      {routine.type === 'positive' ? (
        <div className="flex justify-between items-center mt-2 px-1">
            {routine.completedDays.map((completed, index) => {
            const activeDays = routine.frequency || [0,1,2,3,4,5,6];
            const isRestDay = !activeDays.includes(index);

            return (
                <div key={index} className="flex flex-col items-center gap-2 relative group/day">
                <span className={`text-xs font-medium transition-colors ${completed ? 'text-gray-400 dark:text-zinc-400' : 'text-gray-300 dark:text-zinc-700'}`}>
                    {DAYS[index]}
                </span>
                
                {isRestDay ? (
                    // Rest Day Indicator
                    <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-200 dark:bg-zinc-800"></div>
                    </div>
                ) : (
                    // Active Checkbox
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
                )}
                
                {/* XP Popup Animation */}
                {xpAnimationIndex === index && (
                    <span className="absolute -top-6 left-1/2 text-[10px] font-bold text-blue-500 pointer-events-none animate-xp-float whitespace-nowrap z-20">
                        +10 XP
                    </span>
                )}
                </div>
            )
            })}
        </div>
      ) : (
        /* Negative Habit Card Body */
        <div className="flex items-center justify-between mt-2 bg-white dark:bg-black/20 rounded-2xl p-4 border border-red-100 dark:border-red-900/20">
            <div>
                 <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-1">Sobriety</p>
                 <p className="text-3xl font-bold text-gray-900 dark:text-white">
                     {daysClean} <span className="text-base font-medium text-gray-400 dark:text-zinc-600">Days</span>
                 </p>
            </div>
            
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    if(confirm("Reset counter? This implies a relapse.")) onReset(routine.id);
                }}
                className="px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold text-xs flex items-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
            >
                <AlertTriangle size={14} />
                Relapse
            </button>
        </div>
      )}
    </div>
  );
};
