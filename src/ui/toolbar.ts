import debounce from 'lodash/debounce';
import EventEmitter from 'eventemitter3';
import type { Editor } from '../editor';
import { NativeNode } from '../types/native';
import { ToolbarButtonItem, ToolbarDropdownItem, ToolbarUploadItem, ToolbarItem } from '../types/toolbar';
import { toolbarItems } from '../config/toolbar-items';
import { safeTemplate } from '../utils/safe-template';
import { query } from '../utils/query';
import { Nodes } from '../models/nodes';
import { Button } from './button';
import { Dropdown } from './dropdown';
import { uploadImage } from './upload';

const defaultItems: string[] = [
  'undo',
  'redo',
  '|',
  'heading',
  'fontSize',
  '|',
  'formatPainter',
  'removeFormat',
  'bold',
  'moreStyle',
  '|',
  'fontColor',
  'highlight',
  '|',
  'align',
  'list',
  'indent',
  'link',
  'blockQuote',
  'hr',
];

type ToolbarConfig = {
  editor: Editor;
  root: string | Nodes | NativeNode;
  items?: (string | ToolbarItem)[];
};

const toolbarItemMap: Map<string, ToolbarItem> = new Map();

toolbarItems.forEach(item => {
  toolbarItemMap.set(item.name, item);
});

export class Toolbar {

  private items: (string | ToolbarItem)[];

  public editor: Editor;

  public root: Nodes;

  public container: Nodes;

  public event: EventEmitter;

  constructor(config: ToolbarConfig) {
    this.items = config.items || defaultItems;
    this.editor = config.editor;
    this.root = query(config.root);
    this.container = query('<div class="lake-toolbar" />');
    this.event = new EventEmitter();

    this.root.addClass('lake-custom-properties');
  }

  private appendDivider(): void {
    this.container.append('<div class="lake-toolbar-divider" />');
  }

  private appendButton(item: ToolbarButtonItem): void {
    const editor = this.editor;
    const button = new Button({
      root: this.container,
      name: item.name,
      icon: item.icon,
      tooltip: item.tooltip,
      onClick: () => {
        editor.focus();
        item.onClick(editor, item.name);
      },
    });
    button.render();
  }

  private appendDropdown(item: ToolbarDropdownItem) {
    const editor = this.editor;
    const dropdown = new Dropdown({
      root: this.container,
      name: item.name,
      icon: item.icon,
      accentIcon: item.accentIcon,
      downIcon: item.downIcon,
      defaultValue: item.defaultValue,
      tooltip:item.tooltip,
      width: item.width,
      menuType: item.menuType,
      menuItems: item.menuItems,
      hasDocumentClick: false,
      onSelect: value => {
        editor.focus();
        item.onSelect(editor, value);
      },
    });
    dropdown.render();
    const titleNode = dropdown.node.find('.lake-dropdown-title');
    const menuNode = dropdown.node.find('.lake-dropdown-menu');
    editor.event.on('click', target => {
      if (target.closest('.lake-dropdown-title').get(0) === titleNode.get(0)) {
        return;
      }
      menuNode.hide();
    });
  }

  private appendUpload(item: ToolbarUploadItem): void {
    const editor = this.editor;
    const uploadNode = query(safeTemplate`
      <div class="lake-upload" name="${item.name}">
        <input type="file" />
      </div>
    `);
    const fileNode = uploadNode.find('input[type="file"]');
    const fileNativeNode = fileNode.get(0) as HTMLInputElement;
    if (item.accept) {
      fileNode.attr('accept', item.accept);
    }
    if (item.multiple === true) {
      fileNode.attr('multiple', 'true');
    }
    const button = new Button({
      root: uploadNode,
      name: item.name,
      icon: item.icon,
      tooltip: item.tooltip,
      onClick: () => {
        fileNativeNode.click();
      },
    });
    button.render();
    this.container.append(uploadNode);
    fileNode.on('click', event => event.stopPropagation());
    fileNode.on('change', event => {
      const target = event.target as HTMLInputElement;
      const files = target.files || [];
      for (const file of files) {
        uploadImage({
          editor,
          file,
        });
      }
    });
  }

  private getUpdateStateHandler(config: {
    editor: Editor;
    allMenuMap: Map<string, Map<string, string>>;
    buttonItemList: ToolbarButtonItem[];
    dropdownItemList: ToolbarDropdownItem[];
  }): () => void {
    const { editor, allMenuMap, buttonItemList, dropdownItemList } = config;
    return debounce(() => {
      let appliedItems = editor.selection.appliedItems;
      if (
        appliedItems.length > 0 &&
        appliedItems[0].node.closestContainer().get(0) !== editor.container.get(0)
      ) {
        appliedItems = [];
      }
      for (const item of buttonItemList) {
        const selectedClass = 'lake-button-selected';
        const buttonNode = this.container.find(`button[name="${item.name}"]`);
        const isDisabled = item.isDisabled && appliedItems.length > 0 ? item.isDisabled(appliedItems, editor) : false;
        if (isDisabled) {
          buttonNode.attr('disabled', 'true');
          buttonNode.removeClass(selectedClass);
        } else {
          buttonNode.removeAttr('disabled');
        }
        if (!isDisabled) {
          const isSelected = item.isSelected && appliedItems.length > 0 ? item.isSelected(appliedItems, editor) : false;
          if (isSelected) {
            buttonNode.addClass(selectedClass);
          } else {
            buttonNode.removeClass(selectedClass);
          }
        }
      }
      for (const item of dropdownItemList) {
        const selectedValues = item.selectedValues && appliedItems.length > 0 ? item.selectedValues(appliedItems, editor) : [];
        const dropdownNode = this.container.find(`div.lake-dropdown[name="${item.name}"]`);
        const isDisabled = item.isDisabled && appliedItems.length > 0 ? item.isDisabled(appliedItems, editor) : false;
        if (isDisabled) {
          dropdownNode.attr('disabled', 'true');
        } else {
          dropdownNode.removeAttr('disabled');
        }
        if (!isDisabled) {
          Dropdown.setValue(dropdownNode, selectedValues);
          const textNode = dropdownNode.find('.lake-dropdown-text');
          if (textNode.length > 0) {
            const key = selectedValues[0] || item.defaultValue;
            const menuMap = allMenuMap.get(item.name);
            const text = (menuMap && menuMap.get(key)) ?? key;
            textNode.text(text);
          }
        }
      }
      this.event.emit('updatestate');
    }, 100, {
      leading: false,
      trailing: true,
      maxWait: 100,
    });
  }

  // Renders a toolbar for the specified editor.
  public render() {
    const editor = this.editor;
    this.root.empty();
    this.root.append(this.container);
    const allMenuMap: Map<string, Map<string, string>> = new Map();
    const buttonItemList: ToolbarButtonItem[] = [];
    const dropdownItemList: ToolbarDropdownItem[] = [];
    this.items.forEach(name => {
      if (name === '|') {
        this.appendDivider();
        return;
      }
      let item;
      if (typeof name === 'string') {
        item = toolbarItemMap.get(name);
        if (!item) {
          return;
        }
      } else {
        item = name;
      }
      if (item.type === 'button') {
        buttonItemList.push(item);
        this.appendButton(item);
        return;
      }
      if (item.type === 'dropdown') {
        allMenuMap.set(item.name, Dropdown.getMenuMap(item.menuItems));
        dropdownItemList.push(item);
        this.appendDropdown(item);
        return;
      }
      if (item.type === 'upload') {
        this.appendUpload(item);
      }
    });
    const updateStateHandler = this.getUpdateStateHandler({
      editor,
      allMenuMap,
      buttonItemList,
      dropdownItemList,
    });
    editor.event.on('selectionchange', updateStateHandler);
    editor.event.on('change', updateStateHandler);
  }
}
