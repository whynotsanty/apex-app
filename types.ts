
export interface Routine {
  id: string;
  title: string;
  category: 'Career' | 'Growth' | 'Health' | 'Mindset';
  consistency: number;
  completedDays: boolean[]; // Array of 7 booleans for Mon-Sun
  iconColor: string;
  streak: number;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
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
  suggestedRoutines?: Routine[]; // If the AI suggests routines, they are attached here
}

export interface Blueprint {
  id: string;
  author: string;
  title: string;
  description: string;
  routines: Partial<Routine>[];
  image?: string; // Optional image URL for the author
}

export enum AISuggestionType {
  ROUTINE_PLAN = 'ROUTINE_PLAN'
}

export type Language = 'en' | 'pt';

export type Tab = 'tracker' | 'tasks' | 'guru';
