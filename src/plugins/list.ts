import type Editor from '..';
import { Nodes } from '../models/nodes';

export default (editor: Editor) => {
  editor.command.add('list', (type: 'numbered' | 'bulleted' | 'checklist') => {
    editor.focus();
    const blocks = editor.selection.getBlocks();
    let isNumberedList = false;
    let isBulletedList = false;
    let isChecklist = false;
    for (const block of blocks) {
      if (!isNumberedList && block.name === 'ol') {
        isNumberedList = true;
      }
      if (!isBulletedList && block.name === 'ul' && !block.hasAttr('type')) {
        isBulletedList = true;
      }
      if (!isChecklist && block.name === 'ul' && block.attr('type') === 'checklist') {
        isChecklist = true;
      }
    }
    if (isNumberedList) {
      if (type === 'numbered') {
        editor.selection.setBlocks('<p />');
      }
      if (type === 'bulleted') {
        editor.selection.setBlocks('<ul><li></li></ul>');
      }
      if (type === 'checklist') {
        editor.selection.setBlocks('<ul type="checklist"><li value="false"></li></ul>');
      }
    } else if (isBulletedList) {
      if (type === 'numbered') {
        editor.selection.setBlocks('<ol><li></li></ol>');
      }
      if (type === 'bulleted') {
        editor.selection.setBlocks('<p />');
      }
      if (type === 'checklist') {
        editor.selection.setBlocks('<ul type="checklist"><li value="false"></li></ul>');
      }
    } else if (isChecklist) {
      if (type === 'numbered') {
        editor.selection.setBlocks('<ol><li></li></ol>');
      }
      if (type === 'bulleted') {
        editor.selection.setBlocks('<ul><li></li></ul>');
      }
      if (type === 'checklist') {
        editor.selection.setBlocks('<p />');
      }
    } else {
      if (type === 'numbered') {
        editor.selection.setBlocks('<ol><li></li></ol>');
      }
      if (type === 'bulleted') {
        editor.selection.setBlocks('<ul><li></li></ul>');
      }
      if (type === 'checklist') {
        editor.selection.setBlocks('<ul type="checklist"><li value="false"></li></ul>');
      }
    }
    editor.selection.fixList();
    editor.history.save();
    editor.select();
  });
  editor.container.on('click', event => {
    const target = new Nodes(event.target as Element);
    if (target.name === 'li' && target.attr('value') !== '') {
      target.attr('value', target.attr('value') === 'true' ? 'false' : 'true');
    }
  });
};
