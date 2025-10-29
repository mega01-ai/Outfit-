
import React, { useState, useCallback, useRef } from 'react';
import { analyzeClothingItem, professionalizeImage } from '../services/geminiService';
import type { ClothingItem, ClothingInfo } from '../types';
import Spinner from './Spinner';

interface AddItemModalProps {
  onClose: () => void;
  onAddItem: (item: ClothingItem) => void;
}

const fileToBas64 = (file: File): Promise<{ data: string, mimeType: string }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            const mimeType = result.split(',')[0].split(':')[1].split(';')[0];
            const data = result.split(',')[1];
            resolve({ data, mimeType });
        };
        reader.onerror = error => reject(error);
    });
};

const AddItemModal: React.FC<AddItemModalProps> = ({ onClose, onAddItem }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processedItem, setProcessedItem] = useState<Partial<ClothingItem> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setProcessedItem(null);
      setError(null);
      const { data, mimeType } = await fileToBas64(selectedFile);
      setPreview(`data:${mimeType};base64,${data}`);
    }
  }, []);

  const handleProcessImage = async () => {
    if (!file) {
      setError("الرجاء اختيار صورة أولاً.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const { data: base64Data, mimeType } = await fileToBas64(file);
      
      const [info, processedImageUrl] = await Promise.all([
          analyzeClothingItem(base64Data, mimeType),
          professionalizeImage(base64Data, mimeType),
      ]);
      
      setProcessedItem({
        ...info,
        originalImageUrl: preview!,
        processedImageUrl: processedImageUrl,
      });

    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء معالجة الصورة. الرجاء المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveItem = () => {
    if (processedItem && processedItem.processedImageUrl) {
      onAddItem(processedItem as Omit<ClothingItem, 'id'> & { id: number });
      onClose();
    }
  };
  
  const handleFieldChange = (field: keyof ClothingInfo, value: string) => {
      if(processedItem) {
          setProcessedItem(prev => ({...prev, [field]: value}));
      }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 relative animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 left-4 text-gray-400 hover:text-gray-600">&times;</button>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">إضافة قطعة ملابس جديدة</h2>

        {!processedItem ? (
          <div className="text-center">
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4 cursor-pointer hover:border-indigo-500 transition"
              onClick={() => fileInputRef.current?.click()}
            >
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
              {preview ? (
                <img src={preview} alt="Preview" className="mx-auto h-48 rounded-lg object-contain" />
              ) : (
                <div className="text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                  <p>انقر هنا لرفع صورة</p>
                </div>
              )}
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button onClick={handleProcessImage} disabled={!file || isLoading} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-indigo-300 transition flex items-center justify-center gap-2">
              {isLoading ? <Spinner /> : <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l.34 3.34a7.5 7.5 0 0 0 9.32 9.32l3.34.34-3.34.34a7.5 7.5 0 0 0-9.32 9.32l-.34 3.34-.34-3.34a7.5 7.5 0 0 0-9.32-9.32l-3.34-.34 3.34-.34a7.5 7.5 0 0 0 9.32-9.32Z"/></svg>}
              <span>{isLoading ? 'جاري التحليل...' : 'تحليل وتحسين الصورة'}</span>
            </button>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <img src={processedItem.processedImageUrl} alt="Processed" className="w-full rounded-lg shadow-md object-cover"/>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">النوع</label>
                  <input type="text" value={processedItem.type || ''} onChange={e => handleFieldChange('type', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700">اللون</label>
                  <input type="text" value={processedItem.color || ''} onChange={e => handleFieldChange('color', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700">النمط</label>
                  <input type="text" value={processedItem.style || ''} onChange={e => handleFieldChange('style', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700">الموسم</label>
                  <input type="text" value={processedItem.season || ''} onChange={e => handleFieldChange('season', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">الوصف</label>
                  <textarea value={processedItem.description || ''} onChange={e => handleFieldChange('description', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 h-24 resize-none" rows={3}></textarea>
                </div>
              </div>
            </div>
             <div className="mt-8 flex justify-end gap-4">
                 <button onClick={() => setProcessedItem(null)} className="py-2 px-6 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">العودة</button>
                 <button onClick={handleSaveItem} className="py-2 px-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">حفظ في الخزانة</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddItemModal;