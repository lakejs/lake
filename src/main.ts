import EventEmitter from 'eventemitter3';
import pkg from '../package.json';
import { NativeElement } from './types/native';
import * as utils from './utils';
import * as models from './models';

import heading from './plugins/heading';

const { query, forEach } = utils;
const { Selection } = models;

type TargetType = string | NativeElement;

type OptionsType = {[key: string]: any};

const containerClassName = 'lake-editor-container';

const defaultOptions: OptionsType = {
  className: '',
  defaultValue: '<p><anchor />foo<focus />bar</p>',
};

export default class LakeCore {
  static version: string = pkg.version;

  static utils = utils;

  static models = models;

  private target: TargetType;

  private container: models.Nodes;

  private options: OptionsType;

  public range: models.Range;

  public selection: models.Selection;

  public event: EventEmitter;

  public commands: models.Commands;

  public plugins: models.Plugins;

  constructor(target: string | NativeElement, options?: OptionsType) {
    this.target = target;
    this.options = options || defaultOptions;
    this.container = query('<div />');

    this.setDefaultOptions();
    this.addContainerAttributes();

    this.event = new EventEmitter();
    this.selection = new Selection();
    this.range = this.selection.getRange();
    this.commands = new models.Commands();
    this.plugins = new models.Plugins();

    this.addBuiltInPlugins();

    this.container.on('blur', () => {
      this.range = this.selection.getRange();
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

  private normalizeCursorTags(value: string): string {
    return value.
      replace(/<anchor\s*\/>/ig, '<bookmark type="anchor"></bookmark>').
      replace(/<focus\s*\/>/ig, '<bookmark type="focus"></bookmark>');
  }

  private setRangeByCursorTags(): void {
    const container = this.container;
    const anchorNode = container.find('bookmark[type="anchor"]');
    const focusNode = container.find('bookmark[type="focus"]');
    if (anchorNode.length > 0) {
      this.range.setStartAfter(anchorNode);
      anchorNode.remove();
    }
    if (focusNode.length > 0) {
      this.range.setEndAfter(focusNode);
      focusNode.remove();
    }
  }

  public focus(): void {
    if (this.selection.getRange().get() !== this.range.get()) {
      this.selection.addRange(this.range);
    }
    this.container.focus();
  }

  public create(): void {
    const container = this.container;
    const targetNode = query(this.target);
    targetNode.hide();
    const defaultValue = this.options.defaultValue;
    container.html(this.normalizeCursorTags(defaultValue));
    targetNode.after(container);
    this.setRangeByCursorTags();
    this.focus();
    this.plugins.runAll(this);
    this.event.emit('create');
  }
}
