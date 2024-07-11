import type { Editor } from '../editor';
import { SelectionState } from '../types/object';
import { ToolbarButtonItem, ToolbarDropdownItem, ToolbarUploadItem, ToolbarItem } from '../types/toolbar';
import { toolbarItems } from '../config/toolbar-items';
import { safeTemplate } from '../utils/safe-template';
import { query } from '../utils/query';
import { uploadFile } from '../utils/upload-file';
import { Nodes } from '../models/nodes';
import { Button } from './button';
import { Dropdown } from './dropdown';

type ToolbarPlacement = 'top' | 'bottom';

type ToolbarConfig = {
  root: string | Node | Nodes;
  items?: (string | ToolbarItem)[];
  placement?: ToolbarPlacement;
};

const defaultItems: string[] = [
  'undo',
  'redo',
  '|',
  'heading',
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

for (const item of toolbarItems) {
  toolbarItemMap.set(item.name, item);
}

export class Toolbar {

  private root: Nodes;

  private items: (string | ToolbarItem)[];

  private placement: ToolbarPlacement = 'top';

  private allMenuMap: Map<string, Map<string, string>> = new Map();

  private buttonItemList: ToolbarButtonItem[] = [];

  private dropdownItemList: ToolbarDropdownItem[] = [];

  public container: Nodes;

  constructor(config: ToolbarConfig) {
    this.root = query(config.root);
    this.items = config.items || defaultItems;
    if (config.placement) {
      this.placement = config.placement;
    }
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
      tooltip: typeof item.tooltip === 'string' ? item.tooltip : item.tooltip(editor.locale),
      tabIndex: -1,
      onClick: () => {
        editor.focus();
        const range = editor.selection.range;
        if (!editor.container.contains(range.commonAncestor)) {
          range.shrinkAfter(editor.container);
        }
        item.onClick(editor, item.name);
      },
    });
    button.render();
  }

  private appendDropdown(editor: Editor, item: ToolbarDropdownItem) {
    const dropdown = new Dropdown({
      root: this.container,
      locale: editor.locale,
      name: item.name,
      icon: item.icon,
      accentIcon: item.accentIcon,
      downIcon: item.downIcon,
      defaultValue: item.defaultValue,
      tooltip: item.tooltip,
      width: item.width,
      menuType: item.menuType,
      menuItems: item.menuItems,
      menuWidth: item.menuWidth,
      menuHeight: item.menuHeight,
      tabIndex: -1,
      placement: this.placement === 'top' ? 'bottom' : 'top',
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
      tooltip: typeof item.tooltip === 'string' ? item.tooltip : item.tooltip(editor.locale),
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
        uploadFile({
          editor,
          name: item.name,
          file,
          onError: error => editor.config.onMessage('error', error),
        });
      }
    });
  }

  // Updates state of each item such as disabled, selected.
  public updateState(state: SelectionState) {
    const { appliedItems, disabledNameMap, selectedNameMap, selectedValuesMap } = state;
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
          const key = selectedValues[0] || item.defaultValue || '';
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
    for (const name of this.items) {
      if (name === '|') {
        this.appendDivider();
      } else {
        let item;
        if (typeof name === 'string') {
          item = toolbarItemMap.get(name);
          if (!item) {
            throw new Error(`ToolbarItem "${name}" has not been defined yet.`);
          }
        } else {
          item = name;
        }
        if (item.type === 'button') {
          this.buttonItemList.push(item);
          this.appendButton(editor, item);
        } else if (item.type === 'dropdown') {
          this.allMenuMap.set(item.name, Dropdown.getMenuMap(item.menuItems, editor.locale));
          this.dropdownItemList.push(item);
          this.appendDropdown(editor, item);
        } else if (item.type === 'upload') {
          this.appendUpload(editor, item);
        }
      }
    }
  }
}
