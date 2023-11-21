import EventEmitter from 'eventemitter3';
import pkg from '../package.json';
import './elements/bookmark';
import './elements/box';
import { NativeNode } from './types/native';
import * as utils from './utils';
import * as models from './models';

type TargetType = string | NativeNode;

type OptionsType = {[key: string]: any};

const containerClassName = 'lake-container';

const defaultOptions: OptionsType = {
  className: '',
  defaultValue: '<p><br /><focus /></p>',
  spellcheck: 'false',
  minChangeSize: 5,
};

export class Core {
  public static version: string = pkg.version;

  public static utils = utils;

  public static models = models;

  public static plugin = new models.Plugin();

  private target: TargetType;

  private options: OptionsType;

  private selectionListener: EventListener;

  private clickListener: EventListener;

  public container: models.Nodes;

  public event: EventEmitter;

  public selection: models.Selection;

  public command: models.Command;

  public history: models.History;

  public keystroke: models.Keystroke;

  constructor(target: string | NativeNode, options = defaultOptions) {
    this.target = target;
    this.options = options;
    this.container = utils.query('<div />');

    this.setDefaultOptions();
    this.setContainerAttributes();

    this.event = new EventEmitter();
    this.selection = new models.Selection(this.container);
    this.command = new models.Command();
    this.history = new models.History(this.selection);
    this.keystroke = new models.Keystroke(this.container);

    this.selectionListener = () => {
      this.selection.syncByRange();
    };
    this.clickListener = event => {
      const targetNode = new models.Nodes(event.target as Element);
      if (!targetNode.isContentEditable) {
        this.event.emit('click:outside');
      }
    };
  }

  private setDefaultOptions(): void {
    utils.forEach(defaultOptions, (key, value) => {
      if (this.options[key] === undefined) {
        this.options[key] = value;
      }
    });
  }

  private setContainerAttributes(): void {
    const container = this.container;
    container.attr({
      class: containerClassName,
      contenteditable: 'true',
      spellcheck: this.options.spellcheck,
    });
    if (this.options.className !== '') {
      container.addClass(this.options.className);
    }
  }

  private bindInputEvent(): void {
    let isComposing = false;
    this.container.on('compositionstart', () => {
      isComposing = true;
    });
    this.container.on('compositionend', () => {
      isComposing = false;
    });
    let preData = '';
    this.container.on('input', event => {
      window.setTimeout(() => {
        if (isComposing) {
          return;
        }
        preData += (event as InputEvent).data ?? '';
        if (preData.length < this.options.minChangeSize) {
          return;
        }
        this.history.save();
        preData = '';
      }, 100);
    });
    this.command.event.on('execute:before', () => {
      if (preData.length > 0) {
        this.history.save();
        preData = '';
      }
    });
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
    value = utils.normalizeValue(value);
    const htmlParser = new models.HTMLParser(value);
    const fragment = htmlParser.getFragment();
    this.container.empty();
    this.container.append(fragment);
    this.selection.synByBookmark();
  }

  // Gets the contents from the editor.
  public getValue() {
    const bookmark = this.selection.insertBookmark();
    let value = new models.HTMLParser(this.container).getHTML();
    value = utils.denormalizeValue(value);
    this.selection.toBookmark(bookmark);
    return value;
  }

  // Creates an editor area and set default value to it.
  public create(): void {
    const container = this.container;
    const targetNode = utils.query(this.target);
    targetNode.hide();
    const value = utils.normalizeValue(this.options.defaultValue);
    const htmlParser = new models.HTMLParser(value);
    const fragment = htmlParser.getFragment();
    this.container.empty();
    this.container.append(fragment);
    targetNode.after(container);
    this.focus();
    this.history.save(false);
    this.selection.synByBookmark();
    this.select();
    Core.plugin.loadAll(this);
    document.addEventListener('selectionchange', this.selectionListener);
    document.addEventListener('click', this.clickListener);
    this.bindInputEvent();
    this.event.emit('create');
  }

  // Removes the editor.
  public remove(): void {
    this.container.remove();
    document.removeEventListener('selectionchange', this.selectionListener);
    document.removeEventListener('click', this.clickListener);
    this.event.emit('remove');
  }
}
