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
  onClick: (editor: Editor, value: string) => void,
};

export type DropdownItem = {
  name: string,
  type: 'dropdown',
  icon?: string,
  downIcon?: string,
  defaultValue: string,
  tooltip: string,
  width: string,
  menuType: 'list' | 'color',
  menuItems: MenuItem[],
  getValues: (appliedItems: AppliedItem[]) => string[],
  onSelect: (editor: Editor, value: string) => void,
};

export type ToolbarItem = ButtonItem | DropdownItem;
