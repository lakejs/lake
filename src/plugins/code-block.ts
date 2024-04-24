import { type Editor } from '..';
import { BoxValue } from '../types/box';

const langList = [
  'text',
  'c',
  'csharp',
  'cpp',
  'css',
  'go',
  'html',
  'java',
  'javascript',
  'json',
  'markdown',
  'php',
  'python',
  'rust',
  'sql',
  'typescript',
  'xml',
  'yaml',
];

export default (editor: Editor) => {
  if (!window.CodeMirror) {
    return;
  }
  editor.setPluginConfig('codeBlock', {
    langList,
    defaultLang: 'text',
  });
  editor.command.add('codeBlock', {
    execute: (value: BoxValue) => {
      const box = editor.insertBox('codeBlock', value);
      editor.history.save();
      const codeEditor = box.getData('codeEditor');
      codeEditor.focus();
    },
  });
};
