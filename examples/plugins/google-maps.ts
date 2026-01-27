import { Editor, BoxValue, createIframeBox } from 'lakelib';

const googleMapsBox = createIframeBox({
  type: 'inline',
  name: 'googleMaps',
  width: '600px',
  height: '450px',
  formDescription: 'Paste a share code to embed a Google Map.',
  urlPlaceholder: '<iframe src="https://www.google.com/maps/embed...',
  embedButtonText: 'Embed Map',
  deleteButtonText: 'Delete',
  validUrl: url => url.indexOf('<iframe src="https://www.google.com/maps/embed') === 0,
  urlError: 'Invalid Google Maps code',
  iframePlaceholder: '<span>Google Maps</span>',
  iframeAttributes: url => {
    return {
      src: url.replace(/^<iframe src="([^"]+)".+$/, '$1'),
      scrolling: 'no',
      frameborder: '0',
      loading: 'lazy',
      referrerpolicy: 'no-referrer-when-downgrade',
    };
  },
  resize: true,
});

export {
  googleMapsBox,
};

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  editor.command.add('googleMaps', {
    execute: (value?: BoxValue) => {
      const box = editor.selection.insertBox('googleMaps', value);
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
