import { DiffDOM } from 'diff-dom';
import { NativeElement } from '../types/native';
import { Nodes } from './nodes';
import { Selection } from './selection';

// Saves and controls the editor value history.
// Example:
// before initialization: value: 'a', list: [], index: 0, canUndo: false
// after initialization: value: 'a', list: ['a'], index: 1, canUndo: false
// inputs 'b': value: 'ab', list: ['a', 'ab'], index: 2, canUndo: true
// inputs 'c': value: 'abc', list: ['a', 'ab', 'abc'], index: 3
// inputs 'd': value: 'abcd', list: ['a', 'ab', 'abc', 'abcd'], index: 4
// undoes: value: 'abc', list: ['a', 'ab', 'abc', 'abcd'], index: 3
// undoes: value: 'ab', list: ['a', 'ab', 'abc', 'abcd'], index: 2
// undoes: value: 'a', list: ['a', 'ab', 'abc', 'abcd'], index: 1, canUndo: false
// redoes: value: 'ab', list: ['a', 'ab', 'abc', 'abcd'], index: 2, canRedo: true
// inputs 'e': value: 'abe', list: ['a', 'ab', 'abe'], index: 3, canRedo: false
export class History {
  private selection: Selection;

  private container: Nodes;

  // a stack of the history items
  private list: NativeElement[];

  // the current index of the list
  private index: number;

  private diffDom: DiffDOM;

  constructor(selection: Selection) {
    this.selection = selection;
    this.container = selection.container;
    this.list = [];
    this.index = 0;
    this.diffDom = new DiffDOM();
  }

  public get canUndo(): boolean {
    return this.index > 1 && !!this.list[this.index - 1];
  }

  public get canRedo(): boolean {
    return !!this.list[this.index];
  }

  public undo(): void {
    if (!this.list[this.index - 1]) {
      return;
    }
    this.selection.insertBookmark();
    const nativeContainer = this.container.get(0) as NativeElement;
    let diff: ReturnType<typeof this.diffDom.diff> = [];
    while(diff.length === 0) {
      const item = this.list[this.index - 1];
      diff = this.diffDom.diff(nativeContainer, item);
      if (this.index === 1) {
        break;
      }
      this.index--;
      if (diff.length > 0) {
        this.index++;
      }
    }
    if (diff.length > 0) {
      this.diffDom.apply(nativeContainer, diff);
    }
    this.selection.synByBookmark();
  }

  public redo(): void {
    if (!this.list[this.index]) {
      return;
    }
    this.selection.insertBookmark();
    const nativeContainer = this.container.get(0) as NativeElement;
    let diff: ReturnType<typeof this.diffDom.diff> = [];
    while(diff.length === 0) {
      const item = this.list[this.index];
      diff = this.diffDom.diff(nativeContainer, item);
      if (this.index === this.list.length) {
        break;
      }
      this.index++;
    }
    if (diff.length > 0) {
      this.diffDom.apply(nativeContainer, diff);
    }
    this.selection.synByBookmark();
  }

  public save(): void {
    const bookmark = this.selection.insertBookmark();
    const item = this.container.clone(true).get(0) as NativeElement;
    this.selection.toBookmark(bookmark);
    this.list.splice(this.index, Infinity, item);
    this.index++;
  }
}
