import { i18nObject as initI18nObject, type FormattersInitializer } from 'typesafe-i18n';
import type { Formatters, Locales, Translations, TranslationFunctions } from './types';

import enUS from './en-US';
import zhCN from './zh-CN';
import ja from './ja';
import ko from './ko';

const localeTranslations = {
  'en-US': enUS,
  'zh-CN': zhCN,
  ja,
  ko,
};

const locales: Locales[] = Object.keys(localeTranslations) as Locales[];

const loadedLocales: Record<Locales, Translations> = {} as Record<Locales, Translations>;
const loadedFormatters: Record<Locales, Formatters> = {} as Record<Locales, Formatters>;

const initFormatters: FormattersInitializer<Locales, Formatters> = () => {
  const formatters: Formatters = {
    // add your formatter functions here
  };
  return formatters;
};

function loadFormatters(locale: Locales): void {
  loadedFormatters[locale] = initFormatters(locale);
}

function loadLocale(locale: Locales): void {
  if (loadedLocales[locale]) {
    return;
  }
  loadedLocales[locale] = localeTranslations[locale] as Translations;
  loadFormatters(locale);
}

const loadAllLocales = (): void => locales.forEach(loadLocale);

export function i18nObject(locale: Locales): TranslationFunctions {
  return initI18nObject<Locales, Translations, TranslationFunctions, Formatters>(
    locale,
    loadedLocales[locale],
    loadedFormatters[locale],
  );
}

loadAllLocales();
