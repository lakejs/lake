import EventEmitter from 'eventemitter3';
import pkg from '../package.json';
import './elements/bookmark';
import './elements/box';
import { NativeNode } from './types/native';
import { denormalizeValue, forEach, normalizeValue, query } from './utils';
import { Nodes } from './models/nodes';
import { Box } from './models/box';
import { HTMLParser } from './parsers/html-parser';
import { Selection } from './managers/selection';
import { Command } from './managers/command';
import { History } from './managers/history';
import { Keystroke } from './managers/keystroke';
import { BoxManager } from './managers/box-manager';
import { Plugin } from './managers/plugin';

type TargetType = string | NativeNode;

type OptionsType = {[key: string]: any};

const containerClassName = 'lake-container';

const defaultOptions: OptionsType = {
  readonly: false,
  className: '',
  defaultValue: '<p><br /><focus /></p>',
  spellcheck: false,
  minChangeSize: 5,
};

export class Core {
  public static version: string = pkg.version;

  public static box = new BoxManager();

  public static plugin = new Plugin();

  private target: TargetType;

  private options: OptionsType;

  private unsavedInputData: string;

  private selectionListener: EventListener;

  private clickListener: EventListener;

  private mouseoverListener: EventListener;

  private mutationObserver: MutationObserver;

  public container: Nodes;

  public readonly: boolean;

  public event: EventEmitter;

  public selection: Selection;

  public command: Command;

  public history: History;

  public keystroke: Keystroke;

  public box: BoxManager;

  constructor(target: string | NativeNode, options = defaultOptions) {
    this.target = target;
    this.options = options;
    this.container = query('<div />');

    this.setDefaultOptions();
    this.readonly = this.options.readonly;
    this.setContainerAttributes();

    this.event = new EventEmitter();
    this.selection = new Selection(this.container);
    this.command = new Command();
    this.history = new History(this.selection);
    this.keystroke = new Keystroke(this.container);
    this.box = Core.box;

    this.unsavedInputData = '';

    // watch for changes being made to the DOM tree
    this.mutationObserver = new MutationObserver((records: MutationRecord[]) => {
      for (const record of records) {
        this.event.emit('mutation', record);
      }
    });
    this.selectionListener = () => {
      this.selection.syncByRange();
      // TODO: need to review performance
      const range = this.selection.range;
      const clonedRange = range.clone();
      clonedRange.adaptBox();
      const boxNodeList = this.box.getNodeList(this);
      for (const boxNode of boxNodeList) {
        const box = new Box(boxNode);
        if (clonedRange.intersectsNode(boxNode)) {
          box.focus();
        } else {
          box.blur();
        }
      }
    };
    this.clickListener = event => {
      const targetNode = new Nodes(event.target as Element);
      if (targetNode.isOutside) {
        this.event.emit('click:outside');
        return;
      }
      this.event.emit('click:inside', targetNode);
    };
    this.mouseoverListener = event => {
      const targetNode = new Nodes(event.target as Element);
      this.event.emit('mouseover', targetNode);
    };
  }

  private setDefaultOptions(): void {
    forEach(defaultOptions, (key, value) => {
      if (this.options[key] === undefined) {
        this.options[key] = value;
      }
    });
  }

  private setContainerAttributes(): void {
    const container = this.container;
    container.attr({
      class: containerClassName,
      contenteditable: this.readonly ? 'false' : 'true',
      spellcheck: this.options.spellcheck ? 'true' : 'false',
    });
    if (this.options.className !== '') {
      container.addClass(this.options.className);
    }
  }

  private inputInBoxStrip(): void {
    const selection = this.selection;
    const range = selection.range;
    const stripNode = range.startNode.closest('.lake-box-strip');
    const boxNode = stripNode.closest('lake-box');
    const box = new Box(boxNode);
    if (box.type === 'inline') {
      if (range.isBoxLeft) {
        range.setStartBefore(boxNode);
        range.collapseToStart();
      } else {
        range.setStartAfter(boxNode);
        range.collapseToStart();
      }
    } else {
      const paragraph = query('<p />');
      if (range.isBoxLeft) {
        boxNode.before(paragraph);
      } else {
        boxNode.after(paragraph);
      }
      range.shrinkAfter(paragraph);
    }
    const text = stripNode.text();
    stripNode.html('<br />');
    selection.insertNode(document.createTextNode(text));
  }

  private bindInputEvents(): void {
    let isComposing = false;
    this.container.on('compositionstart', () => {
      isComposing = true;
    });
    this.container.on('compositionend', () => {
      isComposing = false;
    });
    this.container.on('beforeinput', event => {
      const range = this.selection.range;
      if (range.isBoxLeft || range.isBoxRight) {
        this.commitUnsavedInputData();
      }
      this.event.emit('input:before', event);
    });
    this.container.on('input', event => {
      const inputEvent = event as InputEvent;
      // Here setTimeout is necessary because isComposing is not false after ending composition.
      window.setTimeout(() => {
        const range = this.selection.range;
        if (range.isBoxCenter) {
          return;
        }
        // isComposing is false after ending composition because compositionend event has been emitted.
        if (isComposing) {
          this.event.emit('input', inputEvent);
          return;
        }
        if (
          inputEvent.inputType === 'insertText' ||
          inputEvent.inputType === 'insertCompositionText'
        ) {
          if (range.isBoxLeft || range.isBoxRight) {
            this.inputInBoxStrip();
          } else {
            this.unsavedInputData += inputEvent.data ?? '';
            if (this.unsavedInputData.length < this.options.minChangeSize) {
              this.event.emit('input', inputEvent);
              return;
            }
          }
        }
        this.history.save();
        this.unsavedInputData = '';
        this.event.emit('input', inputEvent);
      }, 0);
    });
    this.command.event.on('execute:before', () => this.commitUnsavedInputData());
  }

  private bindBoxEvents(): void {
    this.event.on('click:inside', (target: Nodes) => {
      const targetBoxNode = target.closest('lake-box');
      if (targetBoxNode.length > 0) {
        if (target.closest('.lake-box-editarea').length > 0) {
          return;
        }
        const range = this.selection.range;
        const targetBox = new Box(targetBoxNode);
        range.setStart(targetBox.getContainer(), 0);
        range.collapseToStart();
        window.setTimeout(() => targetBox.focus(), 0);
      }
    });
    this.event.on('mutation', (record: MutationRecord) => {
      if (record.type === 'attributes' && record.attributeName === 'save') {
        const boxNode = new Nodes(record.target);
        if (boxNode.name === 'lake-box' && boxNode.attr('save') === 'true') {
          boxNode.removeAttr('save');
          this.history.save();
          this.unsavedInputData = '';
        }
      }
    });
  }

  private bindHistoryEvents(): void {
    this.history.event.on('undo', value => {
      this.event.emit('change', value);
    });
    this.history.event.on('redo', value => {
      this.event.emit('change', value);
    });
    this.history.event.on('save', value => {
      this.event.emit('change', value);
    });
  }

  // Saves the input data which is unsaved.
  public commitUnsavedInputData(): void {
    if (this.unsavedInputData.length > 0) {
      this.history.save();
      this.unsavedInputData = '';
    }
  }

  // Updates some state before custom modifications.
  public prepareOperation(): void {
    this.commitUnsavedInputData();
    this.history.pause();
  }

  // Saves custom modifications to the history.
  public commitOperation(): void {
    this.history.continue();
    this.history.save();
  }

  // Sets focus on the editor area.
  public focus(): void {
    this.container.focus();
  }

  // Removes focus from the editor area.
  public blur(): void {
    this.container.blur();
  }

  // Sets the specified HTML string to the editor area.
  public setValue(value: string) {
    value = normalizeValue(value);
    const htmlParser = new HTMLParser(value);
    const fragment = htmlParser.getFragment();
    this.container.empty();
    this.container.append(fragment);
    Core.box.renderAll(this);
    this.selection.synByBookmark();
  }

  // Gets the contents from the editor.
  public getValue() {
    const bookmark = this.selection.insertBookmark();
    let value = new HTMLParser(this.container).getHTML();
    value = denormalizeValue(value);
    this.selection.toBookmark(bookmark);
    return value;
  }

  // Creates an editor area and set default value to it.
  public create(): void {
    const container = this.container;
    const targetNode = query(this.target);
    targetNode.hide();
    const value = normalizeValue(this.options.defaultValue);
    const htmlParser = new HTMLParser(value);
    const fragment = htmlParser.getFragment();
    this.container.empty();
    this.container.append(fragment);
    targetNode.after(container);
    if (!this.readonly) {
      this.focus();
      this.selection.synByBookmark();
      this.history.save();
    }
    Core.plugin.loadAll(this);
    Core.box.renderAll(this);
    if (!this.readonly) {
      this.mutationObserver.observe(this.container.get(0), {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true,
      });
      document.addEventListener('selectionchange', this.selectionListener);
      this.bindInputEvents();
      this.bindBoxEvents();
      this.bindHistoryEvents();
    }
    document.addEventListener('click', this.clickListener);
    document.addEventListener('mouseover', this.mouseoverListener);
    this.event.emit('create');
  }

  // Removes the editor.
  public remove(): void {
    this.container.remove();
    if (!this.readonly) {
      const records = this.mutationObserver.takeRecords();
      for (const record of records) {
        this.event.emit('mutation', record);
      }
      this.mutationObserver.disconnect();
      document.removeEventListener('selectionchange', this.selectionListener);
    }
    document.removeEventListener('click', this.clickListener);
    document.removeEventListener('mouseover', this.mouseoverListener);
    this.event.emit('remove');
  }
}
