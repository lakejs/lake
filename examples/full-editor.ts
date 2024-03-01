import { Editor, Toolbar } from '../src';

export default (value: string) => {
  const editor = new Editor('.lake-container', {
    defaultValue: value,
  });
  editor.render();
  new Toolbar(editor, [
    'undo',
    'redo',
    '|',
    'heading',
    'fontFamily',
    'fontSize',
    '|',
    'formatPainter',
    'removeFormat',
    'bold',
    'italic',
    'underline',
    'strikethrough',
    'superscript',
    'subscript',
    'code',
    '|',
    'fontColor',
    'highlight',
    '|',
    'numberedList',
    'bulletedList',
    'checklist',
    '|',
    'alignLeft',
    'alignCenter',
    'alignRight',
    'alignJustify',
    '|',
    'increaseIndent',
    'decreaseIndent',
    '|',
    'image',
    'link',
    'codeBlock',
    'blockQuote',
    'hr',
    '|',
    'selectAll',
  ]).render('.lake-toolbar');
  return editor;
};
