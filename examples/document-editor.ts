import { Editor, Toolbar, Utils } from '../src';

export default (value: string) => {
  Utils.query('.lake-editor').addClass('lake-document-editor');
  const editor = new Editor({
    root: '.lake-main',
    value,
  });
  editor.render();
  new Toolbar({
    editor,
    root: '.lake-toolbar',
  }).render();
  return editor;
};
