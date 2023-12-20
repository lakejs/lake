import morphdom from 'morphdom';
import { NativeElement } from '../types/native';
import { debug } from '../utils/debug';
import { denormalizeValue } from '../utils/denormalize-value';
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

  constructor(selection: Selection) {
    this.selection = selection;
    this.container = selection.container;
    this.list = [];
    this.index = 0;
    this.canSave = true;
    this.limit = 100;
  }

  private getValue(container: Nodes): string {
    const value = new HTMLParser(container).getHTML();
    return denormalizeValue(value);
  }

  private renderBoxes(): void {
    this.container.find('lake-box').each(node => {
      const boxNode = new Nodes(node);
      if (boxNode.find('.lake-body').length === 0) {
        new Box(boxNode).render();
      }
    });
  }

  private merge(sourceItem: Nodes): void {
    const options = {
      onBeforeElChildrenUpdated: (fromElement: NativeElement, toElement: NativeElement) => {
        if (fromElement.nodeName.toLowerCase() === 'lake-box') {
          return false;
        }
        if (toElement.nodeName.toLowerCase() === 'lake-box') {
          return false;
        }
        return true;
      },
      childrenOnly: true,
    };
    morphdom(this.container.get(0), sourceItem.clone(true).get(0), options);
    this.renderBoxes();
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
    let item = null;
    while (this.index > 0) {
      const prevItem = this.list[this.index - 1];
      if (!prevItem) {
        break;
      }
      this.index--;
      if (this.getValue(prevItem) !== value) {
        item = prevItem;
        break;
      }
    }
    if (item) {
      this.merge(item);
    }
    this.selection.synByBookmark();
  }

  public redo(): void {
    if (!this.list[this.index]) {
      return;
    }
    this.selection.insertBookmark();
    const value = this.getValue(this.container);
    let item = null;
    while (this.index < this.list.length) {
      const nextItem = this.list[this.index];
      if (!nextItem) {
        break;
      }
      this.index++;
      if (this.getValue(nextItem) !== value) {
        item = nextItem;
        break;
      }
    }
    if (item) {
      this.merge(item);
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
    this.list.splice(this.index, Infinity, item);
    this.index++;
    if (this.list.length > this.limit) {
      this.list.shift();
      this.index = this.list.length;
    }
    debug(`saved history (index = ${this.index})`);
  }
}
