import { Editor, Toolbar } from '../src';

const toolbarItems = [
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
  'moreStyle',
  '|',
  'fontColor',
  'highlight',
  '|',
  'list',
  'numberedList',
  'bulletedList',
  'checklist',
  '|',
  'align',
  'alignLeft',
  'alignCenter',
  'alignRight',
  'alignJustify',
  '|',
  'indent',
  'increaseIndent',
  'decreaseIndent',
  '|',
  'image',
  'link',
  'codeBlock',
  'blockQuote',
  'paragraph',
  'hr',
  '|',
  'selectAll',
];

export default (value: string) => {
  const toolbar = new Toolbar({
    root: '.lake-toolbar-root',
    items: toolbarItems,
  });
  const editor = new Editor({
    root: '.lake-root',
    toolbar,
    value,
    image: {
      // requestMethod: 'GET',
      // requestAction: '/assets/json/upload-image.json',
      requestAction: '/upload',
    },
  });
  editor.render();
  return editor;
};
