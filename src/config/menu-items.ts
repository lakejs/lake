import { icons } from '../icons';
import { MenuItem } from '../types/toolbar';

export const  headingMenuItems: MenuItem[] = [
  {
    value: 'h1',
    text: '<span style="font-weight: bold; font-size: 26px;">Heading 1</span>',
  },
  {
    value: 'h2',
    text: '<span style="font-weight: bold; font-size: 24px;">Heading 2</span>',
  },
  {
    value: 'h3',
    text: '<span style="font-weight: bold; font-size: 22px;">Heading 3</span>',
  },
  {
    value: 'h4',
    text: '<span style="font-weight: bold; font-size: 20px;">Heading 4</span>',
  },
  {
    value: 'h5',
    text: '<span style="font-weight: bold; font-size: 18px;">Heading 5</span>',
  },
  {
    value: 'h6',
    text: '<span style="font-weight: bold; font-size: 16px;">Heading 6</span>',
  },
  {
    value: 'p',
    text: 'Paragraph',
  },
];

export const listMenuItems: MenuItem[] = [
  {
    icon: icons.get('numberedList'),
    value: 'numbered',
    text: 'Numbered list',
  },
  {
    icon: icons.get('bulletedList'),
    value: 'bulleted',
    text: 'Bulleted list',
  },
  {
    icon: icons.get('checklist'),
    value: 'checklist',
    text: 'Checklist',
  },
];

export const alignMenuItems: MenuItem[] = [
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

export const indentMenuItems: MenuItem[] = [
  {
    icon: icons.get('increaseIndent'),
    value: 'increase',
    text: 'Increase indent',
  },
  {
    icon: icons.get('decreaseIndent'),
    value: 'decrease',
    text: 'Decrease indent',
  },
];

export const fontFamilyMenuItems: MenuItem[] = [
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

export const fontSizeMenuItems: MenuItem[] = [
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

export const moreStyleMenuItems: MenuItem[] = [
  {
    icon: icons.get('italic'),
    value: 'italic',
    text: 'Italic',
  },
  {
    icon: icons.get('underline'),
    value: 'underline',
    text: 'Underline',
  },
  {
    icon: icons.get('strikethrough'),
    value: 'strikethrough',
    text: 'Strikethrough',
  },
  {
    icon: icons.get('superscript'),
    value: 'superscript',
    text: 'Superscript',
  },
  {
    icon: icons.get('subscript'),
    value: 'subscript',
    text: 'Subscript',
  },
  {
    icon: icons.get('code'),
    value: 'code',
    text: 'Code',
  },
];
