import { ActiveItem } from './selection';

export interface CommandItem {
  isDisabled?: (activeItems: ActiveItem[]) => boolean;
  isSelected?: (activeItems: ActiveItem[]) => boolean;
  selectedValues?: (activeItems: ActiveItem[]) => string[];
  execute: (...data: any[]) => void;
}
