import type { Nodes } from '../models/nodes';

export type KeyValue = { [key: string]: string };

export type TwoParts = {
  left: Nodes | null;
  right: Nodes | null;
};

export type ThreeParts = TwoParts & {
  center: Nodes | null;
};

export type Point = {
  node: Nodes;
  offset: number;
};

export type AppliedItem = {
  node: Nodes;
  name: string;
  attributes: KeyValue;
  styles: KeyValue;
};
