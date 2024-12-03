import { use } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import I18NextHttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

import { Language, LocaleNamespace } from '@/constants/enums/common';

use(initReactI18next); // passes i18n down to react-i18next
use(I18NextHttpBackend)
  .use(LanguageDetector)
  .init({
    // the translations
    // (tip move them in a JSON file and import them,
    // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
    fallbackLng: Language.EN,
    ns: [LocaleNamespace.Common], // preload common namespace
    defaultNS: LocaleNamespace.Common,
    supportedLngs: Object.values(Language),
    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
    backend: {
      loadPath: () => `/locales/{{lng}}/{{ns}}.json`,
    },
  });
