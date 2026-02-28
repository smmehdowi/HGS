import fs from 'fs/promises';
import path from 'path';
import { ThemeSettings, NewsArticle, CustomSection, StoneProduct, HomeSection, EmailSettings } from './admin-types';

const CONFIG_DIR = path.join(process.cwd(), 'data', 'config');

async function readJson<T>(filename: string, fallback?: T): Promise<T> {
  const filePath = path.join(CONFIG_DIR, filename);
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    if (fallback !== undefined) return fallback;
    throw new Error(`Config file not found: ${filename}`);
  }
}

async function writeJson<T>(filename: string, data: T): Promise<void> {
  const filePath = path.join(CONFIG_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

const DEFAULT_THEME: ThemeSettings = {
  colors: {
    obsidian: '#1a1a1a',
    marbleWhite: '#f5f0eb',
    gold: '#c9a96e',
    goldLight: '#e4c99a',
    warmGray: '#8a8279',
    slateDark: '#3a3a3c',
    sand: '#e8ddd0',
    deepGreen: '#0d5e37',
    deepGreenHover: '#0a4d2e',
    slateBlue: '#4a5568',
  },
  fonts: { enHeading: 'Playfair Display', enBody: 'DM Sans', arHeading: 'Noto Kufi Arabic', arBody: 'IBM Plex Sans Arabic' },
  fontSizes: { heroEn: '4.5rem', heroAr: '4rem', h2En: '2rem', h2Ar: '1.85rem', bodyEn: '1rem', bodyAr: '1.1rem' },
  social: { tiktok: '', x: '', instagram: '', snapchat: '' },
};

export async function getTheme(): Promise<ThemeSettings> {
  return readJson<ThemeSettings>('theme.json', DEFAULT_THEME);
}

export async function saveTheme(theme: ThemeSettings): Promise<void> {
  return writeJson('theme.json', theme);
}

export async function getNews(): Promise<NewsArticle[]> {
  return readJson<NewsArticle[]>('news.json', []);
}

export async function saveNews(news: NewsArticle[]): Promise<void> {
  return writeJson('news.json', news);
}

export async function getSections(): Promise<CustomSection[]> {
  return readJson<CustomSection[]>('sections.json', []);
}

export async function saveSections(sections: CustomSection[]): Promise<void> {
  return writeJson('sections.json', sections);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getContent(locale: string): Promise<Record<string, any>> {
  return readJson(`content-${locale}.json`, {});
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function saveContent(locale: string, content: Record<string, any>): Promise<void> {
  return writeJson(`content-${locale}.json`, content);
}

export async function getProducts(): Promise<StoneProduct[]> {
  return readJson<StoneProduct[]>('products.json', []);
}

export async function saveProducts(products: StoneProduct[]): Promise<void> {
  return writeJson('products.json', products);
}

const DEFAULT_HOME_LAYOUT: HomeSection[] = [
  { id: 'hero', type: 'hero', visible: true, order: 0 },
  { id: 'product_categories', type: 'product_categories', visible: true, order: 1 },
  { id: 'why_choose_us', type: 'why_choose_us', visible: true, order: 2 },
  { id: 'sourcing_story', type: 'sourcing_story', visible: true, order: 3 },
  { id: 'statistics', type: 'statistics', visible: true, order: 4 },
  { id: 'custom_sections', type: 'custom_sections', visible: true, order: 5 },
  { id: 'news', type: 'news', visible: true, order: 6 },
  { id: 'cta_banner', type: 'cta_banner', visible: true, order: 7 },
];

export async function getHomeLayout(): Promise<HomeSection[]> {
  try {
    const data = await readJson<HomeSection[]>('home-layout.json');
    return Array.isArray(data) && data.length > 0 ? data : DEFAULT_HOME_LAYOUT;
  } catch {
    return DEFAULT_HOME_LAYOUT;
  }
}

export async function saveHomeLayout(layout: HomeSection[]): Promise<void> {
  return writeJson('home-layout.json', layout);
}

const DEFAULT_EMAIL: EmailSettings = {
  toEmail: '',
  ccEmail: '',
  fromName: 'Himalayan Gulf Stones',
  enabled: false,
};

export async function getEmailSettings(): Promise<EmailSettings> {
  return readJson<EmailSettings>('email.json', DEFAULT_EMAIL);
}

export async function saveEmailSettings(settings: EmailSettings): Promise<void> {
  return writeJson('email.json', settings);
}

