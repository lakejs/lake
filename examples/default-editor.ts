/* eslint-disable no-console */

import { Editor, Toolbar } from '../src';

export default (value: string) => {
  const toolbar = new Toolbar({
    root: '.lake-toolbar-root',
  });
  const editor = new Editor({
    root: '.lake-root',
    toolbar,
    value,
  });
  editor.event.on('statechange', () => {
    console.log('Event \'statechange\' emitted');
  });
  editor.event.on('change', (val: string) => {
    console.log(`Event 'change' emitted, the length of the value is ${val.length}`);
  });
  editor.render();
  return editor;
};
