
import React, { useState, useMemo, useRef, useCallback } from 'react';
import type { ClothingItem, UserProfile } from '../types';
import ClothingCard from './ClothingCard';
import { generateOutfitImage } from '../services/geminiService';
import Spinner from './Spinner';

const ShirtIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46 16 2a4 4 0 0 0-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>;
const PantsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v7.5"/><path d="M12 22V9.5"/><path d="M12 9.5H7.5l-1.5 12.5"/><path d="M12 9.5h4.5l1.5 12.5"/></svg>;
const JacketIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8c0-2.2-1.8-4-4-4h-2.2c-.3-1.2-1.4-2.1-2.8-2-1.4.1-2.5 1-2.8 2.2H7c-2.2 0-4 1.8-4 4v10c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8Z"/><path d="m16 4-3 3-3-3"/></svg>;
const ShoesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M20 18v-1a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v1"/><path d="M19.5 13.5 18 12a3 3 0 0 0-3 0l-1.5 1.5"/><path d="M4 18h16"/><path d="M12 13v5"/></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;


const categoryNames: { [key: string]: string } = {
  tops: 'ملابس علوية',
  bottoms: 'ملابس سفلية',
  outerwear: 'ملابس خارجية',
  shoes: 'أحذية',
};

const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

const OutfitSlot: React.FC<{ item?: ClothingItem; icon: React.ReactNode; title: string }> = ({ item, icon, title }) => (
  <div className="bg-gray-100 rounded-lg flex flex-col items-center justify-center p-2 text-center aspect-square">
    {item ? (
      <img src={item.processedImageUrl} alt={item.type} className="w-full h-full object-contain rounded-md" />
    ) : (
      <div className="text-gray-400">
        {icon}
        <p className="text-xs font-semibold mt-1">{title}</p>
      </div>
    )}
  </div>
);

interface OutfitCreatorProps {
    items: ClothingItem[];
    userProfile: UserProfile;
    setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const OutfitCreator: React.FC<OutfitCreatorProps> = ({ items, userProfile, setUserProfile }) => {
  const [selectedItems, setSelectedItems] = useState<ClothingItem[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = useMemo(() => {
    const tops = items.filter(i => ['قميص', 'تيشيرت', 'بلوزة', 'سويتر'].some(type => i.type.toLowerCase().includes(type)));
    const bottoms = items.filter(i => ['بنطلون', 'جينز', 'شورت', 'تنورة'].some(type => i.type.toLowerCase().includes(type)));
    const outerwear = items.filter(i => ['جاكيت', 'معطف', 'بليزر'].some(type => i.type.toLowerCase().includes(type)));
    const shoes = items.filter(i => ['حذاء', 'كوتشي', 'صندل', 'بوت'].some(type => i.type.toLowerCase().includes(type)));
    return { tops, bottoms, outerwear, shoes };
  }, [items]);
  
  const typedCategories: { [key: string]: ClothingItem[] } = categories;

  const outfit = useMemo(() => {
    return {
        top: selectedItems.find(item => typedCategories.tops.some(i => i.id === item.id)),
        bottom: selectedItems.find(item => typedCategories.bottoms.some(i => i.id === item.id)),
        outerwear: selectedItems.find(item => typedCategories.outerwear.some(i => i.id === item.id)),
        shoes: selectedItems.find(item => typedCategories.shoes.some(i => i.id === item.id)),
    };
  }, [selectedItems, typedCategories]);

  const handlePhotoUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const dataUrl = await fileToDataUrl(file);
          setUserProfile(p => ({ ...p, photo: dataUrl }));
      }
  }, [setUserProfile]);

  const toggleItemSelection = (itemToToggle: ClothingItem) => {
    setGeneratedImage(null);
    setError(null);
    
    const itemCategoryKey = Object.keys(typedCategories).find(cat => typedCategories[cat].some(i => i.id === itemToToggle.id));

    setSelectedItems(prev => {
      if (prev.some(i => i.id === itemToToggle.id)) {
        return prev.filter(i => i.id !== itemToToggle.id);
      }
      const otherItems = prev.filter(i => {
        const otherItemCategoryKey = Object.keys(typedCategories).find(cat => typedCategories[cat].some(ci => ci.id === i.id));
        return otherItemCategoryKey !== itemCategoryKey;
      });
      return [...otherItems, itemToToggle];
    });
  };
  
  const handleGenerate = async () => {
    if (!canGenerate) return;
    setIsGenerating(true);
    setError(null);
    try {
        const result = await generateOutfitImage(selectedItems, userProfile);
        setGeneratedImage(result);
    } catch(err) {
        console.error(err);
        setError("فشل توليد صورة الطقم. الرجاء المحاولة مرة أخرى.");
    } finally {
        setIsGenerating(false);
    }
  };

  const handleClear = () => {
    setSelectedItems([]);
    setGeneratedImage(null);
    setError(null);
  };

  const isProfileComplete = !!(userProfile.height && userProfile.weight && userProfile.photo);
  const canGenerate = !!(outfit.top && outfit.bottom) && isProfileComplete;

  return (
    <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md max-h-[80vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4 sticky top-0 bg-white py-2 z-10">خزانتك</h3>
        {items.length > 0 ? (
          Object.keys(typedCategories).map(key => {
            const categoryItems = typedCategories[key];
            if (categoryItems.length === 0) return null;
            return (
              <div key={key} className="mb-6">
                <h4 className="font-semibold text-gray-700 border-b pb-2 mb-3">{categoryNames[key]}</h4>
                <div className="grid grid-cols-2 gap-4">
                  {categoryItems.map(item => (
                    <ClothingCard
                      key={item.id}
                      item={item}
                      isSelected={selectedItems.some(i => i.id === item.id)}
                      onSelectToggle={() => toggleItemSelection(item)}
                    />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500">أضف ملابس إلى خزانتك أولاً.</p>
        )}
      </div>
      
      <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md min-h-[50vh] flex flex-col">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">لوحة تنسيق الملابس</h2>
        
        {/* Personalization Section */}
        <div className="mb-6 border-2 border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
                <UserIcon />
                <h3 className="text-lg font-bold">تخصيص المظهر</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                 <div 
                    className="md:col-span-1 h-32 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" />
                    {userProfile.photo ? (
                        <img src={userProfile.photo} alt="User" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                        <div className="text-center text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                            <span className="text-xs font-semibold">ارفع صورة لكامل الجسم</span>
                        </div>
                    )}
                </div>
                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">الطول (سم)</label>
                        <input type="number" value={userProfile.height} onChange={e => setUserProfile(p => ({...p, height: e.target.value}))} placeholder="175" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">الوزن (كجم)</label>
                        <input type="number" value={userProfile.weight} onChange={e => setUserProfile(p => ({...p, weight: e.target.value}))} placeholder="70" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex-grow border-2 border-dashed border-gray-300 rounded-lg p-4 relative flex items-center justify-center">
          {isGenerating && (
            <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center z-10">
              <Spinner />
              <p className="mt-2 text-indigo-600 font-semibold">جاري توليد الصورة...</p>
            </div>
          )}
          {!isGenerating && generatedImage ? (
            <img src={generatedImage} alt="Generated Outfit" className="w-full h-full object-contain rounded-md" />
          ) : (
            <div className="grid grid-cols-2 grid-rows-2 gap-4 w-full h-full max-w-md mx-auto">
              <OutfitSlot item={outfit.top} icon={<ShirtIcon />} title="قطعة علوية" />
              <OutfitSlot item={outfit.outerwear} icon={<JacketIcon />} title="ملابس خارجية" />
              <OutfitSlot item={outfit.bottom} icon={<PantsIcon />} title="قطعة سفلية" />
              <OutfitSlot item={outfit.shoes} icon={<ShoesIcon />} title="حذاء" />
            </div>
          )}
        </div>
        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
        <div className="mt-6 flex justify-between items-center">
            <button
                onClick={handleClear}
                className="px-6 py-3 font-semibold text-gray-700 bg-gray-200 rounded-lg shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition"
            >
                مسح
            </button>
            <button
                onClick={handleGenerate}
                disabled={!canGenerate || isGenerating}
                className="px-6 py-3 font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 transition flex items-center gap-2"
                 title={!isProfileComplete ? "الرجاء إكمال معلومات تخصيص المظهر أولاً" : (!outfit.top || !outfit.bottom) ? "يجب اختيار قطعة علوية وسفلية على الأقل" : ""}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l.34 3.34a7.5 7.5 0 0 0 9.32 9.32l3.34.34-3.34.34a7.5 7.5 0 0 0-9.32 9.32l-.34 3.34-.34-3.34a7.5 7.5 0 0 0-9.32-9.32l-3.34-.34 3.34-.34a7.5 7.5 0 0 0 9.32-9.32Z"/></svg>
                <span>توليد صورة الطقم</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default OutfitCreator;
