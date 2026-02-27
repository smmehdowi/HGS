export interface StoneProduct {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  category: 'slate' | 'marble' | 'granite';
  colors: string[];
  colorsAr?: string[];
  finishes: string[];
  finishesAr?: string[];
  applications: string[];
  applicationsAr?: string[];
  origin: string;
  originAr?: string;
  sizes: string[];
  thickness: string[];
  image: string;
  priceFrom?: number;
  priceTo?: number;
  discountPercent?: number;
}
