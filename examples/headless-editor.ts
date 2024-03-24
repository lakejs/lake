import { Editor, Utils } from '../src';

export default (value: string) => {
  const editor = new Editor({
    root: '.lake-main',
    value,
  });
  editor.render();
  Utils.query('.lake-toolbar').remove();
  return editor;
};
