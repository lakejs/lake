import type { Nodes } from '../models/nodes';
import type { Box } from '../models/box';

export type BoxType = 'inline' | 'block';

export type BoxValue = { [key: string]: any };

export type BoxRender = (box: Box) => Nodes | string | void;

export type BoxComponent = {
  type: BoxType;
  name: string;
  value?: BoxValue;
  render: BoxRender;
};
