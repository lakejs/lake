import EventEmitter from 'eventemitter3';
import { getInstanceMap } from '../storage/box-instances';
import { debug } from '../utils/debug';
import { morph } from '../utils/morph';
import { denormalizeValue } from '../utils/denormalize-value';
import { getBox } from '../utils/get-box';
import { Nodes } from '../models/nodes';
import { HTMLParser } from '../parsers/html-parser';
import { insertBookmark } from '../operations/insert-bookmark';
import { Selection } from './selection';
import { getContentRules } from '@/config/content-rules';

interface SaveOptions {
  inputType?: string;
  update?: boolean;
  emitEvent?: boolean;
}

/**
 * The History interface manages undo and redo functionality for a container that holds some editable content.
 * It emits events when actions like save, undo, or redo are performed.
 */
//
// Example:
//
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
  private readonly selection: Selection;

  private readonly container: Nodes;

  private canSave = true;

  /**
   * A list in which the current and previous contents are stored.
   */
  public readonly list: Nodes[] = [];

  /**
   * A number that always indicates the position at which new content is stored.
   */
  public index = 0;

  /**
   * The maximum length of the history. Once this limit is reached, the earliest item in the list will be removed.
   */
  public limit = 100;

  /**
   * A ContentRules object defining the HTML parsing rules used by HTMLParser.
   */
  public contentRules = getContentRules();

  /**
   * An EventEmitter object used to set up events.
   */
  public readonly event: EventEmitter = new EventEmitter();

  constructor(selection: Selection) {
    this.selection = selection;
    this.container = selection.container;
  }

  private removeBookmark(value: string): string {
    return value.replace(/(<lake-box[^>]+)\sfocus="\w+"([^>]*>)/gi, '$1$2')
      .replace(/<lake-bookmark\s+type="anchor">\s*<\/lake-bookmark>/gi, '')
      .replace(/<lake-bookmark\s+type="focus">\s*<\/lake-bookmark>/gi, '');
  }

  private getValue(container: Nodes): string {
    return new HTMLParser(container, this.contentRules).getHTML();
  }

  private addIdToBoxes(node: Nodes): void {
    node.find('lake-box').each(nativeNode => {
      const boxNode = new Nodes(nativeNode);
      const id = `${boxNode.attr('name')}-${boxNode.attr('value')}`;
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
      beforeChildrenUpdated: (oldNode: Node) => {
        if (new Nodes(oldNode).name === 'lake-box') {
          return false;
        }
      },
      afterAttributeUpdated: (attributeName: string, nativeNode: Node) => {
        const node = new Nodes(nativeNode);
        if (['name', 'value'].indexOf(attributeName) >= 0 && node.name === 'lake-box') {
          getBox(node).unmount();
          const instanceMap = getInstanceMap(container.id);
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

  /**
   * A boolean value indicating whether the history can be undone.
   */
  public get canUndo(): boolean {
    return this.index > 1 && !!this.list[this.index - 2];
  }

  /**
   * A boolean value indicating whether the history can be redone.
   */
  public get canRedo(): boolean {
    return !!this.list[this.index];
  }

  /**
   * Creates a deep clone of the current container with its content.
   * If there is a selection within the container, it ensures the selection is also preserved in the cloned container.
   */
  public cloneContainer(): Nodes {
    const range = this.selection.range;
    const newContainer = this.container.clone(true);
    newContainer.find('lake-box').each(nativeNode => {
      const box = getBox(nativeNode);
      box.getContainer().empty();
    });
    if (!this.container.contains(range.commonAncestor)) {
      return newContainer;
    }
    if (range.isInsideBox) {
      const boxNode = range.commonAncestor.closest('lake-box');
      const boxNodePath = boxNode.path();
      const newBoxNode = newContainer.find(boxNodePath);
      const newRange = range.clone();
      newRange.selectBox(newBoxNode);
      insertBookmark(newRange);
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

  /**
   * Undoes to the previous saved content.
   */
  public undo(): void {
    if (!this.list[this.index - 2]) {
      return;
    }
    this.selection.insertBookmark();
    const value = this.getValue(this.container);
    while (this.index > 1) {
      const prevItem = this.list[this.index - 2];
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
    this.selection.updateByBookmark();
    debug(`History undone (index: ${this.index})`);
  }

  /**
   * Redoes to the next saved content.
   */
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
    this.selection.updateByBookmark();
    debug(`History redone (index: ${this.index})`);
  }

  /**
   * Resumes the ability to save history.
   * This method re-enables saving after the pause method has been called.
   */
  public continue(): void {
    this.canSave = true;
  }

  /**
   * Pauses the ability to save history.
   * This method temporarily disables saving history, which can be resumed later by calling the continue method.
   */
  public pause(): void {
    this.canSave = false;
  }

  /**
   * Saves the current content to the history.
   * The content is saved only if it is different from the previous content.
   */
  public save(options: SaveOptions = {}): void {
    const inputType = options.inputType ?? '';
    const update = options.update ?? false;
    const emitEvent = options.emitEvent ?? true;
    if (!this.canSave) {
      return;
    }
    const item = this.cloneContainer();
    const value = this.getValue(item);
    if (
      this.list[this.index - 1]
      && this.removeBookmark(this.getValue(this.list[this.index - 1])) === this.removeBookmark(value)
    ) {
      return;
    }
    if (update) {
      this.list.splice(this.index - 1, Infinity, item);
    } else {
      this.list.splice(this.index, Infinity, item);
      this.index++;
    }
    if (this.list.length > this.limit) {
      this.list.shift();
      this.index = this.list.length;
    }
    debug(`History saved (index: ${this.index}, inputType: "${inputType}", update: ${update}, emitEvent: ${emitEvent})`);
    if (emitEvent) {
      this.event.emit('save', denormalizeValue(value), {
        inputType,
        update,
        emitEvent,
      });
    }
  }
}
