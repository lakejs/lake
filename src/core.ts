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
import { BoxManager } from './managers/box';
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
    this.selectionListener = () => {
      this.selection.syncByRange();
    };
    this.clickListener = event => {
      const targetNode = new Nodes(event.target as Element);
      if (targetNode.isOutside) {
        this.event.emit('click:outside');
        return;
      }
      this.event.emit('click:inside', targetNode);
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
        range.selectBoxLeft(boxNode);
      } else {
        range.selectBoxRight(boxNode);
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
    const data = stripNode.text();
    stripNode.html('<br />');
    selection.insertNode(document.createTextNode(data));
  }

  private bindInputEvents(): void {
    let isComposing = false;
    this.container.on('compositionstart', () => {
      isComposing = true;
    });
    this.container.on('compositionend', () => {
      isComposing = false;
    });
    this.container.on('beforeinput', () => {
      const range = this.selection.range;
      if (range.isBoxLeft || range.isBoxRight) {
        this.commitUnsavedInputData();
      }
    });
    this.container.on('input', event => {
      window.setTimeout(() => {
        if (isComposing) {
          return;
        }
        const range = this.selection.range;
        if (range.isBoxLeft || range.isBoxRight) {
          this.inputInBoxStrip();
        } else {
          this.unsavedInputData += (event as InputEvent).data ?? '';
          if (this.unsavedInputData.length < this.options.minChangeSize) {
            return;
          }
        }
        this.history.save();
        this.unsavedInputData = '';
      }, 100);
    });
    this.command.event.on('execute:before', () => this.commitUnsavedInputData());
  }

  private bindBoxEvents(): void {
    this.event.on('click:inside', target => {
      const targetBoxNode = target.closest('lake-box');
      if (targetBoxNode.length > 0) {
        targetBoxNode.find('.lake-box-container').addClass('lake-box-focused');
      }
      const boxNodeList = this.box.getAllNodeList(this);
      for (const boxNode of boxNodeList) {
        if (boxNode.get(0) !== targetBoxNode.get(0)) {
          boxNode.find('.lake-box-container').removeClass('lake-box-focused');
        }
      }
    });
    this.event.on('click:outside', () => {
      const boxNodeList = this.box.getAllNodeList(this);
      for (const boxNode of boxNodeList) {
        boxNode.find('.lake-box-container').removeClass('lake-box-focused');
      }
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

  // Adds the saved range to the selection.
  public select(): void {
    this.selection.setRange();
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
      this.history.save(false);
      this.selection.synByBookmark();
      this.select();
    }
    Core.plugin.loadAll(this);
    Core.box.renderAll(this);
    if (!this.readonly) {
      document.addEventListener('selectionchange', this.selectionListener);
      this.bindInputEvents();
      this.bindBoxEvents();
    }
    document.addEventListener('click', this.clickListener);
    this.event.emit('create');
  }

  // Removes the editor.
  public remove(): void {
    this.container.remove();
    if (!this.readonly) {
      document.removeEventListener('selectionchange', this.selectionListener);
    }
    document.removeEventListener('click', this.clickListener);
    this.event.emit('remove');
  }
}
