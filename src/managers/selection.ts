import { NativeSelection, NativeElement } from '../types/native';
import { KeyValue } from '../types/object';
import { parseStyle } from '../utils/parse-style';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';
import { insertBookmark } from '../operations/insert-bookmark';
import { toBookmark } from '../operations/to-bookmark';
import { insertNode } from '../operations/insert-node';
import { insertFragment } from '../operations/insert-fragment';
import { insertContents } from '../operations/insert-contents';
import { deleteContents } from '../operations/delete-contents';
import { setBlocks } from '../operations/set-blocks';
import { splitBlock } from '../operations/split-block';
import { splitMarks } from '../operations/split-marks';
import { addMark } from '../operations/add-mark';
import { removeMark } from '../operations/remove-mark';
import { fixList } from '../operations/fix-list';
import { insertBox } from '../operations/insert-box';
import { removeBox } from '../operations/remove-box';

type AppliedTagMapType = {
  node: Nodes,
  name: string,
  attributes: KeyValue,
  styles: KeyValue,
};

// Returns the attributes of the element as an key-value object.
function getAttributes(node: Nodes): KeyValue {
  const nativeNode = node.get(0) as NativeElement;
  const attributes: KeyValue = {};
  if (nativeNode.hasAttributes()) {
    for (const attr of nativeNode.attributes) {
      attributes[attr.name] = attr.value;
    }
  }
  return attributes;
}

function pushAncestralNodes(appliedNodes: AppliedTagMapType[], range: Range): void {
  let parentNode = range.startNode;
  if (parentNode.isText) {
    parentNode = parentNode.parent();
  }
  while (parentNode.length > 0) {
    if (!parentNode.isInside) {
      break;
    }
    appliedNodes.push({
      node: parentNode,
      name: parentNode.name,
      attributes: getAttributes(parentNode),
      styles: parseStyle(parentNode.attr('style')),
    });
    parentNode = parentNode.parent();
  }
}

function pushNextNestedNodes(appliedNodes: AppliedTagMapType[], range: Range): void {
  const startNode = range.startNode;
  let nextNode;
  if (startNode.isText && startNode.text().length === range.startOffset) {
    const node = startNode.next();
    if (node.length > 0 && node.isElement) {
      nextNode = node;
    }
  }
  if (startNode.isElement) {
    const children = startNode.children();
    if (children.length > 0) {
      const node = children[range.startOffset];
      if (node && node.isElement) {
        nextNode = node;
      }
    }
  }
  if (nextNode) {
    let child = nextNode;
    while (child.length > 0) {
      if (child.isElement) {
        appliedNodes.push({
          node: child,
          name: child.name,
          attributes: getAttributes(child),
          styles: parseStyle(child.attr('style')),
        });
      }
      child = child.first();
    }
  }
}

export class Selection {
  // Represents the range of text selected by the user or the current position of the caret.
  private selection: NativeSelection;

  // Is the root element which has contenteditable="true" attribute.
  public container: Nodes;

  // Is a saved range which is used to add it to the native selection later.
  public range: Range;

  // Is a saved node list which is used to update state of the toolbar.
  public appliedNodes: AppliedTagMapType[];

  constructor(container: Nodes) {
    const selection = window.getSelection();
    // When called on an <iframe> that is not displayed (e.g., where 'display: none' is set) Firefox will return null,
    // whereas other browsers will return a selection object with Selection.type set to None.
    if (!selection) {
      throw new Error('Selection object is null.');
    }
    this.selection = selection;
    this.container = container;
    this.range = this.getRangeFromNativeSelection();
    this.appliedNodes = [];
  }

  // Returns the current selected range from the native selection.
  private getRangeFromNativeSelection(): Range {
    if (this.selection.rangeCount > 0) {
      const range = this.selection.getRangeAt(0);
      return new Range(range);
    }
    return new Range();
  }

  // Adds the saved range to the native selection.
  public addRangeToNativeSelection(): void {
    this.selection.removeAllRanges();
    this.selection.addRange(this.range.get());
  }

  // Synchronizes the saved range with the range of the native selection.
  public syncByRange(): void {
    const newRange = this.getRangeFromNativeSelection();
    if (this.range.get() === newRange.get()) {
      return;
    }
    this.range = newRange;
  }

  // Synchronizes the saved range with the range represented by the bookmark.
  public synByBookmark(): void {
    const range = this.range;
    const container = this.container;
    const boxFocus = container.find('lake-box[focus]');
    if (boxFocus.length > 0) {
      toBookmark(range, {
        anchor: new Nodes(),
        focus: boxFocus,
      });
      this.addRangeToNativeSelection();
      return;
    }
    const anchor = container.find('lake-bookmark[type="anchor"]');
    const focus = container.find('lake-bookmark[type="focus"]');
    toBookmark(range, {
      anchor,
      focus,
    });
    this.addRangeToNativeSelection();
  }

  public getAppliedNodes(): AppliedTagMapType[] {
    const appliedNodes: AppliedTagMapType[] = [];
    pushAncestralNodes(appliedNodes, this.range);
    pushNextNestedNodes(appliedNodes, this.range);
    return appliedNodes;
  }

  public insertBookmark(): ReturnType<typeof insertBookmark> {
    return insertBookmark(this.range);
  }

  public toBookmark(bookmark: Parameters<typeof toBookmark>[1]): ReturnType<typeof toBookmark> {
    return toBookmark(this.range, bookmark);
  }

  public insertNode(node: Parameters<typeof insertNode>[1]): ReturnType<typeof insertNode> {
    return insertNode(this.range, node);
  }

  public insertFragment(fragment: Parameters<typeof insertFragment>[1]): ReturnType<typeof insertFragment> {
    return insertFragment(this.range, fragment);
  }

  public insertContents(value: Parameters<typeof insertContents>[1]): ReturnType<typeof insertContents> {
    return insertContents(this.range, value);
  }

  public deleteContents(): ReturnType<typeof deleteContents> {
    return deleteContents(this.range);
  }

  public setBlocks(value: Parameters<typeof setBlocks>[1]): ReturnType<typeof setBlocks> {
    return setBlocks(this.range, value);
  }

  public splitBlock(): ReturnType<typeof splitBlock> {
    return splitBlock(this.range);
  }

  public splitMarks(removeEmptyMark?: Parameters<typeof splitMarks>[1]): ReturnType<typeof splitMarks> {
    return splitMarks(this.range, removeEmptyMark);
  }

  public addMark(value: Parameters<typeof addMark>[1]): ReturnType<typeof addMark> {
    return addMark(this.range, value);
  }

  public removeMark(value?: Parameters<typeof removeMark>[1]): ReturnType<typeof removeMark> {
    return removeMark(this.range, value);
  }

  public fixList(): ReturnType<typeof fixList> {
    return fixList(this.range);
  }

  public insertBox(boxName: Parameters<typeof insertBox>[1], boxValue?: Parameters<typeof insertBox>[2]): ReturnType<typeof insertBox> {
    return insertBox(this.range, boxName, boxValue);
  }

  public removeBox(): ReturnType<typeof removeBox> {
    return removeBox(this.range);
  }
}
