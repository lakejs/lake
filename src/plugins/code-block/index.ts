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

export default (editor: Editor) => {
  if (!window.LakeCodeMirror) {
    return;
  }
  editor.setPluginConfig('codeBlock', {
    langList,
    defaultLang: 'text',
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
