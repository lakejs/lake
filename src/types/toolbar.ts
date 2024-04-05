import type { Editor } from '../editor';
import { DropdownItem } from './dropdown';
import { AppliedItem } from './object';

export type ToolbarButtonItem = {
  name: string;
  type: 'button';
  icon?: string;
  tooltip: string;
  isSelected?: (appliedItems: AppliedItem[]) => boolean;
  isDisabled?: (AppliedItems: AppliedItem[]) => boolean;
  onClick: (editor: Editor, value: string) => void;
};

export type ToolbarDropdownItem = DropdownItem & {
  name: string;
  type: 'dropdown';
  selectedValues?: (appliedItems: AppliedItem[]) => string[];
  isDisabled?: (AppliedItems: AppliedItem[]) => boolean;
  onSelect: (editor: Editor, value: string) => void;
}

export type ToolbarUploadItem = {
  name: string;
  type: 'upload';
  icon?: string;
  tooltip: string;
  accept?: string;
  multiple?: boolean;
};

export type ToolbarItem = ToolbarButtonItem | ToolbarDropdownItem | ToolbarUploadItem;
