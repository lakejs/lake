import { TranslationFunctions } from '../i18n/types';

export type DropdownLocation = 'local' | 'global';

export type DropdownDirection = 'top' | 'bottom' | 'auto';

export type DropdownMenuType = 'list' | 'icon' | 'character' | 'color';

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
  defaultValue?: string;
  tooltip: string | ((locale: TranslationFunctions) => string);
  width?: string;
  menuType: DropdownMenuType;
  menuItems: DropdownMenuItem[];
  menuWidth?: string;
  menuHeight?: string;
  menuCheck?: boolean;
};
