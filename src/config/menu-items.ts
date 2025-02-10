import { DropdownMenuItem } from '../types/dropdown';
import { icons } from '../icons';

export const headingMenuItems: DropdownMenuItem[] = [
  {
    value: 'h1',
    text: locale => `<span style="font-weight: bold; font-size: 26px;">${locale.toolbar.heading1()}</span>`,
  },
  {
    value: 'h2',
    text: locale => `<span style="font-weight: bold; font-size: 24px;">${locale.toolbar.heading2()}</span>`,
  },
  {
    value: 'h3',
    text: locale => `<span style="font-weight: bold; font-size: 22px;">${locale.toolbar.heading3()}</span>`,
  },
  {
    value: 'h4',
    text: locale => `<span style="font-weight: bold; font-size: 20px;">${locale.toolbar.heading4()}</span>`,
  },
  {
    value: 'h5',
    text: locale => `<span style="font-weight: bold; font-size: 18px;">${locale.toolbar.heading5()}</span>`,
  },
  {
    value: 'h6',
    text: locale => `<span style="font-weight: bold; font-size: 16px;">${locale.toolbar.heading6()}</span>`,
  },
  {
    value: 'p',
    text: locale => locale.toolbar.paragraph(),
  },
];

export const listMenuItems: DropdownMenuItem[] = [
  {
    icon: icons.get('numberedList'),
    value: 'numbered',
    text: locale => locale.toolbar.numberedList(),
  },
  {
    icon: icons.get('bulletedList'),
    value: 'bulleted',
    text: locale => locale.toolbar.bulletedList(),
  },
  {
    icon: icons.get('checklist'),
    value: 'checklist',
    text: locale => locale.toolbar.checklist(),
  },
];

export const alignMenuItems: DropdownMenuItem[] = [
  {
    icon: icons.get('alignLeft'),
    value: 'left',
    text: locale => locale.toolbar.alignLeft(),
  },
  {
    icon: icons.get('alignCenter'),
    value: 'center',
    text: locale => locale.toolbar.alignCenter(),
  },
  {
    icon: icons.get('alignRight'),
    value: 'right',
    text: locale => locale.toolbar.alignRight(),
  },
  {
    icon: icons.get('alignJustify'),
    value: 'justify',
    text: locale => locale.toolbar.alignJustify(),
  },
];

export const indentMenuItems: DropdownMenuItem[] = [
  {
    icon: icons.get('increaseIndent'),
    value: 'increase',
    text: locale => locale.toolbar.increaseIndent(),
  },
  {
    icon: icons.get('decreaseIndent'),
    value: 'decrease',
    text: locale => locale.toolbar.decreaseIndent(),
  },
];

export const fontFamilyMenuItems: DropdownMenuItem[] = [
  {
    value: 'Arial',
    text: '<span style="font-family: Arial;">Arial</span>',
  },
  {
    value: 'Arial Black',
    text: '<span style="font-family: \'Arial Black\';">Arial Black</span>',
  },
  {
    value: 'Comic Sans MS',
    text: '<span style="font-family: \'Comic Sans MS\';">Comic Sans MS</span>',
  },
  {
    value: 'Courier New',
    text: '<span style="font-family: \'Courier New\';">Courier New</span>',
  },
  {
    value: 'Georgia',
    text: '<span style="font-family: Georgia;">Georgia</span>',
  },
  {
    value: 'Helvetica',
    text: '<span style="font-family: Helvetica;">Helvetica</span>',
  },
  {
    value: 'Impact',
    text: '<span style="font-family: Impact;">Impact</span>',
  },
  {
    value: 'Segoe UI',
    text: '<span style="font-family: \'Segoe UI\';">Segoe UI</span>',
  },
  {
    value: 'Tahoma',
    text: '<span style="font-family: Tahoma;">Tahoma</span>',
  },
  {
    value: 'Times New Roman',
    text: '<span style="font-family: \'Times New Roman\';">Times New Roman</span>',
  },
  {
    value: 'Trebuchet MS',
    text: '<span style="font-family: \'Trebuchet MS\';">Trebuchet MS</span>',
  },
  {
    value: 'Verdana',
    text: '<span style="font-family: Verdana;">Verdana</span>',
  },
];

export const fontSizeMenuItems: DropdownMenuItem[] = [
  {
    value: '12px',
    text: '12px',
  },
  {
    value: '14px',
    text: '14px',
  },
  {
    value: '16px',
    text: '16px',
  },
  {
    value: '18px',
    text: '18px',
  },
  {
    value: '22px',
    text: '22px',
  },
  {
    value: '24px',
    text: '24px',
  },
  {
    value: '32px',
    text: '32px',
  },
];

export const moreStyleMenuItems: DropdownMenuItem[] = [
  {
    icon: icons.get('italic'),
    value: 'italic',
    text: locale => locale.toolbar.italic(),
  },
  {
    icon: icons.get('underline'),
    value: 'underline',
    text: locale => locale.toolbar.underline(),
  },
  {
    icon: icons.get('strikethrough'),
    value: 'strikethrough',
    text: locale => locale.toolbar.strikethrough(),
  },
  {
    icon: icons.get('superscript'),
    value: 'superscript',
    text: locale => locale.toolbar.superscript(),
  },
  {
    icon: icons.get('subscript'),
    value: 'subscript',
    text: locale => locale.toolbar.subscript(),
  },
  {
    icon: icons.get('code'),
    value: 'code',
    text: locale => locale.toolbar.code(),
  },
];

// These colors are sourced from Ant Design (https://ant.design/docs/spec/colors)
const colors: string[] = [
  // Dust Red, Volcano, Sunset Orange, Calendula Gold, Sunrise Yellow, Lime, Polar Green, Cyan, Daybreak Blue, Geek Blue, Golden Purple, Magenta
  '#f5222d', '#fa541c', '#fa8c16', '#faad14', '#fadb14', '#a0d911', '#52c41a', '#13c2c2', '#1677ff', '#2f54eb', '#722ed1', '#eb2f96', // color 6
  '#fff1f0', '#fff2e8', '#fff7e6', '#fffbe6', '#feffe6', '#fcffe6', '#f6ffed', '#e6fffb', '#e6f4ff', '#f0f5ff', '#f9f0ff', '#fff0f6', // color 1
  '#ffccc7', '#ffd8bf', '#ffe7ba', '#fff1b8', '#ffffb8', '#f4ffb8', '#d9f7be', '#b5f5ec', '#bae0ff', '#d6e4ff', '#efdbff', '#ffd6e7', // color 2
  '#ffa39e', '#ffbb96', '#ffd591', '#ffe58f', '#fffb8f', '#eaff8f', '#b7eb8f', '#87e8de', '#91caff', '#adc6ff', '#d3adf7', '#ffadd2', // color 3
  '#ff7875', '#ff9c6e', '#ffc069', '#ffd666', '#fff566', '#d3f261', '#95de64', '#5cdbd3', '#69b1ff', '#85a5ff', '#b37feb', '#ff85c0', // color 4
  '#ff4d4f', '#ff7a45', '#ffa940', '#ffc53d', '#ffec3d', '#bae637', '#73d13d', '#36cfc9', '#4096ff', '#597ef7', '#9254de', '#f759ab', // color 5
  '#cf1322', '#d4380d', '#d46b08', '#d48806', '#d4b106', '#7cb305', '#389e0d', '#08979c', '#0958d9', '#1d39c4', '#531dab', '#c41d7f', // color 7
  '#a8071a', '#ad2102', '#ad4e00', '#ad6800', '#ad8b00', '#5b8c00', '#237804', '#006d75', '#003eb3', '#10239e', '#391085', '#9e1068', // color 8
  '#820014', '#871400', '#873800', '#874d00', '#876800', '#3f6600', '#135200', '#00474f', '#002c8c', '#061178', '#22075e', '#780650', // color 9
  '#5c0011', '#610b00', '#612500', '#613400', '#614700', '#254000', '#092b00', '#002329', '#001d66', '#030852', '#120338', '#520339', // color 10
  // from gray-1 to gray-11, and gray-13
  '#000000', '#1f1f1f', '#262626', '#434343', '#595959', '#8c8c8c', '#bfbfbf', '#d9d9d9', '#f0f0f0', '#f5f5f5', '#fafafa', '#ffffff', // Neutral Color
];
export const colorMenuItems: DropdownMenuItem[] = [
  {
    icon: icons.get('removeFormat'),
    value: '',
    text: locale => locale.toolbar.removeColor(),
  },
];
for (const color of colors) {
  colorMenuItems.push({
    value: color.toLowerCase(),
    text: color.toUpperCase(),
  });
}
