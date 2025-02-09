import { KeyValue } from './object';
import type { Nodes } from '../models/nodes';

export interface ActiveItem {
  node: Nodes;
  name: string;
  attributes: KeyValue;
  styles: KeyValue;
}

export interface SelectionState {
  activeItems: ActiveItem[];
  disabledNameMap?: Map<string, boolean>;
  selectedNameMap?: Map<string, boolean>;
  selectedValuesMap?: Map<string, string[]>;
}
