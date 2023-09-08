import { NativeSelection } from '../types/native';
import { Nodes } from './nodes';
import { Range } from './range';
import { addMark, getTags, insertBookmark, removeMark, setBlocks, toBookmark } from '../operations';

export class Selection {
  // Represents the range of text selected by the user or the current position of the caret.
  private selection: NativeSelection;

  // Is the root element which has contenteditable="true" attribute.
  private container: Nodes;

  // Is a saved range which is used to add it to the selection later.
  private range: Range;

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

  // Returns the current selected range.
  private getRange(): Range {
    const selection = this.selection;
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      return new Range(range);
    }
    return new Range();
  }

  // Selects the saved range.
  public select(): void {
    const range = this.range;
    if (range.get() === this.getRange().get()) {
      return;
    }
    const selection = this.selection;
    selection.removeAllRanges();
    selection.addRange(range.get());
  }

  // Synchronizes the saved range with the range of the selection.
  public syncByRange(): void {
    this.range = this.getRange();
  }

  // Synchronizes the saved range with the bookmarks.
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

  // Either the method inserts a bookmark into the current position of the caret
  // or the method inserts a pair of bookmarks into the beginning and the end of the selection.
  public insertBookmark(): ReturnType<typeof insertBookmark> {
    return insertBookmark(this.range);
  }

  // Adds new blocks or modifies target blocks relating to the selection.
  public setBlocks(value: string): ReturnType<typeof setBlocks> {
    return setBlocks(this.range, value);
  }

  // Adds the specified mark to the texts of the selection.
  public addMark(value: string): ReturnType<typeof addMark> {
    if (!this.range.commonAncestor.isEditable && !this.range.commonAncestor.isContainer) {
      return;
    }
    return addMark(this.range, value);
  }

  // Removes the specified marks from the selection.
  public removeMark(value: string): ReturnType<typeof removeMark> {
    if (!this.range.commonAncestor.isEditable && !this.range.commonAncestor.isContainer) {
      return;
    }
    return removeMark(this.range, value);
  }

}
