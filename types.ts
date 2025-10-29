
export interface ClothingItem {
  id: number;
  type: string;
  color: string;
  style: string;
  season: string;
  description: string;
  originalImageUrl: string;
  processedImageUrl: string;
}

export interface Outfit {
  id: number;
  name: string;
  items: ClothingItem[];
}

export enum View {
  WARDROBE = 'WARDROBE',
  OUTFIT_CREATOR = 'OUTFIT_CREATOR',
  SUGGESTIONS = 'SUGGESTIONS',
}

// Represents the JSON structure expected from Gemini for clothing item analysis
export interface ClothingInfo {
    type: string;
    color: string;
    style: string;
    season: string;
    description: string;
}

// Represents the JSON structure expected from Gemini for outfit suggestions
export interface OutfitSuggestion {
    outfitName: string;
    items: string[];
}

// Represents the user's physical information for personalized generation
export interface UserProfile {
  height: string;
  weight: string;
  photo: string | null; // dataURL
}
