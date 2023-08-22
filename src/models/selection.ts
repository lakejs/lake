import { NativeSelection } from '../types/native';
import { Range } from './range';

export class Selection {
  private selection: NativeSelection;

  constructor() {
    const selection = window.getSelection();
    // When called on an <iframe> that is not displayed (e.g., where 'display: none' is set) Firefox will return null,
    // whereas other browsers will return a selection object with Selection.type set to None.
    if (!selection) {
      throw new Error('Selection object is null.');
    }
    this.selection = selection;
  }

  public getRange(): Range {
    const selection = this.selection;
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      return new Range(range);
    }
    return new Range();
  }

  public addRange(range: Range): void {
    if (this.getRange().get() === range.get()) {
      return;
    }
    const selection = this.selection;
    selection.removeAllRanges();
    selection?.addRange(range.get());
  }
}
