
import React, { useState, useEffect } from 'react';
import { Task, Language } from '../types';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';

interface ToDoListProps {
  lang: Language;
  onXpGain?: (amount: number) => void;
}

export const ToDoList: React.FC<ToDoListProps> = ({ lang, onXpGain }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
      const saved = localStorage.getItem('apex_tasks');
      return saved ? JSON.parse(saved) : [];
  });
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
      localStorage.setItem('apex_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
      if (!inputValue.trim()) return;
      const newTask: Task = {
          id: Date.now().toString(),
          title: inputValue,
          completed: false,
          createdAt: Date.now()
      };
      setTasks(prev => [newTask, ...prev]);
      setInputValue('');
  };

  const toggleTask = (id: string) => {
      setTasks(prev => prev.map(t => {
          if (t.id === id) {
              const newState = !t.completed;
              // XP Logic: +5 for complete, -5 for undo
              if (onXpGain) {
                  onXpGain(newState ? 5 : -5);
              }
              return { ...t, completed: newState };
          }
          return t;
      }));
  };

  const deleteTask = (id: string) => {
      setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') addTask();
  };

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
       <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Focus List</h2>
            <p className="text-gray-500 dark:text-zinc-500 text-sm">Clear your mind. Execute one by one.</p>
       </div>

       {/* Input */}
       <div className="relative mb-8 group">
           <input 
             type="text" 
             value={inputValue}
             onChange={(e) => setInputValue(e.target.value)}
             onKeyDown={handleKeyDown}
             placeholder="Add a new task (5 XP)..."
             className="w-full bg-white dark:bg-[#111] border border-gray-200 dark:border-zinc-800 rounded-2xl py-4 pl-5 pr-14 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-lg shadow-gray-200/50 dark:shadow-none"
           />
           <button 
             onClick={addTask}
             className="absolute right-2 top-2 bottom-2 aspect-square bg-gray-900 dark:bg-zinc-800 hover:bg-blue-600 dark:hover:bg-blue-600 text-white rounded-xl flex items-center justify-center transition-all active:scale-95"
           >
             <Plus size={20} />
           </button>
       </div>

       {/* List */}
       <div className="space-y-3">
           {tasks.length === 0 && (
               <div className="text-center py-12 text-gray-400 dark:text-zinc-600 italic">
                   No pending tasks. Stay hard.
               </div>
           )}

           {activeTasks.map(task => (
               <TaskItem key={task.id} task={task} onToggle={() => toggleTask(task.id)} onDelete={() => deleteTask(task.id)} />
           ))}
           
           {completedTasks.length > 0 && (
               <div className="mt-8 pt-4 border-t border-gray-200 dark:border-zinc-900">
                    <p className="text-xs font-bold text-gray-400 dark:text-zinc-600 uppercase tracking-widest mb-4">Completed</p>
                    <div className="space-y-3 opacity-50">
                        {completedTasks.map(task => (
                            <TaskItem key={task.id} task={task} onToggle={() => toggleTask(task.id)} onDelete={() => deleteTask(task.id)} />
                        ))}
                    </div>
               </div>
           )}
       </div>
    </div>
  );
};

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
    return (
        <div className="group flex items-center gap-3 bg-white dark:bg-[#111] p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 transition-all">
            <button 
                onClick={onToggle}
                className={`flex-shrink-0 transition-colors ${task.completed ? 'text-blue-500' : 'text-gray-400 dark:text-zinc-600 hover:text-gray-600 dark:hover:text-zinc-400'}`}
            >
                {task.completed ? <CheckCircle2 size={24} className="fill-blue-500/20" /> : <Circle size={24} />}
            </button>
            
            <span className={`flex-1 text-sm md:text-base font-medium transition-all ${task.completed ? 'text-gray-400 dark:text-zinc-600 line-through' : 'text-gray-700 dark:text-zinc-200'}`}>
                {task.title}
                {task.completed && <span className="ml-2 text-[10px] text-green-500 font-bold">+5 XP</span>}
            </span>

            <button 
                onClick={onDelete}
                className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 dark:text-zinc-600 hover:text-red-500 transition-all"
            >
                <Trash2 size={16} />
            </button>
        </div>
    )
}
