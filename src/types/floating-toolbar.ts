import type { Range } from '../models/range';
import { TranslationFunctions } from '../i18n/types';
import { DropdownItem } from './dropdown';
import { AppliedItem } from './object';

export type FloatingToolbarButtonItem = {
  name: string;
  type: 'button';
  icon?: string;
  tooltip: string | ((locale: TranslationFunctions) => string);
  isSelected?: (appliedItems: AppliedItem[]) => boolean;
  isDisabled?: (appliedItems: AppliedItem[]) => boolean;
  onClick: (range: Range, value: string) => void;
};

export type FloatingToolbarDropdownItem = DropdownItem & {
  name: string;
  type: 'dropdown';
  selectedValues?: (appliedItems: AppliedItem[]) => string[];
  isDisabled?: (appliedItems: AppliedItem[]) => boolean;
  onSelect: (range: Range, value: string) => void;
}

export type FloatingToolbarItem = FloatingToolbarButtonItem | FloatingToolbarDropdownItem | '|';
