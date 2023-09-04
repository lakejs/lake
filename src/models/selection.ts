import { NativeSelection } from '../types/native';
import { Nodes } from './nodes';
import { Range } from './range';
import { insertBookmark, toBookmark } from '../operations';

export class Selection {
  // Represents the range of text selected by the user or the current position of the caret.
  private selection: NativeSelection;

  // Is the root element which has contenteditable="true" attribute.
  private container: Nodes;

  // Is a saved range which is used to add it to the selection late.
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
    this.range = this.getSelectedRange();
  }

  // Returns the current selected range.
  private getSelectedRange(): Range {
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
    if (range.get() === this.getSelectedRange().get()) {
      return;
    }
    const selection = this.selection;
    selection.removeAllRanges();
    selection.addRange(range.get());
  }

  // Updates the saved range to the selected range.
  public updateBySelectedRange(): void {
    this.range = this.getSelectedRange();
  }

  // Updates the saved range to the position of the bookmark.
  public updateByBookmark(): void {
    const range = this.range;
    const container = this.container;
    const anchor = container.find('bookmark[type="anchor"]');
    const focus = container.find('bookmark[type="focus"]');
    toBookmark(range, {
      anchor,
      focus,
    });
  }

  public insertBookmark(): void {
    insertBookmark(this.range);
  }
}
