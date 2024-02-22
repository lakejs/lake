import { Editor, Toolbar } from '../src';
import { defaultValue } from './data/default-value';

declare global {
  interface Window {
    editor: Editor;
  }
}

window.DEBUG = true;

const localStorageKey = 'lake-example';
const editorValue = localStorage.getItem(localStorageKey) ?? defaultValue;

const editor = new Editor({
  readonly: false,
  className: 'my-editor-container',
  defaultValue: editorValue,
});
editor.event.on('change', value => {
  localStorage.setItem(localStorageKey, value);
});
editor.render('.lake-content');

new Toolbar(editor).render('.lake-toolbar');

window.editor = editor;
