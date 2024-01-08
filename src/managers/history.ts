import EventEmitter from 'eventemitter3';
import { NativeNode } from '../types/native';
import { debug } from '../utils/debug';
import { morph } from '../utils/morph';
import { Nodes } from '../models/nodes';
import { Box } from '../models/box';
import { HTMLParser } from '../parsers/html-parser';
import { insertBookmark } from '../operations/insert-bookmark';
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
  private list: Nodes[];

  // the next index of the list
  private index: number;

  private canSave: boolean;

  public limit: number;

  public event: EventEmitter;

  constructor(selection: Selection) {
    this.selection = selection;
    this.container = selection.container;
    this.list = [];
    this.index = 0;
    this.canSave = true;
    this.limit = 100;
    this.event = new EventEmitter();
  }

  private removeBookmark(value: string): string {
    return value.replace(/(<lake-box[^>]+)\s+focus="\w+"([^>]*>)/ig, '$1$2').
      replace(/<lake-bookmark\s+type="anchor">\s*<\/lake-bookmark>/ig, '').
      replace(/<lake-bookmark\s+type="focus">\s*<\/lake-bookmark>/ig, '');
  }

  private getValue(container: Nodes): string {
    return new HTMLParser(container).getHTML();
  }

  private morphContainer(sourceItem: Nodes): void {
    const callbacks = {
      beforeChildrenUpdated: (oldNode: NativeNode, newNode: NativeNode) => {
        if (new Nodes(oldNode).name === 'lake-box') {
          return false;
        }
        if (new Nodes(newNode).name === 'lake-box') {
          return false;
        }
        return true;
      },
      afterNodeAdded: (nativeNode: NativeNode) => {
        const node = new Nodes(nativeNode);
        if (node.name === 'lake-box') {
          new Box(node).render();
        }
      },
      beforeNodeRemoved: (nativeNode: NativeNode) => {
        const node = new Nodes(nativeNode);
        if (node.name === 'lake-box') {
          new Box(node).remove();
          return false;
        }
        return true;
      },
    };
    morph(this.container, sourceItem.clone(true), { callbacks });
  }

  private cloneContainer(): Nodes {
    const range = this.selection.range;
    const newContainer = this.container.clone(true);
    if (range.commonAncestor.isOutside) {
      return newContainer;
    }
    const startNodePath = range.startNode.path();
    const endNodePath = range.endNode.path();
    const newStartNode = newContainer.find(startNodePath);
    const newEndNode = newContainer.find(endNodePath);
    const newRange = range.clone();
    newRange.setStart(newStartNode, range.startOffset);
    newRange.setEnd(newEndNode, range.endOffset);
    insertBookmark(newRange);
    return newContainer;
  }

  public get count(): number {
    return this.list.length;
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
    const value = this.getValue(this.container);
    while (this.index > 0) {
      const prevItem = this.list[this.index - 1];
      if (!prevItem) {
        break;
      }
      this.index--;
      const prevValue = this.getValue(prevItem);
      if (this.removeBookmark(prevValue) !== this.removeBookmark(value)) {
        this.morphContainer(prevItem);
        this.event.emit('undo', prevValue);
        break;
      }
    }
    this.selection.synByBookmark();
  }

  public redo(): void {
    if (!this.list[this.index]) {
      return;
    }
    this.selection.insertBookmark();
    const value = this.getValue(this.container);
    while (this.index < this.list.length) {
      const nextItem = this.list[this.index];
      if (!nextItem) {
        break;
      }
      this.index++;
      const nextValue = this.getValue(nextItem);
      if (this.removeBookmark(nextValue) !== this.removeBookmark(value)) {
        this.morphContainer(nextItem);
        this.event.emit('redo', nextValue);
        break;
      }
    }
    this.selection.synByBookmark();
  }

  public continue(): void {
    this.canSave = true;
  }

  public pause(): void {
    this.canSave = false;
  }

  public save(): void {
    if (!this.canSave) {
      return;
    }
    const item = this.cloneContainer();
    const value = this.getValue(item);
    if (
      this.list.length > 0 &&
      this.removeBookmark(this.getValue(this.list[this.list.length - 1])) === this.removeBookmark(value)
    ) {
      return;
    }
    this.list.splice(this.index, Infinity, item);
    this.index++;
    if (this.list.length > this.limit) {
      this.list.shift();
      this.index = this.list.length;
    }
    this.event.emit('save', value);
    debug(`saved history (index = ${this.index})`);
  }
}
