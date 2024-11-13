import type { Nodes } from '../models/nodes';

export type KeyValue = { [key: string]: string };

export type TwoParts = {
  start: Nodes | null;
  end: Nodes | null;
};

export type ThreeParts = TwoParts & {
  center: Nodes | null;
};

export type Point = {
  node: Nodes;
  offset: number;
};

export type ActiveItem = {
  node: Nodes;
  name: string;
  attributes: KeyValue;
  styles: KeyValue;
};

export type SelectionState = {
  activeItems: ActiveItem[];
  disabledNameMap?: Map<string, boolean>;
  selectedNameMap?: Map<string, boolean>;
  selectedValuesMap?: Map<string, string[]>;
};
