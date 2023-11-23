import { DiffDOM } from 'diff-dom';
import { NativeElement } from '../types/native';
import { debug } from '../utils/debug';
import { Nodes } from '../models/nodes';
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

  // an array for storing the history items
  private list: NativeElement[];

  // the next index of the list
  private index: number;

  private diffDOM: DiffDOM;

  private canSave: boolean;

  public limit: number;

  constructor(selection: Selection) {
    this.selection = selection;
    this.container = selection.container;
    this.list = [];
    this.index = 0;
    this.diffDOM = new DiffDOM();
    this.canSave = true;
    this.limit = 100;
  }

  private isEmptyDiff(diffList: ReturnType<typeof this.diffDOM.diff>): boolean {
    return diffList.length === 0 ||
      diffList.length === 1 &&
      (diffList[0] as any).action === 'addTextElement' &&
      (diffList[0] as any).value === '';
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
    let diffList: ReturnType<typeof this.diffDOM.diff> = [];
    while(this.isEmptyDiff(diffList)) {
      const item = this.list[this.index - 1];
      if (!item) {
        break;
      }
      diffList = this.diffDOM.diff(nativeContainer, item);
      if (this.index === 1) {
        break;
      }
      this.index--;
    }
    if (diffList.length > 0) {
      this.diffDOM.apply(nativeContainer, diffList);
    }
    this.selection.synByBookmark();
  }

  public redo(): void {
    if (!this.list[this.index]) {
      return;
    }
    this.selection.insertBookmark();
    const nativeContainer = this.container.get(0) as NativeElement;
    let diffList: ReturnType<typeof this.diffDOM.diff> = [];
    while(this.isEmptyDiff(diffList)) {
      const item = this.list[this.index];
      if (!item) {
        break;
      }
      diffList = this.diffDOM.diff(nativeContainer, item);
      this.index++;
    }
    if (diffList.length > 0) {
      this.diffDOM.apply(nativeContainer, diffList);
    }
    this.selection.synByBookmark();
  }

  public continue(): void {
    this.canSave = true;
  }

  public pause(): void {
    this.canSave = false;
  }

  public save(needBookmark = true): void {
    if (!this.canSave) {
      return;
    }
    let bookmark;
    if (needBookmark) {
      bookmark = this.selection.insertBookmark();
    }
    const item = this.container.clone(true).get(0) as NativeElement;
    if (bookmark) {
      this.selection.toBookmark(bookmark);
    }
    this.list.splice(this.index, Infinity, item);
    this.index++;
    if (this.list.length > this.limit) {
      this.list.shift();
      this.index = this.list.length;
    }
    debug(`saved history (index = ${this.index})`);
  }
}
