import EventEmitter from 'eventemitter3';
import pkg from '../package.json';
import { NativeNode } from './types/native';
import * as utils from './utils';
import * as models from './models';
import undo from './plugins/undo';
import redo from './plugins/redo';
import selectAll from './plugins/select-all';
import heading from './plugins/heading';
import blockquote from './plugins/blockquote';
import bold from './plugins/bold';
import italic from './plugins/italic';
import underline from './plugins/underline';
import strikethrough from './plugins/strikethrough';
import subscript from './plugins/subscript';
import superscript from './plugins/superscript';
import code from './plugins/code';
import fontFamily from './plugins/font-family';
import fontSize from './plugins/font-size';
import fontColor from './plugins/font-color';
import highlight from './plugins/highlight';
import enter from './plugins/enter';
import shiftEnter from './plugins/shift-enter';

type TargetType = string | NativeNode;

type OptionsType = {[key: string]: any};

const containerClassName = 'lake-editor-container';

const defaultOptions: OptionsType = {
  className: '',
  defaultValue: '<p><br /><focus /></p>',
};

export default class LakeCore {
  static version: string = pkg.version;

  static utils = utils;

  static models = models;

  private target: TargetType;

  private options: OptionsType;

  private selectionchangeListener: EventListener;

  public container: models.Nodes;

  public event: EventEmitter;

  public selection: models.Selection;

  public commands: models.Commands;

  public history: models.History;

  public keystroke: models.Keystroke;

  public plugins: models.Plugins;

  constructor(target: string | NativeNode, options?: OptionsType) {
    this.target = target;
    this.options = options ?? defaultOptions;
    this.container = utils.query('<div />');

    this.setDefaultOptions();
    this.addContainerAttributes();

    this.event = new EventEmitter();
    this.selection = new models.Selection(this.container);
    this.commands = new models.Commands();
    this.history = new models.History(this.selection);
    this.keystroke = new models.Keystroke(this.container);
    this.plugins = new models.Plugins();

    this.addBuiltInPlugins();

    this.selectionchangeListener = () => {
      this.selection.syncByRange();
    };
    document.addEventListener('selectionchange', this.selectionchangeListener);
    this.container.on('input', () => {
      window.setTimeout(() => this.history.save(), 100);
    });
  }

  private setDefaultOptions(): void {
    utils.forEach(defaultOptions, (key, value) => {
      if (this.options[key] === undefined) {
        this.options[key] = value;
      }
    });
  }

  private addContainerAttributes(): void {
    const container = this.container;
    container.attr({
      class: containerClassName,
      contenteditable: 'true',
    });
    container.addClass(this.options.className);
  }

  private addBuiltInPlugins(): void {
    const plugins = this.plugins;
    plugins.add(undo);
    plugins.add(redo);
    plugins.add(selectAll);
    plugins.add(heading);
    plugins.add(blockquote);
    plugins.add(bold);
    plugins.add(italic);
    plugins.add(underline);
    plugins.add(strikethrough);
    plugins.add(subscript);
    plugins.add(superscript);
    plugins.add(code);
    plugins.add(fontFamily);
    plugins.add(fontSize);
    plugins.add(fontColor);
    plugins.add(highlight);
    plugins.add(enter);
    plugins.add(shiftEnter);
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
    this.container.html(value);
  }

  // Gets the contents from the editor.
  public getValue() {
    const bookmark = this.selection.insertBookmark();
    const value = utils.denormalizeValue(this.container.html());
    this.selection.toBookmark(bookmark);
    return value;
  }

  // Creates an editor area and set default value to it.
  public create(): void {
    const container = this.container;
    const targetNode = utils.query(this.target);
    targetNode.hide();
    this.setValue(this.options.defaultValue);
    targetNode.after(container);
    this.focus();
    this.selection.synByBookmark();
    this.select();
    this.plugins.loadAll(this);
    this.history.save();
    this.event.emit('ready');
  }

  // Removes the editor.
  public remove(): void {
    this.container.remove();
    document.removeEventListener('selectionchange', this.selectionchangeListener);
    this.event.emit('remove');
  }
}
