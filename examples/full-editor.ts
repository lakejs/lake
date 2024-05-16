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
  'link',
  'image',
  'file',
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
    lang: window.LAKE_LANGUAGE,
    value,
    onMessage: (type, message) => {
      if (type === 'error') {
        // eslint-disable-next-line no-alert
        window.alert(message);
      } else {
        // eslint-disable-next-line no-console
        console.log(message);
      }
    },
    image: {
      // requestMethod: 'GET',
      // requestAction: '/assets/json/upload-image.json',
      requestAction: '/upload',
    },
    file: {
      requestAction: '/upload',
    },
    codeBlock: {
      // langList: ['text', 'html'],
    },
  });
  editor.render();
  return editor;
};
