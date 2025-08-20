
import React from 'react';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';

interface CounterProps {
  totalYears: number;
}

const Counter: React.FC<CounterProps> = ({ totalYears }) => {
  const animatedTotal = useAnimatedCounter(totalYears, 1500);

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-2xl border border-cyan-500/20 text-center mb-6">
      <h3 className="text-lg sm:text-xl font-semibold text-cyan-400 tracking-wider mb-2">
        Years of Clean Water Supplied
      </h3>
      <p className="text-6xl sm:text-7xl lg:text-8xl font-black text-white tracking-tight">
        {animatedTotal.toLocaleString()}
      </p>
    </div>
  );
};

export default Counter;
