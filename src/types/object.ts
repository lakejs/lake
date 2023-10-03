import type { Nodes } from '../models';

export type KeyValue = { [key: string]: string };

export type TwoParts = {
  left: Nodes | null;
  right: Nodes | null;
};

export type ThreeParts = TwoParts & {
  center: Nodes | null;
};
