
import React from 'react';
import { WaterDropIcon } from './icons/WaterDropIcon';

const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-800 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400">
        <div className="flex justify-center items-center mb-4">
          <WaterDropIcon className="h-6 w-6 text-cyan-500 mr-2" />
          <p className="text-lg font-semibold text-white">#TEAMWATER</p>
        </div>
        <p>Together, we can create a wave of change.</p>
        <p className="text-sm mt-2">&copy; {new Date().getFullYear()} Team Water. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
