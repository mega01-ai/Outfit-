import React from 'react';
import type { ClothingItem } from '../types';

interface ClothingCardProps {
  item: ClothingItem;
  onRemove?: () => void;
  isSelected?: boolean;
  onSelectToggle?: () => void;
}

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
);

const PlusCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
);

const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);


const ClothingCard: React.FC<ClothingCardProps> = ({ item, onRemove, isSelected, onSelectToggle }) => {
  return (
    <div
      className={`group relative bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl ${isSelected ? 'ring-4 ring-indigo-500' : ''}`}
    >
      <img
        src={item.processedImageUrl}
        alt={item.type}
        className="w-full h-56 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-lg capitalize text-gray-800 truncate">{item.type}</h3>
        <p className="text-sm text-gray-600 mt-1 truncate h-5">{item.description}</p>
        <div className="flex items-center justify-between mt-3">
            <p className="text-sm text-gray-500 capitalize truncate">{item.color} - {item.style}</p>
            <span className="text-xs flex-shrink-0 font-medium bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">{item.season}</span>
        </div>
      </div>
      {onRemove && (
        <button 
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Remove item"
        >
            <TrashIcon />
        </button>
      )}
      {onSelectToggle && (
        <button
            onClick={(e) => { e.stopPropagation(); onSelectToggle(); }}
            className={`absolute top-2 right-2 text-white p-1.5 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 ring-offset-2 ${isSelected ? 'bg-green-500 hover:bg-green-600 focus:ring-green-500' : 'bg-indigo-500 hover:bg-indigo-600 focus:ring-indigo-500'}`}
            aria-label={isSelected ? "Deselect item" : "Select item"}
        >
            {isSelected ? <CheckCircleIcon /> : <PlusCircleIcon />}
        </button>
      )}
    </div>
  );
};

export default ClothingCard;
