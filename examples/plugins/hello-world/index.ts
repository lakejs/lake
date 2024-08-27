import './index.css';
import { BoxValue, Editor } from '../../../src';
import helloWorldBox from './box';

Editor.box.add(helloWorldBox);

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  editor.command.add('helloWorld', {
    execute: (value: BoxValue) => {
      editor.selection.insertBox('helloWorld', value);
      editor.history.save();
    },
  });
};
