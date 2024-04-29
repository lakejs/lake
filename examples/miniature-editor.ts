import './miniature-editor.css';
import { Editor, Toolbar, ToolbarItem, Utils, icons } from '../src';

const colors: string[] = [
  '#E53333', '#E56600', '#FF9900', '#64451D', '#DFC5A4', '#FFE500',
  '#009900', '#006600', '#99BB00', '#B8D100', '#60D978', '#00D5FF',
  '#337FE5', '#003399', '#4C33E5', '#9933E5', '#CC33E5', '#EE33EE',
  '#FFFFFF', '#CCCCCC', '#999999', '#666666', '#333333', '#000000',
];
const colorMenuItems = [
  {
    value: '',
    text: 'Remove color',
  },
];
for (const color of colors) {
  colorMenuItems.push({
    value: color.toLowerCase(),
    text: color.toUpperCase(),
  });
}

const heading: ToolbarItem = {
  name: 'heading',
  type: 'button',
  icon: icons.get('heading'),
  tooltip: 'Heading',
  isSelected: appliedItems => !!appliedItems.find(item => item.name === 'h3'),
  onClick: editor => {
    editor.command.execute('heading', 'h3');
  },
};

const fontColor: ToolbarItem = {
  name: 'fontColor',
  type: 'dropdown',
  downIcon: icons.get('down'),
  icon: icons.get('fontColor'),
  accentIcon: icons.get('fontColorAccent'),
  defaultValue: '#e53333',
  tooltip: 'Font color',
  width: 'auto',
  menuType: 'color',
  menuItems: colorMenuItems,
  selectedValues: appliedItems => {
    const currentValue = appliedItems[0].node.computedCSS('color');
    return [Utils.toHex(currentValue)];
  },
  onSelect: (editor, value) => {
    editor.command.execute('fontColor', value);
  },
};

const highlight: ToolbarItem = {
  name: 'highlight',
  type: 'dropdown',
  downIcon: icons.get('down'),
  icon: icons.get('highlight'),
  accentIcon: icons.get('highlightAccent'),
  defaultValue: '#ffe500',
  tooltip: 'Highlight',
  width: 'auto',
  menuType: 'color',
  menuItems: colorMenuItems,
  selectedValues: appliedItems => {
    const currentValue = appliedItems[0].node.computedCSS('background-color');
    return [Utils.toHex(currentValue)];
  },
  onSelect: (editor, value) => {
    editor.command.execute('highlight', value);
  },
};

const toolbarItems = [
  heading,
  'blockQuote',
  'bold',
  'italic',
  'code',
  '|',
  fontColor,
  highlight,
  '|',
  'numberedList',
  'bulletedList',
  'checklist',
  '|',
  'link',
];

export default (value: string) => {
  // copy root node
  const rootNode = Utils.query('.lake-editor');
  const rootNode2 = rootNode.clone(true);
  rootNode2.css('margin-top', '10px');
  rootNode.after(rootNode2);
  // create editor 1
  const toolbar = new Toolbar({
    root: rootNode.find('.lake-toolbar-root'),
    items: toolbarItems,
  });
  const editor = new Editor({
    root: rootNode.find('.lake-root'),
    toolbar,
    lang: window.LAKE_LANGUAGE,
    value,
    indentWithTab: false,
    image: {
      requestAction: '/upload',
    },
  });
  editor.container.on('focusin', ()=> {
    editor.root.addClass('lake-root-focused');
  });
  editor.container.on('focusout', ()=> {
    editor.root.removeClass('lake-root-focused');
  });
  editor.render();
  // create editor 2
  const toolbar2 = new Toolbar({
    root: rootNode2.find('.lake-toolbar-root'),
    items: toolbarItems,
  });
  const editor2 = new Editor({
    root: rootNode2.find('.lake-root'),
    toolbar: toolbar2,
    lang: 'en-US',
    value,
    indentWithTab: false,
  });
  editor2.container.on('focusin', ()=> {
    editor2.root.addClass('lake-root-focused');
  });
  editor2.container.on('focusout', ()=> {
    editor2.root.removeClass('lake-root-focused');
  });
  editor2.render();
  return editor;
};
