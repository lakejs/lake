import LakeCore from '../src/main';

const { query, debug } = LakeCore.utils;

window.DEBUG = true;

const heading = 'h1,h2,h3,h4,h5,h6,paragraph'.split(',');

const editor = new LakeCore('.lake-editor', {
  className: 'my-editor-container',
  // defaultValue: query('.lake-editor').html(),
});

editor.event.on('create', () => {
  debug('Editor demo is created.');
});

editor.create();

query('.lake-toolbar-icon').on('click', (e: Event) => {
  e.preventDefault();
  e.stopPropagation();
  const type = query(e.target as Element).attr('data-type');
  if (heading.indexOf(type) >= 0) {
    editor.commands.run('heading', type);
  }
});
