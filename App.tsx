
import React, { useState, useCallback } from 'react';
import { ClothingItem, View } from './types';
import Header from './components/Header';
import Wardrobe from './components/Wardrobe';
import Suggestions from './components/Suggestions';
import OutfitCreator from './components/OutfitCreator';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.WARDROBE);
  const [wardrobeItems, setWardrobeItems] = useState<ClothingItem[]>([]);

  const addWardrobeItem = useCallback((item: ClothingItem) => {
    setWardrobeItems(prevItems => [...prevItems, { ...item, id: Date.now() }]);
  }, []);
  
  const removeWardrobeItem = useCallback((itemId: number) => {
    setWardrobeItems(prevItems => prevItems.filter(item => item.id !== itemId));
  }, []);

  const renderView = () => {
    switch (view) {
      case View.WARDROBE:
        return <Wardrobe items={wardrobeItems} onAddItem={addWardrobeItem} onRemoveItem={removeWardrobeItem} />;
      case View.SUGGESTIONS:
        return <Suggestions items={wardrobeItems} />;
      case View.OUTFIT_CREATOR:
        return <OutfitCreator items={wardrobeItems} />;
      default:
        return <Wardrobe items={wardrobeItems} onAddItem={addWardrobeItem} onRemoveItem={removeWardrobeItem} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Header currentView={view} setView={setView} />
      <main className="p-4 sm:p-6 lg:p-8">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
