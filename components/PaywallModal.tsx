
import React, { useState } from 'react';
import { X, Check, Star, Lock, Crown, Zap } from 'lucide-react';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({ isOpen, onClose, onUpgrade }) => {
  const [plan, setPlan] = useState<'monthly' | 'lifetime'>('lifetime');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#0a0a0a] border border-amber-500/30 w-full max-w-sm rounded-[2rem] p-0 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] overflow-y-auto custom-scrollbar">
        
        {/* Decorative Background */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-amber-500/20 to-transparent pointer-events-none"></div>
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-amber-500/10 blur-[60px] rounded-full pointer-events-none"></div>

        <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors z-20 bg-black/20 rounded-full p-1"
        >
            <X size={20} />
        </button>

        {/* Content */}
        <div className="p-8 pb-4 text-center relative z-10">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-300 to-amber-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-amber-500/20 mb-6 rotate-3">
                <Crown size={32} className="text-black" strokeWidth={2.5} />
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-2">Apex <span className="text-amber-400">Pro</span></h2>
            <p className="text-zinc-400 text-sm">Unlock your full potential and dominate your day.</p>
        </div>

        <div className="px-8 space-y-4 mb-8">
            <FeatureRow text="Unlimited Habits" subtext="Break the 10 habit limit" />
            <FeatureRow text="Guru Unlimited" subtext="AI Coaching with no daily limits" />
            <FeatureRow text="Library of Titans" subtext="Access routines of Elon Musk, Goggins..." />
            <FeatureRow text="God Mode Stats" subtext="Advanced analytics & insights (Soon)" />
        </div>

        {/* Pricing Options */}
        <div className="px-6 mb-4 grid grid-cols-2 gap-3">
             <button 
                onClick={() => setPlan('monthly')}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center transition-all ${
                    plan === 'monthly'
                    ? 'bg-amber-500/10 border-amber-500 text-white'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800'
                }`}
             >
                 <span className="text-sm font-bold">Monthly</span>
                 <span className="text-lg font-bold text-white">$4.99</span>
             </button>

             <button 
                onClick={() => setPlan('lifetime')}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center transition-all relative ${
                    plan === 'lifetime'
                    ? 'bg-amber-500/10 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800'
                }`}
             >
                 <span className="absolute -top-2.5 bg-amber-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full">BEST VALUE</span>
                 <span className="text-sm font-bold">Lifetime</span>
                 <span className="text-lg font-bold text-white">$39.99</span>
             </button>
        </div>

        <div className="p-6 pt-0 mt-auto">
            <button
                onClick={onUpgrade}
                className="w-full bg-gradient-to-r from-amber-400 to-yellow-600 hover:from-amber-300 hover:to-yellow-500 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] shadow-lg shadow-amber-500/20"
            >
                <Zap size={18} className="fill-black" />
                {plan === 'lifetime' ? 'Unlock Forever' : 'Subscribe Now'}
            </button>
            <p className="text-center text-[10px] text-zinc-600 mt-4">
                Restore Purchases • Terms & Conditions
            </p>
        </div>
      </div>
    </div>
  );
};

const FeatureRow = ({ text, subtext }: { text: string; subtext: string }) => (
    <div className="flex items-start gap-3">
        <div className="mt-1 w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
            <Check size={12} className="text-amber-400" strokeWidth={3} />
        </div>
        <div className="text-left">
            <p className="text-white font-medium text-sm">{text}</p>
            <p className="text-zinc-500 text-xs">{subtext}</p>
        </div>
    </div>
);
