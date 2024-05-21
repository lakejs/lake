import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import EventEmitter from 'eventemitter3';
import { version } from '../package.json';
import { NativeNode } from './types/native';
import { SelectionState } from './types/object';
import { Locales, TranslationFunctions } from './i18n/types';
import { editors } from './storage/editors';
import { denormalizeValue, normalizeValue, query, getBox, debug } from './utils';
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

type MessageCallback = (type: 'success' | 'error' | 'warning', message: string) => void;

type Config = {
  value: string;
  readonly: boolean;
  spellcheck: boolean;
  tabIndex: number;
  placeholder: string;
  indentWithTab: boolean;
  lang: string;
  minChangeSize: number;
  onMessage: MessageCallback;
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
  onMessage?: MessageCallback;
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
  onMessage: (type, message) => {
    if (type === 'success') {
      // eslint-disable-next-line no-console
      console.log(message);
      return;
    }
    if (type === 'warning') {
      // eslint-disable-next-line no-console
      console.warn(message);
      return;
    }
    if (type === 'error') {
      // eslint-disable-next-line no-console
      console.error(message);
    }
  },
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

  private copyListener: EventListener = event => {
    const range = this.selection.range;
    if (range.commonAncestor.closestContainer().get(0) !== this.container.get(0)) {
      return;
    }
    this.event.emit('copy', event);
  };

  private cutListener: EventListener = event => {
    const range = this.selection.range;
    if (range.commonAncestor.closestContainer().get(0) !== this.container.get(0)) {
      return;
    }
    this.event.emit('cut', event);
  };

  private pasteListener: EventListener = event => {
    const range = this.selection.range;
    if (range.commonAncestor.closestContainer().get(0) !== this.container.get(0)) {
      return;
    }
    this.event.emit('paste', event);
  };

  private beforeunloadListener: EventListener = () => {
    this.history.save();
  };

  private selectionchangeListener: EventListener = () => {
    this.selection.updateByRange();
    this.updateBoxSelectionStyle();
    this.emitStateChangeEvent();
  };

  private clickListener: EventListener = event => {
    const targetNode = new Nodes(event.target as Element);
    if (!targetNode.get(0).isConnected || targetNode.closest('.lake-popup').length > 0) {
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
    this.scrollToCaret();
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
      this.box.renderAll(this.container);
      this.emitChangeEvent(value);
    });
    this.history.event.on('redo', value => {
      this.box.renderAll(this.container);
      this.emitChangeEvent(value);
    });
    this.history.event.on('save', value => {
      this.box.rectifyInstances(this.container);
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

  // Scrolls to the caret or the range of the selection.
  public scrollToCaret(): void {
    // Creates an artificial caret that is the same size as the caret at the current caret position.
    const rangeRect = this.selection.range.getRect();
    const containerRect = (this.container.get(0) as Element).getBoundingClientRect();
    const artificialCaret = query('<div class="lake-artificial-caret" />');
    const left = rangeRect.x - containerRect.x;
    const top = rangeRect.y - containerRect.y;
    artificialCaret.css({
      position: 'absolute',
      top: `${top}px`,
      left: `${left}px`,
      width: `${rangeRect.width}px`,
      height: `${rangeRect.height}px`,
      // background: 'red',
      'z-index': '-1',
    });
    this.overlayContainer.find('.lake-artificial-caret').remove();
    this.overlayContainer.append(artificialCaret);
    // Scrolls the artificial caret element into the visible area of the browser window
    // if it's not already within the visible area of the browser window.
    // If the element is already within the visible area of the browser window, then no scrolling takes place.
    let scrollX: number;
    let scrollY: number;
    let viewportWidth: number;
    let viewportHeight: number;
    const viewport = this.container.closestScroller();
    if (viewport.length > 0) {
      const nativeViewport = viewport.get(0) as Element;
      const viewportRect = nativeViewport.getBoundingClientRect();
      scrollX = nativeViewport.scrollLeft;
      scrollY = nativeViewport.scrollTop;
      viewportWidth = viewportRect.width;
      viewportHeight = viewportRect.height;
    } else {
      const nativeContainerWrapper = this.containerWrapper.get(0) as HTMLElement;
      scrollX = window.scrollX;
      scrollY = window.scrollY;
      viewportWidth = window.innerWidth - nativeContainerWrapper.offsetLeft;
      viewportHeight = window.innerHeight - nativeContainerWrapper.offsetTop;
    }
    let needScroll = false;
    let alignToTop = true;
    if (left < scrollX || left > scrollX + viewportWidth) {
      needScroll = true;
    }
    if (top < scrollY) {
      needScroll = true;
      alignToTop = true;
    } else if (top > scrollY + viewportHeight) {
      needScroll = true;
      alignToTop = false;
    }
    if (needScroll) {
      (artificialCaret.get(0) as Element).scrollIntoView(alignToTop);
    }
    artificialCaret.remove();
  }

  // Sets the specified HTML string to the editor area.
  public setValue(value: string): void {
    value = normalizeValue(value);
    const htmlParser = new HTMLParser(value);
    const fragment = htmlParser.getFragment();
    this.container.empty();
    this.togglePlaceholderClass(htmlParser.getHTML());
    this.container.append(fragment);
    Editor.box.renderAll(this.container);
    this.selection.updateByBookmark();
  }

  // Returns the contents from the editor.
  public getValue(): string {
    const bookmark = this.selection.insertBookmark();
    let value = new HTMLParser(this.container).getHTML();
    value = denormalizeValue(value);
    this.selection.toBookmark(bookmark);
    return value;
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
      this.selection.updateByBookmark();
      this.history.save();
    }
    Editor.box.renderAll(this.container);
    if (this.toolbar) {
      this.toolbar.render(this);
    }
    document.addEventListener('copy', this.copyListener);
    if (!this.readonly) {
      document.addEventListener('cut', this.cutListener);
      document.addEventListener('paste', this.pasteListener);
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
    this.event.removeAllListeners();
    this.command.event.removeAllListeners();
    this.history.event.removeAllListeners();
    this.root.empty();
    this.popupContainer.remove();
    document.removeEventListener('copy', this.copyListener);
    if (!this.readonly) {
      document.removeEventListener('cut', this.cutListener);
      document.removeEventListener('paste', this.pasteListener);
      window.removeEventListener('beforeunload', this.beforeunloadListener);
      document.removeEventListener('selectionchange', this.selectionchangeListener);
      document.removeEventListener('click', this.clickListener);
      window.removeEventListener('resize', this.resizeListener);
    }
  }
}
