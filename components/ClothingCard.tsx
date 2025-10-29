
import React from 'react';
import type { ClothingItem } from '../types';

interface ClothingCardProps {
  item: ClothingItem;
  onRemove: () => void;
  isSelected?: boolean;
  onClick?: () => void;
}

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
);


const ClothingCard: React.FC<ClothingCardProps> = ({ item, onRemove, isSelected, onClick }) => {
  return (
    <div
      className={`group relative bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl ${onClick ? 'cursor-pointer' : ''} ${isSelected ? 'ring-4 ring-indigo-500' : ''}`}
      onClick={onClick}
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
      <button 
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        aria-label="Remove item"
      >
        <TrashIcon />
      </button>
    </div>
  );
};

export default ClothingCard;