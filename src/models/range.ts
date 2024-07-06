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

  // Returns a boolean value indicating whether the range's start point is in the box.
  public get isBox(): boolean {
    const boxNode = this.commonAncestor.closest('lake-box');
    return boxNode.length > 0;
  }

  // Returns a boolean value indicating whether the range's common ancestor node is in the start strip of the box.
  // case 1: <lake-box><span class="lake-box-strip">|</span><div class="lake-box-container"></div> ...
  // case 2: <lake-box><span class="lake-box-strip"></span>|<div class="lake-box-container"></div> ...
  // case 3: <lake-box>|<span class="lake-box-strip"></span><div class="lake-box-container"></div> ...
  public get isBoxStart(): boolean {
    const boxNode = this.commonAncestor.closest('lake-box');
    if (boxNode.length === 0) {
      return false;
    }
    const boxContainer = boxNode.find('.lake-box-container');
    return this.compareBeforeNode(boxContainer) >= 0;
  }

  // Returns a boolean value indicating whether the range's common ancestor node is in the center of the box.
  // case 1: ... <div class="lake-box-container"><div>|</div></div> ...
  // case 2: ... <div class="lake-box-container"><div></div>|</div> ...
  public get isBoxCenter(): boolean {
    const boxNode = this.commonAncestor.closest('lake-box');
    if (boxNode.length === 0) {
      return false;
    }
    const boxContainer = boxNode.find('.lake-box-container');
    // Returns true when the box was selected.
    // case: ... <div class="lake-box-container">|<div></div></div> ...
    return this.isCollapsed && this.startNode.get(0) === boxContainer.get(0) && this.startOffset === 0;
  }

  // Returns a boolean value indicating whether the range's common ancestor node is in the end strip of the box.
  // case 1: ... <div class="lake-box-container"></div><span class="lake-box-strip">|</span></lake-box>
  // case 2: ... <div class="lake-box-container"></div>|<span class="lake-box-strip"></span></lake-box>
  // case 3: ... <div class="lake-box-container"></div><span class="lake-box-strip"></span>|</lake-box>
  public get isBoxEnd(): boolean {
    const boxNode = this.commonAncestor.closest('lake-box');
    if (boxNode.length === 0) {
      return false;
    }
    const boxContainer = boxNode.find('.lake-box-container');
    return this.compareAfterNode(boxContainer) <= 0;
  }

  // Returns a boolean value indicating whether the range's common ancestor node is inside the container of the box.
  // case 1: ... <div class="lake-box-container"><div>|</div></div> ...
  // case 2: ... <div class="lake-box-container"><div></div>|</div> ...
  public get isInsideBox(): boolean {
    const boxNode = this.commonAncestor.closest('lake-box');
    if (boxNode.length === 0) {
      return false;
    }
    const boxContainer = boxNode.find('.lake-box-container');
    // Returns false when the box was selected.
    // case: ... <div class="lake-box-container">|<div></div></div> ...
    if (
      this.isCollapsed &&
      this.startNode.get(0) === boxContainer.get(0) &&
      this.startOffset === 0
    ) {
      return false;
    }
    return this.compareBeforeNode(boxContainer) < 0 && this.compareAfterNode(boxContainer) > 0;
  }

  // Returns a boolean value indicating whether the range is inoperative.
  public get isInoperative(): boolean {
    if (this.commonAncestor.isOutside) {
      return true;
    }
    const startBlock = this.startNode.closest('td');
    const endBlock = this.endNode.closest('td');
    if (
      startBlock.length > 0 &&
      endBlock.length > 0 &&
      startBlock.get(0) !== endBlock.get(0)
    ) {
      return true;
    }
    return false;
  }

  // Gets a native range.
  public get(): NativeRange {
    return this.range;
  }

  // Returns the size and position of the range.
  public getRect(): DOMRect {
    const range = this.clone();
    let rect;
    let x;
    let width;
    if (range.isCollapsed) {
      let reference = 'left';
      if (range.startNode.isElement) {
        const children = range.startNode.children();
        if (children.length === 0) {
          range.selectNode(range.startNode);
        } else if (range.startOffset < children.length) {
          range.setEnd(range.startNode, range.startOffset + 1);
        } else {
          range.setStart(range.startNode, range.startOffset - 1);
          reference = 'right';
        }
      } else if (range.startNode.isText) {
        const text = range.startNode.text();
        if (range.startOffset < text.length) {
          range.setEnd(range.startNode, range.startOffset + 1);
        } else if (range.startOffset > 0) {
          range.setStart(range.startNode, range.startOffset - 1);
          reference = 'right';
        }
      }
      rect = range.get().getBoundingClientRect();
      if (reference === 'left') {
        x = rect.x;
      } else {
        x = rect.right;
      }
      width = 1;
    } else {
      rect = range.get().getBoundingClientRect();
      x = rect.x;
      width = rect.width;
    }
    const height = rect.height;
    return DOMRect.fromRect({
      x,
      y: height > 0 ? rect.y : 0,
      width: width > 0 ? width : 1,
      height: height > 0 ? height : 1,
    });
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
      const nodeValue = node.get(0).nodeValue ?? '';
      targetRange.setStart(node, nodeValue.length);
    } else {
      targetRange.setStartAfter(node);
    }
    targetRange.collapseToStart();
    return this.comparePoint(targetRange.startNode, targetRange.startOffset);
  }

  // Indicates whether a specified node is part of the range or intersects the range.
  public intersectsNode(node: Nodes): boolean {
    return this.range.intersectsNode(node.get(0));
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

  // Sets the range to the center position of the box.
  public selectBox(boxNode: Nodes): void {
    const boxContainer = boxNode.find('.lake-box-container');
    if (boxContainer.length === 0) {
      throw new Error(`The box cannot be selected because the box "${boxNode.attr('name')}" (id=${boxNode.id}) has not been rendered yet.`);
    }
    this.setStart(boxContainer, 0);
    this.collapseToStart();
  }

  // Sets the range to the start position of the box.
  public selectBoxStart(boxNode: Nodes): void {
    const boxStrip = boxNode.find('.lake-box-strip');
    if (boxStrip.length === 0) {
      throw new Error(`The box cannot be selected because the box "${boxNode.attr('name')}" (id=${boxNode.id}) has not been rendered yet.`);
    }
    this.selectNodeContents(boxStrip.eq(0));
    this.collapseToStart();
  }

  // Sets the range to the start position of the box.
  public selectBoxEnd(boxNode: Nodes): void {
    const boxStrip = boxNode.find('.lake-box-strip');
    if (boxStrip.length === 0) {
      throw new Error(`The box cannot be selected because the box "${boxNode.attr('name')}" (id=${boxNode.id}) has not been rendered yet.`);
    }
    this.selectNodeContents(boxStrip.eq(1));
    this.collapseToStart();
  }

  // Collapses the range and sets the range to the beginning of the contents of the specified node.
  public shrinkBefore(node: Nodes): void {
    if (node.isBox) {
      this.selectBoxStart(node);
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
        this.selectBoxStart(child);
        return;
      }
      this.setStart(child, 0);
    }
    this.collapseToStart();
  }

  // Collapses the range and sets the range to the end of the contents of the specified node.
  public shrinkAfter(node: Nodes): void {
    if (node.isBox) {
      this.selectBoxEnd(node);
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
        this.selectBoxEnd(child);
        return;
      }
      this.setEnd(child, child.children().length);
    }
    this.collapseToEnd();
  }

  // Reduces the boundary of the range.
  // <div>[<p><strong>foo</strong></p>]</div>
  // to
  // <div><p><strong>[foo]</strong></p></div>
  public shrink(): void {
    const isCollapsed = this.isCollapsed;
    let child;
    while (
      this.startNode.isElement &&
      (child = this.startNode.children()[this.startOffset]) &&
      child.isElement && !child.isVoid && !child.isBox
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
      child.isElement && !child.isVoid && !child.isBox
    ) {
      this.setEnd(child, child.children().length);
    }
  }

  // Relocates the start and end points of the range for the box.
  public adjustBox(): void {
    const startBoxNode = this.startNode.closest('lake-box');
    if (startBoxNode.length > 0) {
      const startRange = this.clone();
      startRange.collapseToStart();
      if (startRange.isBoxEnd) {
        this.setStartAfter(startBoxNode);
      } else {
        this.setStartBefore(startBoxNode);
      }
    }
    const endBoxNode = this.endNode.closest('lake-box');
    if (endBoxNode.length > 0) {
      const endRange = this.clone();
      endRange.collapseToEnd();
      if (endRange.isBoxStart) {
        this.setEndBefore(endBoxNode);
      } else {
        this.setEndAfter(endBoxNode);
      }
    }
  }

  // Relocates the beginning or end position of the range for table.
  public adjustTable(): void {
    const startTable = this.startNode.closest('table');
    const endTable = this.endNode.closest('table');
    if (startTable.length === 0 && endTable.length > 0 && endTable.isInside) {
      this.setEndBefore(endTable);
      this.shrink();
      return;
    }
    if (endTable.length === 0 && startTable.length > 0 && startTable.isInside) {
      this.setStartAfter(startTable);
      this.shrink();
    }
  }

  // Relocates the start point of the range for the block.
  // case 1:
  // <p>foo</p>|<p>bar</p>
  // to
  // <p>foo</p><p>|bar</p>
  // case 2:
  // [<p>foo</p>]<p>bar</p>
  // to
  // <p>[foo]</p><p>bar</p>
  // case 3:
  // [<p>foo</p><p>]bar</p>
  // to
  // <p>[foo]</p><p>bar</p>
  public adjustBlock(): void {
    if (!this.isCollapsed) {
      // [<p>foo</p><p>]bar</p> to [<p>foo</p>]<p>bar</p>
      if (this.endNode.isElement && this.endOffset === 0) {
        let node = this.endNode;
        while (node.prev().length === 0) {
          node = node.parent();
        }
        this.setEndBefore(node);
      }
      this.shrink();
      return;
    }
    if (this.startNode.isText) {
      return;
    }
    const nextBlock = this.startNode.children()[this.startOffset];
    if (nextBlock && (nextBlock.isBlockBox || nextBlock.isBlock)) {
      this.shrinkBefore(nextBlock);
    }
  }

  // Relocates the start and end points of the range.
  public adjust(): void {
    this.adjustBox();
    this.adjustTable();
    this.adjustBlock();
  }

  // Returns the previous node of the beginning point of the range.
  public getPrevNode(): Nodes {
    let prevNode;
    if (this.startNode.isText) {
      if (this.startOffset === 0) {
        prevNode = this.startNode.prev();
      } else {
        prevNode = this.startNode;
      }
    } else {
      prevNode = this.startNode.children()[this.startOffset - 1];
    }
    return prevNode ?? new Nodes();
  }

  // Returns the next node of the beginning point of the range.
  public getNextNode(): Nodes {
    let nextNode;
    if (this.endNode.isText) {
      if (this.endOffset === this.endNode.text().length) {
        nextNode = this.endNode.next();
      } else {
        nextNode = this.endNode;
      }
    } else {
      nextNode = this.endNode.children()[this.endOffset];
    }
    return nextNode ?? new Nodes();
  }

  // Returns target boxes relating to the range.
  public getBoxes(): Nodes[] {
    if (this.isCollapsed) {
      const startBox = this.startNode.closest('lake-box');
      return startBox.length > 0 ? [ startBox ] : [];
    }
    const nodeList: Nodes[] = [];
    const clonedRange = this.clone();
    clonedRange.adjustBox();
    for (const child of clonedRange.commonAncestor.getWalker()) {
      if (child.isBox && clonedRange.intersectsNode(child)) {
        nodeList.push(child);
      }
    }
    return nodeList;
  }

  // Returns target blocks relating to the range.
  public getBlocks(): Nodes[] {
    if (this.isCollapsed) {
      const startBlock = this.startNode.closestOperableBlock();
      if (startBlock.isTable) {
        return [];
      }
      return startBlock.isInside ? [ startBlock ] : [];
    }
    const startBlock = this.startNode.closestOperableBlock();
    const endBlock = this.endNode.closestOperableBlock();
    if (
      startBlock.isInside &&
      startBlock.get(0) &&
      startBlock.get(0) === endBlock.get(0)
    ) {
      return startBlock.isTable ? [] : [ startBlock ];
    }
    const blocks: Nodes[] = [];
    const clonedRange = this.clone();
    clonedRange.collapseToEnd();
    for (const child of this.commonAncestor.getWalker()) {
      if (child.isBlock && !child.isTable && child.isTopInside &&
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
      if (child.isBlock && !child.isTable &&
        (startBlock.isSibling(child) || endBlock.isSibling(child)) &&
        this.intersectsNode(child)) {
        blocks.push(child);
      }
    }
    return blocks;
  }

  // Returns target marks and text nodes relating to the range.
  public getMarks(hasText = false): Nodes[] {
    const marks: Nodes[] = [];
    if (this.commonAncestor.isText && hasText) {
      if (
        this.startOffset === 0 &&
        this.endOffset === this.commonAncestor.text().length
      ) {
        marks.push(this.commonAncestor);
        return marks;
      }
    }
    const stratRange = this.clone();
    stratRange.collapseToStart();
    const endRange = this.clone();
    endRange.collapseToEnd();
    for (const node of this.commonAncestor.getWalker()) {
      const targetRange = document.createRange();
      targetRange.setStartAfter(node.get(0));
      targetRange.collapse(true);
      if (endRange.compareBeforeNode(node) >= 0) {
        break;
      }
      if (stratRange.compareAfterNode(node) > 0) {
        if (node.isMark) {
          marks.push(node);
        } else if (node.isText && hasText) {
          marks.push(node);
        }
      }
    }
    return marks;
  }

  // Returns the text of the start part of the closest block divided into two parts by the start point of the range.
  // "<p>one<anchor />two<focus />three</p>" returns "three".
  public getStartText(): string {
    const node = this.startNode;
    const offset = this.startOffset;
    let block = node.closestBlock();
    if (block.isOutside) {
      block = node.closestContainer();
    }
    if (block.length === 0) {
      return '';
    }
    const startRange = new Range();
    startRange.setStartBefore(block);
    startRange.setEnd(node, offset);
    const container = query('<div />');
    container.append(startRange.cloneContents());
    const text = container.text();
    if (text === '' && container.find('lake-box').length > 0) {
      return '\u200B';
    }
    return text;
  }

  // Returns the text of the end part of the closest block divided into two parts by the end point of the range.
  // "<p>one<anchor />two<focus />three</p>" returns "three".
  public getEndText(): string {
    const node = this.endNode;
    const offset = this.endOffset;
    let block = node.closestBlock();
    if (block.isOutside) {
      block = node.closestContainer();
    }
    if (block.length === 0) {
      return '';
    }
    const endRange = new Range();
    endRange.setStart(node, offset);
    endRange.setEndAfter(block);
    const container = query('<div />');
    container.append(endRange.cloneContents());
    const text = container.text();
    if (text === '' && container.find('lake-box').length > 0) {
      return '\u200B';
    }
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
  public info(): void {
    debug('--- range information ---');
    debug('start node:', this.startNode.toString(), ', offset:', this.startOffset);
    debug('end node:', this.endNode.toString(), ', offset:', this.endOffset);
  }
}
