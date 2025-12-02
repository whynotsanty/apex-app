
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface RadialProgressProps {
  percentage: number;
  theme: 'light' | 'dark';
}

export const RadialProgress: React.FC<RadialProgressProps> = ({ percentage, theme }) => {
  const data = [
    { name: 'Completed', value: percentage },
    { name: 'Remaining', value: 100 - percentage },
  ];

  // Colors
  // Light mode track: Gray-200 (#e5e7eb) for subtle contrast on white
  // Dark mode track: Gray-800 (#1f2937) for subtle contrast on black
  const trackColor = theme === 'dark' ? '#1f2937' : '#e5e7eb';

  return (
    <div className="relative w-32 h-32 md:w-40 md:h-40">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <defs>
            <linearGradient id="progressGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#06b6d4" /> {/* Cyan-500 */}
              <stop offset="100%" stopColor="#2563eb" /> {/* Blue-600 */}
            </linearGradient>
          </defs>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="75%"
            outerRadius="90%"
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            stroke="none"
            cornerRadius={10}
            paddingAngle={5}
          >
            <Cell key="completed" fill="url(#progressGradient)" />
            <Cell key="remaining" fill={trackColor} />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <span className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
};
