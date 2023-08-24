import { NativeRange } from '../types/native';
import { debug } from '../utils/debug';
import { Nodes } from './nodes';

// The Range class represents a fragment of a document that can contain nodes and parts of text nodes.
export class Range {
  // native range
  private range: NativeRange;

  constructor(range?: NativeRange) {
    if (range) {
      this.range = range;
    } else {
      this.range = document.createRange();
    }
  }

  // Returns a node within which the range starts.
  public get startNode(): Nodes {
    return new Nodes(this.range.startContainer);
  }

  // Returns a number representing where in the startNode the range starts.
  public get startOffset(): number {
    return this.range.startOffset;
  }

  // Returns a node within which the range ends.
  public get endNode(): Nodes {
    return new Nodes(this.range.endContainer);
  }

  // Returns a number representing where in the endNode the range ends.
  public get endOffset(): number {
    return this.range.endOffset;
  }

  // Returns the closest node that contains both the startNode and endNode.
  public get commonAncestor(): Nodes {
    return new Nodes(this.range.commonAncestorContainer);
  }

  // Returns a boolean value indicating whether the range's start and end points are at the same position.
  public get isCollapsed(): boolean {
    return this.range.collapsed;
  }

  // Gets a native range.
  public get(): NativeRange {
    return this.range;
  }

  // Returns -1, 0, or 1 depending on whether the end of the specified node is before, the same as, or after the end of the range.
  public compareAfterPoint(node: Nodes): number {
    const afterPoint = this.range.cloneRange();
    afterPoint.collapse(false);
    const targetAfterPoint = document.createRange();
    targetAfterPoint.setEndAfter(node.get());
    targetAfterPoint.collapse(false);
    return afterPoint.comparePoint(targetAfterPoint.startContainer, targetAfterPoint.startOffset);
  }

  // Indicates whether a specified node is part of the range or intersects the range.
  public intersectsNode(node: Nodes): boolean {
    return this.range.intersectsNode(node.get());
  }

  // Returns all nodes which is part of the range or intersects the range.
  public allNodes(): Nodes[] {
    return this.commonAncestor.allChildNodes(child => this.intersectsNode(child));
  }

  // Returns all block nodes which is part of the range or intersects the range.
  public allBlocks(): Nodes[] {
    return this.commonAncestor.allChildNodes(child => child.isBlock && this.intersectsNode(child));
  }

  // Returns a range object with boundary points identical to the cloned range.
  public clone(): Range {
    return new Range(this.range.cloneRange());
  }

  // Sets the start position of the range.
  public setStart(node: Nodes, offset: number): this {
    this.range.setStart(node.get(0), offset);
    return this;
  }

  // Sets the start position of the range before a node.
  public setStartBefore(node: Nodes): this {
    this.range.setStartBefore(node.get(0));
    return this;
  }

  // Sets the start position of the range after a node.
  public setStartAfter(node: Nodes): this {
    this.range.setStartAfter(node.get(0));
    return this;
  }

  // Sets the end position of the range.
  public setEnd(node: Nodes, offset: number): this {
    this.range.setEnd(node.get(0), offset);
    return this;
  }

  // Sets the end position of the range before a node.
  public setEndBefore(node: Nodes): this {
    this.range.setEndBefore(node.get(0));
    return this;
  }

  // Sets the end position of the range after a node.
  public setEndAfter(node: Nodes): this {
    this.range.setEndAfter(node.get(0));
    return this;
  }

  // Collapses the range to the start of it.
  public collapseToStart(): this {
    this.range.collapse(true);
    return this;
  }

  // Collapses the range to the end of it.
  public collapseToEnd(): this {
    this.range.collapse(false);
    return this;
  }

  // Sets the range to contain the specified node and its contents.
  public selectNode(node: Nodes): this {
    this.range.selectNode(node.get(0));
    return this;
  }

  // Sets the range to contain the contents of the specified node.
  public selectNodeContents(node: Nodes): this {
    this.range.selectNodeContents(node.get(0));
    return this;
  }

  // Inserts the specified nodes to the start of the range.
  public insertNode(nodes: Nodes): this {
    nodes.each(node => {
      this.range.insertNode(node);
      this.range.selectNode(node);
      this.range.collapse(false);
    });
    return this;
  }

  // Prints information of the range for debug.
  public debug(): void {
    debug('--- range information ---');
    debug(`start node (${this.startNode.id}):`, this.startNode.get(0), ', offset:', this.startOffset);
    debug(`end node (${this.endNode.id}):`, this.endNode.get(0), ', offset:', this.endOffset);
  }
}
