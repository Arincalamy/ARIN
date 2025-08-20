
import React, { useState, useEffect } from 'react';
import { getWaterFact } from '../services/geminiService';

const Factoid: React.FC = () => {
  const [fact, setFact] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFact = async () => {
      setIsLoading(true);
      const newFact = await getWaterFact();
      setFact(newFact);
      setIsLoading(false);
    };
    fetchFact();
  }, []);

  return (
    <div className="bg-slate-800/60 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-700">
      <h3 className="text-lg font-bold text-cyan-400 mb-2">Did You Know?</h3>
      {isLoading ? (
        <div className="h-16 bg-slate-700/50 rounded animate-pulse"></div>
      ) : (
        <p className="text-slate-200 italic">"{fact}"</p>
      )}
    </div>
  );
};

export default Factoid;
