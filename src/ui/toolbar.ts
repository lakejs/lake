import type { Editor } from '../editor';
import { NativeNode } from '../types/native';
import { StateData } from '../types/object';
import { ToolbarButtonItem, ToolbarDropdownItem, ToolbarUploadItem, ToolbarItem } from '../types/toolbar';
import { toolbarItems } from '../config/toolbar-items';
import { safeTemplate } from '../utils/safe-template';
import { query } from '../utils/query';
import { Nodes } from '../models/nodes';
import { Button } from './button';
import { Dropdown } from './dropdown';
import { uploadImage } from './upload';

type ToolbarConfig = {
  root: string | Nodes | NativeNode;
  items?: (string | ToolbarItem)[];
};

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

const toolbarItemMap: Map<string, ToolbarItem> = new Map();

toolbarItems.forEach(item => {
  toolbarItemMap.set(item.name, item);
});

export class Toolbar {

  private items: (string | ToolbarItem)[];

  private root: Nodes;

  private allMenuMap: Map<string, Map<string, string>> = new Map();

  private buttonItemList: ToolbarButtonItem[] = [];

  private dropdownItemList: ToolbarDropdownItem[] = [];

  public container: Nodes;

  constructor(config: ToolbarConfig) {
    this.items = config.items || defaultItems;
    this.root = query(config.root);
    this.container = query('<div class="lake-toolbar" />');

    this.root.addClass('lake-custom-properties');
  }

  private appendDivider(): void {
    this.container.append('<div class="lake-toolbar-divider" />');
  }

  private appendButton(editor: Editor, item: ToolbarButtonItem): void {
    const button = new Button({
      root: this.container,
      name: item.name,
      icon: item.icon,
      tooltip: item.tooltip,
      tabIndex: -1,
      onClick: () => {
        editor.focus();
        item.onClick(editor, item.name);
      },
    });
    button.render();
  }

  private appendDropdown(editor: Editor, item: ToolbarDropdownItem) {
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
      tabIndex: -1,
      onSelect: value => {
        editor.focus();
        item.onSelect(editor, value);
      },
    });
    dropdown.render();
  }

  private appendUpload(editor: Editor, item: ToolbarUploadItem): void {
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
      tabIndex: -1,
      onClick: () => {
        editor.focus();
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

  // Updates state of each item such as disabled, selected.
  public updateState(stateData: StateData) {
    const { appliedItems, disabledNameMap, selectedNameMap, selectedValuesMap } = stateData;
    for (const item of this.buttonItemList) {
      const selectedClass = 'lake-button-selected';
      const buttonNode = this.container.find(`button[name="${item.name}"]`);
      let isDisabled = disabledNameMap.get(item.name);
      if (isDisabled === undefined) {
        isDisabled = item.isDisabled && appliedItems.length > 0 ? item.isDisabled(appliedItems) : false;
      }
      if (isDisabled) {
        buttonNode.attr('disabled', 'true');
        buttonNode.removeClass(selectedClass);
      } else {
        buttonNode.removeAttr('disabled');
      }
      if (!isDisabled) {
        let isSelected = selectedNameMap.get(item.name);
        if (isSelected === undefined) {
          isSelected = item.isSelected && appliedItems.length > 0 ? item.isSelected(appliedItems) : false;
        }
        if (isSelected) {
          buttonNode.addClass(selectedClass);
        } else {
          buttonNode.removeClass(selectedClass);
        }
      }
    }
    for (const item of this.dropdownItemList) {
      let selectedValues = selectedValuesMap.get(item.name);
      if (selectedValues === undefined) {
        selectedValues = item.selectedValues && appliedItems.length > 0 ? item.selectedValues(appliedItems) : [];
      }
      const dropdownNode = this.container.find(`div.lake-dropdown[name="${item.name}"]`);
      let isDisabled = disabledNameMap.get(item.name);
      if (isDisabled === undefined) {
        isDisabled = item.isDisabled && appliedItems.length > 0 ? item.isDisabled(appliedItems) : false;
      }
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
          const menuMap = this.allMenuMap.get(item.name);
          const text = (menuMap && menuMap.get(key)) ?? key;
          textNode.text(text);
        }
      }
    }
  }

  // Renders a toolbar for the specified editor.
  public render(editor: Editor) {
    this.root.empty();
    this.root.append(this.container);
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
        this.buttonItemList.push(item);
        this.appendButton(editor, item);
        return;
      }
      if (item.type === 'dropdown') {
        this.allMenuMap.set(item.name, Dropdown.getMenuMap(item.menuItems));
        this.dropdownItemList.push(item);
        this.appendDropdown(editor, item);
        return;
      }
      if (item.type === 'upload') {
        this.appendUpload(editor, item);
      }
    });
  }
}
