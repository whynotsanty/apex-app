
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Language, Routine } from '../types';
import { chatWithGuru } from '../services/geminiService';
import { Send, User, Sparkles, Loader2, Plus, Check, Square, CheckSquare, Crown, Lock } from 'lucide-react';

interface GuruChatProps {
  lang: Language;
  onAddRoutines: (routines: Routine[]) => void;
  isPro: boolean;
  onShowPaywall: () => void;
  currentRoutineCount: number;
}

const MAX_FREE_MESSAGES_PER_DAY = 5;
const MAX_FREE_HABITS = 10;

export const GuruChat: React.FC<GuruChatProps> = ({ 
    lang, onAddRoutines, isPro, onShowPaywall, currentRoutineCount 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
      const saved = localStorage.getItem('apex_chat_history');
      if (saved) return JSON.parse(saved);
      return [{ id: 'init', role: 'model', text: "I am your High Performance Guru. What is the target today?" }];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Usage Tracking
  const [dailyUsage, setDailyUsage] = useState<{ date: string, count: number }>(() => {
      const saved = localStorage.getItem('apex_guru_usage');
      if (saved) return JSON.parse(saved);
      return { date: new Date().toDateString(), count: 0 };
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Persist Messages
  useEffect(() => {
      localStorage.setItem('apex_chat_history', JSON.stringify(messages));
  }, [messages]);

  // Persist Usage
  useEffect(() => {
      localStorage.setItem('apex_guru_usage', JSON.stringify(dailyUsage));
  }, [dailyUsage]);

  // Check reset daily
  useEffect(() => {
      const today = new Date().toDateString();
      if (dailyUsage.date !== today) {
          setDailyUsage({ date: today, count: 0 });
      }
  }, []);

  const handleSend = async () => {
      if (!input.trim() || isLoading) return;

      // PRO CHECK
      if (!isPro && dailyUsage.count >= MAX_FREE_MESSAGES_PER_DAY) {
          onShowPaywall();
          return;
      }

      const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
      setMessages(prev => [...prev, userMsg]);
      setInput('');
      setIsLoading(true);

      // Increment Usage
      setDailyUsage(prev => ({ ...prev, count: prev.count + 1 }));

      const response = await chatWithGuru(messages, input, 'en');
      
      const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: response.text,
          suggestedRoutines: response.suggestedRoutines as Routine[]
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsLoading(false);
  };

  const handleAddSuggested = (routines: Routine[]) => {
      // Check limit before adding from Guru
      if (!isPro && currentRoutineCount + routines.length > MAX_FREE_HABITS) {
          onShowPaywall();
          return;
      }

      // Convert Partial routines to full Routines
      const fullRoutines: Routine[] = routines.map(r => ({
          ...r,
          id: `guru-add-${Date.now()}-${Math.random()}`,
          consistency: 0,
          completedDays: [false,false,false,false,false,false,false],
          streak: 0,
          // Fallback defaults if missing
          title: r.title || 'New Habit',
          category: r.category || 'Growth',
          iconColor: r.iconColor || 'from-gray-500 to-gray-700'
      }));
      onAddRoutines(fullRoutines);
  };

  const remainingFree = MAX_FREE_MESSAGES_PER_DAY - dailyUsage.count;

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pb-4" ref={scrollRef}>
            {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.role === 'user' 
                        ? 'bg-gray-200 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400' 
                        : 'bg-gradient-to-tr from-blue-600 to-purple-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                    }`}>
                        {msg.role === 'user' ? <User size={14} /> : <Sparkles size={14} />}
                    </div>

                    {/* Bubble */}
                    <div className={`max-w-[85%] space-y-2`}>
                        <div className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                            msg.role === 'user'
                            ? 'bg-gray-900 dark:bg-zinc-800 text-white rounded-tr-sm'
                            : 'bg-white dark:bg-zinc-900/80 border border-gray-200 dark:border-zinc-800/50 text-gray-700 dark:text-zinc-300 rounded-tl-sm shadow-sm dark:shadow-none'
                        }`}>
                            {msg.text}
                        </div>

                        {/* Action Card for Suggestions */}
                        {msg.suggestedRoutines && msg.suggestedRoutines.length > 0 && (
                            <ProtocolCard 
                                routines={msg.suggestedRoutines} 
                                onAdd={handleAddSuggested} 
                                isPro={isPro}
                                currentRoutineCount={currentRoutineCount}
                                onShowPaywall={onShowPaywall}
                            />
                        )}
                    </div>
                </div>
            ))}
            {isLoading && (
                 <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center">
                        <Loader2 size={14} className="animate-spin" />
                    </div>
                    <div className="bg-white dark:bg-zinc-900/80 border border-gray-200 dark:border-zinc-800/50 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm dark:shadow-none">
                        <div className="flex gap-1">
                            <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-zinc-500 rounded-full animate-bounce"></span>
                        </div>
                    </div>
                 </div>
            )}
        </div>

        {/* Input Area */}
        <div className="relative mt-2">
            {!isPro && (
                <div className="absolute -top-6 right-0 text-[10px] text-zinc-500 flex items-center gap-1">
                    {remainingFree > 0 ? (
                        <span>{remainingFree} free messages left</span>
                    ) : (
                        <span className="text-amber-500 font-bold flex items-center gap-1"><Lock size={10} /> Limit reached</span>
                    )}
                </div>
            )}
            
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={!isPro && dailyUsage.count >= MAX_FREE_MESSAGES_PER_DAY ? "Daily limit reached. Upgrade to continue." : "Ask anything..."}
                disabled={!isPro && dailyUsage.count >= MAX_FREE_MESSAGES_PER_DAY}
                className="w-full bg-white dark:bg-[#111] border border-gray-200 dark:border-zinc-800 rounded-2xl py-4 pl-4 pr-12 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all shadow-lg shadow-gray-200/50 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading || (!isPro && dailyUsage.count >= MAX_FREE_MESSAGES_PER_DAY)}
                className={`absolute right-2 top-2 bottom-2 aspect-square rounded-xl flex items-center justify-center transition-all ${
                     !isPro && dailyUsage.count >= MAX_FREE_MESSAGES_PER_DAY
                     ? 'bg-zinc-800 text-zinc-600'
                     : 'bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50 disabled:bg-gray-300 dark:disabled:bg-zinc-800'
                }`}
            >
                {!isPro && dailyUsage.count >= MAX_FREE_MESSAGES_PER_DAY ? <Lock size={16} /> : <Send size={18} />}
            </button>
        </div>
    </div>
  );
};

// Sub-component to manage selection state for each chat message separately
const ProtocolCard = ({ 
    routines, 
    onAdd, 
    isPro, 
    currentRoutineCount, 
    onShowPaywall 
}: { 
    routines: any[], 
    onAdd: (r: any[]) => void,
    isPro: boolean,
    currentRoutineCount: number,
    onShowPaywall: () => void
}) => {
    const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
    const [isAdded, setIsAdded] = useState(false);

    // Initial Selection: Only select up to the free limit
    useEffect(() => {
        const allIndices = routines.map((_, i) => i);
        if (!isPro) {
            const remainingSlots = Math.max(0, MAX_FREE_HABITS - currentRoutineCount);
            // Select only what fits
            setSelectedIndices(allIndices.slice(0, remainingSlots));
        } else {
            // Select all if Pro
            setSelectedIndices(allIndices);
        }
    }, [routines, isPro, currentRoutineCount]);

    const toggleIndex = (index: number) => {
        if (isAdded) return; // Lock after adding
        
        const isSelected = selectedIndices.includes(index);
        
        if (isSelected) {
            // Deselect is always allowed
            setSelectedIndices(prev => prev.filter(i => i !== index));
        } else {
            // Select check
            if (!isPro) {
                const remainingSlots = Math.max(0, MAX_FREE_HABITS - currentRoutineCount);
                if (selectedIndices.length >= remainingSlots) {
                    onShowPaywall();
                    return;
                }
            }
            setSelectedIndices(prev => [...prev, index]);
        }
    };

    const handleConfirm = () => {
        const toAdd = routines.filter((_, i) => selectedIndices.includes(i));
        onAdd(toAdd);
        setIsAdded(true);
    };

    const remainingSlots = isPro ? 9999 : Math.max(0, MAX_FREE_HABITS - currentRoutineCount);

    return (
        <div className="bg-blue-50 dark:bg-[#0f121a] border border-blue-100 dark:border-blue-900/30 rounded-xl p-3 mt-2 overflow-hidden relative transition-colors">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
            <div className="flex justify-between items-center mb-2 pl-2">
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Protocol Detected</p>
                {!isAdded && (
                    <div className="flex items-center gap-2">
                        {!isPro && (
                            <span className="text-[9px] text-zinc-500 bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                                {remainingSlots} slots left
                            </span>
                        )}
                        <span className="text-[10px] text-blue-400 dark:text-blue-500/70">{selectedIndices.length} Selected</span>
                    </div>
                )}
            </div>
            
            <div className="space-y-1.5 pl-2 mb-3">
                {routines.map((r, i) => {
                    const isSelected = selectedIndices.includes(i);
                    return (
                        <div 
                            key={i} 
                            onClick={() => toggleIndex(i)}
                            className={`text-xs flex items-center gap-2 cursor-pointer transition-colors ${!isSelected ? 'opacity-50' : ''}`}
                        >
                             <div className={`flex-shrink-0 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-zinc-600'}`}>
                                {isSelected ? <CheckSquare size={14} /> : <Square size={14} />}
                            </div>
                            <span className="text-gray-700 dark:text-zinc-300">{r.title}</span>
                        </div>
                    );
                })}
            </div>
            
            <button 
                onClick={handleConfirm}
                disabled={isAdded || selectedIndices.length === 0}
                className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    isAdded 
                    ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:shadow-none'
                }`}
            >
                {isAdded ? <Check size={14} /> : <Plus size={14} />}
                {isAdded ? "Added to Dashboard" : "Add Selected"}
            </button>
        </div>
    );
};
