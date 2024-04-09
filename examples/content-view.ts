import { Editor, Utils } from '../src';

export default (value: string) => {
  Utils.query('.lake-toolbar-root').remove();
  const contentView = new Editor({
    root: '.lake-root',
    value,
    readonly: true,
  });
  contentView.render();
  return contentView;
};
