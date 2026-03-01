export interface DaftraSettings {
  enabled: boolean;
  subdomain: string;    // e.g. "mycompany" → mycompany.daftra.com
  apiKey: string;
  storeId: number;      // from Daftra → Settings → Stores
  currencyCode: string; // default "SAR"
}

export interface EmailSettings {
  toEmail: string;
  ccEmail: string;
  fromName: string;
  fromEmail: string;  // verified sender domain email — e.g. noreply@himalayangulfstones.com
  enabled: boolean;
}

export interface SocialLinks {
  tiktok: string;
  x: string;
  instagram: string;
  snapchat: string;
}

export interface ThemeSettings {
  colors: {
    obsidian: string;
    marbleWhite: string;
    gold: string;
    goldLight: string;
    warmGray: string;
    slateDark: string;
    sand: string;
    deepGreen: string;
    deepGreenHover: string;
    slateBlue: string;
  };
  fonts: {
    enHeading: string;
    enBody: string;
    arHeading: string;
    arBody: string;
  };
  fontSizes: {
    heroEn: string;
    heroAr: string;
    h2En: string;
    h2Ar: string;
    bodyEn: string;
    bodyAr: string;
  };
  social: SocialLinks;
}

export interface NewsArticle {
  id: string;
  titleEn: string;
  titleAr: string;
  summaryEn: string;
  summaryAr: string;
  contentEn: string;
  contentAr: string;
  imageUrl?: string;
  publishedAt: string;
  visible: boolean;
}

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
  visible?: boolean;
}

export type HomeSectionType =
  | 'hero'
  | 'product_categories'
  | 'why_choose_us'
  | 'sourcing_story'
  | 'statistics'
  | 'news'
  | 'cta_banner'
  | 'custom_sections'
  | 'popular_products'
  | 'discounted_products';

export interface HomeSection {
  id: string;
  type: HomeSectionType;
  visible: boolean;
  order: number;
}

export interface CustomSection {
  id: string;
  titleEn: string;
  titleAr: string;
  contentEn: string;
  contentAr: string;
  imageUrl?: string;
  ctaTextEn?: string;
  ctaTextAr?: string;
  ctaUrl?: string;
  order: number;
  visible: boolean;
}
