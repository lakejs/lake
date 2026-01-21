import { i18nObject as initI18nObject, type FormattersInitializer } from 'typesafe-i18n';
import type { Formatters, Translation, TranslationFunctions } from './types';

import enUS from './en-US';
import zhCN from './zh-CN';
import ja from './ja';
import ko from './ko';

const localeTranslations: Record<string, Translation> = {
  'en-US': enUS as Translation,
  'zh-CN': zhCN,
  ja,
  ko,
};

const loadedLocales = {} as Record<string, Translation>;
const loadedFormatters = {} as Record<string, Formatters>;

const initFormatters: FormattersInitializer<string, Formatters> = () => {
  const formatters: Formatters = {
    // add your formatter functions here
  };
  return formatters;
};

function loadFormatters(locale: string): void {
  loadedFormatters[locale] = initFormatters(locale);
}

function loadLocale(locale: string): void {
  if (loadedLocales[locale]) {
    return;
  }
  loadedLocales[locale] = localeTranslations[locale] as Translation;
  loadFormatters(locale);
}

export function i18nObject(locale: string): TranslationFunctions {
  return initI18nObject<string, Translation, TranslationFunctions, Formatters>(
    locale,
    loadedLocales[locale],
    loadedFormatters[locale],
  );
}

/**
 * The LocaleManager interface manages a collection of Translation objects.
 * It allows you to add and retrieve the names of locales.
 */
export class LocaleManager {
  /**
   * Adds a Translation to the collection.
   */
  public add(locale: string, translation: Translation): void {
    localeTranslations[locale] = translation;
    loadLocale(locale);
  }

  /**
   * Returns a list of all locale names.
   */
  public getNames(): string[] {
    return Object.keys(localeTranslations);
  }
}

const locales = Object.keys(localeTranslations);
locales.forEach(loadLocale);
