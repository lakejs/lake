import type { Editor } from '..';

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  editor.keystroke.setKeydown('/', () => {
    /*
    const range = editor.selection.range;
    if (range.isInsideBox) {
      return;
    }
    */
    // TODO
    // console.log(1);
  });
};
