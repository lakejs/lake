import { TranslationFunctions } from '../i18n/types';

export type DropdownMenuItem = {
  value: string;
  icon?: string;
  text: string | ((locale: TranslationFunctions) => string);
};

export type DropdownItem = {
  name: string;
  icon?: string;
  accentIcon?: string;
  downIcon?: string;
  defaultValue: string;
  tooltip: string | ((locale: TranslationFunctions) => string);
  width: string;
  menuType: 'list' | 'color';
  menuItems: DropdownMenuItem[];
};
