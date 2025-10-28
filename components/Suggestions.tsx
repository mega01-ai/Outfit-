
import React, { useState } from 'react';
import type { ClothingItem, OutfitSuggestion } from '../types';
import { getOutfitSuggestions } from '../services/geminiService';
import Spinner from './Spinner';

interface SuggestionsProps {
  items: ClothingItem[];
}

const Suggestions: React.FC<SuggestionsProps> = ({ items }) => {
  const [occasion, setOccasion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<OutfitSuggestion[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGetSuggestions = async () => {
    if (!occasion.trim() || items.length === 0) {
        setError("الرجاء إدخال مناسبة والتأكد من وجود ملابس في خزانتك.");
        return;
    }
    setIsLoading(true);
    setError(null);
    setSuggestions([]);
    try {
        const result = await getOutfitSuggestions(items, occasion);
        setSuggestions(result);
    } catch (err) {
        console.error(err);
        setError("عذراً، لم نتمكن من توليد اقتراحات. حاول مرة أخرى.");
    } finally {
        setIsLoading(false);
    }
  };

  const findItemByDescription = (desc: string) => {
    return items.find(item => `${item.type} (${item.color}, ${item.style})` === desc);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-3xl font-bold text-gray-800">منسق الأزياء الذكي</h2>
        <p className="text-gray-500 mt-2 mb-6">صف المناسبة، وسأقترح عليك أفضل التنسيقات من خزانتك!</p>
        
        <div className="flex flex-col sm:flex-row gap-2">
            <input 
                type="text"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                placeholder="مثال: عشاء عمل، نزهة على الشاطئ..."
                className="flex-grow w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button 
                onClick={handleGetSuggestions}
                disabled={isLoading || items.length === 0}
                className="flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 transition"
            >
                {isLoading ? <Spinner /> : <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l.34 3.34a7.5 7.5 0 0 0 9.32 9.32l3.34.34-3.34.34a7.5 7.5 0 0 0-9.32 9.32l-.34 3.34-.34-3.34a7.5 7.5 0 0 0-9.32-9.32l-3.34-.34 3.34-.34a7.5 7.5 0 0 0 9.32-9.32Z"/></svg>}
                <span>{isLoading ? 'جاري التفكير...' : 'احصل على اقتراحات'}</span>
            </button>
        </div>
        {items.length === 0 && <p className="text-yellow-600 text-sm mt-2">تحذير: خزانتك فارغة. أضف ملابس أولاً لتحصل على اقتراحات.</p>}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      <div className="mt-8 space-y-6">
        {suggestions.map((suggestion, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md animate-fade-in-up">
                <h3 className="text-xl font-bold mb-4 text-indigo-700">{suggestion.outfitName}</h3>
                <div className="flex flex-wrap gap-4">
                    {suggestion.items.map((itemDesc, itemIndex) => {
                        const item = findItemByDescription(itemDesc);
                        return item ? (
                            <div key={itemIndex} className="text-center w-32">
                                <img src={item.processedImageUrl} alt={item.type} className="w-32 h-32 object-cover rounded-md shadow-sm mb-2" />
                                <p className="text-sm font-medium text-gray-700 capitalize">{item.type}</p>
                                <p className="text-xs text-gray-500 capitalize">{item.color}</p>
                            </div>
                        ) : null;
                    })}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default Suggestions;
