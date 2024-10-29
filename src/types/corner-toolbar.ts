import { TranslationFunctions } from '../i18n/types';

export type CornerToolbarItem = {
  name: string;
  icon?: string;
  tooltip: string | ((locale: TranslationFunctions) => string);
  onClick: (event: Event) => void;
};
