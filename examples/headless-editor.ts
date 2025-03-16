import './headless-editor.css';
import { Editor, Button, query } from 'lakelib';

export default (value: string) => {
  const editor = new Editor({
    root: '.lake-root',
    lang: window.LAKE_LANGUAGE,
    value,
    image: {
      requestAction: '/upload',
    },
  });
  const toolbarRoot = query('.lake-toolbar-root');
  const buttonList: Button[] = [];
  // Heading
  buttonList.push(new Button({
    root: toolbarRoot,
    name: 'heading',
    text: 'H',
    tooltip: 'Heading',
    onClick: () => {
      editor.focus();
      editor.command.execute('heading', 'h3');
    },
  }));
  // Paragraph
  buttonList.push(new Button({
    root: toolbarRoot,
    name: 'paragraph',
    text: 'Paragraph',
    onClick: () => {
      editor.focus();
      editor.command.execute('heading', 'p');
    },
  }));
  // Block quote
  buttonList.push(new Button({
    root: toolbarRoot,
    name: 'blockQuote',
    text: 'Quote',
    onClick: () => {
      editor.focus();
      editor.command.execute('blockQuote');
    },
  }));
  // Bold
  buttonList.push(new Button({
    root: toolbarRoot,
    name: 'bold',
    text: 'B',
    tooltip: 'Bold',
    onClick: () => {
      editor.focus();
      editor.command.execute('bold');
    },
  }));
  // Italic
  buttonList.push(new Button({
    root: toolbarRoot,
    name: 'italic',
    text: 'I',
    tooltip: 'Italic',
    onClick: () => {
      editor.focus();
      editor.command.execute('italic');
    },
  }));
  // Code
  buttonList.push(new Button({
    root: toolbarRoot,
    name: 'code',
    text: 'Code',
    onClick: () => {
      editor.focus();
      editor.command.execute('code');
    },
  }));
  // Link
  buttonList.push(new Button({
    root: toolbarRoot,
    name: 'link',
    text: 'Link',
    onClick: () => {
      editor.focus();
      editor.command.execute('link');
    },
  }));
  // Truth Social
  buttonList.push(new Button({
    root: toolbarRoot,
    name: 'truthsocial',
    text: 'Truth Social',
    onClick: () => {
      editor.focus();
      editor.command.execute('truthsocial');
    },
  }));
  // CodeSandbox
  buttonList.push(new Button({
    root: toolbarRoot,
    name: 'codesandbox',
    text: 'CodeSandbox',
    onClick: () => {
      editor.focus();
      editor.command.execute('codesandbox');
    },
  }));
  for (const button of buttonList) {
    button.render();
  }
  editor.event.on('statechange', state => {
    const { disabledNameMap, selectedNameMap, selectedValuesMap } = state;
    for (const button of buttonList) {
      const name = button.node.attr('name');
      let isDisabled = disabledNameMap.get(name);
      let isSelected = selectedNameMap.get(name);
      const headingValues = selectedValuesMap.get('heading') ?? [];
      if (name === 'heading') {
        isSelected = /^h[1-6]$/i.test(headingValues[0] || '');
      } else if (name === 'paragraph') {
        isSelected = headingValues[0] === 'p';
      } else {
        isDisabled = disabledNameMap.get(name);
        isSelected = selectedNameMap.get(name);
      }
      if (isDisabled) {
        button.node.attr('disabled', 'true');
      } else {
        button.node.removeAttr('disabled');
      }
      if (isSelected) {
        button.node.addClass('lake-button-selected');
      } else {
        button.node.removeClass('lake-button-selected');
      }
    }
  });
  editor.render();
  return editor;
};
