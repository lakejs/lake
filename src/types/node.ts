import type { Nodes } from '../models/nodes';

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

export type NodePath = number[];
