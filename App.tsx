import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Counter from './components/Counter';
import ProgressBar from './components/ProgressBar';
import DonationForm from './components/DonationForm';
import Leaderboard from './components/Leaderboard';
import Factoid from './components/Factoid';
import Footer from './components/Footer';
import Modal from './components/Modal';
import type { LeaderboardEntry } from './types';
import { generateThankYouMessage } from './services/geminiService';
import { XIcon } from './components/icons/XIcon';
import { WaterDropIcon } from './components/icons/WaterDropIcon';

const App: React.FC = () => {
  const [totalYears, setTotalYears] = useState<number>(() => {
    try {
      const savedTotalYears = window.localStorage.getItem('teamwater_totalYears');
      return savedTotalYears ? JSON.parse(savedTotalYears) : 0;
    } catch (error) {
      console.error("Error reading totalYears from localStorage:", error);
      return 0;
    }
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    try {
      const savedLeaderboard = window.localStorage.getItem('teamwater_leaderboard');
      return savedLeaderboard ? JSON.parse(savedLeaderboard) : [];
    } catch (error) {
      console.error("Error reading leaderboard from localStorage:", error);
      return [];
    }
  });

  const [goal] = useState(5000000000);
  const [donationMessage, setDonationMessage] = useState<string | null>(null);
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const [lastDonation, setLastDonation] = useState<{ name: string; amount: number } | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem('teamwater_totalYears', JSON.stringify(totalYears));
    } catch (error) {
      console.error("Error saving totalYears to localStorage:", error);
    }
  }, [totalYears]);

  useEffect(() => {
    try {
      window.localStorage.setItem('teamwater_leaderboard', JSON.stringify(leaderboard));
    } catch (error) {
      console.error("Error saving leaderboard to localStorage:", error);
    }
  }, [leaderboard]);

  const handleShare = (amount: number) => {
    const text = `I just helped supply ${amount} years of clean water for people in need through #TeamWater! Join the wave of change and make a difference.`;
    const url = window.location.href; 
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCloseModal = () => {
    setDonationMessage(null);
    setLastDonation(null);
  };

  const handleDonation = useCallback(async (name: string, amount: number) => {
    setDonationMessage(null);
    setLastDonation(null);
    setIsMessageLoading(true);

    // Update total years
    setTotalYears(prev => prev + amount);

    // Update leaderboard
    setLeaderboard(prev => {
      const existingEntryIndex = prev.findIndex(entry => entry.name.toLowerCase() === name.toLowerCase());
      let newLeaderboard = [...prev];

      if (existingEntryIndex > -1) {
        newLeaderboard[existingEntryIndex].amount += amount;
      } else {
        newLeaderboard.push({ name, amount });
      }

      return newLeaderboard.sort((a, b) => b.amount - a.amount).slice(0, 10);
    });

    // Set last donation for share feature
    setLastDonation({ name, amount });

    // Generate thank you message
    const { message, success } = await generateThankYouMessage(name, amount);
    if (!success) {
        console.warn("Could not generate a personalized thank you message due to an API issue. Displaying a default message.");
    }
    setDonationMessage(message);
    setIsMessageLoading(false);

  }, []);

  return (
    <div className="bg-slate-900 min-h-screen text-white antialiased">
      <div className="absolute inset-0 z-0 opacity-10">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{backgroundImage: "url('https://picsum.photos/seed/waterbg/1920/1080')"}}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900/80 to-slate-900"></div>
      </div>
      
      <div className="relative z-10">
        <Header />

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h2 className="text-xl sm:text-2xl font-light text-cyan-400 tracking-widest uppercase mb-2">Join the Wave</h2>
            <p className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
              Help Supply Clean Water to Those in Need
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto mb-12">
            <Counter totalYears={totalYears} />
            <ProgressBar current={totalYears} goal={goal} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 max-w-7xl mx-auto">
            <div className="lg:col-span-2">
              <DonationForm onDonate={handleDonation} />
              {isMessageLoading && (
                <div className="mt-6 p-4 rounded-lg bg-slate-800 border border-cyan-500/30 text-center">
                  <p className="text-cyan-300 animate-pulse">Generating a special thank you message for you...</p>
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-8">
              <Leaderboard entries={leaderboard} />
              <Factoid />
            </div>
          </div>
        </main>

        <Footer />

        <Modal isOpen={!!donationMessage && !!lastDonation} onClose={handleCloseModal}>
          <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-blue-500">
                <WaterDropIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-2xl font-bold leading-6 text-white" id="modal-title">
                Thank You!
              </h3>
              <div className="mt-4">
                <p className="text-lg text-slate-300">
                  {donationMessage}
                </p>
              </div>
          </div>
          <div className="mt-8 text-center">
              <button
                  type="button"
                  onClick={() => handleShare(lastDonation!.amount)}
                  className="inline-flex w-full justify-center items-center gap-3 bg-slate-900/80 text-white font-bold text-base px-6 py-3 rounded-lg shadow-lg hover:bg-slate-700/80 transition-colors duration-300 border border-slate-600"
              >
                  <XIcon className="h-5 w-5" />
                  Share your contribution on X
              </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default App;