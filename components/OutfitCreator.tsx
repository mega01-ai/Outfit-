
import React, { useState } from 'react';
import type { ClothingItem } from '../types';
import ClothingCard from './ClothingCard';

interface OutfitCreatorProps {
  items: ClothingItem[];
}

const OutfitCreator: React.FC<OutfitCreatorProps> = ({ items }) => {
  const [selectedItems, setSelectedItems] = useState<ClothingItem[]>([]);
  
  const toggleItemSelection = (item: ClothingItem) => {
    setSelectedItems(prev => 
      prev.find(i => i.id === item.id) 
        ? prev.filter(i => i.id !== item.id) 
        : [...prev, item]
    );
  };
  
  const isSelected = (item: ClothingItem) => !!selectedItems.find(i => i.id === item.id);

  return (
    <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">خزانتك</h3>
        {items.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto pr-2">
            {items.map(item => (
              <div key={item.id} className="transform scale-90" onClick={() => toggleItemSelection(item)}>
                <ClothingCard 
                    item={item} 
                    onRemove={() => {}} // dummy onRemove for styling
                    isSelected={isSelected(item)}
                    onClick={() => toggleItemSelection(item)}
                />
              </div>
            ))}
          </div>
        ) : (
             <p className="text-gray-500">أضف ملابس إلى خزانتك أولاً.</p>
        )}
      </div>
      
      <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md min-h-[50vh] flex flex-col">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">منطقة تنسيق الملابس</h2>
        <div className="flex-grow border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-wrap justify-center items-center gap-4">
          {selectedItems.length === 0 ? (
            <p className="text-gray-500">اختر قطعًا من خزانتك لإنشاء طقم</p>
          ) : (
            selectedItems.map(item => (
                <div key={item.id} className="w-40 h-40">
                    <img src={item.processedImageUrl} alt={item.type} className="w-full h-full object-contain rounded-md" />
                </div>
            ))
          )}
        </div>
        <div className="mt-6 flex justify-end">
            <button
                disabled={selectedItems.length === 0}
                className="px-6 py-3 font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 transition"
            >
                حفظ الطقم
            </button>
        </div>
      </div>
    </div>
  );
};

export default OutfitCreator;
