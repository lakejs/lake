import { NativeSelection } from '../types/native';
import { getRightText } from '../utils/get-right-text';
import { Nodes } from './nodes';
import { Range } from './range';
import { getBlocks } from '../operations/get-blocks';
import { getTags } from '../operations/get-tags';
import { insertBookmark } from '../operations/insert-bookmark';
import { toBookmark } from '../operations/to-bookmark';
import { insertContents } from '../operations/insert-contents';
import { insertFragment } from '../operations/insert-fragment';
import { addMark } from '../operations/add-mark';
import { removeMark } from '../operations/remove-mark';
import { setBlocks } from '../operations/set-blocks';
import { splitBlock } from '../operations/split-block';

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

  // Returns the applied tags of the selection.
  public getTags(): ReturnType<typeof getTags> {
    return getTags(this.range);
  }

  // Returns target blocks relating to the selection that can be modified by other operations.
  public getBlocks(): ReturnType<typeof getBlocks> {
    return getBlocks(this.range);
  }

  // Returns the text of the right part of the closest block divided into two parts by the end of the selection.
  public getRightText(): ReturnType<typeof getRightText> {
    return getRightText(this.range.endNode, this.range.endOffset);
  }

  // Either the method inserts a bookmark into the current position of the caret
  // or the method inserts a pair of bookmarks into the beginning and the end of the selection.
  public insertBookmark(): ReturnType<typeof insertBookmark> {
    return insertBookmark(this.range);
  }

  // Sets the saved range to the range represented by the bookmark.
  public toBookmark(bookmark: Parameters<typeof toBookmark>[1]): ReturnType<typeof toBookmark> {
    return toBookmark(this.range, bookmark);
  }

  // Inserts a HTML string into the selection.
  public insertContents(value: Parameters<typeof insertContents>[1]): ReturnType<typeof insertContents> {
    return insertContents(this.range, value);
  }

  // Inserts a DocumentFragment object into the selection.
  public insertFragment(fragment: Parameters<typeof insertFragment>[1]): ReturnType<typeof insertFragment> {
    return insertFragment(this.range, fragment);
  }

  // Adds new blocks or modifies target blocks relating to the selection.
  public setBlocks(value: Parameters<typeof setBlocks>[1]): ReturnType<typeof setBlocks> {
    return setBlocks(this.range, value);
  }

  // Removes the contents of the selection and then splits the block node at the point of the collapsed range of the selection.
  public splitBlock(): ReturnType<typeof splitBlock> {
    return splitBlock(this.range);
  }

  // Adds the specified mark to the texts of the selection.
  public addMark(value: Parameters<typeof addMark>[1]): ReturnType<typeof addMark> {
    return addMark(this.range, value);
  }

  // Removes the specified marks from the selection.
  public removeMark(value?: Parameters<typeof removeMark>[1]): ReturnType<typeof removeMark> {
    return removeMark(this.range, value);
  }

}
