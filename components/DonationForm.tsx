
import React, { useState } from 'react';

interface DonationFormProps {
  onDonate: (name: string, amount: number) => void;
}

const presetAmounts = [20, 50, 100, 250, 500, 1000];

const DonationForm: React.FC<DonationFormProps> = ({ onDonate }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState<number | string>(50);
  const [isCustom, setIsCustom] = useState(false);

  const handleAmountClick = (value: number) => {
    setAmount(value);
    setIsCustom(false);
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value === '' ? '' : Number(value));
    setIsCustom(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const donationAmount = Number(amount);
    if (donationAmount > 0) {
      onDonate(name || 'Anonymous', donationAmount);
      setName('');
      setAmount(50);
      setIsCustom(false);
    }
  };

  return (
    <div className="bg-slate-800/60 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-slate-700">
      <h3 className="text-3xl font-bold text-white mb-2">$1 = 1 Year of Clean Water</h3>
      <p className="text-slate-300 mb-6">Your donation makes a direct impact. Choose an amount or enter your own.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {presetAmounts.map(preset => (
            <button
              key={preset}
              type="button"
              onClick={() => handleAmountClick(preset)}
              className={`p-4 rounded-lg text-xl font-bold transition-all duration-200 border-2 ${
                !isCustom && amount === preset
                  ? 'bg-cyan-500 border-cyan-400 text-white scale-105 shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-700 border-slate-600 hover:bg-slate-600 hover:border-cyan-500'
              }`}
            >
              ${preset}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">$</span>
            <input
              type="number"
              placeholder="Custom Amount"
              value={amount}
              onChange={handleCustomAmountChange}
              onFocus={() => setIsCustom(true)}
              className="w-full bg-slate-900/50 border-2 border-slate-600 rounded-lg p-4 pl-8 text-white text-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
              min="1"
            />
          </div>
          <input
            type="text"
            placeholder="Your Name (Optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full sm:w-2/5 bg-slate-900/50 border-2 border-slate-600 rounded-lg p-4 text-white text-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
          />
        </div>

        <button 
          type="submit"
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xl py-4 rounded-lg shadow-lg hover:scale-105 hover:shadow-cyan-500/40 transition-transform duration-300"
          disabled={!amount || Number(amount) <= 0}
        >
          Donate Now
        </button>
      </form>
    </div>
  );
};

export default DonationForm;
