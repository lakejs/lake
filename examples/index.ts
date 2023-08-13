import LakeCore from '../src/main';

window.DEBUG = true;

const lakeCore = new LakeCore('.lake-editor', {
  className: 'lake-editor',
});

lakeCore.create();
