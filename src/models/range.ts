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

  // Gets a native range.
  public get(): NativeRange {
    return this.range;
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

  public get container(): Nodes {
    return this.commonAncestor.closest('div[contenteditable="true"]');
  }

  // Returns a boolean value indicating whether the range's start and end points are at the same position.
  public get collapsed(): boolean {
    return this.range.collapsed;
  }

  // Sets the start position of a range.
  public setStart(node: Nodes, offset: number): this {
    this.range.setStart(node.get(0), offset);
    return this;
  }

  // Sets the start position of a range before a node.
  public setStartBefore(node: Nodes): this {
    this.range.setStartBefore(node.get(0));
    return this;
  }

  // Sets the start position of a range after a node.
  public setStartAfter(node: Nodes): this {
    this.range.setStartAfter(node.get(0));
    return this;
  }

  // Sets the end position of a range.
  public setEnd(node: Nodes, offset: number): this {
    this.range.setEnd(node.get(0), offset);
    return this;
  }

  // Sets the end position of a range before a node.
  public setEndBefore(node: Nodes): this {
    this.range.setEndBefore(node.get(0));
    return this;
  }

  // Sets the end position of a range after a node.
  public setEndAfter(node: Nodes): this {
    this.range.setEndAfter(node.get(0));
    return this;
  }

  // Collapses the range to one of its boundary points.
  public collapse(toStart?: boolean): this {
    this.range.collapse(toStart);
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

  // Indicates whether a specified node is part of a range.
  public containsNode(node: Nodes): boolean {
    const startRange = document.createRange();
    startRange.selectNodeContents(node.get(0));
    startRange.collapse(true);
    const endRange = document.createRange();
    endRange.selectNodeContents(node.get(0));
    endRange.collapse(false);
    return this.range.isPointInRange(startRange.startContainer, startRange.startOffset) ||
      this.range.isPointInRange(endRange.startContainer, endRange.startOffset);
  }

  // Returns all child nodes which is part of a range.
  public allNodes(): Nodes[] {
    const nodeList: Nodes[] = [];
    this.commonAncestor.allChildNodes().forEach(node => {
      if (this.containsNode(node)) {
        nodeList.push(node);
      }
    });
    return nodeList;
  }

  // Inserts the specified nodes to the start of a range.
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
