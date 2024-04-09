import { Editor, Utils } from '../src';

export default (value: string) => {
  Utils.query('.lake-toolbar-root').remove();
  const editor = new Editor({
    root: '.lake-root',
    value,
    readonly: true,
  });
  editor.render();
  return editor;
};
