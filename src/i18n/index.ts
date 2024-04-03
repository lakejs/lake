import { i18nObject as initI18nObject, type FormattersInitializer } from 'typesafe-i18n';
import type { Formatters, Locales, Translations, TranslationFunctions } from './types';

import enUS from './en-US';
import zhCN from './zh-CN';

const localeTranslations = {
  'en-US': enUS,
  'zh-CN': zhCN,
};

const locales: Locales[] = [
  'en-US',
  'zh-CN',
];

const loadedLocales: Record<Locales, Translations> = {} as Record<Locales, Translations>;
const loadedFormatters: Record<Locales, Formatters> = {} as Record<Locales, Formatters>;

const initFormatters: FormattersInitializer<Locales, Formatters> = () => {
  const formatters: Formatters = {
    // add your formatter functions here
  };
  return formatters;
};

const loadFormatters = (locale: Locales): void => {
  loadedFormatters[locale] = initFormatters(locale);
};

const loadLocale = (locale: Locales): void => {
  if (loadedLocales[locale]) {
    return;
  }
  loadedLocales[locale] = localeTranslations[locale] as Translations;
  loadFormatters(locale);
};

const loadAllLocales = (): void => locales.forEach(loadLocale);

const i18nObject = (locale: Locales): TranslationFunctions =>
  initI18nObject<Locales, Translations, TranslationFunctions, Formatters>(
    locale,
    loadedLocales[locale],
    loadedFormatters[locale],
  );

loadAllLocales();

const language = locales.indexOf(window.LAKE_LANGUAGE) >= 0 ? window.LAKE_LANGUAGE : 'en-US';

export const locale = i18nObject(language);
