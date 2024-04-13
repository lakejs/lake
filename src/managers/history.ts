import md5 from 'blueimp-md5';
import EventEmitter from 'eventemitter3';
import { NativeNode } from '../types/native';
import { boxInstances } from '../storage/box-instances';
import { debug } from '../utils/debug';
import { morph } from '../utils/morph';
import { denormalizeValue } from '../utils/denormalize-value';
import { Nodes } from '../models/nodes';
import { Box } from '../models/box';
import { HTMLParser } from '../parsers/html-parser';
import { insertBookmark } from '../operations/insert-bookmark';
import { Selection } from './selection';

// Saves and controls the history of the value of the editor.
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
  private list: Nodes[] = [];

  // the next index of the list
  private index: number = 0;

  private canSave: boolean = true;

  public limit: number = 100;

  public event: EventEmitter = new EventEmitter();

  constructor(selection: Selection) {
    this.selection = selection;
    this.container = selection.container;
  }

  private removeBookmark(value: string): string {
    return value.replace(/(<lake-box[^>]+)\s+focus="\w+"([^>]*>)/ig, '$1$2').
      replace(/<lake-bookmark\s+type="anchor">\s*<\/lake-bookmark>/ig, '').
      replace(/<lake-bookmark\s+type="focus">\s*<\/lake-bookmark>/ig, '');
  }

  private getValue(container: Nodes): string {
    return new HTMLParser(container).getHTML();
  }

  private addIdToBoxes(node: Nodes): void {
    node.find('lake-box').each(nativeNode => {
      const boxNode = new Nodes(nativeNode);
      const id = md5(`${boxNode.attr('type')}-${boxNode.attr('name')}-${boxNode.attr('value')}`);
      boxNode.attr('id', id);
    });
  }

  private removeIdfromBoxes(node: Nodes): void {
    node.find('lake-box').each(nativeNode => {
      const boxNode = new Nodes(nativeNode);
      boxNode.removeAttr('id');
    });
  }

  private morphContainer(sourceItem: Nodes): void {
    const container = this.container;
    const callbacks = {
      beforeChildrenUpdated: (oldNode: NativeNode) => {
        if (new Nodes(oldNode).name === 'lake-box') {
          return false;
        }
      },
      afterAttributeUpdated: (attributeName: string, nativeNode: NativeNode) => {
        const node = new Nodes(nativeNode);
        if (attributeName === 'value' && node.name === 'lake-box') {
          const instanceMap = boxInstances.get(container.id);
          if (!instanceMap) {
            return;
          }
          instanceMap.delete(node.id);
        }
      },
    };
    const otherContainer = sourceItem.clone(true);
    this.addIdToBoxes(container);
    this.addIdToBoxes(otherContainer);
    morph(container, otherContainer, {
      callbacks,
    });
    this.removeIdfromBoxes(container);
    this.removeIdfromBoxes(otherContainer);
  }

  private cloneContainer(): Nodes {
    const range = this.selection.range;
    const newContainer = this.container.clone(true);
    newContainer.find('lake-box').each(nativeNode => {
      const box = new Box(nativeNode);
      box.getContainer().empty();
    });
    if (range.commonAncestor.isOutside) {
      return newContainer;
    }
    if (range.isInsideBox) {
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
      const prevValue = this.getValue(prevItem);
      if (this.removeBookmark(prevValue) !== this.removeBookmark(value)) {
        this.morphContainer(prevItem);
        this.event.emit('undo', prevValue);
        break;
      }
      if (this.index === 1) {
        break;
      }
      this.index--;
    }
    this.selection.synByBookmark();
    debug(`History undone, the last index is ${this.index}`);
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
    debug(`History redone, the last index is ${this.index}`);
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
      this.list[this.index - 1] &&
      this.removeBookmark(this.getValue(this.list[this.index - 1])) === this.removeBookmark(value)
    ) {
      return;
    }
    this.list.splice(this.index, Infinity, item);
    this.index++;
    if (this.list.length > this.limit) {
      this.list.shift();
      this.index = this.list.length;
    }
    this.event.emit('save', denormalizeValue(value));
    debug(`History saved, the last index is ${this.index}`);
  }
}
