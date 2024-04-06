import './document-editor.css';
import { Editor, Toolbar } from '../src';

export default (value: string) => {
  const editor = new Editor({
    root: '.lake-root',
    value,
  });
  editor.render();
  new Toolbar({
    editor,
    root: '.lake-toolbar-root',
  }).render();
  return editor;
};
