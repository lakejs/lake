import './document-editor.css';
import { Editor, Toolbar } from '../src';

export default (value: string) => {
  const toolbar = new Toolbar({
    root: '.lake-toolbar-root',
  });
  const editor = new Editor({
    root: '.lake-root',
    toolbar,
    value,
  });
  editor.render();
  return editor;
};
