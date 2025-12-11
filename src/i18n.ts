import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import vi from './messages/vi.json';
import en from './messages/en.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { 
        translation: en,
        admin: en.admin 
      },
      vi: { 
        translation: vi,
        admin: vi.admin  
      }
    },
    lng: localStorage.getItem('language') || 'vi',
    fallbackLng: 'en',
    ns: ['translation', 'admin'], 
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false
    }
  });

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
});

export default i18n;
















