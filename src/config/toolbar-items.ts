import { ToolbarItem } from '../types/toolbar';
import { icons } from '../icons';
import { headingMenuItems, fontSizeMenuItems, moreStyleMenuItems, fontFamilyMenuItems } from './menu-items';

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
    tooltipText: 'Undo',
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'redo',
    type: 'button',
    icon: icons.get('redo'),
    tooltipText: 'Redo',
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'selectAll',
    type: 'button',
    icon: icons.get('selectAll'),
    tooltipText: 'Select all',
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'blockQuote',
    type: 'button',
    icon: icons.get('blockQuote'),
    tooltipText: 'Block quote',
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'numberedList',
    type: 'button',
    icon: icons.get('numberedList'),
    tooltipText: 'Numbered list',
    onClick: editor => {
      editor.command.execute('list', 'numbered');
    },
  },
  {
    name: 'bulletedList',
    type: 'button',
    icon: icons.get('bulletedList'),
    tooltipText: 'Bulleted list',
    onClick: editor => {
      editor.command.execute('list', 'bulleted');
    },
  },
  {
    name: 'checklist',
    type: 'button',
    icon: icons.get('checklist'),
    tooltipText: 'Checklist',
    onClick: editor => {
      editor.command.execute('list', 'checklist');
    },
  },
  {
    name: 'alignLeft',
    type: 'button',
    icon: icons.get('alignLeft'),
    tooltipText: 'Align left',
    onClick: editor => {
      editor.command.execute('align', 'left');
    },
  },
  {
    name: 'alignCenter',
    type: 'button',
    icon: icons.get('alignCenter'),
    tooltipText: 'Align center',
    onClick: editor => {
      editor.command.execute('align', 'center');
    },
  },
  {
    name: 'alignRight',
    type: 'button',
    icon: icons.get('alignRight'),
    tooltipText: 'Align right',
    onClick: editor => {
      editor.command.execute('align', 'right');
    },
  },
  {
    name: 'alignJustify',
    type: 'button',
    icon: icons.get('alignJustify'),
    tooltipText: 'Align justify',
    onClick: editor => {
      editor.command.execute('align', 'justify');
    },
  },
  {
    name: 'increaseIndent',
    type: 'button',
    icon: icons.get('increaseIndent'),
    tooltipText: 'Increase indent',
    onClick: editor => {
      editor.command.execute('indent', 'increase');
    },
  },
  {
    name: 'decreaseIndent',
    type: 'button',
    icon: icons.get('decreaseIndent'),
    tooltipText: 'Decrease indent',
    onClick: editor => {
      editor.command.execute('indent', 'decrease');
    },
  },
  {
    name: 'bold',
    type: 'button',
    icon: icons.get('bold'),
    tooltipText: 'Bold',
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'italic',
    type: 'button',
    icon: icons.get('italic'),
    tooltipText: 'Italic',
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'underline',
    type: 'button',
    icon: icons.get('underline'),
    tooltipText: 'Underline',
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'strikethrough',
    type: 'button',
    icon: icons.get('strikethrough'),
    tooltipText: 'Strikethrough',
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'superscript',
    type: 'button',
    icon: icons.get('superscript'),
    tooltipText: 'Superscript',
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'subscript',
    type: 'button',
    icon: icons.get('subscript'),
    tooltipText: 'Subscript',
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'code',
    type: 'button',
    icon: icons.get('code'),
    tooltipText: 'Code',
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'removeFormat',
    type: 'button',
    icon: icons.get('removeFormat'),
    tooltipText: 'Remove format',
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'formatPainter',
    type: 'button',
    icon: icons.get('formatPainter'),
    tooltipText: 'Format painter',
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'hr',
    type: 'button',
    icon: icons.get('hr'),
    tooltipText: 'Horizontal line',
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'codeBlock',
    type: 'button',
    icon: icons.get('codeBlock'),
    tooltipText: 'Code block',
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'heading',
    type: 'dropdown',
    defaultValue: 'p',
    tooltipText: 'Heading',
    width: '100px',
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
    name: 'fontFamily',
    type: 'dropdown',
    defaultValue: 'Segoe UI',
    tooltipText: 'Font family',
    width: '100px',
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
    defaultValue: '16px',
    tooltipText: 'Font Size',
    width: '65px',
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
    tooltipText: 'More style',
    width: 'auto',
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
];
