import { NativeRange } from '../types/native';
import { debug } from '../utils/debug';
import { Nodes } from './nodes';

// The Range class represents a fragment of a document that can contain nodes and parts of text nodes.
export class Range {
  // native range
  private range: NativeRange;

  constructor(range?: NativeRange) {
    this.range = range ?? document.createRange();
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

  // Returns a boolean value indicating whether the range's start point is at the left strip of the box.
  // <lake-box><span class="box-strip">|</span><div class="box-body"></div> ...
  // <lake-box><span class="box-strip"></span>|<div class="box-body"></div> ...
  // <lake-box>|<span class="box-strip"></span><div class="box-body"></div> ...
  public get isBoxLeft(): boolean {
    const boxNode = this.startNode.closest('lake-box');
    if (boxNode.length === 0) {
      return false;
    }
    const boxBody = boxNode.find('.box-body');
    return this.compareBeforeNode(boxBody) >= 0;
  }

  // Returns a boolean value indicating whether the range's start point is at the right strip of the box.
  // ... <div class="box-body"></div><span class="box-strip">|</span></lake-box>
  // ... <div class="box-body"></div>|<span class="box-strip"></span></lake-box>
  // ... <div class="box-body"></div><span class="box-strip"></span>|</lake-box>
  public get isBoxRight(): boolean {
    const boxNode = this.startNode.closest('lake-box');
    if (boxNode.length === 0) {
      return false;
    }
    const boxBody = boxNode.find('.box-body');
    return this.compareAfterNode(boxBody) <= 0;
  }

  // Gets a native range.
  public get(): NativeRange {
    return this.range;
  }

  // Returns −1 if the point is before the range, 0 if the point is in the range, and 1 if the point is after the range.
  public comparePoint(node: Nodes, offset: number): number {
    return this.range.comparePoint(node.get(0), offset);
  }

  // Returns -1, 0, or 1 depending on whether the beginning of the specified node is before, the same as, or after the range.
  public compareBeforeNode(node: Nodes): number {
    const targetRange = new Range();
    if (node.isText) {
      targetRange.setStart(node, 0);
    } else {
      targetRange.setStartBefore(node);
    }
    targetRange.collapseToStart();
    return this.comparePoint(targetRange.startNode, targetRange.startOffset);
  }

  // Returns -1, 0, or 1 depending on whether the end of the specified node is before, the same as, or after the range.
  public compareAfterNode(node: Nodes): number {
    const targetRange = new Range();
    if (node.isText) {
      const nodeValue = node.get().nodeValue ?? '';
      targetRange.setStart(node, nodeValue.length);
    } else {
      targetRange.setStartAfter(node);
    }
    targetRange.collapseToStart();
    return this.comparePoint(targetRange.startNode, targetRange.startOffset);
  }

  // Indicates whether a specified node is part of the range or intersects the range.
  public intersectsNode(node: Nodes): boolean {
    return this.range.intersectsNode(node.get());
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

  // Reduces the boundary of the range.
  // <div>[<p><strong>foo</strong></p>]</div>
  // to
  // <div><p><strong>[foo]</strong></p></div>
  public reduce(): this {
    const isCollapsed = this.isCollapsed;
    let child;
    while (
      this.startNode.isElement &&
      (child = this.startNode.children()[this.startOffset]) &&
      child.isElement && !child.isVoid
    ) {
      this.setStart(child, 0);
    }
    if (isCollapsed) {
      return this.collapseToStart();
    }
    while (
      this.endNode.isElement &&
      this.endOffset > 0 &&
      (child = this.endNode.children()[this.endOffset - 1]) &&
      child.isElement && !child.isVoid
    ) {
      this.setEnd(child, child.children().length);
    }
    return this;
  }

  // Relocates the start and end points of the range.
  public adapt(): this {
    if (this.isCollapsed) {
      return this;
    }
    const startBoxNode = this.startNode.closest('lake-box');
    if (startBoxNode.length > 0) {
      const startRange = this.clone();
      startRange.collapseToStart();
      if (startRange.isBoxLeft) {
        this.setStartBefore(startBoxNode);
      }
      if (startRange.isBoxRight) {
        this.setStartAfter(startBoxNode);
      }
    }
    const endBoxNode = this.endNode.closest('lake-box');
    if (endBoxNode.length > 0) {
      const endRange = this.clone();
      endRange.collapseToEnd();
      if (endRange.isBoxLeft) {
        this.setEndBefore(endBoxNode);
      }
      if (endRange.isBoxRight) {
        this.setEndAfter(endBoxNode);
      }
    }
    return this;
  }

  // Collapses the range and sets the range to the end of the contents of the specified node.
  public selectAfterNodeContents(node: Nodes): this {
    if (!node.isBlock) {
      this.setEndAfter(node);
      this.collapseToEnd();
      return this;
    }
    this.setEnd(node, node.children().length);
    let child;
    while (
      this.endNode.isBlock &&
      this.endOffset > 0 &&
      (child = this.endNode.children()[this.endOffset - 1]) &&
      child.isBlock && !child.isVoid
    ) {
      this.setEnd(child, child.children().length);
    }
    return this.collapseToEnd();
  }

  // Returns a range object with boundary points identical to the cloned range.
  public clone(): Range {
    return new Range(this.range.cloneRange());
  }

  // Returns a document fragment copying the nodes included in the range.
  public cloneContents(): DocumentFragment {
    return this.range.cloneContents();
  }

  // Prints information of the range.
  public debug(): void {
    debug('--- range information ---');
    debug('start node:', this.startNode.toString(), ', offset:', this.startOffset);
    debug('end node:', this.endNode.toString(), ', offset:', this.endOffset);
  }
}
