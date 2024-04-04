import type { Nodes } from '../models/nodes';

export type DropdownMenuItem = {
  value: string;
  icon?: string;
  text: string;
};

export type DropdownItem = {
  icon?: string;
  accentIcon?: string;
  downIcon?: string;
  defaultValue: string;
  tooltip: string;
  width: string;
  menuType: 'list' | 'color';
  menuItems: DropdownMenuItem[];
  hasDocumentClick?: boolean;
};

export type DropdownConfig = DropdownItem & {
  root: Nodes;
  onSelect: (value: string) => void;
}
