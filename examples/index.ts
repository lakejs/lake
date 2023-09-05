import LakeCore from '../src/main';

const { query } = LakeCore.utils;

window.DEBUG = true;

const heading = 'h1,h2,h3,h4,h5,h6,p'.split(',');

const editor = new LakeCore('.lake-editor', {
  className: 'my-editor-container',
  defaultValue: query('.lake-editor').html(),
});

editor.create();

query('.lake-toolbar-icon').on('click', event => {
  event.preventDefault();
  const type = query(event.target as Element).attr('data-type');
  if (heading.indexOf(type) >= 0) {
    editor.commands.execute('heading', type);
    return;
  }
  if (type === 'blockquote') {
    editor.commands.execute('blockquote');
    return;
  }
  if (type === 'bold') {
    editor.commands.execute('bold');
  }
});
