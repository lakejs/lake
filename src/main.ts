import EventEmitter from 'eventemitter3';
import pkg from '../package.json';
import { NativeNode } from './types/native';
import * as utils from './utils';
import * as models from './models';
import heading from './plugins/heading';
import blockquote from './plugins/blockquote';
import bold from './plugins/bold';
import italic from './plugins/italic';
import underline from './plugins/underline';
import strikethrough from './plugins/strikethrough';
import subscript from './plugins/subscript';
import superscript from './plugins/superscript';
import code from './plugins/code';
import fontfamily from './plugins/fontfamily';

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

  private container: models.Nodes;

  public event: EventEmitter;

  public selection: models.Selection;

  public commands: models.Commands;

  public keystroke: models.Keystroke;

  public plugins: models.Plugins;

  constructor(target: string | NativeNode, options?: OptionsType) {
    this.target = target;
    this.options = options || defaultOptions;
    this.container = utils.query('<div />');

    this.setDefaultOptions();
    this.addContainerAttributes();

    this.event = new EventEmitter();
    this.selection = new models.Selection(this.container);
    this.commands = new models.Commands();
    this.keystroke = new models.Keystroke(this.container);
    this.plugins = new models.Plugins();

    this.addBuiltInPlugins();

    this.container.on('blur', () => {
      this.selection.syncByRange();
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
    plugins.add(heading);
    plugins.add(blockquote);
    plugins.add(bold);
    plugins.add(italic);
    plugins.add(underline);
    plugins.add(strikethrough);
    plugins.add(subscript);
    plugins.add(superscript);
    plugins.add(code);
    plugins.add(fontfamily);
  }

  // Selects the saved range in the selection.
  public select(): void {
    this.selection.select();
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
    this.selection.insertBookmark();
    const value = utils.denormalizeValue(this.container.html());
    this.selection.synByBookmark();
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
    this.event.emit('ready');
  }

  // Removes the editor.
  public remove(): void {
    this.container.remove();
    this.event.emit('remove');
  }
}
