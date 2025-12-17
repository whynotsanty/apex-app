
import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RefreshCw, Trophy, Clock } from 'lucide-react';

interface FocusTimerProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (minutes: number) => void;
}

export const FocusTimer: React.FC<FocusTimerProps> = ({ isOpen, onClose, onComplete }) => {
  const [duration, setDuration] = useState(25); // Default 25 min
  const [customInput, setCustomInput] = useState('25');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let interval: any;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      // Timer finished
      setIsActive(false);
      setIsFinished(true);
      onComplete(duration);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, duration, onComplete]);

  // Reset timer if duration changes
  useEffect(() => {
      setTimeLeft(duration * 60);
      setIsActive(false);
      setIsFinished(false);
      setCustomInput(duration.toString());
  }, [duration]);

  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseInt(e.target.value);
      setCustomInput(e.target.value);
      if (!isNaN(val) && val > 0 && val <= 180) {
          setDuration(val);
      }
  };

  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  return (
    <div className="fixed inset-0 z-[60] bg-[#050505] flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
      
      {/* Background Ambience */}
      <div className={`absolute inset-0 bg-blue-900/10 transition-opacity duration-1000 ${isActive ? 'animate-pulse' : ''}`}></div>

      <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors z-20"
      >
        <X size={24} />
      </button>

      <div className="relative z-10 flex flex-col items-center w-full max-w-md">
        
        <h2 className="text-zinc-400 font-medium tracking-widest uppercase text-sm mb-10">Monk Mode</h2>

        {/* Timer Circle */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center mb-12">
            {/* Background Ring */}
            <svg className="absolute w-full h-full transform -rotate-90">
                <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    className="stroke-zinc-800 fill-none"
                    strokeWidth="4"
                />
                {/* Progress Ring */}
                <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    className={`fill-none transition-all duration-1000 ease-linear ${isFinished ? 'stroke-green-500' : 'stroke-blue-500'}`}
                    strokeWidth="4"
                    strokeDasharray="283%" // Approx circumference
                    strokeDashoffset={`${283 - (283 * progress) / 100}%`}
                    strokeLinecap="round"
                />
            </svg>

            <div className="text-center">
                <div className={`text-6xl md:text-7xl font-bold font-mono tabular-nums transition-colors ${isFinished ? 'text-green-500' : 'text-white'}`}>
                    {isFinished ? "Done" : formatTime(timeLeft)}
                </div>
                {!isFinished && isActive && (
                    <p className="text-blue-500/50 text-xs mt-2 uppercase tracking-widest animate-pulse">Focusing</p>
                )}
            </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-6">
            {!isActive && !isFinished && (
                <div className="flex flex-col items-center gap-4">
                    <div className="flex gap-2">
                        {[15, 25, 45, 60].map(m => (
                            <button
                                key={m}
                                onClick={() => setDuration(m)}
                                className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                                    duration === m 
                                    ? 'bg-white text-black border-white' 
                                    : 'bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-600'
                                }`}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                    
                    {/* Custom Input */}
                    <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2">
                        <Clock size={14} className="text-zinc-500" />
                        <input 
                            type="number"
                            min="1"
                            max="180"
                            value={customInput}
                            onChange={handleCustomChange}
                            className="bg-transparent text-white text-sm font-bold w-12 text-center focus:outline-none"
                        />
                        <span className="text-zinc-500 text-xs">min</span>
                    </div>
                </div>
            )}

            {isFinished ? (
                 <button
                    onClick={() => {
                        setDuration(25);
                        setIsFinished(false);
                    }}
                    className="bg-white text-black px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                >
                    <RefreshCw size={20} />
                    Reset Timer
                </button>
            ) : (
                <div className="flex items-center gap-4 mt-4">
                     <button
                        onClick={() => setIsActive(!isActive)}
                        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                            isActive 
                            ? 'bg-zinc-800 text-white hover:bg-zinc-700' 
                            : 'bg-white text-black hover:bg-gray-200 shadow-[0_0_30px_rgba(255,255,255,0.2)]'
                        }`}
                    >
                        {isActive ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current ml-1" />}
                    </button>
                </div>
            )}
        </div>
        
        {isFinished && (
            <div className="mt-8 flex items-center gap-2 text-green-500 animate-in slide-in-from-bottom-4">
                <Trophy size={20} />
                <span className="font-bold">+50 XP Earned</span>
            </div>
        )}
      </div>
    </div>
  );
};
