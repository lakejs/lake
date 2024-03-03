import type { Editor } from '../editor';
import { AppliedItem } from './object';

export type MenuItem = {
  value: string,
  icon?: string,
  text: string,
};

export type ButtonItem = {
  name: string,
  type: 'button',
  icon?: string,
  tooltip: string,
  isSelected: (appliedItems: AppliedItem[], editor: Editor) => boolean,
  isDisabled?: (AppliedItems: AppliedItem[], editor: Editor) => boolean,
  onClick: (editor: Editor, value: string) => void,
};

export type DropdownItem = {
  name: string,
  type: 'dropdown',
  icon?: string,
  accentIcon?: string,
  downIcon?: string,
  defaultValue: string,
  tooltip: string,
  width: string,
  menuType: 'list' | 'color',
  menuItems: MenuItem[],
  selectedValues: (appliedItems: AppliedItem[], editor: Editor) => string[],
  isDisabled?: (AppliedItems: AppliedItem[], editor: Editor) => boolean,
  onSelect: (editor: Editor, value: string) => void,
};

export type ToolbarItem = ButtonItem | DropdownItem;
