import { NativeRange } from '../types/native';
import { Nodes } from './nodes';

export class Range {
  range: NativeRange;

  constructor() {
    this.range = document.createRange();
  }

  startNode(): Nodes {
    return new Nodes(this.range.startContainer);
  }

  startOffset(): number {
    return this.range.startOffset;
  }

  endNode(): Nodes {
    return new Nodes(this.range.endContainer);
  }

  endOffset(): number {
    return this.range.endOffset;
  }

  commonAncestor(): Nodes {
    return new Nodes(this.range.commonAncestorContainer);
  }

  collapsed(): boolean {
    return this.range.collapsed;
  }

  collapse(toStart?: boolean): this {
    this.range.collapse(toStart);
    return this;
  }

  selectNode(nodes: Nodes): this {
    this.range.selectNode(nodes.get(0));
    return this;
  }

  selectNodeContents(nodes: Nodes): this {
    this.range.selectNodeContents(nodes.get(0));
    return this;
  }

  insertNode(nodes: Nodes): this {
    nodes.each(node => {
      this.range.insertNode(node);
    });
    return this;
  }
}
