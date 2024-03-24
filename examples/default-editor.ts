import { Editor, Toolbar } from '../src';

export default (value: string) => {
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
