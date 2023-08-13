import { NativeRange } from '../types/native';
import { Nodes } from './nodes';

export class Range {
  range: NativeRange;

  constructor() {
    this.range = document.createRange();
  }

  get startNode(): Nodes {
    return new Nodes(this.range.startContainer);
  }

  get startOffset(): number {
    return this.range.startOffset;
  }

  get endNode(): Nodes {
    return new Nodes(this.range.endContainer);
  }

  get endOffset(): number {
    return this.range.endOffset;
  }

  get commonAncestor(): Nodes {
    return new Nodes(this.range.commonAncestorContainer);
  }

  get collapsed(): boolean {
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
