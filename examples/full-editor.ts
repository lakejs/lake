import { Editor, Toolbar } from '../src';

const toolbarConfig = [
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
];

export default (value: string) => {
  const editor = new Editor({
    root: '.lake-main',
    value,
  });
  editor.render();
  new Toolbar(editor, toolbarConfig).render('.lake-toolbar');
  return editor;
};
