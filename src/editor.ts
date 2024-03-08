import debounce from 'lodash/debounce';
import EventEmitter from 'eventemitter3';
import pkg from '../package.json';
import { NativeElement, NativeNode } from './types/native';
import { editors } from './storage/editors';
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

type OptionsType = {[key: string]: any};

const defaultOptions: OptionsType = {
  readonly: false,
  defaultValue: '<p><br /><focus /></p>',
  spellcheck: false,
  minChangeSize: 5,
};

export class Editor {
  public static version: string = pkg.version;

  public static box = new BoxManager();

  public static plugin = new Plugin();

  private options: OptionsType;

  private unsavedInputData: string;

  private beforeunloadListener: EventListener;

  private selectionchangeListener: EventListener;

  private clickListener: EventListener;

  private mouseoverListener: EventListener;

  public root: Nodes;

  public containerWrapper: Nodes;

  public container: Nodes;

  public overlayContainer: Nodes;

  public popupContainer: Nodes;

  public isComposing: boolean;

  public readonly: boolean;

  public event: EventEmitter;

  public selection: Selection;

  public command: Command;

  public history: History;

  public keystroke: Keystroke;

  public box: BoxManager;

  constructor(target: string | Nodes | NativeNode, options = defaultOptions) {
    this.root = query(target);
    this.options = options;
    this.containerWrapper = query('<div class="lake-container-wrapper" />');
    this.container = query('<div class="lake-container" />');
    this.overlayContainer = query('<div class="lake-overlay" />');
    this.popupContainer = query('<div class="lake-variables lake-popup" />');
    this.isComposing = false;

    this.root.addClass('lake-variables');
    this.setDefaultOptions();
    this.readonly = this.options.readonly;
    this.setContainerAttributes();

    this.event = new EventEmitter();
    this.selection = new Selection(this.container);
    this.command = new Command();
    this.history = new History(this.selection);
    this.keystroke = new Keystroke(this.container);
    this.box = Editor.box;

    this.unsavedInputData = '';

    editors.set(this.container.id, this);

    this.beforeunloadListener = () => {
      this.commitUnsavedInputData();
    };
    const updateBoxSelectionStyleHandler = debounce(() => {
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
            boxContainer.removeClass('lake-box-selected');
            boxContainer.addClass('lake-box-activated');
            return;
          }
        }
        if (clonedRange.intersectsNode(box.node)) {
          boxContainer.removeClass('lake-box-activated');
          boxContainer.addClass('lake-box-selected');
          return;
        }
        boxContainer.removeClass('lake-box-activated');
        boxContainer.removeClass('lake-box-selected');
      });
    }, 50, {
      leading: false,
      trailing: true,
      maxWait: 50,
    });
    this.selectionchangeListener = () => {
      this.selection.syncByRange();
      this.selection.appliedItems = this.selection.getAppliedItems();
      updateBoxSelectionStyleHandler();
      this.event.emit('selectionchange');
    };
    this.clickListener = event => {
      const targetNode = new Nodes(event.target as NativeElement);
      this.event.emit('click', targetNode);
    };
    this.mouseoverListener = event => {
      const targetNode = new Nodes(event.target as NativeElement);
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
      contenteditable: this.readonly ? 'false' : 'true',
      spellcheck: this.options.spellcheck ? 'true' : 'false',
    });
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
    this.container.on('compositionstart', () => {
      this.isComposing = true;
    });
    this.container.on('compositionend', () => {
      this.isComposing = false;
    });
    this.container.on('beforeinput', () => {
      const range = this.selection.range;
      if (range.isBoxLeft || range.isBoxRight) {
        this.commitUnsavedInputData();
      }
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
    this.command.event.on('beforeexecute', () => this.commitUnsavedInputData());
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
    Editor.box.renderAll(this);
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

  // Renders an editor area and set default value to it.
  public render(): void {
    const value = normalizeValue(this.options.defaultValue);
    const htmlParser = new HTMLParser(value);
    const fragment = htmlParser.getFragment();
    this.root.empty();
    this.root.append(this.containerWrapper);
    this.containerWrapper.append(this.container);
    this.containerWrapper.append(this.overlayContainer);
    this.container.append(fragment);
    query(document.body).append(this.popupContainer);
    if (!this.readonly) {
      this.focus();
      this.selection.synByBookmark();
      this.history.save();
    }
    Editor.plugin.loadAll(this);
    Editor.box.renderAll(this);
    if (!this.readonly) {
      window.addEventListener('beforeunload', this.beforeunloadListener);
      document.addEventListener('selectionchange', this.selectionchangeListener);
      this.bindInputEvents();
      this.bindHistoryEvents();
    }
    document.addEventListener('click', this.clickListener);
    document.addEventListener('mouseover', this.mouseoverListener);
  }

  // Destroys a rendered editor.
  public unmount(): void {
    this.root.empty();
    this.popupContainer.remove();
    if (!this.readonly) {
      window.removeEventListener('beforeunload', this.beforeunloadListener);
      document.removeEventListener('selectionchange', this.selectionchangeListener);
    }
    document.removeEventListener('click', this.clickListener);
    document.removeEventListener('mouseover', this.mouseoverListener);
  }
}
