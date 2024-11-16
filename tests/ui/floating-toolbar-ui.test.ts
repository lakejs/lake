import { boxes } from '../../src/storage/boxes';
import { icons } from '../../src/icons';
import { query } from '../../src/utils/query';
import { Box } from '../../src/models/box';
import { FloatingToolbar } from '../../src/ui/floating-toolbar';
import { Editor } from '../../src';

const imageUrl = '../assets/images/heaven-lake-256.png';

const alignMenuItems = [
  {
    icon: icons.get('alignLeft'),
    value: 'left',
    text: 'Align left',
  },
  {
    icon: icons.get('alignCenter'),
    value: 'center',
    text: 'Align center',
  },
  {
    icon: icons.get('alignRight'),
    value: 'right',
    text: 'Align right',
  },
  {
    icon: icons.get('alignJustify'),
    value: 'justify',
    text: 'Align justify',
  },
];

const columnMenuItems = [
  {
    value: 'insertLeft',
    text: 'Insert column left',
  },
  {
    value: 'insertRight',
    text: 'Insert column right',
  },
  {
    value: 'delete',
    text: 'Delete column',
  },
];

const rowMenuItems = [
  {
    value: 'insertAbove',
    text: 'Insert row above',
  },
  {
    value: 'insertBelow',
    text: 'Insert row below',
  },
  {
    value: 'delete',
    text: 'Delete row',
  },
];

const colors = [
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

describe('ui / floating-toolbar-ui', () => {

  let editor: Editor;

  before(() => {
    boxes.set('floatingToolbarUiTestBox', {
      type: 'inline',
      name: 'floatingToolbarUiTestBox',
      value: {
        url: imageUrl,
      },
      render: box => `<img src="${box.value.url}" style="width: 256px; height: 186px;" />`,
    });
    const rootNode = query('<div class="lake-root"></div>');
    query(document.body).append(rootNode);
    editor = new Editor({
      root: rootNode,
      value: '<p><focus /><br /></p>',
    });
    editor.render();
  });

  it('floating toolbar', () => {
    editor.setValue('<p style="text-align: center;"><lake-box type="inline" name="floatingToolbarUiTestBox"></lake-box></p>');
    const box = new Box(editor.container.find('lake-box'));
    box.render();
    const floatingToolbar = new FloatingToolbar({
      target: box.node,
      items: [
        {
          name: 'open',
          type: 'button',
          icon: icons.get('open'),
          tooltip: 'Open',
          onClick: () => { },
        },
        {
          name: 'open2',
          type: 'button',
          icon: icons.get('open'),
          tooltip: 'Open',
          isSelected: () => true,
          onClick: () => { },
        },
        {
          name: 'open3',
          type: 'button',
          icon: icons.get('open'),
          tooltip: 'Open',
          isDisabled: () => true,
          onClick: () => { },
        },
        '|',
        {
          name: 'tableColumn',
          type: 'dropdown',
          downIcon: icons.get('down'),
          icon: icons.get('tableColumn'),
          tooltip: 'Column',
          menuType: 'list',
          menuItems: columnMenuItems,
          onSelect: () => { },
        },
        {
          name: 'tableRow',
          type: 'dropdown',
          downIcon: icons.get('down'),
          icon: icons.get('tableRow'),
          tooltip: 'Row',
          menuType: 'list',
          menuItems: rowMenuItems,
          onSelect: () => { },
        },
        {
          name: 'tableMerge',
          type: 'button',
          icon: icons.get('tableMerge'),
          tooltip: 'Merge cells',
          onClick: () => { },
        },
        {
          name: 'tableSplit',
          type: 'button',
          icon: icons.get('tableSplit'),
          tooltip: 'Split cells',
          onClick: () => { },
        },
        {
          name: 'align',
          type: 'dropdown',
          downIcon: icons.get('down'),
          tooltip: 'Align',
          menuType: 'list',
          menuItems: alignMenuItems.map(item => ({
            value: item.value,
            text: item.text,
          })),
          selectedValues: () => ['right'],
          onSelect: () => { },
        },
        {
          name: 'align2',
          type: 'dropdown',
          downIcon: icons.get('down'),
          icon: icons.get('alignLeft'),
          tooltip: 'Align',
          menuType: 'list',
          menuItems: alignMenuItems,
          isDisabled: () => true,
          selectedValues: () => ['center'],
          onSelect: () => { },
        },
        {
          name: 'fontColor',
          type: 'dropdown',
          icon: icons.get('fontColor'),
          accentIcon: icons.get('fontColorAccent'),
          downIcon: icons.get('down'),
          defaultValue: '#e53333',
          tooltip: 'Color',
          menuType: 'color',
          menuItems: colorMenuItems,
          menuWidth: '156px',
          onSelect: () => { },
        },
        '|',
        {
          name: 'remove',
          type: 'button',
          icon: icons.get('remove'),
          tooltip: 'Remove',
          onClick: () => { },
        },
      ],
    });
    floatingToolbar.render();
  });

});
