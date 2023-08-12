import { NativeRange } from '../types/native';
import { Nodes } from './nodes';

export class Range {
  range: NativeRange;
  start: Nodes;
  end: Nodes;
  startOffset: number;
  endOffset: number;
  commonAncestor: Nodes;
  collapsed: boolean;

  constructor(range: NativeRange) {
    this.range = range;
    this.start = new Nodes(range.startContainer);
    this.end = new Nodes(range.endContainer);
    this.startOffset = range.startOffset;
    this.endOffset = range.endOffset;
    this.commonAncestor = new Nodes(range.commonAncestorContainer);
    this.collapsed = range.collapsed;
  }

  insert(nodes: Nodes): this {
    nodes.each(node => {
      this.range.insertNode(node);
    });
    return this;
  }
}
