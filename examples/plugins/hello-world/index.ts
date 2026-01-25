import './hello-world-box.css';
import { BoxValue, Editor } from 'lakelib';
import helloWorldBox from './hello-world-box';

export {
  helloWorldBox,
};

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  editor.command.add('helloWorld', {
    isDisabled: activeItems => !!activeItems.find(item => item.node.isHeading),
    execute: (value: BoxValue) => {
      editor.selection.insertBox('helloWorld', value);
      editor.history.save();
    },
  });
};
