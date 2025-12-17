
import React from 'react';
import { Tab } from '../types';
import { Layout, CheckSquare, Sparkles, Crown, Book } from 'lucide-react';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onOpenPro: () => void;
  isPro: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, onOpenPro, isPro }) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
      <div className="bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-full px-2 py-2 flex items-center gap-1 shadow-2xl shadow-black/10 dark:shadow-black/50 transition-colors duration-300">
        
        <button
          onClick={() => onTabChange('tracker')}
          className={`relative px-4 py-3 rounded-full transition-all duration-300 flex items-center gap-2 ${
            activeTab === 'tracker' 
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_-3px_rgba(6,182,212,0.4)]' 
              : 'text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300'
          }`}
        >
          <Layout size={20} className={activeTab === 'tracker' ? 'fill-white/20' : ''} />
        </button>

        <button
          onClick={() => onTabChange('journal')}
          className={`relative px-4 py-3 rounded-full transition-all duration-300 flex items-center gap-2 ${
            activeTab === 'journal' 
              ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-[0_0_15px_-3px_rgba(249,115,22,0.4)]' 
              : 'text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300'
          }`}
        >
          <Book size={20} className={activeTab === 'journal' ? 'fill-white/20' : ''} />
        </button>

        <button
          onClick={() => onTabChange('tasks')}
          className={`relative px-4 py-3 rounded-full transition-all duration-300 flex items-center gap-2 ${
            activeTab === 'tasks' 
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-[0_0_15px_-3px_rgba(16,185,129,0.4)]' 
              : 'text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300'
          }`}
        >
          <CheckSquare size={20} className={activeTab === 'tasks' ? 'fill-white/20' : ''} />
        </button>

        <button
          onClick={() => onTabChange('guru')}
          className={`relative px-4 py-3 rounded-full transition-all duration-300 flex items-center gap-2 ${
            activeTab === 'guru' 
              ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-[0_0_15px_-3px_rgba(139,92,246,0.4)]' 
              : 'text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300'
          }`}
        >
          <Sparkles size={20} className={activeTab === 'guru' ? 'fill-white/20' : ''} />
        </button>

        <div className="w-px h-8 bg-gray-200 dark:bg-zinc-800 mx-1"></div>

        <button
          onClick={onOpenPro}
          className={`relative px-3 py-3 rounded-full transition-all duration-300 flex items-center justify-center gap-2 ${
            isPro
            ? 'text-amber-500 bg-amber-500/10'
            : 'text-gray-400 dark:text-zinc-500 hover:text-amber-500 dark:hover:text-amber-400'
          }`}
        >
          <Crown size={20} className={isPro ? "fill-amber-500" : ""} />
        </button>

      </div>
    </div>
  );
};
