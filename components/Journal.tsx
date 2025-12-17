
import React, { useState, useEffect } from 'react';
import { JournalEntry, Task } from '../types';
import { ChevronLeft, ChevronRight, Save, Smile, Frown, Meh, ThumbsUp, ThumbsDown, Calendar, FileText, CheckSquare, Square } from 'lucide-react';

interface JournalProps {
    entries: JournalEntry[];
    onSaveEntry: (entry: JournalEntry) => void;
    tasks: Task[]; // Received tasks
}

export const Journal: React.FC<JournalProps> = ({ entries, onSaveEntry, tasks }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [content, setContent] = useState('');
    const [mood, setMood] = useState<JournalEntry['mood']>('neutral');

    // Format YYYY-MM-DD for storage/lookup
    const dateKey = selectedDate.toISOString().split('T')[0];
    
    // Find entry for selected date
    const currentEntry = entries.find(e => e.date === dateKey);

    // Filter tasks for this date
    const dailyTasks = tasks.filter(t => t.date === dateKey);

    useEffect(() => {
        if (currentEntry) {
            setContent(currentEntry.content || '');
            setMood(currentEntry.mood || 'neutral');
        } else {
            setContent('');
            setMood('neutral');
        }
    }, [dateKey, entries]);

    const handleSave = () => {
        onSaveEntry({
            date: dateKey,
            content,
            mood,
            habitLog: currentEntry?.habitLog || []
        });
    };

    const changeDate = (days: number) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + days);
        setSelectedDate(newDate);
    };

    const MOODS: { type: JournalEntry['mood'], icon: any, color: string }[] = [
        { type: 'great', icon: ThumbsUp, color: 'text-green-500 bg-green-500/10 border-green-500/20' },
        { type: 'good', icon: Smile, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
        { type: 'neutral', icon: Meh, color: 'text-gray-500 bg-gray-500/10 border-gray-500/20' },
        { type: 'bad', icon: Frown, color: 'text-orange-500 bg-orange-500/10 border-orange-500/20' },
        { type: 'awful', icon: ThumbsDown, color: 'text-red-500 bg-red-500/10 border-red-500/20' },
    ];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
             <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Daily Log</h2>
                <p className="text-gray-500 dark:text-zinc-500 text-sm">Reflect on your journey. Track your mind.</p>
            </div>

            {/* Date Nav */}
            <div className="flex items-center justify-between bg-white dark:bg-[#111] p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 mb-6">
                <button onClick={() => changeDate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                    <ChevronLeft size={20} className="text-gray-500" />
                </button>
                <div className="text-center">
                    <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">
                        {selectedDate.toDateString() === new Date().toDateString() ? 'Today' : selectedDate.toLocaleDateString(undefined, { weekday: 'long' })}
                    </p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 justify-center">
                        <Calendar size={16} />
                        {selectedDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <button onClick={() => changeDate(1)} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                    <ChevronRight size={20} className="text-gray-500" />
                </button>
            </div>

            {/* Daily Missions (Tasks for this day) */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-3 px-1">
                     <CheckSquare size={14} className="text-gray-400" />
                     <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Daily Missions</p>
                </div>
                {dailyTasks.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2">
                        {dailyTasks.map(task => (
                            <div key={task.id} className="flex items-center gap-3 bg-white dark:bg-[#111] p-3 rounded-xl border border-gray-100 dark:border-zinc-800 opacity-80">
                                {task.completed ? <CheckSquare size={16} className="text-blue-500" /> : <Square size={16} className="text-gray-400" />}
                                <span className={`text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-zinc-300'}`}>
                                    {task.title}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-4 bg-gray-50 dark:bg-zinc-900/30 rounded-xl border border-dashed border-gray-200 dark:border-zinc-800">
                        <p className="text-xs text-gray-400">No missions scheduled for this day.</p>
                    </div>
                )}
            </div>

            {/* Mood Selector */}
            <div className="grid grid-cols-5 gap-2 mb-6">
                {MOODS.map((m) => {
                    const isActive = mood === m.type;
                    const Icon = m.icon;
                    return (
                        <button
                            key={m.type}
                            onClick={() => setMood(m.type)}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                                isActive 
                                ? m.color + ' scale-105 shadow-sm' 
                                : 'bg-white dark:bg-[#111] border-transparent text-gray-300 dark:text-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-900'
                            }`}
                        >
                            <Icon size={24} />
                        </button>
                    )
                })}
            </div>

            {/* Text Area */}
            <div className="relative mb-6">
                <textarea 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Brain dump... What went well? What didn't?"
                    className="w-full h-64 bg-white dark:bg-[#111] border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-700 focus:outline-none focus:border-blue-500/50 resize-none shadow-sm transition-all text-base leading-relaxed"
                />
                <div className="absolute bottom-4 right-4">
                     <button 
                        onClick={handleSave}
                        className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-full font-bold text-xs flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
                    >
                        <Save size={14} /> Save Entry
                    </button>
                </div>
            </div>

            {/* Habit Notes Log (Auto-generated) */}
            {currentEntry?.habitLog && currentEntry.habitLog.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-400 dark:text-zinc-600 mb-2">
                        <FileText size={14} />
                        <span className="text-xs font-bold uppercase tracking-widest">Field Notes from Habits</span>
                    </div>
                    {currentEntry.habitLog.map((log, i) => (
                        <div key={i} className="bg-white dark:bg-[#111] border border-gray-100 dark:border-zinc-800 p-4 rounded-2xl flex items-start gap-3">
                            <div className="w-1 h-full min-h-[40px] bg-blue-500 rounded-full"></div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 dark:text-zinc-500 mb-1">{log.routineTitle}</p>
                                <p className="text-sm text-gray-800 dark:text-gray-300">{log.note}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};
