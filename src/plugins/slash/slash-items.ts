import { icons } from '@/icons';
import { SlashItem } from './types';

export const slashItems: SlashItem[] = [
  {
    name: 'heading1',
    type: 'button',
    icon: icons.get('heading1'),
    title: locale => locale.slash.heading1(),
    description: locale => locale.slash.heading1Desc(),
    onClick: editor => {
      editor.command.execute('heading', 'h1');
    },
  },
  {
    name: 'heading2',
    type: 'button',
    icon: icons.get('heading2'),
    title: locale => locale.slash.heading2(),
    description: locale => locale.slash.heading2Desc(),
    onClick: editor => {
      editor.command.execute('heading', 'h2');
    },
  },
  {
    name: 'heading3',
    type: 'button',
    icon: icons.get('heading3'),
    title: locale => locale.slash.heading3(),
    description: locale => locale.slash.heading3Desc(),
    onClick: editor => {
      editor.command.execute('heading', 'h3');
    },
  },
  {
    name: 'heading4',
    type: 'button',
    icon: icons.get('heading4'),
    title: locale => locale.slash.heading4(),
    description: locale => locale.slash.heading4Desc(),
    onClick: editor => {
      editor.command.execute('heading', 'h4');
    },
  },
  {
    name: 'heading5',
    type: 'button',
    icon: icons.get('heading5'),
    title: locale => locale.slash.heading5(),
    description: locale => locale.slash.heading5Desc(),
    onClick: editor => {
      editor.command.execute('heading', 'h5');
    },
  },
  {
    name: 'heading6',
    type: 'button',
    icon: icons.get('heading6'),
    title: locale => locale.slash.heading6(),
    description: locale => locale.slash.heading6Desc(),
    onClick: editor => {
      editor.command.execute('heading', 'h6');
    },
  },
  {
    name: 'paragraph',
    type: 'button',
    icon: icons.get('paragraph'),
    title: locale => locale.slash.paragraph(),
    description: locale => locale.slash.paragraphDesc(),
    onClick: editor => {
      editor.command.execute('heading', 'p');
    },
  },
  {
    name: 'blockQuote',
    type: 'button',
    icon: icons.get('blockQuote'),
    title: locale => locale.slash.blockQuote(),
    description: locale => locale.slash.blockQuoteDesc(),
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'numberedList',
    type: 'button',
    icon: icons.get('numberedList'),
    title: locale => locale.slash.numberedList(),
    description: locale => locale.slash.numberedListDesc(),
    onClick: editor => {
      editor.command.execute('list', 'numbered');
    },
  },
  {
    name: 'bulletedList',
    type: 'button',
    icon: icons.get('bulletedList'),
    title: locale => locale.slash.bulletedList(),
    description: locale => locale.slash.bulletedListDesc(),
    onClick: editor => {
      editor.command.execute('list', 'bulleted');
    },
  },
  {
    name: 'checklist',
    type: 'button',
    icon: icons.get('checklist'),
    title: locale => locale.slash.checklist(),
    description: locale => locale.slash.checklistDesc(),
    onClick: editor => {
      editor.command.execute('list', 'checklist');
    },
  },
  {
    name: 'table',
    type: 'button',
    icon: icons.get('table'),
    title: locale => locale.slash.table(),
    description: locale => locale.slash.tableDesc(),
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'infoAlert',
    type: 'button',
    icon: icons.get('info'),
    title: locale => locale.slash.infoAlert(),
    description: locale => locale.slash.infoAlertDesc(),
    onClick: editor => {
      editor.command.execute('blockQuote', 'info');
    },
  },
  {
    name: 'tipAlert',
    type: 'button',
    icon: icons.get('tip'),
    title: locale => locale.slash.tipAlert(),
    description: locale => locale.slash.tipAlertDesc(),
    onClick: editor => {
      editor.command.execute('blockQuote', 'tip');
    },
  },
  {
    name: 'warningAlert',
    type: 'button',
    icon: icons.get('warning'),
    title: locale => locale.slash.warningAlert(),
    description: locale => locale.slash.warningAlertDesc(),
    onClick: editor => {
      editor.command.execute('blockQuote', 'warning');
    },
  },
  {
    name: 'dangerAlert',
    type: 'button',
    icon: icons.get('danger'),
    title: locale => locale.slash.dangerAlert(),
    description: locale => locale.slash.dangerAlertDesc(),
    onClick: editor => {
      editor.command.execute('blockQuote', 'danger');
    },
  },
  {
    name: 'hr',
    type: 'button',
    icon: icons.get('hr'),
    title: locale => locale.slash.hr(),
    description: locale => locale.slash.hrDesc(),
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'codeBlock',
    type: 'button',
    icon: icons.get('codeBlock'),
    title: locale => locale.slash.codeBlock(),
    description: locale => locale.slash.codeBlockDesc(),
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'video',
    type: 'button',
    icon: icons.get('video'),
    title: locale => locale.slash.video(),
    description: locale => locale.slash.videoDesc(),
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'equation',
    type: 'button',
    icon: icons.get('equation'),
    title: locale => locale.slash.equation(),
    description: locale => locale.slash.equationDesc(),
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'twitter',
    type: 'button',
    icon: icons.get('twitter'),
    title: locale => locale.slash.twitter(),
    description: locale => locale.slash.twitterDesc(),
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'image',
    type: 'upload',
    icon: icons.get('image'),
    title: locale => locale.slash.image(),
    description: locale => locale.slash.imageDesc(),
    accept: 'image/*',
    multiple: true,
  },
  {
    name: 'file',
    type: 'upload',
    icon: icons.get('attachment'),
    title: locale => locale.slash.file(),
    description: locale => locale.slash.fileDesc(),
    accept: '*',
    multiple: true,
  },
];
