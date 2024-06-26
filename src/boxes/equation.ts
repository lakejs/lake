import { BoxComponent } from '../types/box';
import { query } from '../utils';

export const equationBox: BoxComponent = {
  type: 'inline',
  name: 'equation',
  render: box => {
    const editor = box.getEditor();
    if (!editor) {
      return;
    }
    const rootNode = query('<div class="lake-equation" />');
    const boxContainer = box.getContainer();
    boxContainer.empty();
    boxContainer.append(rootNode);
    const codeBlockNativeNode = rootNode.get(0) as HTMLElement;
    if (!codeBlockNativeNode) {
      return;
    }
    // begin to create CodeMirror
    const katex = window.katex;
    if (!katex) {
      if (editor.readonly) {
        box.node.hide();
        return;
      }
      rootNode.addClass('lake-equation-error');
      rootNode.text(`
        The equation cannot be displayed because window.katex is not found.
        Please check if the "katex" library is added to this page.
      `.trim());
      rootNode.on('click', () => {
        editor.selection.selectBox(box);
      });
      return;
    }
    const boxValue = box.value;
    const html = window.katex.renderToString(boxValue.code, {
      throwOnError: false,
    });
    rootNode.append(html);
    rootNode.on('click', () => {
      editor.selection.selectBox(box);
    });
  },
};
