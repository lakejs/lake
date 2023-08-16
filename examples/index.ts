import LakeCore from '../src/main';

const { utils, } = LakeCore;
const { query, } = utils;

window.DEBUG = true;

const heading = 'h1,h2,h3,h4,h5,h6,paragraph'.split(',');

const editor = new LakeCore('.lake-editor', {
  className: 'lake-editor',
});

editor.create();

query('.lake-toolbar-icon').on('click', e => {
  e.preventDefault();
  const type = query(e.target as Element).attr('data-type');
  if (heading.indexOf(type) >= 0) {
    editor.command.run('heading', type);
    return;
  }
});
