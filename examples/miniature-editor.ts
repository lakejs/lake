import { Editor, Toolbar, Utils } from '../src';

export default (value: string) => {
  Utils.query('.lake-editor').addClass('lake-mini-editor');
  const editor = new Editor('.lake-container', {
    defaultValue: value,
  });
  editor.render();
  new Toolbar(editor, [
    'undo',
    'redo',
    '|',
    'heading',
    'blockQuote',
    '|',
    'bold',
    'moreStyle',
    '|',
    'numberedList',
    'bulletedList',
    'checklist',
  ]).render('.lake-toolbar');
  return editor;
};
