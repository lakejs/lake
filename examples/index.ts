import './index.css';
import './default-editor.css';
import { Editor, Utils, Dropdown } from '../src';
import './reset.css';
import defaultEditor from './default-editor';
import fullEditor from './full-editor';
import documentEditor from './document-editor';
import miniatureEditor from './miniature-editor';
import headlessEditor from './headless-editor';
import contentView from './content-view';

const { query, safeTemplate } = Utils;

declare global {
  interface Window {
    Editor: typeof Editor;
    editor: Editor;
    defaultValue: string;
    miniatureValue: string;
    headlessValue: string;
    hugeValue: string;
  }
}

window.Editor = Editor;

const menuItems = [
  {
    url: './',
    text: 'Default configuration',
    source: 'https://github.com/lakejs/lake/blob/main/examples/default-editor.ts',
    editorValue: window.defaultValue,
    editor: defaultEditor,
  },
  {
    url: './full-featured',
    text: 'Full-featured editor',
    source: 'https://github.com/lakejs/lake/blob/main/examples/full-editor.ts',
    editorValue: window.defaultValue,
    editor: fullEditor,
  },
  {
    url: './document',
    text: 'Document editor',
    source: 'https://github.com/lakejs/lake/blob/main/examples/default-editor.ts',
    editorValue: window.defaultValue,
    editor: documentEditor,
  },
  {
    url: './miniature',
    text: 'Miniature toolbar',
    source: 'https://github.com/lakejs/lake/blob/main/examples/miniature-editor.ts',
    editorValue: window.miniatureValue,
    editor: miniatureEditor,
  },
  {
    url: './headless',
    text: 'Headless editor',
    source: 'https://github.com/lakejs/lake/blob/main/examples/headless-editor.ts',
    editorValue: window.headlessValue,
    editor: headlessEditor,
  },
  {
    url: './huge-content',
    text: 'Huge Content',
    source: 'https://github.com/lakejs/lake/blob/main/examples/default-editor.ts',
    editorValue: window.hugeValue,
    editor: defaultEditor,
  },
  {
    url: './content-view',
    text: 'Content view',
    source: 'https://github.com/lakejs/lake/blob/main/examples/content-view.ts',
    editorValue: window.defaultValue,
    editor: contentView,
  },
];

const languageMenuItems = [
  {
    value: 'en-US',
    text: 'English',
  },
  {
    value: 'zh-CN',
    text: '简体中文',
  },
  {
    value: 'ja',
    text: '日本語',
  },
  {
    value: 'ko',
    text: '한국어',
  },
];

const directionMenuItems = [
  {
    value: 'ltr',
    text: 'Left to Right',
  },
  {
    value: 'rtl',
    text: 'Right to Left',
  },
];

const menuItemMap: Map<string, typeof menuItems[0]> = new Map();
for (const item of menuItems) {
  const type = item.url.substring(2) || 'default';
  menuItemMap.set(type, item);
}

function renderLanguage(): void {
  const localStorageKey = 'lake-example-language';
  const languageDropdown = new Dropdown({
    root: query('.header .language'),
    name: 'language',
    icon: '<img src="../assets/icons/globe.svg" />',
    defaultValue: localStorage.getItem(localStorageKey) ?? 'en-US',
    tooltip: 'Select language',
    width: 'auto',
    menuType: 'list',
    menuItems: languageMenuItems,
    onSelect: value => {
      localStorage.setItem(localStorageKey, value);
      window.location.reload();
    },
  });
  languageDropdown.render();
}

function renderDirection(): void {
  const localStorageKey = 'lake-example-direction';
  const directionDropdown = new Dropdown({
    root: query('.header .direction'),
    name: 'direction',
    icon: '<img src="../assets/icons/direction.svg" />',
    defaultValue: localStorage.getItem(localStorageKey) ?? 'en-US',
    tooltip: 'Select writing direction',
    width: 'auto',
    menuType: 'list',
    menuItems: directionMenuItems,
    onSelect: value => {
      localStorage.setItem(localStorageKey, value);
      window.location.reload();
    },
  });
  directionDropdown.render();
}

function renderHeader(pageType: string): void {
  const currentItem = menuItemMap.get(pageType);
  if (!currentItem) {
    return;
  }
  const titleNode = query('.header .title');
  titleNode.text(currentItem.text);
  const sourceNode = query('.header .source');
  sourceNode.append(`<a href="${currentItem.source}" target="_blank" title="View Source"><img src="../assets/icons/code.svg" /></a>`);
  renderLanguage();
  renderDirection();
  const menuNode = query('.header .menu');
  menuNode.append('<button type="button" name="list"><img src="../assets/icons/list.svg" /></button>');
  const ul = query('<ul />');
  menuNode.append(ul);
  for (const item of menuItems) {
    ul.append(safeTemplate`<li><a href="${item.url}">${item.text}</a></li>`);
  }
  let timeoutId: number | null = null;
  const showMenuListener = () => {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      timeoutId = null;
    }
    menuNode.find('button').addClass('hovered');
    menuNode.find('ul').show();
  };
  menuNode.on('click', showMenuListener);
  menuNode.on('mouseenter', showMenuListener);
  menuNode.on('mouseleave', () => {
    timeoutId = window.setTimeout(() => {
      menuNode.find('button').removeClass('hovered');
      menuNode.find('ul').hide();
    }, 300);
  });
}

function renderEditor(pageType: string): void {
  const currentItem = menuItemMap.get(pageType);
  if (!currentItem) {
    window.location.href = './';
    return;
  }
  query(document.body).addClass(pageType);
  const localStorageKey = `lake-example-${pageType}-value`;
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
  renderHeader(pageType);
  renderEditor(pageType);
}

renderPage();
