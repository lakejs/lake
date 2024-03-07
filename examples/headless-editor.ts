import { Editor, Utils } from '../src';

export default (value: string) => {
  const editor = new Editor('.lake-main', {
    defaultValue: value,
  });
  editor.render();
  Utils.query('.lake-toolbar').remove();
  return editor;
};
