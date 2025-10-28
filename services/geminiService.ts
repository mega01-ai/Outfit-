
import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { ClothingInfo, ClothingItem, OutfitSuggestion } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = (base64Data: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64Data,
      mimeType,
    },
  };
};

export const analyzeClothingItem = async (
  base64Image: string,
  mimeType: string
): Promise<ClothingInfo> => {
  const imagePart = fileToGenerativePart(base64Image, mimeType);
  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: { parts: [imagePart, {text: "วิเคราะห์รายการเสื้อผ้าในภาพนี้ อธิบายในรูปแบบ JSON วัตถุ JSON ควรมีคีย์เหล่านี้: 'type' (เช่น 'T-Shirt', 'Jeans'), 'color' (สีเด่น), 'style' (เช่น 'Casual', 'Formal'), และ 'season' (เช่น 'Summer', 'Winter') ตอบเป็นภาษาไทย"}] }, // Prompt in Thai for Arabic context, but asking for English values
    config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                type: { type: Type.STRING },
                color: { type: Type.STRING },
                style: { type: Type.STRING },
                season: { type: Type.STRING },
            },
            required: ["type", "color", "style", "season"]
        }
    }
  });

  const jsonString = result.text.trim();
  return JSON.parse(jsonString) as ClothingInfo;
};

export const professionalizeImage = async (
  base64Image: string,
  mimeType: string
): Promise<string> => {
  const imagePart = fileToGenerativePart(base64Image, mimeType);
  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: { parts: [imagePart, {text: "Take the clothing item from this image, remove the background completely, and place it on a clean, light grey, professional studio background. The item should be centered and well-lit, suitable for an e-commerce website."}] },
    config: {
        responseModalities: [Modality.IMAGE],
    }
  });

  const firstPart = result.candidates?.[0]?.content?.parts[0];
  if (firstPart && firstPart.inlineData) {
      return `data:${firstPart.inlineData.mimeType};base64,${firstPart.inlineData.data}`;
  }
  throw new Error("Could not generate professional image.");
};

export const getOutfitSuggestions = async (
  items: ClothingItem[],
  occasion: string
): Promise<OutfitSuggestion[]> => {
  const simplifiedItems = items.map(item => `${item.type} (${item.color}, ${item.style})`);
  
  const prompt = `أنت خبير في تنسيق الأزياء. يحتاج المستخدم إلى طقم للمناسبة التالية: "${occasion}". لديه الملابس التالية في خزانته: ${JSON.stringify(simplifiedItems)}.
  اقترح 3 أطقم متميزة باستخدام الملابس من هذه القائمة فقط. لكل طقم، قدم اسمًا إبداعيًا وقائمة بالملابس المستخدمة بالضبط.
  يجب أن تكون الاستجابة على شكل مصفوفة JSON، حيث يمثل كل كائن طقمًا ويحتوي على 'outfitName' (سلسلة نصية) و 'items' (مصفوفة من السلاسل النصية، حيث تكون كل سلسلة نصية وصفًا لقطعة ملابس من القائمة المقدمة).`;

  const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
          responseMimeType: "application/json",
          responseSchema: {
              type: Type.ARRAY,
              items: {
                  type: Type.OBJECT,
                  properties: {
                      outfitName: { type: Type.STRING },
                      items: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING }
                      }
                  },
                  required: ["outfitName", "items"]
              }
          }
      }
  });

  const jsonString = result.text.trim();
  return JSON.parse(jsonString) as OutfitSuggestion[];
};
