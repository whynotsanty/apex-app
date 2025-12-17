
import React, { useState } from 'react';
import { Task, Language } from '../types';
import { Plus, Trash2, CheckCircle2, Circle, Calendar } from 'lucide-react';

interface ToDoListProps {
  lang: Language;
  onStartFocus: () => void;
  tasks: Task[];
  onAddTask: (task: Task) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export const ToDoList: React.FC<ToDoListProps> = ({ 
    lang, 
    onStartFocus, 
    tasks, 
    onAddTask, 
    onToggleTask, 
    onDeleteTask 
}) => {
  const [inputValue, setInputValue] = useState('');
  // Default to today YYYY-MM-DD
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const addTask = () => {
      if (!inputValue.trim()) return;
      const newTask: Task = {
          id: Date.now().toString(),
          title: inputValue,
          completed: false,
          createdAt: Date.now(),
          date: selectedDate
      };
      onAddTask(newTask);
      setInputValue('');
      setIsDatePickerOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') addTask();
  };

  // Group tasks
  const today = new Date().toISOString().split('T')[0];
  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
       <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Focus List</h2>
            <p className="text-gray-500 dark:text-zinc-500 text-sm">Schedule your mission. Execute.</p>
       </div>

       {/* Input Area */}
       <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-zinc-800 rounded-3xl p-2 shadow-lg shadow-gray-200/50 dark:shadow-none mb-8">
           <div className="flex items-center px-4 py-2 gap-3">
               <input 
                 type="text" 
                 value={inputValue}
                 onChange={(e) => setInputValue(e.target.value)}
                 onKeyDown={handleKeyDown}
                 placeholder="What needs to be done?"
                 className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none h-12"
               />
               <button 
                onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                className={`p-2 rounded-xl transition-colors ${selectedDate === today ? 'text-gray-400 dark:text-zinc-600' : 'text-blue-500 bg-blue-500/10'}`}
                title="Select Date"
               >
                   <Calendar size={20} />
               </button>
               <button 
                 onClick={addTask}
                 className="bg-black dark:bg-zinc-800 hover:bg-blue-600 dark:hover:bg-blue-600 text-white rounded-xl w-10 h-10 flex items-center justify-center transition-all active:scale-95 shadow-lg"
               >
                 <Plus size={20} />
               </button>
           </div>
           
           {/* Date Picker Collapse */}
           {isDatePickerOpen && (
               <div className="px-4 pb-4 animate-in slide-in-from-top-2">
                   <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 flex items-center gap-3">
                       <span className="text-xs font-bold text-gray-400 uppercase">Schedule For:</span>
                       <input 
                        type="date" 
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg px-3 py-1 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                       />
                       {selectedDate === today && <span className="text-[10px] text-blue-500 font-bold bg-blue-500/10 px-2 py-1 rounded">TODAY</span>}
                   </div>
               </div>
           )}
       </div>

       {/* List */}
       <div className="space-y-3">
           {tasks.length === 0 && (
               <div className="text-center py-12 text-gray-400 dark:text-zinc-600 italic">
                   No tasks scheduled. Clear mind.
               </div>
           )}

           {activeTasks.map(task => (
               <TaskItem key={task.id} task={task} onToggle={() => onToggleTask(task.id)} onDelete={() => onDeleteTask(task.id)} />
           ))}
           
           {completedTasks.length > 0 && (
               <div className="mt-8 pt-4 border-t border-gray-200 dark:border-zinc-900">
                    <p className="text-xs font-bold text-gray-400 dark:text-zinc-600 uppercase tracking-widest mb-4">Completed</p>
                    <div className="space-y-3 opacity-50">
                        {completedTasks.map(task => (
                            <TaskItem key={task.id} task={task} onToggle={() => onToggleTask(task.id)} onDelete={() => onDeleteTask(task.id)} />
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
    const isToday = task.date === new Date().toISOString().split('T')[0];
    
    return (
        <div className="group flex items-center gap-3 bg-white dark:bg-[#111] p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 transition-all">
            <button 
                onClick={onToggle}
                className={`flex-shrink-0 transition-colors ${task.completed ? 'text-blue-500' : 'text-gray-400 dark:text-zinc-600 hover:text-gray-600 dark:hover:text-zinc-400'}`}
            >
                {task.completed ? <CheckCircle2 size={24} className="fill-blue-500/20" /> : <Circle size={24} />}
            </button>
            
            <div className="flex-1 min-w-0">
                <p className={`text-sm md:text-base font-medium transition-all truncate ${task.completed ? 'text-gray-400 dark:text-zinc-600 line-through' : 'text-gray-700 dark:text-zinc-200'}`}>
                    {task.title}
                    {task.completed && <span className="ml-2 text-[10px] text-green-500 font-bold">+5 XP</span>}
                </p>
                {task.date && (
                    <div className="flex items-center gap-1 mt-0.5">
                        <Calendar size={10} className={isToday ? "text-blue-500" : "text-gray-400"} />
                        <span className={`text-[10px] ${isToday ? "text-blue-500 font-bold" : "text-gray-400"}`}>
                            {isToday ? "Today" : task.date}
                        </span>
                    </div>
                )}
            </div>

            <button 
                onClick={onDelete}
                className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 dark:text-zinc-600 hover:text-red-500 transition-all"
            >
                <Trash2 size={16} />
            </button>
        </div>
    )
}
