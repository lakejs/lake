import { Editor, BoxValue, createIframeBox } from 'lakelib';

const codesandboxBox = createIframeBox({
  type: 'block',
  name: 'codesandbox',
  width: '100%',
  height: '500px',
  formDescription: 'Paste a CodeSandbox link to embed the running sandbox.',
  urlPlaceholder: 'https://codesandbox.io/p/sandbox/...',
  embedButtonText: 'Embed',
  deleteButtonText: 'Delete',
  validUrl: url => url.indexOf('https://codesandbox.io/') === 0,
  urlError: 'Invalid CodeSandbox URL',
  iframePlaceholder: '<span>CodeSandbox</span>',
  iframeAttributes: url => ({
    src: url.replace('/p/sandbox/', '/embed/'),
    scrolling: 'no',
    frameborder: '0',
    allow: 'accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking',
    sandbox: 'allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts',
  }),
  beforeIframeLoad: box => {
    const boxContainer = box.getContainer();
    const placeholder = boxContainer.find('.lake-iframe-placeholder');
    const iframe = boxContainer.find('iframe');
    const messageListener = (event: MessageEvent) => {
      if (event.origin === 'https://codesandbox.io') {
        const height = JSON.parse(event.data).height;
        if (height > 0) {
          placeholder.css('height', `${height}px`);
          iframe.css('height', `${height}px`);
          window.removeEventListener('message', messageListener);
        }
      }
    };
    window.addEventListener('message', messageListener);
  },
});

export {
  codesandboxBox,
};

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  editor.command.add('codesandbox', {
    execute: (value?: BoxValue) => {
      const box = editor.selection.insertBox('codesandbox', value);
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
