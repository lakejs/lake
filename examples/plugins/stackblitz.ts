import { Editor, BoxValue, createIframeBox } from 'lakelib';

const stackblitzBox = createIframeBox({
  type: 'block',
  name: 'stackblitz',
  width: '100%',
  height: '500px',
  formDescription: 'Paste your StackBlitz link below.',
  urlPlaceholder: 'https://stackblitz.com/edit/...',
  embedButtonText: 'Embed',
  deleteButtonText: 'Delete',
  validUrl: url => url.indexOf('https://stackblitz.com/') === 0,
  urlError: 'Invalid StackBlitz URL',
  iframePlaceholder: '<span>StackBlitz</span>',
  iframeAttributes: url => {
    const iframeUrl = new URL(url);
    iframeUrl.searchParams.set('embed', '1');
    iframeUrl.searchParams.set('ctl', '1');
    return {
      src: iframeUrl.toString(),
      scrolling: 'no',
      frameborder: '0',
    };
  },
});

export {
  stackblitzBox,
};

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  editor.command.add('stackblitz', {
    execute: (value?: BoxValue) => {
      const box = editor.selection.insertBox('stackblitz', value);
      editor.history.save();
      if (box) {
        const urlInput = box.getContainer().find('input[name="url"]');
        if (urlInput.length > 0) {
          urlInput.focus();
        }
      }
    },
  });
};
