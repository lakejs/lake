import debounce from 'lodash/debounce';
import { Base64 } from 'js-base64';
import type { Editor } from '../editor';
import { NativeElement, NativeHTMLElement, NativeNode } from '../types/native';
import { ButtonItem, DropdownItem, UploadItem, ToolbarItem } from '../types/toolbar';
import { UploadRequestOption } from '../types/request';
import { icons } from '../icons';
import { toolbarItems } from '../config/toolbar-items';
import { template } from '../utils/template';
import { safeTemplate } from '../utils/safe-template';
import { query } from '../utils/query';
import { request } from '../utils/request';
import { Nodes } from '../models/nodes';

const defaultConfig: string[] = [
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
  private editor: Editor;

  private config: (string | ToolbarItem)[];

  private root: Nodes;

  constructor(editor: Editor, config?: (string | ToolbarItem)[]) {
    this.editor = editor;
    this.config = config || defaultConfig;
    this.root = query('<div />');
  }

  // Returns the value of the node.
  public getValue(node: Nodes): string[] {
    const value = node.attr('value');
    if (value === '') {
      return [];
    }
    return JSON.parse(Base64.decode(value));
  }

  // Updates the value of the node.
  public setValue(node: Nodes, value: string[]): void {
    node.attr('value', Base64.encode(JSON.stringify(value)));
  }

  private appendDivider(): void {
    this.root.append('<div class="lake-toolbar-divider" />');
  }

  private appendButton(item: ButtonItem): void {
    const editor = this.editor;
    const buttonNode = query('<button type="button" class="lake-toolbar-button" />');
    buttonNode.attr('name', item.name);
    buttonNode.attr('title', item.tooltip);
    if (item.icon) {
      buttonNode.append(item.icon);
    }
    this.root.append(buttonNode);
    buttonNode.on('mouseenter', () => {
      if (buttonNode.attr('disabled')) {
        return;
      }
      buttonNode.addClass('lake-toolbar-button-hovered');
    });
    buttonNode.on('mouseleave', () => {
      if (buttonNode.attr('disabled')) {
        return;
      }
      buttonNode.removeClass('lake-toolbar-button-hovered');
    });
    buttonNode.on('click', event => {
      event.preventDefault();
      editor.focus();
      item.onClick(editor, item.name);
    });
  }

  private getMenuMap(item: DropdownItem): Map<string, string> {
    const menuMap: Map<string, string> = new Map();
    if (!item.menuItems) {
      return menuMap;
    }
    for (const menuItem of item.menuItems) {
      // remove HTML tags
      const text = menuItem.text.replace(/<[^>]*>/, '');
      menuMap.set(menuItem.value, text);
    }
    return menuMap;
  }

  private updateColorAccent(titleNode: Nodes, value: string): void {
    const svgNode = titleNode.find('.lake-dropdown-icon svg').eq(1);
    const lineNode = svgNode.find('line');
    if (lineNode.length > 0) {
      lineNode.attr('stroke', value);
    } else {
      svgNode.find('path').attr('fill', value);
    }
  }

  private addDropdownMenu(menuNode: Nodes, item: DropdownItem): void {
    for (const menuItem of item.menuItems) {
      const listContent = template`
        <li value="${menuItem.value}">
          <div class="lake-dropdown-menu-text">${menuItem.text}</div>
        </li>
      `;
      const listNode = query(listContent);
      menuNode.append(listNode);
      if (item.menuType === 'color') {
        listNode.attr('title', menuItem.text);
        listNode.find('.lake-dropdown-menu-text').css('background-color', menuItem.value);
      }
      if (menuItem.icon) {
        const menuIconNode = query('<div class="lake-dropdown-menu-icon"></div>');
        menuIconNode.append(menuItem.icon);
        listNode.prepend(menuIconNode);
      }
      const checkIcon = icons.get('check');
      if (checkIcon) {
        const checkNode = query('<div class="lake-dropdown-menu-check"></div>');
        checkNode.append(checkIcon);
        listNode.prepend(checkNode);
      }
    }
  }

  private bindDropdownEvents(dropdownNode: Nodes, item: DropdownItem): void {
    const editor = this.editor;
    const titleNode = dropdownNode.find('.lake-dropdown-title');
    const textNode = titleNode.find('.lake-dropdown-text');
    const iconNode = titleNode.find('.lake-dropdown-icon');
    const downIconNode = titleNode.find('.lake-dropdown-down-icon');
    const menuNode = dropdownNode.find('.lake-dropdown-menu');
    if (item.menuType === 'color') {
      iconNode.on('mouseenter', () => {
        if (dropdownNode.attr('disabled')) {
          return;
        }
        iconNode.addClass('lake-dropdown-icon-hovered');
      });
      iconNode.on('mouseleave', () => {
        iconNode.removeClass('lake-dropdown-icon-hovered');
      });
      downIconNode.on('mouseenter', () => {
        if (dropdownNode.attr('disabled')) {
          return;
        }
        downIconNode.addClass('lake-dropdown-down-icon-hovered');
      });
      downIconNode.on('mouseleave', () => {
        downIconNode.removeClass('lake-dropdown-down-icon-hovered');
      });
    } else {
      titleNode.on('mouseenter', () => {
        if (dropdownNode.attr('disabled')) {
          return;
        }
        titleNode.addClass('lake-dropdown-title-hovered');
      });
      titleNode.on('mouseleave', () => {
        titleNode.removeClass('lake-dropdown-title-hovered');
      });
    }
    if (item.menuType === 'color') {
      iconNode.on('click', event => {
        event.preventDefault();
        if (dropdownNode.attr('disabled')) {
          return;
        }
        editor.focus();
        const value = dropdownNode.attr('color') || item.defaultValue;
        item.onSelect(editor, value);
      });
    }
    const triggerNode = (item.menuType === 'color' && downIconNode) ? downIconNode : titleNode;
    triggerNode.on('click', event => {
      event.preventDefault();
      if (dropdownNode.attr('disabled')) {
        return;
      }
      const currentValues = this.getValue(dropdownNode);
      menuNode.find('.lake-dropdown-menu-check').css('visibility', 'hidden');
      menuNode.find('li').each(node => {
        const listNode = query(node);
        if (currentValues.indexOf(listNode.attr('value')) >= 0) {
          listNode.find('.lake-dropdown-menu-check').css('visibility', 'visible');
        }
      });
      menuNode.css('visibility', 'hidden');
      menuNode.show(item.menuType === 'color' ? 'flex' : 'block');
      const dropdownNativeNode = dropdownNode.get(0) as NativeHTMLElement;
      const dropdownRect = dropdownNativeNode.getBoundingClientRect();
      const menuNativeNode = menuNode.get(0) as NativeElement;
      if (dropdownRect.x + menuNativeNode.clientWidth > window.innerWidth) {
        menuNode.css('left', 'auto');
        menuNode.css('right', '0');
      } else {
        menuNode.css('left', '');
        menuNode.css('right', '');
      }
      menuNode.css('visibility', '');
    });
    menuNode.on('click', event => {
      event.preventDefault();
      editor.focus();
      const listItem = query(event.target as NativeNode).closest('li');
      const value = listItem.attr('value');
      if (textNode.length > 0) {
        textNode.html(listItem.text());
      }
      if (item.menuType === 'color' && value !== '') {
        dropdownNode.attr('color', value);
        this.updateColorAccent(titleNode, value);
      }
      item.onSelect(editor, value);
    });
    editor.event.on('click', target => {
      if (target.closest('.lake-dropdown-title').get(0) === titleNode.get(0)) {
        return;
      }
      menuNode.hide();
    });
  }

  private appendDropdown(item: DropdownItem) {
    const menuMap = this.getMenuMap(item);
    const dropdownNode = item.icon ? query(safeTemplate`
      <div class="lake-dropdown">
        <button type="button" class="lake-dropdown-title">
          <div class="lake-dropdown-icon"></div>
          <div class="lake-dropdown-down-icon"></div>
        </button>
      </div>
    `) : query(safeTemplate`
      <div class="lake-dropdown">
        <button type="button" class="lake-dropdown-title">
          <div class="lake-dropdown-text"></div>
          <div class="lake-dropdown-down-icon"></div>
        </button>
      </div>
    `);
    dropdownNode.attr('name', item.name);
    dropdownNode.addClass(`lake-dropdown-${item.menuType}`);
    const titleNode = dropdownNode.find('.lake-dropdown-title');
    if (!item.downIcon) {
      titleNode.addClass('lake-dropdown-title-no-down');
    }
    titleNode.css('width', item.width);
    titleNode.attr('title', item.tooltip);
    const textNode = titleNode.find('.lake-dropdown-text');
    const iconNode = titleNode.find('.lake-dropdown-icon');
    if (item.icon) {
      iconNode.append(item.icon);
    }
    if (item.accentIcon) {
      iconNode.append(item.accentIcon);
    }
    const downIconNode = titleNode.find('.lake-dropdown-down-icon');
    if (item.downIcon) {
      downIconNode.append(item.downIcon);
    }
    const menuNode = query('<ul class="lake-dropdown-menu" />');
    menuNode.addClass(`lake-dropdown-${item.menuType}-menu`);
    if (textNode.length > 0) {
      textNode.html(menuMap.get(item.defaultValue) ?? item.defaultValue);
    }
    if (item.menuType === 'color') {
      this.updateColorAccent(titleNode, item.defaultValue);
    }
    this.addDropdownMenu(menuNode, item);
    dropdownNode.append(titleNode);
    dropdownNode.append(menuNode);
    this.root.append(dropdownNode);
    this.bindDropdownEvents(dropdownNode, item);
  }

  private appendUpload(item: UploadItem): void {
    const editor = this.editor;
    const uploadNode = query(safeTemplate`
      <div class="lake-upload">
        <input type="file" />
        <button type="button" class="lake-toolbar-button" />
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
    const buttonNode = uploadNode.find('button');
    buttonNode.attr('name', item.name);
    buttonNode.attr('title', item.tooltip);
    if (item.icon) {
      buttonNode.append(item.icon);
    }
    this.root.append(uploadNode);
    buttonNode.on('mouseenter', () => {
      buttonNode.addClass('lake-toolbar-button-hovered');
    });
    buttonNode.on('mouseleave', () => {
      buttonNode.removeClass('lake-toolbar-button-hovered');
    });
    buttonNode.on('click', event => {
      event.preventDefault();
      fileNativeNode.click();
    });
    fileNode.on('click', event => event.stopPropagation());
    fileNode.on('change', () => {
      const files = fileNativeNode.files || [];
      for (const file of files) {
        const imageBox = editor.selection.insertBox('image', {
          url: URL.createObjectURL(file),
          status: 'uploading',
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
        });
        file.uid = imageBox.node.id.toString(10);
        editor.history.save();
        const requestOption: UploadRequestOption<{ [ key: string ]: string}> = {
          onProgress: event => {
            const percentNode = imageBox.node.find('.lake-percent');
            const progressValue = Math.round(event.loaded / event.total * 100);
            percentNode.html(`${progressValue} %`);
          },
          onError: () => {
            const boxValue = imageBox.value;
            boxValue.status = 'error';
            imageBox.value = boxValue;
            imageBox.render();
            editor.history.save();
          },
          onSuccess: body => {
            const boxValue = imageBox.value;
            boxValue.status = 'done';
            boxValue.url = body.url;
            imageBox.value = boxValue;
            imageBox.render();
            editor.history.save();
          },
          file,
          action: '/upload',
          method: 'POST',
        };
        request(requestOption);
      }
    });
  }

  public render(target: string | Nodes | NativeNode) {
    const editor = this.editor;
    this.root = query(target);
    this.root.addClass('lake-custom-properties');
    const allMenuMap: Map<string, Map<string, string>> = new Map();
    const buttonItemList: ButtonItem[] = [];
    const dropdownItemList: DropdownItem[] = [];
    this.config.forEach(name => {
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
        allMenuMap.set(item.name, this.getMenuMap(item));
        dropdownItemList.push(item);
        this.appendDropdown(item);
        return;
      }
      if (item.type === 'upload') {
        this.appendUpload(item);
      }
    });
    const updateStateHandler = debounce(() => {
      const appliedItems = editor.selection.appliedItems;
      for (const item of buttonItemList) {
        const selectedClass = 'lake-toolbar-button-selected';
        const buttonNode = this.root.find(`button[name="${item.name}"]`);
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
        const dropdownNode = this.root.find(`div.lake-dropdown[name="${item.name}"]`);
        const isDisabled = item.isDisabled && appliedItems.length > 0 ? item.isDisabled(appliedItems, editor) : false;
        if (isDisabled) {
          dropdownNode.attr('disabled', 'true');
        } else {
          dropdownNode.removeAttr('disabled');
        }
        if (!isDisabled) {
          this.setValue(dropdownNode, selectedValues);
          const textNode = dropdownNode.find('.lake-dropdown-text');
          if (textNode.length > 0) {
            const key = selectedValues[0] || item.defaultValue;
            const menuMap = allMenuMap.get(item.name);
            const text = (menuMap && menuMap.get(key)) ?? key;
            textNode.html(text);
          }
        }
      }
    }, 100, {
      leading: false,
      trailing: true,
      maxWait: 100,
    });
    editor.event.on('selectionchange', updateStateHandler);
    editor.event.on('change', updateStateHandler);
  }
}
