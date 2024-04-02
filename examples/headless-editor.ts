import { Editor, Utils } from '../src';

export default (value: string) => {
  const editor = new Editor({
    root: '.lake-root',
    value,
  });
  editor.render();
  Utils.query('.lake-toolbar-root').remove();
  return editor;
};
