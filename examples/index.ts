import './index.css';
import { Editor, Utils } from '../src';
import { defaultValue } from './data/default-value';
import { miniatureValue } from './data/miniature-value';
import { headlessValue } from './data/headless-value';
import { hugeValue } from './data/huge-value';
import defaultEditor from './default-editor';
import fullEditor from './full-editor';
import miniatureEditor from './miniature-editor';
import headlessEditor from './headless-editor';

const { query } = Utils;

declare global {
  interface Window {
    editor: Editor;
  }
}

window.DEBUG = true;

type MenuItem = {
  url: string,
  text: string,
  editorValue: string,
  editor: (value: string) => Editor,
};

const menuItems: MenuItem[] = [
  {
    url: './',
    text: 'Default configuration',
    editorValue: defaultValue,
    editor: defaultEditor,
  },
  {
    url: './full-featured',
    text: 'Full-featured editor',
    editorValue: defaultValue,
    editor: fullEditor,
  },
  {
    url: './document',
    text: 'Document editor',
    editorValue: defaultValue,
    editor: defaultEditor,
  },
  {
    url: './miniature',
    text: 'Miniature toolbar',
    editorValue: miniatureValue,
    editor: miniatureEditor,
  },
  {
    url: './headless',
    text: 'Headless editor',
    editorValue: headlessValue,
    editor: headlessEditor,
  },
  {
    url: './mobile',
    text: 'Mobile friendly editor',
    editorValue: defaultValue,
    editor: defaultEditor,
  },
  {
    url: './i18n',
    text: 'Internationalization',
    editorValue: defaultValue,
    editor: defaultEditor,
  },
  {
    url: './huge-content',
    text: 'Huge Content',
    editorValue: hugeValue,
    editor: defaultEditor,
  },
];

const menuItemMap: Map<string, MenuItem> = new Map();
for (const item of menuItems) {
  const type = item.url.substring(2) || 'default';
  menuItemMap.set(type, item);
}

function renderMenu(): void {
  const menuNode = query('.menu');
  menuNode.append('<button type="button"><img src="../assets/list.svg" /></button>');
  const ul = query('<ul />');
  menuNode.append(ul);
  for (const item of menuItems) {
    ul.append(`<li><a href="${item.url}">${item.text}</a></li>`);
  }
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
}

function renderTitle(pageType: string): void {
  const currentItem = menuItemMap.get(pageType);
  if (!currentItem) {
    return;
  }
  const titleNode = query('.header .title');
  titleNode.html(currentItem.text);
}

function renderEditor(pageType: string): void {
  const currentItem = menuItemMap.get(pageType);
  if (!currentItem) {
    return;
  }
  const localStorageKey = `lake-example-${pageType}`;
  const editorValue = localStorage.getItem(localStorageKey) ?? currentItem.editorValue;
  const editor = currentItem.editor(editorValue);
  editor.event.on('change', value => {
    localStorage.setItem(localStorageKey, value);
  });
  window.editor = editor;
}

function renderPage(): void {
  const url = window.location.href;
  const pageType = url.split('/').pop() || 'default';
  renderTitle(pageType);
  renderMenu();
  renderEditor(pageType);
}

renderPage();
