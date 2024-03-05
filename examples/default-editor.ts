import { Editor, Toolbar } from '../src';

export default (value: string) => {
  const editor = new Editor('.lake-content', {
    defaultValue: value,
  });
  editor.render();
  new Toolbar(editor).render('.lake-toolbar');
  return editor;
};
