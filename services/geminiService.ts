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

const dataUrlToBase64 = (dataUrl: string): string => {
    return dataUrl.split(',')[1];
};

export const analyzeClothingItem = async (
  base64Image: string,
  mimeType: string
): Promise<ClothingInfo> => {
  const imagePart = fileToGenerativePart(base64Image, mimeType);
  const prompt = "حلل قطعة الملابس في هذه الصورة. استجب بتنسيق JSON. يجب أن يحتوي كائن JSON على هذه المفاتيح: 'type' (مثل 'قميص'، 'جينز')، 'color' (اللون السائد)، 'style' (مثل 'كاجوال'، 'رسمي')، 'season' (مثل 'صيف'، 'شتاء')، و 'description' (وصف موجز للقطعة بما في ذلك أي نقوش أو تفاصيل). يجب أن تكون جميع القيم باللغة العربية.";
  
  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: { parts: [imagePart, {text: prompt}] },
    config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                type: { type: Type.STRING, description: "نوع قطعة الملابس" },
                color: { type: Type.STRING, description: "اللون الأساسي للملابس" },
                style: { type: Type.STRING, description: "نمط الملابس" },
                season: { type: Type.STRING, description: "الموسم المناسب للملابس" },
                description: { type: Type.STRING, description: "وصف مفصل للملابس" },
            },
            required: ["type", "color", "style", "season", "description"]
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
    contents: { parts: [imagePart, {text: "Take the clothing item from this image. If it is wrinkled or creased, digitally smooth it out to make it look perfectly ironed. Then, remove the background completely and place it on a clean, light grey, professional studio background. The item should be centered and well-lit, suitable for an e-commerce website."}] },
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

export const generateOutfitImage = async (
    items: ClothingItem[]
): Promise<string> => {
    const prompt = `أنت مصمم أزياء ومنشئ صور محترف. قم بإنشاء صورة واقعية عالية الجودة لعارض أزياء (بدون وجه واضح) يرتدي الطقم المكون من قطع الملابس التالية. يجب أن تكون الصورة بأسلوب تصوير المنتجات للمتاجر الإلكترونية، مع خلفية استوديو احترافية بلون رمادي فاتح وإضاءة ممتازة. ادمج القطع معًا بشكل طبيعي ومتناسق.`;

    const imageParts = items.map(item => {
        const base64Data = dataUrlToBase64(item.processedImageUrl);
        const mimeType = item.processedImageUrl.substring(item.processedImageUrl.indexOf(":") + 1, item.processedImageUrl.indexOf(";"));
        return fileToGenerativePart(base64Data, mimeType);
    });

    const result = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: { parts: [...imageParts, { text: prompt }] },
        config: {
            responseModalities: [Modality.IMAGE],
        }
    });

    const firstPart = result.candidates?.[0]?.content?.parts[0];
    if (firstPart && firstPart.inlineData) {
        return `data:${firstPart.inlineData.mimeType};base64,${firstPart.inlineData.data}`;
    }
    throw new Error("Could not generate outfit image.");
};
