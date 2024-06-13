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
    tooltip: locale => locale.toolbar.undo(),
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'redo',
    type: 'button',
    icon: icons.get('redo'),
    tooltip: locale => locale.toolbar.redo(),
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'selectAll',
    type: 'button',
    icon: icons.get('selectAll'),
    tooltip: locale => locale.toolbar.selectAll(),
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'paragraph',
    type: 'button',
    icon: icons.get('paragraph'),
    tooltip: locale => locale.toolbar.paragraph(),
    isSelected: appliedItems => !!appliedItems.find(item => item.name === 'p'),
    onClick: editor => {
      editor.command.execute('heading', 'p');
    },
  },
  {
    name: 'blockQuote',
    type: 'button',
    icon: icons.get('blockQuote'),
    tooltip: locale => locale.toolbar.blockQuote(),
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'numberedList',
    type: 'button',
    icon: icons.get('numberedList'),
    tooltip: locale => locale.toolbar.numberedList(),
    isSelected: appliedItems => !!appliedItems.find(item => item.name === 'ol'),
    onClick: editor => {
      editor.command.execute('list', 'numbered');
    },
  },
  {
    name: 'bulletedList',
    type: 'button',
    icon: icons.get('bulletedList'),
    tooltip: locale => locale.toolbar.bulletedList(),
    isSelected: appliedItems => !!appliedItems.find(item => item.name === 'ul' && !item.node.hasAttr('type')),
    onClick: editor => {
      editor.command.execute('list', 'bulleted');
    },
  },
  {
    name: 'checklist',
    type: 'button',
    icon: icons.get('checklist'),
    tooltip: locale => locale.toolbar.checklist(),
    isSelected: appliedItems => !!appliedItems.find(item => item.name === 'ul' && item.node.attr('type') === 'checklist'),
    onClick: editor => {
      editor.command.execute('list', 'checklist');
    },
  },
  {
    name: 'alignLeft',
    type: 'button',
    icon: icons.get('alignLeft'),
    tooltip: locale => locale.toolbar.alignLeft(),
    isSelected: appliedItems => !!appliedItems.find(item => item.node.isBlock && item.node.css('text-align') === 'left'),
    onClick: editor => {
      editor.command.execute('align', 'left');
    },
  },
  {
    name: 'alignCenter',
    type: 'button',
    icon: icons.get('alignCenter'),
    tooltip: locale => locale.toolbar.alignCenter(),
    isSelected: appliedItems => !!appliedItems.find(item => item.node.isBlock && item.node.css('text-align') === 'center'),
    onClick: editor => {
      editor.command.execute('align', 'center');
    },
  },
  {
    name: 'alignRight',
    type: 'button',
    icon: icons.get('alignRight'),
    tooltip: locale => locale.toolbar.alignRight(),
    isSelected: appliedItems => !!appliedItems.find(item => item.node.isBlock && item.node.css('text-align') === 'right'),
    onClick: editor => {
      editor.command.execute('align', 'right');
    },
  },
  {
    name: 'alignJustify',
    type: 'button',
    icon: icons.get('alignJustify'),
    tooltip: locale => locale.toolbar.alignJustify(),
    isSelected: appliedItems => !!appliedItems.find(item => item.node.isBlock && item.node.css('text-align') === 'justify'),
    onClick: editor => {
      editor.command.execute('align', 'justify');
    },
  },
  {
    name: 'increaseIndent',
    type: 'button',
    icon: icons.get('increaseIndent'),
    tooltip: locale => locale.toolbar.increaseIndent(),
    onClick: editor => {
      editor.command.execute('indent', 'increase');
    },
  },
  {
    name: 'decreaseIndent',
    type: 'button',
    icon: icons.get('decreaseIndent'),
    tooltip: locale => locale.toolbar.decreaseIndent(),
    onClick: editor => {
      editor.command.execute('indent', 'decrease');
    },
  },
  {
    name: 'bold',
    type: 'button',
    icon: icons.get('bold'),
    tooltip: locale => locale.toolbar.bold(),
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'italic',
    type: 'button',
    icon: icons.get('italic'),
    tooltip: locale => locale.toolbar.italic(),
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'underline',
    type: 'button',
    icon: icons.get('underline'),
    tooltip: locale => locale.toolbar.underline(),
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'strikethrough',
    type: 'button',
    icon: icons.get('strikethrough'),
    tooltip: locale => locale.toolbar.strikethrough(),
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'superscript',
    type: 'button',
    icon: icons.get('superscript'),
    tooltip: locale => locale.toolbar.superscript(),
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'subscript',
    type: 'button',
    icon: icons.get('subscript'),
    tooltip: locale => locale.toolbar.subscript(),
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'code',
    type: 'button',
    icon: icons.get('code'),
    tooltip: locale => locale.toolbar.code(),
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'removeFormat',
    type: 'button',
    icon: icons.get('removeFormat'),
    tooltip: locale => locale.toolbar.removeFormat(),
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'formatPainter',
    type: 'button',
    icon: icons.get('formatPainter'),
    tooltip: locale => locale.toolbar.formatPainter(),
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'link',
    type: 'button',
    icon: icons.get('link'),
    tooltip: locale => locale.toolbar.link(),
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'hr',
    type: 'button',
    icon: icons.get('hr'),
    tooltip: locale => locale.toolbar.hr(),
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'codeBlock',
    type: 'button',
    icon: icons.get('codeBlock'),
    tooltip: locale => locale.toolbar.codeBlock(),
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'video',
    type: 'button',
    icon: icons.get('video'),
    tooltip: locale => locale.toolbar.video(),
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'heading',
    type: 'dropdown',
    downIcon: icons.get('down'),
    defaultValue: 'p',
    tooltip: locale => locale.toolbar.heading(),
    width: '100px',
    menuType: 'list',
    menuItems: headingMenuItems,
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
    tooltip: locale => locale.toolbar.list(),
    width: 'auto',
    menuType: 'list',
    menuItems: listMenuItems,
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
    tooltip: locale => locale.toolbar.align(),
    width: 'auto',
    menuType: 'list',
    menuItems: alignMenuItems,
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
    tooltip: locale => locale.toolbar.indent(),
    width: 'auto',
    menuType: 'list',
    menuItems: indentMenuItems,
    onSelect: (editor, value) => {
      editor.command.execute('indent', value);
    },
  },
  {
    name: 'fontFamily',
    type: 'dropdown',
    downIcon: icons.get('down'),
    defaultValue: 'Segoe UI',
    tooltip: locale => locale.toolbar.fontFamily(),
    width: '100px',
    menuType: 'list',
    menuItems: fontFamilyMenuItems,
    onSelect: (editor, value) => {
      editor.command.execute('fontFamily', value);
    },
  },
  {
    name: 'fontSize',
    type: 'dropdown',
    downIcon: icons.get('down'),
    defaultValue: '16px',
    tooltip: locale => locale.toolbar.fontSize(),
    width: '65px',
    menuType: 'list',
    menuItems: fontSizeMenuItems,
    onSelect: (editor, value) => {
      editor.command.execute('fontSize', value);
    },
  },
  {
    name: 'moreStyle',
    type: 'dropdown',
    icon: icons.get('more'),
    defaultValue: '',
    tooltip: locale => locale.toolbar.moreStyle(),
    width: 'auto',
    menuType: 'list',
    menuItems: moreStyleMenuItems,
    selectedValues: appliedItems => {
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
    accentIcon: icons.get('fontColorAccent'),
    defaultValue: '#f5222d',
    tooltip: locale => locale.toolbar.fontColor(),
    width: 'auto',
    menuType: 'color',
    menuItems: colorMenuItems,
    onSelect: (editor, value) => {
      editor.command.execute('fontColor', value);
    },
  },
  {
    name: 'highlight',
    type: 'dropdown',
    downIcon: icons.get('down'),
    icon: icons.get('highlight'),
    accentIcon: icons.get('highlightAccent'),
    defaultValue: '#fadb14',
    tooltip: locale => locale.toolbar.highlight(),
    width: 'auto',
    menuType: 'color',
    menuItems: colorMenuItems,
    onSelect: (editor, value) => {
      editor.command.execute('highlight', value);
    },
  },
  {
    name: 'image',
    type: 'upload',
    icon: icons.get('image'),
    tooltip: locale => locale.toolbar.image(),
    accept: 'image/*',
    multiple: true,
  },
  {
    name: 'file',
    type: 'upload',
    icon: icons.get('attachment'),
    tooltip: locale => locale.toolbar.file(),
    accept: '*',
    multiple: true,
  },
];
