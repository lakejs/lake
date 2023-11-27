import { NativeRange } from '../types/native';
import { debug } from '../utils/debug';
import { query } from '../utils/query';
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
  public setStart(node: Nodes, offset: number): void {
    this.range.setStart(node.get(0), offset);
  }

  // Sets the start position of the range before a node.
  public setStartBefore(node: Nodes): void {
    this.range.setStartBefore(node.get(0));
  }

  // Sets the start position of the range after a node.
  public setStartAfter(node: Nodes): void {
    this.range.setStartAfter(node.get(0));
  }

  // Sets the end position of the range.
  public setEnd(node: Nodes, offset: number): void {
    this.range.setEnd(node.get(0), offset);
  }

  // Sets the end position of the range before a node.
  public setEndBefore(node: Nodes): void {
    this.range.setEndBefore(node.get(0));
  }

  // Sets the end position of the range after a node.
  public setEndAfter(node: Nodes): void {
    this.range.setEndAfter(node.get(0));
  }

  // Collapses the range to the start of it.
  public collapseToStart(): void {
    this.range.collapse(true);
  }

  // Collapses the range to the end of it.
  public collapseToEnd(): void {
    this.range.collapse(false);
  }

  // Sets the range to contain the specified node and its contents.
  public selectNode(node: Nodes): void {
    this.range.selectNode(node.get(0));
  }

  // Sets the range to contain the contents of the specified node.
  public selectNodeContents(node: Nodes): void {
    this.range.selectNodeContents(node.get(0));
  }

  // Sets the range to the left position of the box.
  public selectBoxLeft(boxNode: Nodes): void {
    this.selectNodeContents(boxNode.find('.box-strip').eq(0));
    this.collapseToEnd();
  }

  // Sets the range to the left position of the box.
  public selectBoxRight(boxNode: Nodes): void {
    this.selectNodeContents(boxNode.find('.box-strip').eq(1));
    this.collapseToEnd();
  }

  // Collapses the range and sets the range to the beginning of the contents of the specified node.
  public shrinkBefore(node: Nodes): void {
    if (node.isBox) {
      this.selectBoxLeft(node);
      return;
    }
    if (node.isText) {
      this.setStartBefore(node);
      this.collapseToStart();
      return;
    }
    this.setStart(node, 0);
    let child;
    while (
      this.startNode.isElement &&
      (child = this.startNode.children()[0]) &&
      child.isElement && !child.isVoid
    ) {
      if (child.isBox) {
        this.selectBoxLeft(child);
      } else {
        this.setStart(child, 0);
      }
    }
    this.collapseToStart();
  }

  // Collapses the range and sets the range to the end of the contents of the specified node.
  public shrinkAfter(node: Nodes): void {
    if (node.isBox) {
      this.selectBoxRight(node);
      return;
    }
    if (node.isText) {
      this.setEndAfter(node);
      this.collapseToEnd();
      return;
    }
    this.setEnd(node, node.children().length);
    let child;
    while (
      this.endNode.isElement &&
      this.endOffset > 0 &&
      (child = this.endNode.children()[this.endOffset - 1]) &&
      child.isElement && !child.isVoid
    ) {
      if (child.isBox) {
        this.selectBoxLeft(child);
      } else {
        this.setEnd(child, child.children().length);
      }
    }
    this.collapseToEnd();
  }

  // Reduces the boundary of the range.
  // <div>[<p><strong>foo</strong></p>]</div>
  // to
  // <div><p><strong>[foo]</strong></p></div>
  public reduce(): void {
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
      this.collapseToStart();
      return;
    }
    while (
      this.endNode.isElement &&
      this.endOffset > 0 &&
      (child = this.endNode.children()[this.endOffset - 1]) &&
      child.isElement && !child.isVoid
    ) {
      this.setEnd(child, child.children().length);
    }
  }

  // Relocates the start and end points of the range.
  public adapt(): void {
    if (!this.isCollapsed) {
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
    }
    // <p>foo</p>|<p>bar</p>
    // to
    // <p>foo</p><p>|bar</p>
    if (this.isCollapsed && this.startNode.isElement) {
      const nextBlock = this.startNode.children()[this.startOffset];
      if (nextBlock) {
        if (nextBlock.isBox) {
          this.selectBoxLeft(nextBlock);
        } else if (nextBlock.isBlock) {
          this.shrinkBefore(nextBlock);
        }
      }
    }
  }

  // Returns target blocks relating to the range.
  public getBlocks(): Nodes[] {
    if (this.isCollapsed) {
      const startBlock = this.startNode.closestOperableBlock();
      return startBlock.isInside ? [ startBlock ] : [];
    }
    const startBlock = this.startNode.closestOperableBlock();
    const endBlock = this.endNode.closestOperableBlock();
    if (
      startBlock.isInside &&
      startBlock.get(0) &&
      startBlock.get(0) === endBlock.get(0)
    ) {
      return [ startBlock ];
    }
    const blocks: Nodes[] = [];
    const clonedRange = this.clone();
    clonedRange.collapseToEnd();
    for (const child of this.commonAncestor.getWalker()) {
      if (child.isBlock && child.isTopInside &&
        // the range doesn't end at the start of a block
        clonedRange.comparePoint(child, 0) !== 0 &&
        this.intersectsNode(child)
      ) {
        blocks.push(child);
      }
    }
    if (blocks.length > 0) {
      return blocks;
    }
    for (const child of this.commonAncestor.getWalker()) {
      if (child.isBlock &&
        (startBlock.isSibling(child) || endBlock.isSibling(child)) &&
        this.intersectsNode(child)) {
        blocks.push(child);
      }
    }
    return blocks;
  }

  // Returns target marks and text nodes relating to the range.
  public getMarks(hasText = false): Nodes[] {
    const stratRange = this.clone();
    stratRange.collapseToStart();
    const endRange = this.clone();
    endRange.collapseToEnd();
    const marks: Nodes[] = [];
    for (const node of this.commonAncestor.getWalker()) {
      const targetRange = document.createRange();
      targetRange.setStartAfter(node.get());
      targetRange.collapse(true);
      if (endRange.compareBeforeNode(node) >= 0) {
        break;
      }
      if (stratRange.compareAfterNode(node) > 0) {
        if ((node.isMark || node.isText) && !node.isEmpty) {
          if (node.isMark || hasText) {
            marks.push(node);
          }
        }
      }
    }
    return marks;
  }

  // Returns the text of the left part of the closest block divided into two parts by the start point of the range.
  // "<p>one<anchor />two<focus />three</p>" returns "three".
  public getLeftText(): string {
    const node = this.startNode;
    const offset = this.startOffset;
    let block = node.closestBlock();
    if (block.isOutside) {
      block = node.closestContainer();
    }
    if (block.length === 0) {
      return '';
    }
    const leftRange = new Range();
    leftRange.setStartBefore(block);
    leftRange.setEnd(node, offset);
    const container = query('<div />');
    container.append(leftRange.cloneContents());
    const text = container.text();
    return text;
  }

  // Returns the text of the right part of the closest block divided into two parts by the end point of the range.
  // "<p>one<anchor />two<focus />three</p>" returns "three".
  public getRightText(): string {
    const node = this.endNode;
    const offset = this.endOffset;
    let block = node.closestBlock();
    if (block.isOutside) {
      block = node.closestContainer();
    }
    if (block.length === 0) {
      return '';
    }
    const rightRange = new Range();
    rightRange.setStart(node, offset);
    rightRange.setEndAfter(block);
    const container = query('<div />');
    container.append(rightRange.cloneContents());
    const text = container.text();
    return text;
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
