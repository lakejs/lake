import type { Box } from '../models/box';
import { TranslationFunctions } from '../i18n/types';
import { DropdownItem } from './dropdown';
import { AppliedItem } from './object';

export type BoxToolbarButtonItem = {
  name: string;
  type: 'button';
  icon?: string;
  tooltip: string | ((locale: TranslationFunctions) => string);
  isSelected?: (box: Box, appliedItems: AppliedItem[]) => boolean;
  isDisabled?: (box: Box, appliedItems: AppliedItem[]) => boolean;
  onClick: (box: Box, value: string) => void;
};

export type BoxToolbarDropdownItem = DropdownItem & {
  name: string;
  type: 'dropdown';
  selectedValues?: (box: Box, appliedItems: AppliedItem[]) => string[];
  isDisabled?: (box: Box, appliedItems: AppliedItem[]) => boolean;
  onSelect: (box: Box, value: string) => void;
}

export type BoxToolbarItem = BoxToolbarButtonItem | BoxToolbarDropdownItem;

export type BoxToolbarPlacement = 'top' | 'bottom';
