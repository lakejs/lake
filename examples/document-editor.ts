import { Editor, Toolbar, Utils } from '../src';

export default (value: string) => {
  Utils.query('.lake-editor').addClass('lake-document-editor');
  const editor = new Editor('.lake-main', {
    defaultValue: value,
  });
  editor.render();
  new Toolbar(editor).render('.lake-toolbar');
  return editor;
};
