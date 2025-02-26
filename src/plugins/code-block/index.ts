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

const colors = {
  keyword: 'var(--lake-code-highlight-keyword)',
  name: 'var(--lake-code-highlight-name)',
  function: 'var(--lake-code-highlight-function)',
  constant: 'var(--lake-code-highlight-constant)',
  definition: 'var(--lake-code-highlight-definition)',
  type: 'var(--lake-code-highlight-type)',
  operator: 'var(--lake-code-highlight-operator)',
  comment: 'var(--lake-code-highlight-comment)',
  heading: 'var(--lake-code-highlight-heading)',
  boolean: 'var(--lake-code-highlight-boolean)',
  string: 'var(--lake-code-highlight-string)',
  number: 'var(--lake-code-highlight-number)',
  invalid: 'var(--lake-code-highlight-invalid)',
};

export default (editor: Editor) => {
  if (!window.LakeCodeMirror) {
    return;
  }
  editor.setPluginConfig('codeBlock', {
    langList,
    defaultLang: 'text',
    colors,
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
