import LakeCore from '../src/main';

const { query } = LakeCore.utils;

declare global {
  interface Window {
    editor: LakeCore;
  }
}

window.DEBUG = true;

const headingTypes = 'h1,h2,h3,h4,h5,h6,p'.split(',');

const noParameterCommandNames = 'blockquote,bold,italic,underline,strikethrough,subscript,superscript,code'.split(',');

const editor = new LakeCore('.lake-editor', {
  className: 'my-editor-container',
  defaultValue: query('.lake-editor').html(),
  // defaultValue: 'foo',
});

editor.create();

query('.lake-toolbar-icon').on('click', event => {
  event.preventDefault();
  const type = query(event.target as Element).attr('data-type');
  if (headingTypes.indexOf(type) >= 0) {
    editor.commands.execute('heading', type);
    return;
  }
  if (type === 'fontFamily') {
    editor.commands.execute('fontFamily', 'Segoe UI');
    return;
  }
  if (noParameterCommandNames.indexOf(type) >= 0) {
    editor.commands.execute(type);
  }
});

window.editor = editor;
