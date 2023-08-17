import LakeCore from '../src/main';

window.DEBUG = true;

const heading = 'h1,h2,h3,h4,h5,h6,paragraph'.split(',');

const editor = new LakeCore('.lake-editor', {
  className: 'lake-editor',
});

editor.create();

const { query, } = editor.utils;

query('.lake-toolbar-icon').on('click', (e: Event) => {
  e.preventDefault();
  const type = query(e.target as Element).attr('data-type');
  if (heading.indexOf(type) >= 0) {
    editor.command.run('heading', type);
    return;
  }
});
