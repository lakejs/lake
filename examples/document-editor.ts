import './document-editor.css';
import { Editor, Toolbar } from '../src';

export default (value: string) => {
  const toolbar = new Toolbar({
    root: '.lake-toolbar-root',
  });
  const editor = new Editor({
    root: '.lake-root',
    toolbar,
    lang: window.LAKE_LANGUAGE,
    value,
    image: {
      requestAction: '/upload',
    },
  });
  editor.render();
  return editor;
};
