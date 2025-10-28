
import React from 'react';
import { View } from '../types';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
}

const NavButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm sm:text-base font-medium transition-colors duration-200 rounded-lg ${
        isActive
          ? 'bg-indigo-600 text-white shadow-md'
          : 'text-gray-600 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );
};

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  return (
    <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600"><path d="m21.48 16.2-5.4-8.1C15.2 6.8 13.7 6 12 6s-3.2.8-3.9 2.1l-5.4 8.1c-.6.9-.2 2.1.7 2.1h13.4c1 0 1.3-1.2.8-2.1z"/><path d="M12 22v-2"/><path d="M12 6V4"/></svg>
            <h1 className="text-2xl font-bold text-gray-800">Outfit</h1>
          </div>
          <nav className="flex items-center bg-gray-100 p-1 rounded-lg space-x-1">
            <NavButton
              label="خزانتي"
              isActive={currentView === View.WARDROBE}
              onClick={() => setView(View.WARDROBE)}
            />
            <NavButton
              label="إنشاء طقم"
              isActive={currentView === View.OUTFIT_CREATOR}
              onClick={() => setView(View.OUTFIT_CREATOR)}
            />
            <NavButton
              label="اقتراحات"
              isActive={currentView === View.SUGGESTIONS}
              onClick={() => setView(View.SUGGESTIONS)}
            />
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
