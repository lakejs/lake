import { Editor, Toolbar, ToolbarItem, Utils, icons } from '../src';

const heading3: ToolbarItem = {
  name: 'heading3',
  type: 'button',
  icon: icons.get('heading'),
  tooltip: 'Heading',
  isSelected: appliedItems => !!appliedItems.find(item => item.name === 'h3'),
  onClick: editor => {
    editor.command.execute('heading', 'h3');
  },
};

const toolbarConfig = [
  heading3,
  'bold',
  'italic',
  'blockQuote',
  'code',
  'link',
  '|',
  'numberedList',
  'bulletedList',
  'checklist',
  '|',
  'image',
];

export default (value: string) => {
  Utils.query('.lake-editor').addClass('lake-mini-editor');
  const editor = new Editor('.lake-container', {
    defaultValue: value,
  });
  editor.render();
  new Toolbar(editor, toolbarConfig).render('.lake-toolbar');
  return editor;
};
