
export interface Routine {
  id: string;
  title: string;
  category: 'Career' | 'Growth' | 'Health' | 'Mindset';
  type: 'positive' | 'negative'; // New: Build vs Quit
  consistency: number;
  completedDays: boolean[]; 
  iconColor: string;
  streak: number;
  
  // Positive Habit Props
  frequency?: number[]; 
  target?: {
      value: number;
      unit: string;
  };

  // Negative Habit Props
  startDate?: number; // Timestamp of when the user stopped the bad habit

  notes?: string;
}

export interface JournalEntry {
  date: string; // ISO Date String YYYY-MM-DD
  content: string;
  mood: 'great' | 'good' | 'neutral' | 'bad' | 'awful';
  habitLog: {
    routineId: string;
    routineTitle: string;
    note: string;
    timestamp: number;
  }[];
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
  date?: string; // YYYY-MM-DD
}

export interface Stat {
  label: string;
  value: string;
  subValue?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  suggestedRoutines?: Routine[]; 
}

export interface Blueprint {
  id: string;
  author: string;
  title: string;
  description: string;
  routines: Partial<Routine>[];
  image?: string; 
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: 'flame' | 'target' | 'zap' | 'crown' | 'check';
  unlocked: boolean;
}

export enum AISuggestionType {
  ROUTINE_PLAN = 'ROUTINE_PLAN'
}

export type Language = 'en' | 'pt';

export type Tab = 'tracker' | 'tasks' | 'journal' | 'guru';
