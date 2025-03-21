/* eslint-disable no-console */

import { Editor, Toolbar } from 'lakelib';

export default (value: string) => {
  const toolbar = new Toolbar({
    root: '.lake-toolbar-root',
  });
  const editor = new Editor({
    root: '.lake-root',
    toolbar,
    lang: window.LAKE_LANGUAGE,
    value,
    image: {
      requestAction: '/upload',
    },
  });
  editor.event.on('statechange', () => {
    console.log('Event "statechange" emitted');
  });
  editor.event.on('change', (val: string) => {
    console.log(`Event "change" emitted, the length of the value is ${val.length}`);
  });
  editor.render();
  return editor;
};
