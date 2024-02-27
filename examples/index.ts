import './index.css';
import { Editor, Toolbar, Utils } from '../src';
import { defaultValue } from './data/default-value';

const { query } = Utils;

declare global {
  interface Window {
    editor: Editor;
  }
}

window.DEBUG = true;

const menuNode = query('.menu');
let timeoutId: number | null = null;
menuNode.on('mouseenter', () => {
  if (timeoutId) {
    window.clearTimeout(timeoutId);
    timeoutId = null;
  }
  menuNode.find('button').addClass('hovered');
  menuNode.find('ul').show();
});
menuNode.on('mouseleave', () => {
  timeoutId = window.setTimeout(() => {
    menuNode.find('button').removeClass('hovered');
    menuNode.find('ul').hide();
  }, 300);
});

const localStorageKey = 'lake-example';
const editorValue = localStorage.getItem(localStorageKey) ?? defaultValue;

const editor = new Editor('.lake-container', {
  readonly: false,
  defaultValue: editorValue,
});
editor.event.on('change', value => {
  localStorage.setItem(localStorageKey, value);
});
editor.render();

new Toolbar(editor).render('.lake-toolbar');

window.editor = editor;
