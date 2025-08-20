
import React from 'react';

interface ProgressBarProps {
  current: number;
  goal: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, goal }) => {
  const percentage = Math.min((current / goal) * 100, 100);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2 text-sm font-medium text-cyan-200">
        <span>{percentage.toFixed(2)}% Funded</span>
        <span className="font-bold">{goal.toLocaleString()} Year Goal</span>
      </div>
      <div className="w-full bg-slate-700/50 rounded-full h-4 overflow-hidden border border-slate-600">
        <div
          className="bg-gradient-to-r from-teal-400 to-cyan-500 h-4 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
