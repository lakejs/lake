import type { Editor } from '..';
import { Fragment } from '../models/fragment';

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  editor.command.add('specialCharacter', {
    execute: (value: string) => {
      const fragment = new Fragment();
      fragment.append(document.createTextNode(value));
      editor.selection.insertContents(fragment);
      editor.history.save();
    },
  });
};
