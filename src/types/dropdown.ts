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
