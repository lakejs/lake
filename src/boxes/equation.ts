import { BoxComponent } from '../types/box';
import { query } from '../utils/query';
import { safeTemplate } from '../utils/safe-template';
import { Box } from '../models/box';
import { Button } from '../ui/button';

const defaultExpression = String.raw`\sqrt{x}`;

function renderError(box: Box): void {
  const editor = box.getEditor();
  if (!editor) {
    return;
  }
  if (editor.readonly) {
    box.node.hide();
    return;
  }
  const defaultCode = (box.value.code || '').trim();
  const rootNode = box.getContainer().find('.lake-equation');
  rootNode.addClass('lake-equation-error');
  rootNode.text(defaultCode);
  rootNode.on('click', () => {
    editor.selection.selectBox(box);
  });
  editor.config.onMessage('warning', `
    The box "${box.name}" (id: ${box.node.id}) failed to display because window.katex was not found.
    Please check if the "katex" library is added to this page.
  `.trim());
}

export default {
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
    const katex = window.katex;
    if (!katex) {
      renderError(box);
      return;
    }
    const defaultCode = (box.value.code || '').trim();
    const viewNode = query('<div class="lake-equation-view" />');
    rootNode.append(viewNode);
    viewNode.html(window.katex.renderToString(defaultCode || defaultExpression, {
      throwOnError: false,
    }));
    viewNode.on('click', () => {
      editor.selection.selectBox(box);
    });
    const formNode = query(safeTemplate`
      <div class="lake-equation-form">
        <div class="lake-row">
          <textarea name="code" placeholder="${editor.locale.equation.placeholder()}"></textarea>
        </div>
        <div class="lake-row lake-button-row"></div>
      </div>
    `);
    rootNode.append(formNode);
    const textareaNode = formNode.find('textarea');
    const textareaNativeNode = (textareaNode.get(0) as HTMLTextAreaElement);
    textareaNativeNode.value = defaultCode;
    textareaNode.on('input', () => {
      const code = textareaNativeNode.value.trim();
      viewNode.html(window.katex.renderToString(code || defaultExpression, {
        throwOnError: false,
      }));
      box.updateValue('code', code);
    });
    const button = new Button({
      root: formNode.find('.lake-button-row'),
      name: 'save',
      type: 'primary',
      text: editor.locale.equation.save(),
      onClick: () => {
        editor.selection.range.selectBoxEnd(box.node);
        editor.selection.sync();
        editor.history.save();
      },
    });
    button.render();
  },
} as BoxComponent;
