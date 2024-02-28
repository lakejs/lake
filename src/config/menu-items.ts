import { icons } from '../icons';
import { MenuItem } from '../types/toolbar';

export const  headingMenuItems: MenuItem[] = [
  {
    value: 'h1',
    text: 'Heading 1',
  },
  {
    value: 'h2',
    text: 'Heading 2',
  },
  {
    value: 'h3',
    text: 'Heading 3',
  },
  {
    value: 'h4',
    text: 'Heading 4',
  },
  {
    value: 'h5',
    text: 'Heading 5',
  },
  {
    value: 'h6',
    text: 'Heading 6',
  },
  {
    value: 'p',
    text: 'Paragraph',
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
