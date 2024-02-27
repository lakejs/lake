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

type MenuItem = {
  key: string,
  url: string,
  text: string,
};

const menuItems: MenuItem[] = [
  {
    key: 'default',
    url: './',
    text: 'Default configuration',
  },
  {
    key: 'document-editor',
    url: './document-editor',
    text: 'Document editor',
  },
  {
    key: 'miniature-toolbar',
    url: './miniature-toolbar',
    text: 'Miniature toolbar',
  },
  {
    key: 'headless',
    url: './headless-editor',
    text: 'Headless editor',
  },
  {
    key: 'mobile',
    url: './mobile-editor',
    text: 'Mobile friendly editor',
  },
  {
    key: 'i18n',
    url: './i18n',
    text: 'Internationalization',
  },
  {
    key: 'huge-document',
    url: './huge-document',
    text: 'Huge Document',
  },
];

function renderMenu(): void {
  const menuNode = query('.menu');
  const ul = menuNode.find('ul');
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

function renderTitle(key: string): void {
  const menuItemMap: Map<string, MenuItem> = new Map();
  for (const item of menuItems) {
    menuItemMap.set(item.key, item);
  }
  const currentItem = menuItemMap.get(key);
  if (!currentItem) {
    return;
  }
  const titleNode = query('.header .title');
  titleNode.html(currentItem.text);
}

function renderEditor(key: string): void {
  const localStorageKey = `lake-example-${key}`;
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
}

function renderPage(): void {
  const url = window.location.href;
  let key = menuItems[0].key;
  for (const item of menuItems) {
    if (url.indexOf(item.key) >= 0) {
      key = item.key;
      break;
    }
  }
  renderTitle(key);
  renderMenu();
  renderEditor(key);
}

renderPage();
