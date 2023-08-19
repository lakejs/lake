import { NativeRange } from '../types/native';
import { debug } from '../utils/debug';
import { Nodes } from './nodes';

// The Range class represents a fragment of a document that can contain nodes and parts of text nodes.
export class Range {
  // native Range object
  private range: NativeRange;

  // Returns a customized Range object with native Range object.
  constructor() {
    this.range = document.createRange();
  }

  // Returns the Nodes within which the Range starts.
  public get startNode(): Nodes {
    return new Nodes(this.range.startContainer);
  }

  // Returns a number representing where in the startNode the Range starts.
  public get startOffset(): number {
    return this.range.startOffset;
  }

  // Returns the Nodes within which the Range ends.
  public get endNode(): Nodes {
    return new Nodes(this.range.endContainer);
  }

  // Returns a number representing where in the endNode the Range ends.
  public get endOffset(): number {
    return this.range.endOffset;
  }

  // Returns the closest Nodes that contains both the startNode and endNode.
  public get commonAncestor(): Nodes {
    return new Nodes(this.range.commonAncestorContainer);
  }

  // Returns a boolean value indicating whether the range's start and end points are at the same position.
  public get collapsed(): boolean {
    return this.range.collapsed;
  }

  // Sets the start position of a Range.
  public setStart(nodes: Nodes, offset: number): this {
    this.range.setStart(nodes.get(0), offset);
    return this;
  }

  // Sets the end position of a Range.
  public setEnd(nodes: Nodes, offset: number): this {
    this.range.setEnd(nodes.get(0), offset);
    return this;
  }

  // Collapses the Range to one of its boundary points.
  public collapse(toStart?: boolean): this {
    this.range.collapse(toStart);
    return this;
  }

  // Sets the Range to contain the Nodes and its contents.
  public selectNode(nodes: Nodes): this {
    this.range.selectNode(nodes.get(0));
    return this;
  }

  // Sets the Range to contain the contents of a Nodes.
  public selectNodeContents(nodes: Nodes): this {
    this.range.selectNodeContents(nodes.get(0));
    return this;
  }

  public isNodeInRange(node: Nodes) {
    const startRange = document.createRange();
    startRange.selectNodeContents(node.get(0));
    startRange.collapse(true);
    const endRange = document.createRange();
    endRange.selectNodeContents(node.get(0));
    endRange.collapse(false);
    return this.range.isPointInRange(startRange.startContainer, startRange.startOffset) ||
      this.range.isPointInRange(endRange.startContainer, endRange.startOffset);
  }

  // Returns all child nodes of a Range.
  public allNodes(): Nodes[] {
    const nodeList: Nodes[] = [];
    this.commonAncestor.allChildNodes().forEach(node => {
      if (this.isNodeInRange(node)) {
        nodeList.push(node);
      }
    });
    return nodeList;
  }

  // Insert a Nodes at the start of a Range.
  public insertNode(nodes: Nodes): this {
    nodes.each(node => {
      this.range.insertNode(node);
      this.range.selectNode(node);
      this.range.collapse(false);
    });
    return this;
  }

  public debug(): void {
    debug('--- range information ---');
    debug(`start node (${this.startNode.id}):`, this.startNode.get(0), ', offset:', this.startOffset);
    debug(`end node (${this.endNode.id}):`, this.endNode.get(0), ', offset:', this.endOffset);
  }
}
