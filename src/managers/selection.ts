import { NativeSelection } from '../types/native';
import { KeyValue, ActiveItem } from '../types/object';
import { parseStyle } from '../utils/parse-style';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';
import { Box } from '../models/box';
import { insertBookmark } from '../operations/insert-bookmark';
import { toBookmark } from '../operations/to-bookmark';
import { insertNode } from '../operations/insert-node';
import { insertFragment } from '../operations/insert-fragment';
import { deleteContents } from '../operations/delete-contents';
import { setBlocks } from '../operations/set-blocks';
import { splitBlock } from '../operations/split-block';
import { splitMarks } from '../operations/split-marks';
import { addMark } from '../operations/add-mark';
import { removeMark } from '../operations/remove-mark';
import { fixList } from '../operations/fix-list';
import { insertLink } from '../operations/insert-link';
import { insertBox } from '../operations/insert-box';
import { removeBox } from '../operations/remove-box';

// Returns a key-value object of all attributes of the specified element.
function getAttributes(element: Nodes): KeyValue {
  const nativeElement = element.get(0) as Element;
  const attributes: KeyValue = {};
  if (nativeElement.hasAttributes()) {
    for (const attr of nativeElement.attributes) {
      attributes[attr.name] = attr.value;
    }
  }
  return attributes;
}

function appendAncestralNodes(activeItems: ActiveItem[], range: Range): void {
  let parentNode = range.startNode;
  if (parentNode.isText) {
    parentNode = parentNode.parent();
  }
  while (parentNode.length > 0) {
    if (!parentNode.isContentEditable || parentNode.isContainer) {
      break;
    }
    activeItems.push({
      node: parentNode,
      name: parentNode.name,
      attributes: getAttributes(parentNode),
      styles: parseStyle(parentNode.attr('style')),
    });
    parentNode = parentNode.parent();
  }
}

function appendNextNestedNodes(activeItems: ActiveItem[], range: Range): void {
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
        activeItems.push({
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

  constructor(container: Nodes) {
    const selection = window.getSelection();
    // When called on an <iframe> that is not displayed (e.g., where 'display: none' is set) Firefox will return null,
    // whereas other browsers will return a selection object with Selection.type set to None.
    if (!selection) {
      throw new Error('Selection object is null.');
    }
    this.selection = selection;
    this.container = container;
    this.range = this.getCurrentRange();
  }

  // Returns a range object currently selected.
  public getCurrentRange(): Range {
    if (this.selection.rangeCount > 0) {
      const range = this.selection.getRangeAt(0);
      return new Range(range);
    }
    return new Range();
  }

  // Adds the saved range to the native selection.
  public sync(): void {
    if (!this.container.contains(this.range.commonAncestor)) {
      return;
    }
    this.selection.removeAllRanges();
    this.selection.addRange(this.range.get());
  }

  // Updates the saved range with the range of the native selection.
  public updateByRange(): void {
    const newRange = this.getCurrentRange();
    if (!this.container.contains(newRange.commonAncestor)) {
      return;
    }
    if (
      this.range.startNode.get(0) === newRange.startNode.get(0) &&
      this.range.startOffset === newRange.startOffset &&
      this.range.endNode.get(0) === newRange.endNode.get(0) &&
      this.range.endOffset === newRange.endOffset
    ) {
      return;
    }
    this.range = newRange;
  }

  // Updates the saved range with the range represented by the bookmark.
  public updateByBookmark(): void {
    const range = this.range;
    const container = this.container;
    const boxFocus = container.find('lake-box[focus]');
    if (boxFocus.length > 0) {
      toBookmark(range, {
        anchor: new Nodes(),
        focus: boxFocus,
      });
      this.sync();
      return;
    }
    const anchor = container.find('lake-bookmark[type="anchor"]');
    const focus = container.find('lake-bookmark[type="focus"]');
    toBookmark(range, {
      anchor,
      focus,
    });
    this.sync();
  }

  public getActiveItems(): ActiveItem[] {
    const activeItems: ActiveItem[] = [];
    appendAncestralNodes(activeItems, this.range);
    appendNextNestedNodes(activeItems, this.range);
    return activeItems;
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

  public insertLink(value: Parameters<typeof insertLink>[1]): ReturnType<typeof insertLink> {
    return insertLink(this.range, value);
  }

  // Sets the current range to the center position of the box.
  public selectBox(box: Box | Nodes): void {
    let boxNode = box;
    if (box instanceof Box) {
      boxNode = box.node;
    } else {
      boxNode = box;
    }
    this.range.selectBox(boxNode);
    this.sync();
  }

  // Inserts a box into the position of the selection.
  public insertBox(boxName: Parameters<typeof insertBox>[1], boxValue?: Parameters<typeof insertBox>[2]): Box {
    const box = insertBox(this.range, boxName, boxValue);
    if (!box) {
      throw new Error(`Box "${boxName}" cannot be inserted outside the editor.`);
    }
    return box;
  }

  // Removes the selected box.
  public removeBox(box: Box | Nodes | null = null): ReturnType<typeof removeBox> {
    if (box) {
      this.selectBox(box);
    }
    return removeBox(this.range);
  }
}
