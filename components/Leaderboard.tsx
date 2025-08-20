import React from 'react';
import type { LeaderboardEntry } from '../types';
import { CrownIcon } from './icons/CrownIcon';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ entries }) => {
  return (
    <div className="bg-slate-800/60 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-700">
      <h3 className="text-2xl font-bold text-white mb-4 text-center">Top Supporters</h3>
      <ul className="space-y-3">
        {entries.map((entry, index) => (
          <li
            key={entry.name}
            className={`flex items-center justify-between p-3 rounded-md transition-colors duration-300 ${
              index === 0 ? 'bg-gradient-to-r from-yellow-500/30 to-yellow-400/20 border border-yellow-400/50' : 
              index === 1 ? 'bg-slate-400/20 border border-slate-500' :
              index === 2 ? 'bg-yellow-800/20 border border-yellow-700' : 
              'bg-slate-700/50'
            }`}
          >
            <div className="flex items-center">
              <span className={`font-bold w-6 text-center ${index < 3 ? 'text-yellow-300' : 'text-slate-400'}`}>
                {index + 1}
              </span>
              <span className="ml-3 font-medium text-white truncate">{entry.name}</span>
              {index === 0 && <CrownIcon className="ml-2 h-5 w-5 text-yellow-400" />}
            </div>
            <span className="font-bold text-cyan-300">${entry.amount.toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;