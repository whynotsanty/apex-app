
import React from 'react';
import { ArrowRight, Sparkles, Activity, Target } from 'lucide-react';
import { Language } from '../types';

interface LandingPageProps {
  onEnter: () => void;
  lang: Language;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-white flex flex-col relative overflow-hidden font-sans transition-colors duration-300">
      
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-600/20 blur-[120px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Nav */}
      <nav className="flex justify-between items-center p-6 md:px-12 relative z-10">
        <span className="font-bold text-2xl tracking-tighter flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]"></div>
            Apex.
        </span>
      </nav>

      {/* Hero Content */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 relative z-10 pb-20">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 mb-8 backdrop-blur-sm shadow-sm">
            <Sparkles size={14} className="text-amber-500 dark:text-amber-400" />
            <span className="text-xs font-medium text-gray-600 dark:text-zinc-300">Next Gen Productivity</span>
        </div>

        <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-6 leading-[0.9] text-gray-900 dark:text-white">
          Master Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Daily Rituals.</span>
        </h1>

        <p className="text-gray-500 dark:text-zinc-400 text-lg md:text-xl max-w-lg mb-10 leading-relaxed font-light">
          The elite protocol builder. Track habits, visualize consistency, and engineer your success.
        </p>

        <button 
          onClick={onEnter}
          className="group relative inline-flex items-center gap-3 px-10 py-5 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-lg transition-all hover:scale-105 hover:bg-gray-800 dark:hover:bg-zinc-100 shadow-xl"
        >
          Enter Workspace
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Feature Pills */}
        <div className="mt-16 flex flex-wrap justify-center gap-4 opacity-60">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/50 dark:bg-zinc-900/30 border border-gray-200 dark:border-zinc-800/50">
                <Activity size={16} className="text-emerald-500" />
                <span className="text-xs font-medium text-gray-600 dark:text-zinc-400">Consistency Stats</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/50 dark:bg-zinc-900/30 border border-gray-200 dark:border-zinc-800/50">
                <Target size={16} className="text-blue-500" />
                <span className="text-xs font-medium text-gray-600 dark:text-zinc-400">Goal Alignment</span>
            </div>
        </div>

      </main>

      <footer className="p-6 text-center text-gray-400 dark:text-zinc-600 text-xs relative z-10">
        © {new Date().getFullYear()} Apex. Build your legacy.
      </footer>
    </div>
  );
};
