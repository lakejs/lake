import type { Editor } from '../editor';
import { SelectionState } from '../types/selection';
import { DropdownMenuItem } from '../types/dropdown';
import { ToolbarButtonItem, ToolbarDropdownItem, ToolbarUploadItem, ToolbarItem } from '../types/toolbar';
import { toolbarItems } from '../config/toolbar-items';
import { template } from '../utils/template';
import { query } from '../utils/query';
import { insertUploadBox } from '../utils/insert-upload-box';
import { Nodes } from '../models/nodes';
import { Button } from './button';
import { Dropdown } from './dropdown';

type ToolbarPlacement = 'top' | 'bottom';

export interface ToolbarConfig {
  root?: string | Node | Nodes;
  items?: (string | ToolbarItem)[];
  placement?: ToolbarPlacement;
  fontFamily?: {
    defaultValue: string;
    menuItems: DropdownMenuItem[];
  };
}

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

/**
 * The Toolbar interface provides properties and methods for rendering and manipulating the toolbar.
 */
export class Toolbar {

  private items: (string | ToolbarItem)[];

  private placement: ToolbarPlacement = 'top';

  private toolbarItemMap = new Map<string, ToolbarItem>();

  private allMenuMap = new Map<string, Map<string, string>>();

  private buttonItemList: ToolbarButtonItem[] = [];

  private dropdownItemList: ToolbarDropdownItem[] = [];

  private dropdownList: Dropdown[] = [];

  /**
   * The element to which the toolbar is appended.
   */
  public root: Nodes;

  /**
   * The element where toolbar items are appended.
   */
  public container: Nodes;

  constructor(config: ToolbarConfig) {
    this.root = query(config.root || document.body);
    this.items = config.items || defaultItems;
    if (config.placement) {
      this.placement = config.placement;
    }
    for (const item of toolbarItems) {
      this.toolbarItemMap.set(item.name, { ...item });
    }
    if (config.fontFamily) {
      const fontFamilyItem = this.toolbarItemMap.get('fontFamily') as ToolbarDropdownItem;
      fontFamilyItem.defaultValue = config.fontFamily.defaultValue;
      fontFamilyItem.menuItems = config.fontFamily.menuItems;
    }
    this.container = query('<div class="lake-toolbar" />');
  }

  private appendDivision(name: 'divider' | 'line-break'): void {
    this.container.append(`<div class="lake-toolbar-${name}" />`);
  }

  private appendNormalButton(editor: Editor, item: ToolbarButtonItem): void {
    const button = new Button({
      root: this.container,
      name: item.name,
      icon: item.icon,
      tooltip: typeof item.tooltip === 'string' ? item.tooltip : item.tooltip(editor.locale),
      tabIndex: -1,
      onClick: () => {
        editor.focus();
        item.onClick(editor, item.name);
      },
    });
    button.render();
  }

  private appendDropdown(editor: Editor, item: ToolbarDropdownItem): void {
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
      menuCheck: item.menuCheck,
      tabIndex: -1,
      location: 'local',
      direction: this.placement === 'top' ? 'bottom' : 'top',
      onSelect: value => {
        editor.focus();
        item.onSelect(editor, value);
      },
    });
    dropdown.render();
    this.dropdownList.push(dropdown);
  }

  private appendUploadButton(editor: Editor, item: ToolbarUploadItem): void {
    const uploadNode = query(template`
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
      const {
        requestTypes, requestMethod, requestAction, requestFieldName,
        requestWithCredentials, requestHeaders, transformResponse,
      } = editor.config[item.name];
      const target = event.target as HTMLInputElement;
      const files = target.files || [];
      for (const file of files) {
        insertUploadBox({
          selection: editor.selection,
          boxName: item.name,
          file,
          requestTypes,
          requestMethod,
          requestAction,
          requestFieldName,
          requestWithCredentials,
          requestHeaders,
          transformResponse,
          onError: error => {
            fileNativeNode.value = '';
            editor.config.showMessage('error', error);
          },
          onSuccess: () => {
            fileNativeNode.value = '';
            editor.history.save();
          },
        });
      }
    });
  }

  /**
   * Updates the state of each toolbar item, such as whether it is selected or disabled.
   */
  public updateState(state: SelectionState = {
    activeItems: [],
  }): void {
    const { activeItems } = state;
    const disabledNameMap = state.disabledNameMap || new Map();
    const selectedNameMap = state.selectedNameMap || new Map();
    const selectedValuesMap = state.selectedValuesMap || new Map();
    if (!this.container.get(0).isConnected) {
      return;
    }
    for (const item of this.buttonItemList) {
      const selectedClass = 'lake-button-selected';
      const buttonNode = this.container.find(`button[name="${item.name}"]`);
      let isDisabled = disabledNameMap.get(item.name);
      if (isDisabled === undefined) {
        isDisabled = item.isDisabled ? item.isDisabled(activeItems) : false;
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
          isSelected = item.isSelected ? item.isSelected(activeItems) : false;
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
        selectedValues = item.selectedValues && activeItems.length > 0 ? item.selectedValues(activeItems) : [];
      }
      const dropdownNode = this.container.find(`div.lake-dropdown[name="${item.name}"]`);
      let isDisabled = disabledNameMap.get(item.name);
      if (isDisabled === undefined) {
        isDisabled = item.isDisabled ? item.isDisabled(activeItems) : false;
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

  /**
   * Renders the toolbar for the specified editor.
   */
  public render(editor: Editor): void {
    this.root.append(this.container);
    for (const name of this.items) {
      if (name === '|') {
        this.appendDivision('divider');
      } else if (name === '-') {
        this.appendDivision('line-break');
      } else {
        let item;
        if (typeof name === 'string') {
          item = this.toolbarItemMap.get(name);
          if (!item) {
            throw new Error(`ToolbarItem "${name}" has not been defined yet.`);
          }
        } else {
          item = name;
        }
        if (item.type === 'button') {
          this.buttonItemList.push(item);
          this.appendNormalButton(editor, item);
        } else if (item.type === 'dropdown') {
          this.allMenuMap.set(item.name, Dropdown.getMenuMap(item.menuItems, editor.locale));
          this.dropdownItemList.push(item);
          this.appendDropdown(editor, item);
        } else if (item.type === 'upload') {
          this.appendUploadButton(editor, item);
        }
      }
    }
  }

  /**
   * Destroys the toolbar instance, removing it from the DOM.
   */
  public unmount(): void {
    for (const dropdown of this.dropdownList) {
      dropdown.unmount();
    }
    this.container.remove();
  }
}
