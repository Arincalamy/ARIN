
import React from 'react';
import { WaterDropIcon } from './icons/WaterDropIcon';

const Header: React.FC = () => {
  return (
    <header className="py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center">
        <WaterDropIcon className="h-8 w-8 text-cyan-400 mr-3" />
        <h1 className="text-2xl font-bold tracking-tighter text-white">
          #TEAM<span className="text-cyan-400">WATER</span>
        </h1>
      </div>
    </header>
  );
};

export default Header;
