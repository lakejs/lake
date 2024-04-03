import { loadAllLocales } from './i18n-util.sync';
import { i18nObject } from './i18n-util';

loadAllLocales();

const locale = window.LAKE_LANGUAGE ?? 'en';

export const L = i18nObject(locale);
