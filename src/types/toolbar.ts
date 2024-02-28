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
  tooltipText: string,
  onClick: (editor: Editor, value: string) => void,
};

export type DropdownItem = {
  name: string,
  type: 'dropdown',
  icon?: string,
  defaultValue: string,
  tooltipText: string,
  width: string,
  menuItems: MenuItem[],
  getValues: (appliedItems: AppliedItem[]) => string[],
  onSelect: (editor: Editor, value: string) => void,
};

export type ToolbarItem = ButtonItem | DropdownItem;
