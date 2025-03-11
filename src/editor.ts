import debounce from 'debounce';
import isEqual from 'fast-deep-equal/es6';
import EventEmitter from 'eventemitter3';
import { version } from '../package.json';
import { ContentRules } from './types/content-rules';
import { SelectionState } from './types/selection';
import { UnmountPlugin } from './types/plugin';
import { Locales, TranslationFunctions } from './i18n/types';
import { getInstanceMap } from './storage/box-instances';
import { editors } from './storage/editors';
import { getContentRules } from './config/content-rules';
import { denormalizeValue } from './utils/denormalize-value';
import { normalizeValue } from './utils/normalize-value';
import { query } from './utils/query';
import { getBox } from './utils/get-box';
import { scrollToNode } from './utils/scroll-to-node';
import { debug } from './utils/debug';
import { i18nObject } from './i18n';
import { Nodes } from './models/nodes';
import { HTMLParser } from './parsers/html-parser';
import { Selection } from './managers/selection';
import { Command } from './managers/command';
import { History } from './managers/history';
import { Keystroke } from './managers/keystroke';
import { BoxManager } from './managers/box-manager';
import { Plugin } from './managers/plugin';
import { Toolbar } from './ui/toolbar';

type OnMessage = (type: 'success' | 'error' | 'warning', message: string) => void;

interface Config {
  value: string;
  readonly: boolean;
  spellcheck: boolean;
  tabIndex: number;
  placeholder: string;
  indentWithTab: boolean;
  lang: string;
  contentRules: ContentRules;
  minChangeSize: number;
  historySize: number;
  onMessage: OnMessage;
  [name: string]: any;
}

interface EditorConfig extends Partial<Config> {
  root: string | Node | Nodes;
  toolbar?: Toolbar;
}

const defaultConfig: Config = {
  value: '<p><br /></p>',
  readonly: false,
  spellcheck: false,
  tabIndex: 0,
  placeholder: '',
  indentWithTab: true,
  lang: 'en-US',
  contentRules: getContentRules(),
  minChangeSize: 5,
  historySize: 100,
  onMessage: (type, message) => {
    if (type === 'success') {
      // eslint-disable-next-line no-console
      console.log(message);
      return;
    }
    if (type === 'warning') {
      console.warn(message);
      return;
    }
    if (type === 'error') {
      console.error(message);
    }
  },
  slash: false,
  mention: false,
};

/**
 * The Editor interface provides properties and methods for rendering and manipulating the editor.
 */
export class Editor {
  /**
   * A string that has not yet been saved to the history.
   */
  private unsavedInputData = '';

  /**
   * The number of input event calls before saving to the history.
   */
  private unsavedInputCount = 0;

  /**
   * The state of the current selection.
   */
  private state: SelectionState = {
    activeItems: [],
    disabledNameMap: new Map(),
    selectedNameMap: new Map(),
    selectedValuesMap: new Map(),
  };

  /**
   * The functions for unmounting plugins.
   */
  private unmountPluginMap = new Map<string, UnmountPlugin>();

  /**
   * The parent element of the container.
   */
  private readonly containerWrapper: Nodes;

  /**
   * The current version of Lake.
   */
  public static readonly version: string = version;

  /**
   * A BoxManager object that manages the box components.
   */
  public static readonly box = new BoxManager();

  /**
   * A Plugin object that manages a collection of plugins.
   */
  public static readonly plugin = new Plugin();

  /**
   * An element to which the editor is appended.
   */
  public readonly root: Nodes;

  /**
   * The toolbar for the editor.
   */
  public readonly toolbar: Toolbar | undefined;

  /**
   * The configuration for the editor.
   */
  public readonly config: Config;

  /**
   * A contenteditable element where users can edit the editor's content.
   */
  public readonly container: Nodes;

  /**
   * An element to which overlays are appended.
   */
  public readonly overlayContainer: Nodes;

  /**
   * An EventEmitter object used to set up events.
   */
  public readonly event: EventEmitter = new EventEmitter();

  /**
   * A Selection object representing the range of content selected by the user or the current position of the cursor.
   */
  public readonly selection: Selection;

  /**
   * A Command object managing all registered commands.
   */
  public readonly command: Command;

  /**
   * A History object that manages the undo and redo history.
   */
  public readonly history: History;

  /**
   * A Keystroke object that manages keyboard shortcuts.
   */
  public readonly keystroke: Keystroke;

  /**
   * A boolean value indicating whether the editor is in read-only mode.
   */
  public readonly readonly: boolean;

  /**
   * A boolean value indicating whether a user is entering a character using a text composition system such as an Input Method Editor (IME).
   */
  public isComposing = false;

  /**
   * A pop-up component which is currently displayed, such as LinkPopup, MentionMenu, and SlashMenu.
   */
  public popup: any = null;

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
    this.readonly = this.config.readonly;

    this.container.attr({
      contenteditable: this.readonly ? 'false' : 'true',
      spellcheck: this.config.spellcheck ? 'true' : 'false',
      tabindex: this.config.tabIndex.toString(),
      readonly: this.readonly ? 'true' : 'false',
    });
    if (this.config.placeholder !== '') {
      this.container.attr('placeholder', this.config.placeholder);
    }

    this.selection = new Selection(this.container);
    this.command = new Command(this.selection);
    this.history = new History(this.selection);
    this.history.limit = this.config.historySize;
    this.history.contentRules = this.config.contentRules;
    this.keystroke = new Keystroke(this.container);

    editors.set(this.container.id, this);
  }

  private copyListener: EventListener = event => {
    const range = this.selection.getCurrentRange();
    if (!this.container.contains(range.commonAncestor)) {
      return;
    }
    this.event.emit('copy', event);
  };

  private cutListener: EventListener = event => {
    const range = this.selection.getCurrentRange();
    if (!this.container.contains(range.commonAncestor)) {
      return;
    }
    this.event.emit('cut', event);
  };

  private pasteListener: EventListener = event => {
    const range = this.selection.getCurrentRange();
    if (!this.container.contains(range.commonAncestor)) {
      return;
    }
    this.event.emit('paste', event);
  };

  private selectionchangeListener: EventListener = () => {
    this.updateSelectionRange();
    this.updateBoxSelectionStyle();
    this.emitStateChangeEvent();
  };

  private clickListener: EventListener = event => {
    const targetNode = new Nodes(event.target as Element);
    if (!targetNode.get(0).isConnected) {
      return;
    }
    this.event.emit('click', targetNode);
  };

  private updateSelectionRange = debounce(() => {
    this.selection.updateByRange();
  }, 1, {
    immediate: true,
  });

  /**
   * Updates the classes of all boxes when the current selection is changed.
   */
  private updateBoxSelectionStyle = debounce(() => {
    // The editor has been unmounted.
    if (this.root.first().length === 0) {
      return;
    }
    const range = this.selection.getCurrentRange();
    const clonedRange = range.clone();
    clonedRange.adjustBox();
    this.container.find('lake-box').each(boxNativeNode => {
      const box = getBox(boxNativeNode);
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
          box.event.emit('focus');
          return;
        }
      }
      if (clonedRange.intersectsNode(box.node)) {
        boxContainer.removeClass('lake-box-activated');
        if (range.isCollapsed) {
          boxContainer.removeClass('lake-box-hovered');
          boxContainer.removeClass('lake-box-selected');
          boxContainer.addClass('lake-box-focused');
          box.event.emit('focus');
        } else {
          boxContainer.removeClass('lake-box-focused');
          boxContainer.addClass('lake-box-selected');
          box.event.emit('blur');
        }
        return;
      }
      boxContainer.removeClass('lake-box-activated');
      boxContainer.removeClass('lake-box-focused');
      boxContainer.removeClass('lake-box-selected');
      box.event.emit('blur');
    });
  }, 50, {
    immediate: true,
  });

  /**
   * Triggers the statechange event when the current selection is changed.
   */
  private emitStateChangeEvent = debounce(() => {
    const state = this.getState();
    if (isEqual(state, this.state)) {
      return;
    }
    if (this.toolbar) {
      this.toolbar.updateState(state);
    }
    this.event.emit('statechange', state);
    this.state = state;
  }, 50, {
    immediate: false,
  });

  /**
   * Adds or Removes a placeholder class.
   */
  private togglePlaceholderClass(value: string): void {
    value = denormalizeValue(value);
    const className = 'lake-placeholder';
    if (value.replace('<focus />', '') === '<p><br /></p>') {
      this.container.addClass(className);
    } else {
      this.container.removeClass(className);
    }
  }

  /**
   * Moves the input text from box strip to normal position.
   */
  private moveBoxStripText(): void {
    const selection = this.selection;
    const range = selection.range;
    const stripNode = range.startNode.closest('.lake-box-strip');
    const boxNode = stripNode.closest('lake-box');
    const box = getBox(boxNode);
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
      range.setStart(paragraph, 0);
      range.collapseToStart();
    }
    const text = stripNode.text();
    stripNode.html('<br />');
    selection.insertContents(document.createTextNode(text));
  }

  /**
   * Resets the value of "unsavedInputData" property.
   */
  private resetUnsavedInputData(): void {
    this.unsavedInputData = '';
    this.unsavedInputCount = 0;
  }

  /**
   * Handles input event.
   */
  private handleInputEvent(event: InputEvent | CompositionEvent): void {
    this.selection.updateByRange();
    const range = this.selection.range;
    if (range.isInsideBox) {
      return;
    }
    if (range.isBoxStart || range.isBoxEnd) {
      this.moveBoxStripText();
      this.history.save();
      return;
    }
    const inputType = event instanceof CompositionEvent ? 'insertText' : event.inputType;
    if (inputType === 'insertText') {
      const inputData = event.data ?? '';
      if (inputData.length > 1) {
        this.history.save({
          inputType: 'insertText',
          update: false,
        });
        return;
      }
      this.unsavedInputData += inputData;
      this.unsavedInputCount++;
      if (this.unsavedInputData.length < this.config.minChangeSize) {
        this.history.save({
          inputType: 'insertText',
          update: this.unsavedInputCount > 1,
        });
      } else {
        this.history.save({
          inputType: 'insertText',
          update: true,
        });
        this.resetUnsavedInputData();
      }
      return;
    }
    this.history.save();
  }

  /**
   * Binds events for inputting text.
   */
  private bindInputEvents(): void {
    this.container.on('compositionstart', () => {
      this.isComposing = true;
      this.container.removeClass('lake-placeholder');
    });
    this.container.on('compositionend', event => {
      this.isComposing = false;
      this.handleInputEvent(event as CompositionEvent);
    });
    this.container.on('input', event => {
      const inputEvent = event as InputEvent;
      this.isComposing = inputEvent.isComposing;
      if (this.isComposing) {
        return;
      }
      this.handleInputEvent(event as InputEvent);
    });
  }

  /**
   * Removes all unused box instances.
   */
  private removeBoxGarbage(): void {
    const instanceMap = getInstanceMap(this.container.id);
    for (const box of instanceMap.values()) {
      if (!box.node.get(0).isConnected) {
        box.unmount();
        instanceMap.delete(box.node.id);
      }
    }
  }

  /**
   * Binds events for history.
   */
  private bindHistoryEvents(): void {
    const executeCommonMethods = (value: string) => {
      if (this.fixContent()) {
        this.history.save({
          update: true,
          emitEvent: false,
        });
        value = this.getValue();
      }
      this.emitStateChangeEvent();
      this.togglePlaceholderClass(value);
      this.scrollToCursor();
      this.event.emit('change', value);
    };
    this.history.event.on('undo', value => {
      this.renderBoxes();
      executeCommonMethods(value);
      this.resetUnsavedInputData();
    });
    this.history.event.on('redo', value => {
      this.renderBoxes();
      executeCommonMethods(value);
      this.resetUnsavedInputData();
    });
    this.history.event.on('save', (value, options) => {
      this.removeBoxGarbage();
      executeCommonMethods(value);
      if (options.inputType !== 'insertText') {
        this.selection.sync();
        this.resetUnsavedInputData();
      }
    });
  }

  /**
   * Binds events for pointer.
   */
  private bindPointerEvents(): void {
    this.container.on('pointerdown', event => {
      const pointerEvent = event as PointerEvent;
      if (pointerEvent.target !== null && pointerEvent.target !== this.container.get(0)) {
        return;
      }
      const lastChild = this.container.last();
      if (lastChild.isTable || lastChild.isBlockBox) {
        const lastChildRect = (lastChild.get(0) as Element).getBoundingClientRect();
        if (pointerEvent.clientY > lastChildRect.bottom) {
          pointerEvent.preventDefault();
          const paragraph = query('<p><br /></p>');
          lastChild.after(paragraph);
          this.selection.range.shrinkBefore(paragraph);
          this.selection.sync();
        }
      }
    });
  }

  /**
   * Returns translation functions for the specified language.
   */
  public get locale(): TranslationFunctions {
    return i18nObject(this.config.lang as Locales);
  }

  /**
   * Sets the default config for the specified plugin.
   */
  public setPluginConfig(name: string, config: Record<string, any>): void {
    if (typeof this.config[name] !== 'object') {
      this.config[name] = {};
    }
    for (const key of Object.keys(config)) {
      if (this.config[name][key] === undefined) {
        this.config[name][key] = config[key];
      }
    }
  }

  /**
   * Fixes incorrect content, such as adding paragraphs for void elements or removing empty tags.
   */
  public fixContent(): boolean {
    const range = this.selection.range;
    const cellNode = range.commonAncestor.closest('td');
    const container = cellNode.length > 0 ? cellNode : this.container;
    let changed = false;
    let children = container.children();
    for (const child of children) {
      if ((child.isBlock || child.isMark) && child.html() === '') {
        child.remove();
        changed = true;
        debug(`Content fixed: empty tag "${child.name}" was removed`);
      }
    }
    children = container.children();
    if (children.length === 0) {
      container.html('<p><br /></p>');
      range.shrinkBefore(container);
      changed = true;
      debug('Content fixed: default paragraph was added');
    } else if (children.length === 1) {
      const child = children[0];
      if (child.isVoid) {
        const paragraph = query('<p />');
        child.before(paragraph);
        paragraph.append(child);
        range.shrinkAfter(paragraph);
        changed = true;
        debug(`Content fixed: void element "${child.name}" was wrapped in paragraph`);
      }
    }
    range.adjustBr();
    return changed;
  }

  /**
   * Renders all boxes that haven't been rendered yet.
   */
  public renderBoxes(): void {
    this.removeBoxGarbage();
    const container = this.container;
    const instanceMap = getInstanceMap(container.id);
    container.find('lake-box').each(boxNativeNode => {
      const boxNode = query(boxNativeNode);
      if (instanceMap.get(boxNode.id)) {
        return;
      }
      const box = getBox(boxNode);
      box.render();
    });
  }

  /**
   * Scrolls to the cursor.
   */
  public scrollToCursor(): void {
    const range = this.selection.range;
    if (range.isBox) {
      return;
    }
    // Creates an artificial cursor that is the same size as the cursor at the current cursor position.
    const rangeRect = range.getRect();
    if (rangeRect.x === 0 || rangeRect.y === 0) {
      return;
    }
    const containerRect = (this.container.get(0) as Element).getBoundingClientRect();
    const artificialCursor = query('<div class="lake-artificial-cursor" />');
    const left = rangeRect.x - containerRect.x;
    const top = rangeRect.y - containerRect.y;
    artificialCursor.css({
      position: 'absolute',
      top: `${top}px`,
      left: `${left}px`,
      width: `${rangeRect.width}px`,
      height: `${rangeRect.height}px`,
      // background: 'red',
      'z-index': '-1',
    });
    this.overlayContainer.find('.lake-artificial-cursor').remove();
    this.overlayContainer.append(artificialCursor);
    scrollToNode(artificialCursor, {
      behavior: 'instant',
      block: 'nearest',
      inline: 'nearest',
    });
    artificialCursor.remove();
  }

  /**
   * Checks whether the editor has focus.
   */
  public hasFocus(): boolean {
    const activeElement = document.activeElement;
    if (!activeElement) {
      return false;
    }
    return query(activeElement).closest('.lake-container').get(0) === this.container.get(0);
  }

  /**
   * Sets focus on the editor.
   */
  public focus(): void {
    const range = this.selection.range;
    if (this.container.contains(range.commonAncestor) && range.isBox) {
      return;
    }
    this.container.focus();
  }

  /**
   * Removes focus from the editor.
   */
  public blur(): void {
    this.container.blur();
  }

  /**
   * Returns the state of the current selection.
   */
  public getState(): SelectionState {
    const commandNames = this.command.getNames();
    let activeItems = this.selection.getActiveItems();
    if (activeItems.length > 0 && !this.container.contains(activeItems[0].node)) {
      activeItems = [];
    }
    const disabledNameMap = new Map<string, boolean>();
    const selectedNameMap = new Map<string, boolean>();
    const selectedValuesMap = new Map<string, string[]>();
    for (const name of commandNames) {
      const commandItem = this.command.getItem(name);
      if (commandItem.isDisabled && commandItem.isDisabled(activeItems)) {
        disabledNameMap.set(name, true);
      }
      if (commandItem.isSelected && commandItem.isSelected(activeItems)) {
        selectedNameMap.set(name, true);
      }
      if (activeItems.length > 0 && commandItem.selectedValues) {
        const values = commandItem.selectedValues(activeItems);
        if (values.length > 0) {
          selectedValuesMap.set(name, values);
        }
      }
    }
    return {
      activeItems,
      disabledNameMap,
      selectedNameMap,
      selectedValuesMap,
    };
  }

  /**
   * Sets the specified content to the editor.
   */
  public setValue(value: string): void {
    value = normalizeValue(value);
    const htmlParser = new HTMLParser(value, this.config.contentRules);
    const fragment = htmlParser.getFragment();
    this.container.empty();
    this.togglePlaceholderClass(htmlParser.getHTML());
    this.container.append(fragment);
    this.renderBoxes();
    this.selection.updateByBookmark();
  }

  /**
   * Returns the editor's content.
   */
  public getValue(): string {
    const item = this.history.cloneContainer();
    let value = new HTMLParser(item, this.config.contentRules).getHTML();
    value = denormalizeValue(value);
    return value;
  }

  /**
   * Renders an editing area and sets default content to it.
   */
  public render(): void {
    const value = normalizeValue(this.config.value);
    const htmlParser = new HTMLParser(value, this.config.contentRules);
    const fragment = htmlParser.getFragment();
    this.root.empty();
    this.root.append(this.containerWrapper);
    this.containerWrapper.append(this.container);
    this.containerWrapper.append(this.overlayContainer);
    this.togglePlaceholderClass(htmlParser.getHTML());
    this.container.append(fragment);
    this.unmountPluginMap = Editor.plugin.loadAll(this);
    if (!this.readonly) {
      this.selection.updateByBookmark();
      this.history.save({
        emitEvent: false,
      });
    }
    this.renderBoxes();
    if (this.toolbar) {
      this.toolbar.render(this);
      const state = this.getState();
      this.toolbar.updateState(state);
    }
    document.addEventListener('copy', this.copyListener);
    if (!this.readonly) {
      document.addEventListener('cut', this.cutListener);
      document.addEventListener('paste', this.pasteListener);
      document.addEventListener('selectionchange', this.selectionchangeListener);
      document.addEventListener('click', this.clickListener);
      this.bindInputEvents();
      this.bindHistoryEvents();
      this.bindPointerEvents();
    }
  }

  /**
   * Destroys the editor.
   */
  public unmount(): void {
    // Executes delayed executions immediately.
    this.updateSelectionRange.flush();
    this.updateBoxSelectionStyle.flush();
    this.emitStateChangeEvent.flush();
    for (const name of this.unmountPluginMap.keys()) {
      const unmountPlugin = this.unmountPluginMap.get(name);
      if (unmountPlugin) {
        unmountPlugin();
        debug(`Plugin "${name}" unmounted`);
      }
    }
    if (this.toolbar) {
      this.toolbar.unmount();
    }
    this.removeBoxGarbage();
    this.container.find('lake-box').each(boxNativeNode => {
      const boxNode = query(boxNativeNode);
      const box = getBox(boxNode);
      box.unmount();
    });
    this.event.removeAllListeners();
    this.history.event.removeAllListeners();
    this.root.off();
    this.root.empty();
    document.removeEventListener('copy', this.copyListener);
    if (!this.readonly) {
      document.removeEventListener('cut', this.cutListener);
      document.removeEventListener('paste', this.pasteListener);
      document.removeEventListener('selectionchange', this.selectionchangeListener);
      document.removeEventListener('click', this.clickListener);
    }
  }
}
