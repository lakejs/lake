import { DiffDOM } from 'diff-dom';
import { NativeElement } from '../types/native';
import { Nodes } from './nodes';

export class History {
  private container: Nodes;

  // a stack of the history items
  private list: Nodes[];

  // the current index of the list
  private index: number;

  private dd: DiffDOM;

  constructor(container: Nodes) {
    this.container = container;
    this.list = [];
    this.index = 0;
    this.dd = new DiffDOM();
  }

  public get canUndo(): boolean {
    return !!this.list[this.index - 1];
  }

  public get canRedo(): boolean {
    return !!this.list[this.index + 1];
  }

  public undo(): void {
    if (!this.canUndo) {
      return;
    }
    this.index--;
    const item = this.list[this.index];
    const diff = this.dd.diff(this.container.get(0) as NativeElement, item.get(0) as NativeElement);
    this.dd.apply(this.container.get(0) as NativeElement, diff);
  }

  public redo(): void {
    if (!this.canRedo) {
      return;
    }
    this.index++;
    const item = this.list[this.index];
    const diff = this.dd.diff(this.container.get(0) as NativeElement, item.get(0) as NativeElement);
    this.dd.apply(this.container.get(0) as NativeElement, diff);
  }

  public save(): void {
    const item = this.container.clone(true);
    this.list.splice(this.index, Infinity, item);
    this.index++;
  }
}
