import type { Nodes } from '../models/nodes';

export interface TwoParts {
  start: Nodes | null;
  end: Nodes | null;
}

export interface ThreeParts extends TwoParts {
  center: Nodes | null;
}

export interface Point {
  node: Nodes;
  offset: number;
}

export type NodePath = number[];
