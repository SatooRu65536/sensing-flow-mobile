import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { locale } from '@tauri-apps/plugin-os';

import en from './locales/en.json';
import ja from './locales/ja.json';

export const resources = {
  en,
  ja,
} as const;
export const defaultNS = 'en';

async function getLanguageCode(): Promise<string> {
  const loc = await locale();
  if (typeof loc !== 'string') return 'en';
  return loc.split('-')[0] ?? 'en';
}

const localeCode = await getLanguageCode();
await i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ja: { translation: ja },
  },
  lng: localeCode,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
