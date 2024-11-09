import './index.css';
import './default-editor.css';
import { Editor, Utils, Dropdown } from '../src';
import './reset.css';
import defaultEditor from './default-editor';
import fullEditor from './full-editor';
import documentEditor from './document-editor';
import miniatureEditor from './miniature-editor';
import headlessEditor from './headless-editor';
import readonlyEditor from './readonly-editor';
import helloWorld from './plugins/hello-world';

Editor.plugin.add('helloWorld', helloWorld);

const { query, template } = Utils;

declare global {
  interface Window {
    LAKE_LANGUAGE: string;
    Editor: typeof Editor;
    editor: Editor;
    defaultValue: string;
    hugeValue: string;
  }
}

window.Editor = Editor;

const menuItems = [
  {
    url: './',
    text: 'Default configuration',
    editorValue: window.defaultValue,
    editor: defaultEditor,
  },
  {
    url: './full-featured',
    text: 'Full-featured editor',
    editorValue: window.defaultValue,
    editor: fullEditor,
  },
  {
    url: './document',
    text: 'Document editor',
    editorValue: window.defaultValue,
    editor: documentEditor,
  },
  {
    url: './miniature',
    text: 'Miniature toolbar',
    editorValue: '<p>This example shows you how to use Lake for comment box.</p>',
    editor: miniatureEditor,
  },
  {
    url: './headless',
    text: 'Headless editor',
    editorValue: '<p>This example shows you how to customize a toolbar that is well adapted to your needs.</p>',
    editor: headlessEditor,
  },
  {
    url: './huge-content',
    text: 'Huge Content',
    editorValue: window.hugeValue,
    editor: defaultEditor,
  },
  {
    url: './readonly',
    text: 'Read-only mode',
    editorValue: window.defaultValue,
    editor: readonlyEditor,
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
  renderLanguage();
  renderDirection();
  const menuNode = query('.header .menu');
  menuNode.append('<button type="button" name="list"><img src="../assets/icons/list.svg" /></button>');
  const ul = query('<ul />');
  menuNode.append(ul);
  for (const item of menuItems) {
    ul.append(template`<li><a href="${item.url}">${item.text}</a></li>`);
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
