import Editor, { Utils } from '../src';
import { defaultValue } from './data/default-value';

const { query } = Utils;

declare global {
  interface Window {
    editor: Editor;
  }
}

window.DEBUG = true;

const headingTypes = new Set([
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
]);

const listTypes = new Map([
  ['numberedList', 'numbered'],
  ['bulletedList', 'bulleted'],
  ['checklist', 'checklist'],
]);

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
  'removeFormat',
  'formatPainter',
  'hr',
];

const localStorageKey = 'lake-core-example';
const editorValue = localStorage.getItem(localStorageKey) ?? defaultValue;

const editor = new Editor('.lake-editor', {
  readonly: false,
  className: 'my-editor-container',
  defaultValue: editorValue,
});

editor.event.on('change', value => {
  localStorage.setItem(localStorageKey, value);
});

editor.create();

query('.lake-toolbar-icon').on('click', event => {
  event.preventDefault();
  event.stopPropagation();
  editor.focus();
  const type = query(event.target as Element).attr('data-type');
  if (headingTypes.has(type)) {
    editor.command.execute('heading', type);
    return;
  }
  if (listTypes.has(type)) {
    editor.command.execute('list', listTypes.get(type));
    return;
  }
  if (alignTypes.has(type)) {
    editor.command.execute('align', alignTypes.get(type));
    return;
  }
  if (indentTypes.has(type)) {
    editor.command.execute('indent', indentTypes.get(type));
    return;
  }
  if (type === 'fontFamily') {
    editor.command.execute('fontFamily', 'Segoe UI');
    return;
  }
  if (type === 'fontSize') {
    editor.command.execute('fontSize', '18px');
    return;
  }
  if (type === 'fontColor') {
    editor.command.execute('fontColor', '#ff0000');
    return;
  }
  if (type === 'highlight') {
    editor.command.execute('highlight', '#0000ff');
    return;
  }
  if (type === 'image') {
    editor.command.execute('image', './data/tianchi.png');
    return;
  }
  if (noParameterCommandNames.indexOf(type) >= 0) {
    editor.command.execute(type);
  }
});

window.editor = editor;
