import './headless-editor.css';
import { Editor, Utils, Button } from '../src';

export default (value: string) => {
  const editor = new Editor({
    root: '.lake-root',
    value,
  });
  const toolbarRoot = Utils.query('.lake-toolbar-root');
  toolbarRoot.addClass('lake-custom-properties');
  const buttonList: Button[] = [];
  // Heading 1
  buttonList.push(new Button({
    root: toolbarRoot,
    name: 'heading1',
    text: 'H1',
    tooltip: 'Heading 1',
    onClick: () => {
      editor.focus();
      editor.command.execute('heading', 'h1');
    },
  }));
  // Heading 2
  buttonList.push(new Button({
    root: toolbarRoot,
    name: 'heading2',
    text: 'H2',
    tooltip: 'Heading 2',
    onClick: () => {
      editor.focus();
      editor.command.execute('heading', 'h2');
    },
  }));
  // Heading 3
  buttonList.push(new Button({
    root: toolbarRoot,
    name: 'heading3',
    text: 'H3',
    tooltip: 'Heading 3',
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
  // Underline
  buttonList.push(new Button({
    root: toolbarRoot,
    name: 'underline',
    text: 'U',
    tooltip: 'Underline',
    onClick: () => {
      editor.focus();
      editor.command.execute('underline');
    },
  }));
  for (const button of buttonList) {
    button.render();
  }
  editor.event.on('statechange', data => {
    const { disabledNameMap, selectedNameMap, selectedValuesMap } = data;
    for (const button of buttonList) {
      const name = button.node.attr('name');
      let isDisabled = disabledNameMap.get(name);
      let isSelected = selectedNameMap.get(name);
      const headingValues = selectedValuesMap.get('heading') ?? [];
      if (name === 'heading1') {
        isSelected = headingValues[0] === 'h1';
      } else if (name === 'heading2') {
        isSelected = headingValues[0] === 'h2';
      } else if (name === 'heading3') {
        isSelected = headingValues[0] === 'h3';
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
