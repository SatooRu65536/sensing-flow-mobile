import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import ja from './locales/ja.json';

export const resources = {
  en,
  ja,
} as const;
export const defaultNS = 'en';

await i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ja: { translation: ja },
  },
  lng: 'ja',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
