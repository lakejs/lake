import EventEmitter from 'eventemitter3';
import pkg from '../package.json';
import { NativeElement } from './types/native';
import * as utils from './utils';
import * as models from './models';
import * as operations from './operations';

import heading from './plugins/heading';

const { query, forEach } = utils;
const { Selection } = models;

type TargetType = string | NativeElement;

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

  static operations = operations;

  private target: TargetType;

  private options: OptionsType;

  private container: models.Nodes;

  public event: EventEmitter;

  public selection: models.Selection;

  public commands: models.Commands;

  public plugins: models.Plugins;

  constructor(target: string | NativeElement, options?: OptionsType) {
    this.target = target;
    this.options = options || defaultOptions;
    this.container = query('<div />');

    this.setDefaultOptions();
    this.addContainerAttributes();

    this.event = new EventEmitter();
    this.selection = new Selection(this.container);
    this.commands = new models.Commands();
    this.plugins = new models.Plugins();

    this.addBuiltInPlugins();

    this.container.on('blur', () => {
      this.selection.updateBySelectedRange();
    });
  }

  private setDefaultOptions(): void {
    forEach(defaultOptions, (key, value) => {
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
    this.container.html(utils.normalizeValue(value));
  }

  // Creates an editor area and set default value to it.
  public create(): void {
    const container = this.container;
    const targetNode = query(this.target);
    targetNode.hide();
    this.setValue(this.options.defaultValue);
    targetNode.after(container);
    this.focus();
    this.selection.updateByBookmark();
    this.select();
    this.plugins.runAll(this);
    this.event.emit('create');
  }
}
