import React from 'react';
import { View } from '../types';

interface BottomNavProps {
  currentView: View;
  setView: (view: View) => void;
}

// Icons for the navigation buttons
const WardrobeIcon = ({ isActive }: { isActive: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-colors duration-200 ${isActive ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>
        <path d="m21.48 16.2-5.4-8.1C15.2 6.8 13.7 6 12 6s-3.2.8-3.9 2.1l-5.4 8.1c-.6.9-.2 2.1.7 2.1h13.4c1 0 1.3-1.2.8-2.1z"/>
        <path d="M16 22h-4"/>
        <path d="M12 18v4"/>
    </svg>
);

const CreatorIcon = ({ isActive }: { isActive: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-colors duration-200 ${isActive ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>
        <path d="M5 12h14"/>
        <path d="M12 5v14"/>
    </svg>
);

const SuggestionsIcon = ({ isActive }: { isActive: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-colors duration-200 ${isActive ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>
        <path d="M12 2.69l.34 3.34a7.5 7.5 0 0 0 9.32 9.32l3.34.34-3.34.34a7.5 7.5 0 0 0-9.32 9.32l-.34 3.34-.34-3.34a7.5 7.5 0 0 0-9.32-9.32l-3.34-.34 3.34-.34a7.5 7.5 0 0 0 9.32-9.32Z"/>
    </svg>
);

const NavButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}> = ({ label, isActive, onClick, icon }) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center w-full pt-3 pb-2 transition-colors duration-200 focus:outline-none"
      aria-current={isActive ? 'page' : undefined}
    >
      {icon}
      <span className={`text-xs mt-1 font-medium transition-colors duration-200 ${isActive ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-800'}`}>
        {label}
      </span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ currentView, setView }) => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-20 border-t border-gray-200">
            <div className="flex justify-around max-w-md mx-auto">
                <NavButton
                    label="خزانتي"
                    isActive={currentView === View.WARDROBE}
                    onClick={() => setView(View.WARDROBE)}
                    icon={<WardrobeIcon isActive={currentView === View.WARDROBE} />}
                />
                <NavButton
                    label="إنشاء طقم"
                    isActive={currentView === View.OUTFIT_CREATOR}
                    onClick={() => setView(View.OUTFIT_CREATOR)}
                    icon={<CreatorIcon isActive={currentView === View.OUTFIT_CREATOR} />}
                />
                <NavButton
                    label="اقتراحات"
                    isActive={currentView === View.SUGGESTIONS}
                    onClick={() => setView(View.SUGGESTIONS)}
                    icon={<SuggestionsIcon isActive={currentView === View.SUGGESTIONS} />}
                />
            </div>
        </nav>
    );
};

export default BottomNav;
