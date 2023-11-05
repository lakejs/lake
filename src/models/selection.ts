import { NativeSelection } from '../types/native';
import { Nodes } from './nodes';
import { Range } from './range';
import { insertBookmark } from '../operations/insert-bookmark';
import { toBookmark } from '../operations/to-bookmark';
import { getTags } from '../operations/get-tags';
import { insertNode } from '../operations/insert-node';
import { insertFragment } from '../operations/insert-fragment';
import { insertContents } from '../operations/insert-contents';
import { deleteContents } from '../operations/delete-contents';
import { getBlocks } from '../operations/get-blocks';
import { getLeftText } from '../operations/get-left-text';
import { getRightText } from '../operations/get-right-text';
import { setBlocks } from '../operations/set-blocks';
import { splitBlock } from '../operations/split-block';
import { getMarks } from '../operations/get-marks';
import { splitMarks } from '../operations/split-marks';
import { addMark } from '../operations/add-mark';
import { removeMark } from '../operations/remove-mark';
import { fixList } from '../operations/fix-list';

export class Selection {
  // Represents the range of text selected by the user or the current position of the caret.
  private selection: NativeSelection;

  // Is the root element which has contenteditable="true" attribute.
  public container: Nodes;

  // Is a saved range which is used to add it to the selection later.
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
    this.range = this.getRange();
  }

  // Returns the current selected range from the selection.
  private getRange(): Range {
    if (this.selection.rangeCount > 0) {
      const range = this.selection.getRangeAt(0);
      return new Range(range);
    }
    return new Range();
  }

  // Sets the saved range to the selection.
  public setRange(): void {
    const range = this.range;
    if (range.get() === this.getRange().get()) {
      return;
    }
    this.selection.removeAllRanges();
    this.selection.addRange(range.get());
  }

  // Synchronizes the saved range with the range of the selection.
  public syncByRange(): void {
    this.range = this.getRange();
  }

  // Synchronizes the saved range with the range represented by the bookmark.
  public synByBookmark(): void {
    const range = this.range;
    const container = this.container;
    const anchor = container.find('bookmark[type="anchor"]');
    const focus = container.find('bookmark[type="focus"]');
    toBookmark(range, {
      anchor,
      focus,
    });
  }

  public insertBookmark(): ReturnType<typeof insertBookmark> {
    return insertBookmark(this.range);
  }

  public toBookmark(bookmark: Parameters<typeof toBookmark>[1]): ReturnType<typeof toBookmark> {
    return toBookmark(this.range, bookmark);
  }

  public getTags(): ReturnType<typeof getTags> {
    return getTags(this.range);
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

  public getBlocks(): ReturnType<typeof getBlocks> {
    return getBlocks(this.range);
  }

  public getLeftText(): ReturnType<typeof getLeftText> {
    return getLeftText(this.range);
  }

  public getRightText(): ReturnType<typeof getRightText> {
    return getRightText(this.range);
  }

  public setBlocks(value: Parameters<typeof setBlocks>[1]): ReturnType<typeof setBlocks> {
    return setBlocks(this.range, value);
  }

  public splitBlock(): ReturnType<typeof splitBlock> {
    return splitBlock(this.range);
  }

  public getMarks(): ReturnType<typeof getMarks> {
    return getMarks(this.range);
  }

  public splitMarks(removeEmptyMark: Parameters<typeof splitMarks>[1]): ReturnType<typeof splitMarks> {
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

}
