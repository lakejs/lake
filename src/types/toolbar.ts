import type { Editor } from '../editor';
import { AppliedItem } from './object';
import { UploadRequestMethod } from './request';

export type ToolbarMenuItem = {
  value: string;
  icon?: string;
  text: string;
};

export type ButtonItem = {
  name: string;
  type: 'button';
  icon?: string;
  tooltip: string;
  isSelected?: (appliedItems: AppliedItem[], editor: Editor) => boolean;
  isDisabled?: (AppliedItems: AppliedItem[], editor: Editor) => boolean;
  onClick: (editor: Editor, value: string) => void;
};

export type DropdownItem = {
  name: string;
  type: 'dropdown';
  icon?: string;
  accentIcon?: string;
  downIcon?: string;
  defaultValue: string;
  tooltip: string;
  width: string;
  menuType: 'list' | 'color';
  menuItems: ToolbarMenuItem[];
  selectedValues?: (appliedItems: AppliedItem[], editor: Editor) => string[];
  isDisabled?: (AppliedItems: AppliedItem[], editor: Editor) => boolean;
  onSelect: (editor: Editor, value: string) => void;
};

export type UploadItem = {
  name: string;
  type: 'upload';
  request: {
    method: UploadRequestMethod;
    action: string;
  },
  icon?: string;
  tooltip: string;
  accept?: string;
  multiple?: boolean;
  onClick: (editor: Editor, value: string) => void;
};

export type ToolbarItem = ButtonItem | DropdownItem | UploadItem;
