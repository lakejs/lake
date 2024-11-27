import './readonly-editor.css';
import { Editor, query } from 'lakelib';

export default (value: string) => {
  query('.lake-toolbar-root').remove();
  const editor = new Editor({
    root: '.lake-root',
    value,
    readonly: true,
  });
  editor.render();
  return editor;
};
