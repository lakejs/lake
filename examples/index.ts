import LakeCore from '../src/main';

const { query } = LakeCore.utils;

declare global {
  interface Window {
    editor: LakeCore;
  }
}

window.DEBUG = true;

const headingTypes = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
];

const alignTypes = new Map([
  ['alignLeft', 'left'],
  ['alignCenter', 'center'],
  ['alignRight', 'right'],
  ['alignJustify', 'justify'],
]);

const indentTypes = new Map([
  ['increaseIndent', 'increase'],
  ['decreaseIndent', 'decrease'],
]);

const noParameterCommandNames = [
  'undo',
  'redo',
  'selectAll',
  'blockquote',
  'bold',
  'italic',
  'underline',
  'strikethrough',
  'subscript',
  'superscript',
  'code',
];

const editor = new LakeCore('.lake-editor', {
  className: 'my-editor-container',
  defaultValue: query('.lake-editor').html(),
  // defaultValue: 'foo',
});

editor.create();

query('.lake-toolbar-icon').on('click', event => {
  event.preventDefault();
  const type = query(event.target as Element).attr('data-type');
  if (headingTypes.indexOf(type) >= 0) {
    editor.commands.execute('heading', type);
    return;
  }
  if (alignTypes.has(type)) {
    editor.commands.execute('align', alignTypes.get(type));
    return;
  }
  if (indentTypes.has(type)) {
    editor.commands.execute('indent', indentTypes.get(type));
    return;
  }
  if (type === 'fontFamily') {
    editor.commands.execute('fontFamily', 'Segoe UI');
    return;
  }
  if (type === 'fontSize') {
    editor.commands.execute('fontSize', '18px');
    return;
  }
  if (type === 'fontColor') {
    editor.commands.execute('fontColor', '#ff0000');
    return;
  }
  if (type === 'highlight') {
    editor.commands.execute('highlight', '#0000ff');
    return;
  }
  if (noParameterCommandNames.indexOf(type) >= 0) {
    editor.commands.execute(type);
  }
});

window.editor = editor;
