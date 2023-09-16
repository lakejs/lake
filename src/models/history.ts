import { DiffDOM } from 'diff-dom';
import { NativeElement } from '../types/native';
import { Nodes } from './nodes';
import { Selection } from './selection';

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
    return !!this.list[this.index - 1];
  }

  public get canRedo(): boolean {
    return !!this.list[this.index];
  }

  public undo(): void {
    if (!this.canUndo) {
      return;
    }
    this.selection.insertBookmark();
    const nativeContainer = this.container.get(0) as NativeElement;
    let diff: ReturnType<typeof this.diffDom.diff> = [];
    while(diff.length === 0) {
      this.index--;
      const item = this.list[this.index];
      diff = this.diffDom.diff(nativeContainer, item);
      if (this.index === 0) {
        this.index = 1;
        break;
      }
    }
    if (diff.length > 0) {
      this.diffDom.apply(nativeContainer, diff);
    }
    this.selection.synByBookmark();
  }

  public redo(): void {
    if (!this.canRedo) {
      return;
    }
    this.selection.insertBookmark();
    const nativeContainer = this.container.get(0) as NativeElement;
    let diff: ReturnType<typeof this.diffDom.diff> = [];
    while(diff.length === 0) {
      const item = this.list[this.index];
      this.index++;
      diff = this.diffDom.diff(nativeContainer, item);
      if (this.index === this.list.length) {
        break;
      }
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
