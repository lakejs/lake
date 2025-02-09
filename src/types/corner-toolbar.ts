import { TranslationFunctions } from '../i18n/types';

export interface CornerToolbarItem {
  name: string;
  icon?: string;
  tooltip: string | ((locale: TranslationFunctions) => string);
  onClick: (event: Event) => void;
}
