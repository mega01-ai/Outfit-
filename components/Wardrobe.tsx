
import React, { useState } from 'react';
import type { ClothingItem } from '../types';
import AddItemModal from './AddItemModal';
import ClothingCard from './ClothingCard';

interface WardrobeProps {
  items: ClothingItem[];
  onAddItem: (item: ClothingItem) => void;
  onRemoveItem: (itemId: number) => void;
}

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
);

const Wardrobe: React.FC<WardrobeProps> = ({ items, onAddItem, onRemoveItem }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">خزانتي الرقمية</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
        >
          <PlusIcon />
          <span>إضافة قطعة جديدة</span>
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-400 mb-4"><path d="m21.48 16.2-5.4-8.1C15.2 6.8 13.7 6 12 6s-3.2.8-3.9 2.1l-5.4 8.1c-.6.9-.2 2.1.7 2.1h13.4c1 0 1.3-1.2.8-2.1z"/><path d="M16 22h-4"/><path d="M12 18v4"/><path d="M12 6V2"/></svg>
          <h3 className="text-xl font-semibold text-gray-700">خزانتك فارغة</h3>
          <p className="text-gray-500 mt-2">ابدأ بإضافة ملابسك لرؤيتها هنا.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {items.map(item => (
            <ClothingCard key={item.id} item={item} onRemove={() => onRemoveItem(item.id)} />
          ))}
        </div>
      )}

      {isModalOpen && (
        <AddItemModal
          onClose={() => setIsModalOpen(false)}
          onAddItem={onAddItem}
        />
      )}
    </div>
  );
};

export default Wardrobe;
