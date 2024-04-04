import { Editor, Utils, Button } from '../src';

export default (value: string) => {
  Utils.query('.lake-editor').addClass('lake-headless-editor');
  const editor = new Editor({
    root: '.lake-root',
    value,
  });
  const toolbarRoot = Utils.query('.lake-toolbar-root');
  toolbarRoot.addClass('lake-custom-properties');
  // Heading 1
  new Button({
    root: toolbarRoot,
    name: 'heading1',
    text: 'H1',
    tooltip: 'Heading 1',
    onClick: () => {
      editor.focus();
      editor.command.execute('heading', 'h1');
    },
  }).render();
  // Heading 2
  new Button({
    root: toolbarRoot,
    name: 'heading2',
    text: 'H2',
    tooltip: 'Heading 2',
    onClick: () => {
      editor.focus();
      editor.command.execute('heading', 'h2');
    },
  }).render();
  // Heading 3
  new Button({
    root: toolbarRoot,
    name: 'heading3',
    text: 'H3',
    tooltip: 'Heading 3',
    onClick: () => {
      editor.focus();
      editor.command.execute('heading', 'h3');
    },
  }).render();
  // Paragraph
  new Button({
    root: toolbarRoot,
    name: 'paragraph',
    text: 'Paragraph',
    onClick: () => {
      editor.focus();
      editor.command.execute('heading', 'p');
    },
  }).render();
  // Bold
  new Button({
    root: toolbarRoot,
    name: 'bold',
    text: 'B',
    tooltip: 'Bold',
    onClick: () => {
      editor.focus();
      editor.command.execute('bold');
    },
  }).render();
  // Italic
  new Button({
    root: toolbarRoot,
    name: 'italic',
    text: 'I',
    tooltip: 'Italic',
    onClick: () => {
      editor.focus();
      editor.command.execute('italic');
    },
  }).render();
  // Underline
  new Button({
    root: toolbarRoot,
    name: 'underline',
    text: 'U',
    tooltip: 'Underline',
    onClick: () => {
      editor.focus();
      editor.command.execute('underline');
    },
  }).render();
  editor.event.on('statechange', name => {
    toolbarRoot.find(`button[name=${name}]`).addClass('lake-button-selected');
  });
  editor.render();
  return editor;
};
