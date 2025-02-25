import { BoxValue } from '@/types/box';
import { Editor } from '@/editor';
import codeBlockBox from './code-block-box';

export {
  codeBlockBox,
};

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

const lightColors = {
  keyword: '#af00db', // #af00db
  name: '#444d56', // #444d56
  function: '#005cc5', // #005cc5
  constant: '#0550ae', // #0550ae
  definition: '#444d56', // #444d56
  typeName: '#0550ae', // #0550ae
  operator: '#444d56', // #444d56
  comment: '#008000', // #008000
  heading: '#000080', // #000080
  bool: '#0550ae', // #0550ae
  string: '#a31515', // #a31515
  number: '#098658', // #098658
  invalid: '#cd3131', // #cd3131
};

const darkColors = {
  keyword: '#b392f0', // #b392f0
  name: '#e1e4e8', // #e1e4e8
  function: '#61afef', // #61afef
  constant: '#9ecBff', // #9ecBff
  definition: '#e1e4e8', // #e1e4e8
  typeName: '#9ecBff', // #9ecBff
  operator: '#e1e4e8', // #e1e4e8
  comment: '#6a9955', // #6a9955
  heading: '#569cd6', // #569cd6
  bool: '#9ecBff', // #9ecBff
  string: '#ce9178', // #ce9178
  number: '#b5cea8', // #b5cea8
  invalid: '#f44747', // #f44747
};

export default (editor: Editor) => {
  if (!window.LakeCodeMirror) {
    return;
  }
  const darkMode = editor.container.closest('.lake-dark').length > 0;
  editor.setPluginConfig('codeBlock', {
    langList,
    defaultLang: 'text',
    colors: darkMode ? darkColors : lightColors,
  });
  if (editor.readonly) {
    return;
  }
  editor.command.add('codeBlock', {
    execute: (value: BoxValue) => {
      const box = editor.selection.insertBox('codeBlock', value);
      editor.history.save();
      box.getContainer().find('.lake-code-block').emit('click');
    },
  });
};
