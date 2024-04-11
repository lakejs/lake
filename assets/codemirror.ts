import { EditorState, Compartment } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { history, defaultKeymap, historyKeymap, indentWithTab } from '@codemirror/commands';
import { HighlightStyle, syntaxHighlighting, LanguageSupport } from '@codemirror/language';
import { cpp } from '@codemirror/lang-cpp';
import { css } from '@codemirror/lang-css';
import { go } from '@codemirror/lang-go';
import { html } from '@codemirror/lang-html';
import { java } from '@codemirror/lang-java';
import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';
import { markdown } from '@codemirror/lang-markdown';
import { php } from '@codemirror/lang-php';
import { python } from '@codemirror/lang-python';
import { rust } from '@codemirror/lang-rust';
import { sql } from '@codemirror/lang-sql';
import { xml } from '@codemirror/lang-xml';
import { yaml } from '@codemirror/lang-yaml';
import { tags } from '@lezer/highlight';

type LangItem = {
  value: string,
  text: string,
  component?: () => LanguageSupport,
};

const langItems: LangItem[] = [
  { value: 'text', text: 'Plain text' },
  { value: 'c', text: 'C', component: cpp },
  { value: 'csharp', text: 'C#', component: cpp },
  { value: 'cpp', text: 'C++', component: cpp },
  { value: 'css', text: 'CSS', component: css },
  { value: 'go', text: 'Go', component: go },
  { value: 'html', text: 'HTML', component: html },
  { value: 'java', text: 'Java', component: java },
  { value: 'javascript', text: 'JavaScript', component: javascript },
  { value: 'json', text: 'JSON', component: json },
  { value: 'markdown', text: 'Markdown', component: markdown },
  { value: 'php', text: 'PHP', component: php },
  { value: 'python', text: 'Python', component: python },
  { value: 'rust', text: 'Rust', component: rust },
  { value: 'sql', text: 'SQL', component: sql },
  { value: 'typescript', text: 'TypeScript', component: javascript },
  { value: 'xml', text: 'XML', component: xml },
  { value: 'yaml', text: 'YAML', component: yaml },
];

export {
  EditorState,
  Compartment,
  EditorView,
  keymap,
  history,
  defaultKeymap,
  historyKeymap,
  indentWithTab,
  HighlightStyle,
  syntaxHighlighting,
  tags,
  langItems,
};
