import type { Box } from '../models/box';
import { TranslationFunctions } from '../i18n/types';
import { DropdownItem } from './dropdown';
import { AppliedItem } from './object';

export type FloatingToolbarButtonItem = {
  name: string;
  type: 'button';
  icon?: string;
  tooltip: string | ((locale: TranslationFunctions) => string);
  isSelected?: (box: Box, appliedItems: AppliedItem[]) => boolean;
  isDisabled?: (box: Box, appliedItems: AppliedItem[]) => boolean;
  onClick: (box: Box, value: string) => void;
};

export type FloatingToolbarDropdownItem = DropdownItem & {
  name: string;
  type: 'dropdown';
  selectedValues?: (box: Box, appliedItems: AppliedItem[]) => string[];
  isDisabled?: (box: Box, appliedItems: AppliedItem[]) => boolean;
  onSelect: (box: Box, value: string) => void;
}

export type FloatingToolbarItem = FloatingToolbarButtonItem | FloatingToolbarDropdownItem | '|';

export type FloatingToolbarPlacement = 'top' | 'bottom';
