import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import EventEmitter from 'eventemitter3';
import { version } from '../package.json';
import { NativeNode } from './types/native';
import { SelectionState } from './types/object';
import { Locales, TranslationFunctions } from './i18n/types';
import { editors } from './storage/editors';
import { denormalizeValue, normalizeValue, query, debug } from './utils';
import { i18nObject } from './i18n';
import { Nodes } from './models/nodes';
import { Box } from './models/box';
import { HTMLParser } from './parsers/html-parser';
import { insertBox } from './operations/insert-box';
import { removeBox } from './operations/remove-box';
import { Selection } from './managers/selection';
import { Command } from './managers/command';
import { History } from './managers/history';
import { Keystroke } from './managers/keystroke';
import { BoxManager } from './managers/box-manager';
import { Plugin } from './managers/plugin';
import { Toolbar } from './ui/toolbar';

type Config = {
  value: string;
  readonly: boolean;
  spellcheck: boolean;
  tabIndex: number;
  placeholder: string;
  indentWithTab: boolean;
  lang: string;
  minChangeSize: number;
  [name: string]: any;
};

type EditorConfig = {
  root: string | Nodes | NativeNode;
  toolbar?: Toolbar;
  value?: string;
  readonly?: boolean;
  spellcheck?: boolean;
  tabIndex?: number;
  placeholder?: string;
  indentWithTab?: boolean;
  lang?: string;
  minChangeSize?: number;
  [name: string]: any;
};

const defaultConfig: Config = {
  value: '<p><br /></p>',
  readonly: false,
  spellcheck: false,
  tabIndex: 0,
  placeholder: '',
  indentWithTab: true,
  lang: 'en-US',
  minChangeSize: 5,
};

export class Editor {
  public static version: string = version;

  public static box = new BoxManager();

  public static plugin = new Plugin();

  private unsavedInputData: string = '';

  private state: SelectionState = {
    appliedItems: [],
    disabledNameMap: new Map(),
    selectedNameMap: new Map(),
    selectedValuesMap: new Map(),
  };

  public root: Nodes;

  public toolbar: Toolbar | undefined;

  public config: Config;

  public containerWrapper: Nodes;

  public container: Nodes;

  public overlayContainer: Nodes;

  public popupContainer: Nodes;

  public isComposing: boolean = false;

  public readonly: boolean;

  public event: EventEmitter = new EventEmitter();

  public selection: Selection;

  public command: Command;

  public history: History;

  public keystroke: Keystroke;

  public box: BoxManager = Editor.box;

  constructor(config: EditorConfig) {
    if (!config.root) {
      throw new Error('The root of the config must be specified.');
    }
    this.root = query(config.root);
    this.toolbar = config.toolbar;
    this.config = { ...defaultConfig };
    for (const key of Object.keys(config)) {
      this.config[key] = config[key];
    }
    this.containerWrapper = query('<div class="lake-container-wrapper" />');
    this.container = query('<div class="lake-container" />');
    this.overlayContainer = query('<div class="lake-overlay" />');
    this.popupContainer = query('<div class="lake-popup lake-custom-properties" />');
    this.readonly = this.config.readonly;

    this.root.addClass('lake-custom-properties');
    this.container.attr({
      contenteditable: this.readonly ? 'false' : 'true',
      spellcheck: this.config.spellcheck ? 'true' : 'false',
      tabindex: this.config.tabIndex.toString(),
    });
    if (this.config.placeholder !== '') {
      this.container.attr('placeholder', this.config.placeholder);
    }

    this.selection = new Selection(this.container);
    this.command = new Command(this.selection);
    this.history = new History(this.selection);
    this.keystroke = new Keystroke(this.container);

    editors.set(this.container.id, this);
  }

  private beforeunloadListener: EventListener = () => {
    this.history.save();
  };

  private selectionchangeListener: EventListener = () => {
    this.selection.syncByRange();
    this.updateBoxSelectionStyle();
    this.emitStateChangeEvent();
  };

  private clickListener: EventListener = event => {
    const targetNode = new Nodes(event.target as Element);
    if (targetNode.closest('.lake-popup').length > 0) {
      return;
    }
    this.event.emit('click', targetNode);
  };

  private resizeListener: EventListener = () => {
    this.event.emit('resize');
  };

  private updateBoxSelectionStyle = debounce(() => {
    // The editor has been unmounted.
    if (this.root.first().length === 0) {
      return;
    }
    const range = this.selection.range;
    const clonedRange = range.clone();
    clonedRange.adaptBox();
    this.box.findAll(this).each(boxNode => {
      const box = new Box(boxNode);
      const boxContainer = box.getContainer();
      if (boxContainer.length === 0) {
        return;
      }
      if (range.compareBeforeNode(boxContainer) < 0 && range.compareAfterNode(boxContainer) > 0) {
        if (!(range.isCollapsed && range.startNode.get(0) === boxContainer.get(0) && range.startOffset === 0)) {
          boxContainer.removeClass('lake-box-hovered');
          boxContainer.removeClass('lake-box-selected');
          boxContainer.removeClass('lake-box-focused');
          boxContainer.addClass('lake-box-activated');
          return;
        }
      }
      if (clonedRange.intersectsNode(box.node)) {
        boxContainer.removeClass('lake-box-activated');
        if (range.isCollapsed) {
          boxContainer.removeClass('lake-box-hovered');
          boxContainer.removeClass('lake-box-selected');
          boxContainer.addClass('lake-box-focused');
        } else {
          boxContainer.removeClass('lake-box-focused');
          boxContainer.addClass('lake-box-selected');
        }
        return;
      }
      boxContainer.removeClass('lake-box-activated');
      boxContainer.removeClass('lake-box-focused');
      boxContainer.removeClass('lake-box-selected');
    });
    this.event.emit('boxselectionstylechange');
  }, 50, {
    leading: false,
    trailing: true,
    maxWait: 50,
  });

  private emitStateChangeEvent = debounce(() => {
    const commandNames = this.command.getNames();
    let appliedItems = this.selection.getAppliedItems();
    if (
      appliedItems.length > 0 &&
      appliedItems[0].node.closestContainer().get(0) !== this.container.get(0)
    ) {
      appliedItems = [];
    }
    const disabledNameMap: Map<string, boolean> = new Map();
    const selectedNameMap: Map<string, boolean> = new Map();
    const selectedValuesMap: Map<string, string[]> = new Map();
    if (appliedItems.length > 0) {
      for (const name of commandNames) {
        const commandItem = this.command.getItem(name);
        if (commandItem.isDisabled && commandItem.isDisabled(appliedItems)) {
          disabledNameMap.set(name, true);
        }
        if (commandItem.isSelected && commandItem.isSelected(appliedItems)) {
          selectedNameMap.set(name, true);
        }
        if (commandItem.selectedValues) {
          const values = commandItem.selectedValues(appliedItems);
          if (values.length > 0) {
            selectedValuesMap.set(name, values);
          }
        }
      }
    }
    const state: SelectionState = {
      appliedItems,
      disabledNameMap,
      selectedNameMap,
      selectedValuesMap,
    };
    if (isEqual(state, this.state)) {
      return;
    }
    if (this.toolbar) {
      this.toolbar.updateState(state);
    }
    this.event.emit('statechange', state);
    this.state = state;
  }, 100, {
    leading: false,
    trailing: true,
    maxWait: 100,
  });

  private emitChangeEvent = (value: string) => {
    this.rectifyContent();
    this.emitStateChangeEvent();
    this.togglePlaceholderClass(value);
    this.event.emit('change', value);
  };

  private togglePlaceholderClass(value: string) {
    value = denormalizeValue(value);
    const className = 'lake-show-placeholder';
    if (value.replace('<focus />', '') === '<p><br /></p>') {
      this.container.addClass(className);
    } else {
      this.container.removeClass(className);
    }
  }

  private inputInBoxStrip(): void {
    const selection = this.selection;
    const range = selection.range;
    const stripNode = range.startNode.closest('.lake-box-strip');
    const boxNode = stripNode.closest('lake-box');
    const box = new Box(boxNode);
    if (box.type === 'inline') {
      if (range.isBoxStart) {
        range.setStartBefore(boxNode);
        range.collapseToStart();
      } else {
        range.setStartAfter(boxNode);
        range.collapseToStart();
      }
    } else {
      const paragraph = query('<p />');
      if (range.isBoxStart) {
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
    this.container.on('compositionstart', () => {
      this.isComposing = true;
    });
    this.container.on('compositionend', () => {
      this.isComposing = false;
    });
    this.container.on('beforeinput', event => {
      const inputEvent = event as InputEvent;
      const range = this.selection.range;
      if (range.isBoxStart || range.isBoxEnd) {
        this.commitUnsavedInputData();
        return;
      }
      if (
        inputEvent.inputType === 'insertText' ||
        inputEvent.inputType === 'insertCompositionText'
      ) {
        return;
      }
      this.commitUnsavedInputData();
    });
    this.container.on('input', event => {
      const inputEvent = event as InputEvent;
      // Here setTimeout is necessary because isComposing is not false after ending composition.
      window.setTimeout(() => {
        const range = this.selection.range;
        if (range.isInsideBox) {
          return;
        }
        // isComposing is false after ending composition because compositionend event has been emitted.
        if (this.isComposing) {
          this.event.emit('input', inputEvent);
          return;
        }
        if (range.isBoxStart || range.isBoxEnd) {
          this.inputInBoxStrip();
          this.history.save();
          this.event.emit('input', inputEvent);
          return;
        }
        if (
          inputEvent.inputType === 'insertText' ||
          inputEvent.inputType === 'insertCompositionText'
        ) {
          this.unsavedInputData += inputEvent.data ?? '';
          if (this.unsavedInputData.length < this.config.minChangeSize) {
            this.event.emit('input', inputEvent);
            this.emitChangeEvent(this.getValue());
            return;
          }
        }
        this.history.save();
        this.event.emit('input', inputEvent);
      }, 0);
    });
    this.command.event.on('beforeexecute', () => this.commitUnsavedInputData());
  }

  private bindHistoryEvents(): void {
    this.history.event.on('undo', value => {
      this.box.renderAll(this);
      this.emitChangeEvent(value);
    });
    this.history.event.on('redo', value => {
      this.box.renderAll(this);
      this.emitChangeEvent(value);
    });
    this.history.event.on('save', value => {
      this.box.rectifyInstances(this);
      this.emitChangeEvent(value);
    });
  }

  // Returns a boolean value indicating whether the editor has focus.
  public get hasFocus(): boolean {
    const activeElement = document.activeElement;
    if (!activeElement) {
      return false;
    }
    return query(activeElement).closest('.lake-container').get(0) === this.container.get(0);
  }

  // Returns translation functions by the specified lang.
  public get locale(): TranslationFunctions {
    return i18nObject(this.config.lang as Locales);
  }

  // Fixes wrong content, especially empty tag.
  public rectifyContent(): void {
    let children = this.container.children();
    for (const child of children) {
      if ((child.isBlock || child.isMark) && child.html() === '') {
        child.remove();
        debug('Rectifying content: empty tag was removed');
      }
    }
    children = this.container.children();
    if (children.length === 0) {
      this.container.html('<p><br /></p>');
      this.selection.range.shrinkAfter(this.container);
      debug('Rectifying content: default paragraph was added');
      return;
    }
    if (children.length === 1) {
      const child = children[0];
      if (child.isVoid) {
        const paragraph = query('<p />');
        child.before(paragraph);
        paragraph.append(child);
        this.selection.range.shrinkAfter(paragraph);
        debug('Rectifying content: void element was wrapped in paragraph');
      }
    }
  }

  // Saves the input data which is unsaved.
  public commitUnsavedInputData(): void {
    if (this.unsavedInputData.length > 0) {
      this.history.save(false);
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

  // Sets default config for a plugin.
  public setPluginConfig(pluginName: string, pluginConfig: {[key: string]: any}): void {
    if (!this.config[pluginName]) {
      this.config[pluginName] = {};
    }
    for (const key of Object.keys(pluginConfig)) {
      if (this.config[pluginName][key] === undefined) {
        this.config[pluginName][key] = pluginConfig[key];
      }
    }
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
  public setValue(value: string): void {
    value = normalizeValue(value);
    const htmlParser = new HTMLParser(value);
    const fragment = htmlParser.getFragment();
    this.container.empty();
    this.togglePlaceholderClass(htmlParser.getHTML());
    this.container.append(fragment);
    Editor.box.renderAll(this);
    this.selection.synByBookmark();
  }

  // Returns the contents from the editor.
  public getValue(): string {
    const bookmark = this.selection.insertBookmark();
    let value = new HTMLParser(this.container).getHTML();
    value = denormalizeValue(value);
    this.selection.toBookmark(bookmark);
    return value;
  }

  // Inserts a box into the position of the selection.
  public insertBox(
    boxName: Parameters<typeof insertBox>[1],
    boxValue?: Parameters<typeof insertBox>[2],
  ): Box {
    const box = insertBox(this.selection.range, boxName, boxValue);
    if (!box) {
      throw new Error(`Box '${boxName}' cannot be inserted outside the editor.`);
    }
    const instanceMap = this.box.getInstances(this);
    instanceMap.set(box.node.id, box);
    return box;
  }

  // Removes the selected box.
  public removeBox(): ReturnType<typeof removeBox> {
    const box = removeBox(this.selection.range);
    if (box) {
      const instanceMap = this.box.getInstances(this);
      instanceMap.delete(box.node.id);
    }
    return box;
  }

  // Renders an editor area and set default value to it.
  public render(): void {
    const value = normalizeValue(this.config.value);
    const htmlParser = new HTMLParser(value);
    const fragment = htmlParser.getFragment();
    this.root.empty();
    this.root.append(this.containerWrapper);
    this.containerWrapper.append(this.container);
    this.containerWrapper.append(this.overlayContainer);
    query(document.body).append(this.popupContainer);
    this.togglePlaceholderClass(htmlParser.getHTML());
    this.container.append(fragment);
    Editor.plugin.loadAll(this);
    if (!this.readonly) {
      this.selection.synByBookmark();
      this.history.save();
    }
    Editor.box.renderAll(this);
    if (this.toolbar) {
      this.toolbar.render(this);
    }
    if (!this.readonly) {
      window.addEventListener('beforeunload', this.beforeunloadListener);
      document.addEventListener('selectionchange', this.selectionchangeListener);
      document.addEventListener('click', this.clickListener);
      window.addEventListener('resize', this.resizeListener);
      this.bindInputEvents();
      this.bindHistoryEvents();
    }
  }

  // Destroys a rendered editor.
  public unmount(): void {
    this.root.empty();
    this.popupContainer.remove();
    if (!this.readonly) {
      window.removeEventListener('beforeunload', this.beforeunloadListener);
      document.removeEventListener('selectionchange', this.selectionchangeListener);
      document.removeEventListener('click', this.clickListener);
      window.removeEventListener('resize', this.resizeListener);
    }
  }
}
