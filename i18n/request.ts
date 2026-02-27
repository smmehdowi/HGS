import { getRequestConfig } from 'next-intl/server';
import { routing } from '../routing';
import fs from 'fs/promises';
import path from 'path';

async function loadMessages(locale: string) {
  // Try the editable content config first (written by admin dashboard)
  try {
    const configPath = path.join(process.cwd(), 'data', 'config', `content-${locale}.json`);
    const raw = await fs.readFile(configPath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    // Fall back to the bundled messages (first-run / development)
    return (await import(`../messages/${locale}.json`)).default;
  }
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as 'ar' | 'en')) {
    locale = routing.defaultLocale;
  }
  return {
    locale,
    messages: await loadMessages(locale),
  };
});
