import { ToolbarItem } from '../types/toolbar';
import { icons } from '../icons';
import {
  headingMenuItems,
  listMenuItems,
  alignMenuItems,
  indentMenuItems,
  fontFamilyMenuItems,
  fontSizeMenuItems,
  moreStyleMenuItems,
  colorMenuItems,
} from './menu-items';
import { toHex } from '../utils';

const tagPluginNameMap: Map<string, string> = new Map([
  ['strong', 'bold'],
  ['em', 'italic'],
  ['i', 'italic'],
  ['u', 'underline'],
  ['s', 'strikethrough'],
  ['sup', 'superscript'],
  ['sub', 'subscript'],
  ['code', 'code'],
]);

export const toolbarItems: ToolbarItem[] = [
  {
    name: 'undo',
    type: 'button',
    icon: icons.get('undo'),
    tooltip: 'Undo',
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'redo',
    type: 'button',
    icon: icons.get('redo'),
    tooltip: 'Redo',
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'selectAll',
    type: 'button',
    icon: icons.get('selectAll'),
    tooltip: 'Select all',
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'blockQuote',
    type: 'button',
    icon: icons.get('blockQuote'),
    tooltip: 'Block quote',
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'numberedList',
    type: 'button',
    icon: icons.get('numberedList'),
    tooltip: 'Numbered list',
    onClick: editor => {
      editor.command.execute('list', 'numbered');
    },
  },
  {
    name: 'bulletedList',
    type: 'button',
    icon: icons.get('bulletedList'),
    tooltip: 'Bulleted list',
    onClick: editor => {
      editor.command.execute('list', 'bulleted');
    },
  },
  {
    name: 'checklist',
    type: 'button',
    icon: icons.get('checklist'),
    tooltip: 'Checklist',
    onClick: editor => {
      editor.command.execute('list', 'checklist');
    },
  },
  {
    name: 'alignLeft',
    type: 'button',
    icon: icons.get('alignLeft'),
    tooltip: 'Align left',
    onClick: editor => {
      editor.command.execute('align', 'left');
    },
  },
  {
    name: 'alignCenter',
    type: 'button',
    icon: icons.get('alignCenter'),
    tooltip: 'Align center',
    onClick: editor => {
      editor.command.execute('align', 'center');
    },
  },
  {
    name: 'alignRight',
    type: 'button',
    icon: icons.get('alignRight'),
    tooltip: 'Align right',
    onClick: editor => {
      editor.command.execute('align', 'right');
    },
  },
  {
    name: 'alignJustify',
    type: 'button',
    icon: icons.get('alignJustify'),
    tooltip: 'Align justify',
    onClick: editor => {
      editor.command.execute('align', 'justify');
    },
  },
  {
    name: 'increaseIndent',
    type: 'button',
    icon: icons.get('increaseIndent'),
    tooltip: 'Increase indent',
    onClick: editor => {
      editor.command.execute('indent', 'increase');
    },
  },
  {
    name: 'decreaseIndent',
    type: 'button',
    icon: icons.get('decreaseIndent'),
    tooltip: 'Decrease indent',
    onClick: editor => {
      editor.command.execute('indent', 'decrease');
    },
  },
  {
    name: 'bold',
    type: 'button',
    icon: icons.get('bold'),
    tooltip: 'Bold',
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'italic',
    type: 'button',
    icon: icons.get('italic'),
    tooltip: 'Italic',
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'underline',
    type: 'button',
    icon: icons.get('underline'),
    tooltip: 'Underline',
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'strikethrough',
    type: 'button',
    icon: icons.get('strikethrough'),
    tooltip: 'Strikethrough',
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'superscript',
    type: 'button',
    icon: icons.get('superscript'),
    tooltip: 'Superscript',
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'subscript',
    type: 'button',
    icon: icons.get('subscript'),
    tooltip: 'Subscript',
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'code',
    type: 'button',
    icon: icons.get('code'),
    tooltip: 'Code',
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'removeFormat',
    type: 'button',
    icon: icons.get('removeFormat'),
    tooltip: 'Remove format',
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'formatPainter',
    type: 'button',
    icon: icons.get('formatPainter'),
    tooltip: 'Format painter',
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'link',
    type: 'button',
    icon: icons.get('link'),
    tooltip: 'Link',
    onClick: (editor) => {
      editor.command.execute('link', 'https://github.com/');
    },
  },
  {
    name: 'hr',
    type: 'button',
    icon: icons.get('hr'),
    tooltip: 'Horizontal line',
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'image',
    type: 'button',
    icon: icons.get('image'),
    tooltip: 'Image',
    onClick: (editor) => {
      editor.command.execute('image', './data/tianchi.png');
    },
  },
  {
    name: 'codeBlock',
    type: 'button',
    icon: icons.get('codeBlock'),
    tooltip: 'Code block',
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'heading',
    type: 'dropdown',
    downIcon: icons.get('down'),
    defaultValue: 'p',
    tooltip: 'Heading',
    width: '100px',
    menuType: 'list',
    menuItems: headingMenuItems,
    getValues: appliedItems => {
      const currentItem = appliedItems.find(item => item.node.isHeading || item.name === 'p');
      return currentItem ? [currentItem.name] : [];
    },
    onSelect: (editor, value) => {
      editor.command.execute('heading', value);
    },
  },
  {
    name: 'list',
    type: 'dropdown',
    downIcon: icons.get('down'),
    icon: icons.get('list'),
    defaultValue: '',
    tooltip: 'List',
    width: 'auto',
    menuType: 'list',
    menuItems: listMenuItems,
    getValues: appliedItems => {
      let currentValue = '';
      for (const item of appliedItems) {
        if (item.name === 'ol') {
          currentValue = 'numbered';
          break;
        }
        if (item.name === 'ul' && !item.node.hasAttr('type')) {
          currentValue = 'bulleted';
          break;
        }
        if (item.name === 'ul' && item.node.attr('type') === 'checklist') {
          currentValue = 'checklist';
          break;
        }
      }
      return [currentValue];
    },
    onSelect: (editor, value) => {
      editor.command.execute('list', value);
    },
  },
  {
    name: 'align',
    type: 'dropdown',
    downIcon: icons.get('down'),
    icon: icons.get('alignLeft'),
    defaultValue: '',
    tooltip: 'Alignment',
    width: 'auto',
    menuType: 'list',
    menuItems: alignMenuItems,
    getValues: appliedItems => {
      let currentValue = '';
      for (const item of appliedItems) {
        if (item.node.isBlock) {
          currentValue = item.node.computedCSS('text-align');
          break;
        }
      }
      return [currentValue];
    },
    onSelect: (editor, value) => {
      editor.command.execute('align', value);
    },
  },
  {
    name: 'indent',
    type: 'dropdown',
    downIcon: icons.get('down'),
    icon: icons.get('increaseIndent'),
    defaultValue: '',
    tooltip: 'Indent',
    width: 'auto',
    menuType: 'list',
    menuItems: indentMenuItems,
    getValues: () => [],
    onSelect: (editor, value) => {
      editor.command.execute('indent', value);
    },
  },
  {
    name: 'fontFamily',
    type: 'dropdown',
    downIcon: icons.get('down'),
    defaultValue: 'Segoe UI',
    tooltip: 'Font family',
    width: '100px',
    menuType: 'list',
    menuItems: fontFamilyMenuItems,
    getValues: appliedItems => {
      const currentValue = appliedItems[0].node.css('font-family');
      return [currentValue.replace(/['"]/g, '')];
    },
    onSelect: (editor, value) => {
      editor.command.execute('fontFamily', value);
    },
  },
  {
    name: 'fontSize',
    type: 'dropdown',
    downIcon: icons.get('down'),
    defaultValue: '16px',
    tooltip: 'Font Size',
    width: '65px',
    menuType: 'list',
    menuItems: fontSizeMenuItems,
    getValues: appliedItems => {
      const currentValue = appliedItems[0].node.computedCSS('font-size');
      return [currentValue.replace(/\.\d+/, '')];
    },
    onSelect: (editor, value) => {
      editor.command.execute('fontSize', value);
    },
  },
  {
    name: 'moreStyle',
    type: 'dropdown',
    icon: icons.get('more'),
    defaultValue: '',
    tooltip: 'More style',
    width: 'auto',
    menuType: 'list',
    menuItems: moreStyleMenuItems,
    getValues: appliedItems => {
      const currentValues = [];
      for (const item of appliedItems) {
        if (item.node.isMark) {
          const name = tagPluginNameMap.get(item.name) ?? item.name;
          currentValues.push(name);
        }
      }
      return currentValues;
    },
    onSelect: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'fontColor',
    type: 'dropdown',
    downIcon: icons.get('down'),
    icon: icons.get('fontColor'),
    defaultValue: '#e53333',
    tooltip: 'Font color',
    width: 'auto',
    menuType: 'color',
    menuItems: colorMenuItems,
    getValues: appliedItems => {
      const currentValue = appliedItems[0].node.computedCSS('color');
      return [toHex(currentValue)];
    },
    onSelect: (editor, value) => {
      editor.command.execute('fontColor', value);
    },
  },
  {
    name: 'highlight',
    type: 'dropdown',
    downIcon: icons.get('down'),
    icon: icons.get('highlight'),
    defaultValue: '#ffe500',
    tooltip: 'Highlight',
    width: 'auto',
    menuType: 'color',
    menuItems: colorMenuItems,
    getValues: appliedItems => {
      const currentValue = appliedItems[0].node.computedCSS('background-color');
      return [toHex(currentValue)];
    },
    onSelect: (editor, value) => {
      editor.command.execute('highlight', value);
    },
  },
];
