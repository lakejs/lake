import { SlashItem } from '../types/slash';
import { icons } from '../icons';

export const slashItems: SlashItem[] = [
  {
    name: 'heading1',
    type: 'button',
    icon: icons.get('heading1'),
    title: 'Heading 1',
    description: 'Create a heading level 1',
    onClick: editor => {
      editor.command.execute('heading', 'h1');
    },
  },
  {
    name: 'heading2',
    type: 'button',
    icon: icons.get('heading2'),
    title: 'Heading 2',
    description: 'Create a heading level 2',
    onClick: editor => {
      editor.command.execute('heading', 'h2');
    },
  },
  {
    name: 'heading3',
    type: 'button',
    icon: icons.get('heading3'),
    title: 'Heading 3',
    description: 'Create a heading level 3',
    onClick: editor => {
      editor.command.execute('heading', 'h3');
    },
  },
  {
    name: 'heading4',
    type: 'button',
    icon: icons.get('heading4'),
    title: 'Heading 4',
    description: 'Create a heading level 4',
    onClick: editor => {
      editor.command.execute('heading', 'h4');
    },
  },
  {
    name: 'heading5',
    type: 'button',
    icon: icons.get('heading5'),
    title: 'Heading 5',
    description: 'Create a heading level 5',
    onClick: editor => {
      editor.command.execute('heading', 'h5');
    },
  },
  {
    name: 'heading6',
    type: 'button',
    icon: icons.get('heading6'),
    title: 'Heading 6',
    description: 'Create a heading level 6',
    onClick: editor => {
      editor.command.execute('heading', 'h6');
    },
  },
  {
    name: 'paragraph',
    type: 'button',
    icon: icons.get('paragraph'),
    title: 'Paragraph',
    description: 'Create a paragraph',
    onClick: editor => {
      editor.command.execute('heading', 'p');
    },
  },
  {
    name: 'blockQuote',
    type: 'button',
    icon: icons.get('blockQuote'),
    title: 'Block quote',
    description: 'Create a block quote',
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'numberedList',
    type: 'button',
    icon: icons.get('numberedList'),
    title: 'Numbered list',
    description: 'Create a numbered list',
    onClick: editor => {
      editor.command.execute('list', 'numbered');
    },
  },
  {
    name: 'bulletedList',
    type: 'button',
    icon: icons.get('bulletedList'),
    title: 'Bulleted list',
    description: 'Create a bulleted list',
    onClick: editor => {
      editor.command.execute('list', 'bulleted');
    },
  },
  {
    name: 'checklist',
    type: 'button',
    icon: icons.get('checklist'),
    title: 'Checklist',
    description: 'Create a checklist',
    onClick: editor => {
      editor.command.execute('list', 'checklist');
    },
  },
  {
    name: 'hr',
    type: 'button',
    icon: icons.get('hr'),
    title: 'Horizontal line',
    description: 'Insert a horizontal line',
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'codeBlock',
    type: 'button',
    icon: icons.get('codeBlock'),
    title: 'Code block',
    description: 'Insert a code block',
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'video',
    type: 'button',
    icon: icons.get('video'),
    title: 'Video',
    description: 'Insert a video from YouTube',
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'equation',
    type: 'button',
    icon: icons.get('equation'),
    title: 'Equation',
    description: 'Insert TeX expression in text',
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
];
