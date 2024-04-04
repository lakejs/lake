import type { Editor } from '../editor';
import { DropdownItem } from './dropdown';
import { AppliedItem } from './object';

export type ToolbarButtonItem = {
  name: string;
  type: 'button';
  icon?: string;
  tooltip: string;
  isSelected?: (appliedItems: AppliedItem[], editor: Editor) => boolean;
  isDisabled?: (AppliedItems: AppliedItem[], editor: Editor) => boolean;
  onClick: (editor: Editor, value: string) => void;
};

export type ToolbarDropdownItem = DropdownItem & {
  name: string;
  type: 'dropdown';
  selectedValues?: (appliedItems: AppliedItem[], editor: Editor) => string[];
  isDisabled?: (AppliedItems: AppliedItem[], editor: Editor) => boolean;
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
