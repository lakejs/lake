import type { Nodes } from '../models/nodes';
import type { Box } from '../models/box';

export type BoxType = 'inline' | 'block';

export type BoxValue = Record<string, any>;

export type RenderBox = (box: Box) => Nodes | string | void;

export type RenderBoxHTML = (box: Box) => string;

export interface BoxComponent {
  type: BoxType;
  name: string;
  value?: BoxValue;
  render: RenderBox;
  html?: RenderBoxHTML;
}
