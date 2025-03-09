import listIcon from '../assets/icons/list.svg';
import sunIcon from '../assets/icons/sun.svg';
import globeIcon from '../assets/icons/globe.svg';
import directionIcon from '../assets/icons/direction.svg';
import { Editor, Dropdown, query, template } from 'lakelib';
import './index.css';
import './default-editor.css';
import './reset.css';
import defaultEditor from './default-editor';
import fullEditor from './full-editor';
import documentEditor from './document-editor';
import multipleEditors from './multiple-editors';
import headlessEditor from './headless-editor';
import readonlyEditor from './readonly-editor';
import helloWorld, { helloWorldBox } from './plugins/hello-world';

Editor.box.add(helloWorldBox);

Editor.plugin.add('helloWorld', helloWorld);

declare global {
  interface Window {
    LAKE_THEME: string;
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
    text: 'Default editor',
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
    url: './multiple',
    text: 'Multiple editors',
    editorValue: '<p><br /></p>',
    editor: multipleEditors,
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

const themeMenuItems = [
  {
    value: 'light',
    text: 'Light',
  },
  {
    value: 'dark',
    text: 'Dark',
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

const menuItemMap = new Map<string, typeof menuItems[0]>();
for (const item of menuItems) {
  const type = item.url.substring(2) || 'default';
  menuItemMap.set(type, item);
}

function renderTheme(): void {
  const localStorageKey = 'lake-example-theme';
  const rootElement = query(document.documentElement);
  const languageDropdown = new Dropdown({
    root: query('.header .theme'),
    name: 'theme',
    icon: sunIcon,
    defaultValue: localStorage.getItem(localStorageKey) ?? 'light',
    tooltip: 'Switch theme',
    menuType: 'list',
    menuItems: themeMenuItems,
    onSelect: value => {
      localStorage.setItem(localStorageKey, value);
      rootElement.removeClass('lake-light');
      rootElement.removeClass('lake-dark');
      rootElement.addClass(`lake-${value}`);
    },
  });
  languageDropdown.render();
  rootElement.addClass(`lake-${window.LAKE_THEME}`);
}

function renderLanguage(): void {
  const localStorageKey = 'lake-example-language';
  const languageDropdown = new Dropdown({
    root: query('.header .language'),
    name: 'language',
    icon: globeIcon,
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
    icon: directionIcon,
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
  renderTheme();
  renderLanguage();
  renderDirection();
  const menuNode = query('.header .menu');
  menuNode.append(`<button type="button" name="list">${listIcon}</button>`);
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
