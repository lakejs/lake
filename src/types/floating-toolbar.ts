import type { Range } from '../models/range';
import { TranslationFunctions } from '../i18n/types';
import { DropdownItem } from './dropdown';
import { AppliedItem } from './object';

export type FloatingToolbarButtonItem = {
  name: string;
  type: 'button';
  icon?: string;
  tooltip: string | ((locale: TranslationFunctions) => string);
  isSelected?: (range: Range, appliedItems: AppliedItem[]) => boolean;
  isDisabled?: (range: Range, appliedItems: AppliedItem[]) => boolean;
  onClick: (range: Range, value: string) => void;
};

export type FloatingToolbarDropdownItem = DropdownItem & {
  name: string;
  type: 'dropdown';
  selectedValues?: (range: Range, appliedItems: AppliedItem[]) => string[];
  isDisabled?: (range: Range, appliedItems: AppliedItem[]) => boolean;
  onSelect: (range: Range, value: string) => void;
}

export type FloatingToolbarItem = FloatingToolbarButtonItem | FloatingToolbarDropdownItem | '|';

export type FloatingToolbarPlacement = 'top' | 'bottom';
