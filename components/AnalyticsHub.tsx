
import React, { useMemo } from 'react';
import { Routine, Task, Badge } from '../types';
import { X, BarChart3, Flame, Target, Zap, Crown, CheckCircle2, TrendingUp, CalendarDays, ChevronRight } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface AnalyticsHubProps {
  isOpen: boolean;
  onClose: () => void;
  routines: Routine[];
  tasks: Task[];
  xp: number;
  level: number;
}

const LEVELS = [
    { name: 'Novice', threshold: 0 },
    { name: 'Apprentice', threshold: 100 },
    { name: 'Architect', threshold: 300 },
    { name: 'Executioner', threshold: 600 },
    { name: 'Titan', threshold: 1000 },
    { name: 'God Mode', threshold: 2000 },
];

export const AnalyticsHub: React.FC<AnalyticsHubProps> = ({ isOpen, onClose, routines, tasks, xp, level }) => {
  if (!isOpen) return null;

  const currentLevel = LEVELS[level - 1] || LEVELS[0];
  const nextLevel = LEVELS[level] || { name: 'Max Level', threshold: xp };
  const xpInLevel = xp - currentLevel.threshold;
  const xpNeeded = nextLevel.threshold - currentLevel.threshold;
  const levelProgress = xpNeeded > 0 ? Math.round((xpInLevel / xpNeeded) * 100) : 100;

  const categoryData = useMemo(() => {
    const counts = { Career: 0, Growth: 0, Health: 0, Mindset: 0 };
    routines.forEach(r => {
        const weight = (r.streak > 0 ? r.streak : 1) * r.completedDays.filter(Boolean).length;
        if (r.category in counts) counts[r.category] += weight;
    });
    const maxVal = Math.max(...Object.values(counts), 1);
    return Object.entries(counts).map(([name, value]) => ({ 
        subject: name, 
        A: Math.round((value / maxVal) * 100),
        fullMark: 100
    }));
  }, [routines]);

  const heatmapData = useMemo(() => {
      const days = [];
      const today = new Date();
      for(let i=29; i>=0; i--) {
          const d = new Date();
          d.setDate(today.getDate() - i);
          const intensity = Math.random() > 0.3 ? Math.floor(Math.random() * 4) : 0; 
          days.push({ date: d, intensity });
      }
      return days;
  }, []);

  const badges: Badge[] = useMemo(() => {
      const totalHabitCompletions = routines.reduce((acc, r) => acc + r.completedDays.filter(Boolean).length, 0);
      const maxStreak = Math.max(...routines.map(r => r.streak), 0);
      const totalTasksCompleted = tasks.filter(t => t.completed).length;

      return [
          { id: 'b1', name: 'Week Warrior', description: '20+ habits/week', iconName: 'flame', unlocked: totalHabitCompletions >= 20 },
          { id: 'b2', name: 'Consistency King', description: '7 day streak', iconName: 'target', unlocked: maxStreak >= 7 },
          { id: 'b3', name: 'Task Master', description: '10+ focus tasks', iconName: 'check', unlocked: totalTasksCompleted >= 10 },
          { id: 'b4', name: 'Titan Status', description: 'Reach Level 5', iconName: 'crown', unlocked: level >= 5 },
          { id: 'b5', name: 'Laser Focused', description: 'Use Monk Mode', iconName: 'zap', unlocked: xp >= 50 }
      ];
  }, [routines, tasks, level, xp]);

  const renderBadgeIcon = (name: string, unlocked: boolean) => {
      const className = `w-5 h-5 ${unlocked ? 'text-white' : 'text-zinc-600'}`;
      switch(name) {
          case 'flame': return <Flame className={className} />;
          case 'target': return <Target className={className} />;
          case 'zap': return <Zap className={className} />;
          case 'crown': return <Crown className={className} />;
          default: return <CheckCircle2 className={className} />;
      }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0a0a0a] border border-zinc-800 w-full max-w-4xl rounded-[2rem] p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[95vh] transition-colors duration-300">
        
        <div className="flex justify-between items-center mb-6">
            <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <BarChart3 className="text-blue-500" />
                    Analytics Hub
                </h2>
                <p className="text-zinc-400 text-xs">Your performance metrics & achievements.</p>
            </div>
            <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors bg-zinc-900 p-2 rounded-full"><X size={20} /></button>
        </div>

        <div className="overflow-y-auto custom-scrollbar pr-2 space-y-6">
            
            {/* XP Rank Progress Bar Card */}
            <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-3xl p-6 shadow-inner">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Current Progress</p>
                        <h3 className="text-2xl font-black text-white">{currentLevel.name} <span className="text-zinc-600 text-sm">Level {level}</span></h3>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-zinc-500 font-bold mb-1">Next: {nextLevel.name}</p>
                        <p className="text-xs text-white font-black">{xp} / {nextLevel.threshold} XP</p>
                    </div>
                </div>
                <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-1000" style={{ width: `${levelProgress}%` }}></div>
                </div>
                <p className="text-[10px] text-zinc-600 text-center font-bold uppercase tracking-tighter">
                    {xpNeeded - xpInLevel} XP to become {nextLevel.name}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 bg-zinc-900/50 border border-zinc-800/50 rounded-3xl p-4 relative overflow-hidden min-h-[250px]">
                    <div className="absolute top-4 left-4 z-10"><p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Life Balance</p></div>
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={categoryData}>
                            <PolarGrid stroke="#3f3f46" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 10, fontWeight: 'bold' }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar name="Balance" dataKey="A" stroke="#3b82f6" strokeWidth={2} fill="#3b82f6" fillOpacity={0.3} />
                            <Tooltip contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>

                <div className="grid grid-rows-2 gap-4">
                     <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-3xl p-5 flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-purple-500/10 blur-[40px] rounded-full pointer-events-none"></div>
                        <div className="flex justify-between items-start"><p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Lifetime XP</p><TrendingUp size={16} className="text-purple-500" /></div>
                        <p className="text-4xl font-bold text-white">{xp.toLocaleString()}</p>
                     </div>
                     <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-3xl p-5 flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-orange-500/10 blur-[40px] rounded-full pointer-events-none"></div>
                        <div className="flex justify-between items-start"><p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Longest Streak</p><Flame size={16} className="text-orange-500" /></div>
                        <p className="text-4xl font-bold text-white">{Math.max(...routines.map(r => r.streak), 0)} <span className="text-sm text-zinc-600 font-medium">Days</span></p>
                     </div>
                </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-3xl p-6">
                <div className="flex items-center gap-2 mb-4"><CalendarDays size={16} className="text-zinc-500" /><p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">30 Day Consistency</p></div>
                <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
                    {heatmapData.map((day, i) => {
                        const colors = ['bg-zinc-800', 'bg-emerald-900', 'bg-emerald-700', 'bg-emerald-500'];
                        return <div key={i} title={day.date.toDateString()} className={`w-3 h-3 md:w-4 md:h-4 rounded-sm ${colors[day.intensity] || colors[0]}`}></div>
                    })}
                </div>
            </div>

            <div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 px-1">Achievements</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {badges.map((badge) => (
                        <div key={badge.id} className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${badge.unlocked ? 'bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/30' : 'bg-zinc-900 border-zinc-800 opacity-50 grayscale'}`}>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-inner flex-shrink-0 ${badge.unlocked ? 'bg-gradient-to-tr from-blue-500 to-purple-600 shadow-blue-500/20' : 'bg-zinc-800'}`}>
                                {renderBadgeIcon(badge.iconName, badge.unlocked)}
                            </div>
                            <div>
                                <h4 className={`text-sm font-bold ${badge.unlocked ? 'text-white' : 'text-zinc-500'}`}>{badge.name}</h4>
                                <p className="text-[10px] text-zinc-500 leading-tight mt-0.5">{badge.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};
