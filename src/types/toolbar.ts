import type { Editor } from '../editor';
import { TranslationFunctions } from '../i18n/types';
import { DropdownItem } from './dropdown';
import { ActiveItem } from './selection';

export interface ToolbarButtonItem {
  name: string;
  type: 'button';
  icon?: string;
  tooltip: string | ((locale: TranslationFunctions) => string);
  isSelected?: (activeItems: ActiveItem[]) => boolean;
  isDisabled?: (activeItems: ActiveItem[]) => boolean;
  onClick: (editor: Editor, value: string) => void;
}

export interface ToolbarDropdownItem extends DropdownItem {
  name: string;
  type: 'dropdown';
  selectedValues?: (activeItems: ActiveItem[]) => string[];
  isDisabled?: (activeItems: ActiveItem[]) => boolean;
  onSelect: (editor: Editor, value: string) => void;
}

export interface ToolbarUploadItem {
  name: string;
  type: 'upload';
  icon?: string;
  tooltip: string | ((locale: TranslationFunctions) => string);
  accept?: string;
  multiple?: boolean;
}

export type ToolbarItem = ToolbarButtonItem | ToolbarDropdownItem | ToolbarUploadItem;
