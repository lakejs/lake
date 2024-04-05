import type { Editor } from '..';
import { query } from '../utils/query';

function setParagraph(editor: Editor) {
  editor.selection.setBlocks('<p />');
}

function setNumberedList(editor: Editor) {
  editor.selection.setBlocks('<ol><li></li></ol>');
}

function setBulletedList(editor: Editor) {
  editor.selection.setBlocks('<ul><li></li></ul>');
}

function setChecklist(editor: Editor, value: boolean) {
  editor.selection.setBlocks(`<ul type="checklist"><li value="${value}"></li></ul>`);
}

export default (editor: Editor) => {
  editor.command.add('list', {
    selectedValues: appliedItems => {
      let currentValue = '';
      for (const item of appliedItems) {
        if (item.name === 'ol') {
          currentValue = 'numbered';
          break;
        }
        if (item.name === 'ul' && !item.node.hasAttr('type')) {
          currentValue = 'bulleted';
          break;
        }
        if (item.name === 'ul' && item.node.attr('type') === 'checklist') {
          currentValue = 'checklist';
          break;
        }
      }
      return [currentValue];
    },
    execute: (type: 'numbered' | 'bulleted' | 'checklist', value: boolean = false) => {
      const blocks = editor.selection.range.getBlocks();
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
          setParagraph(editor);
        }
        if (type === 'bulleted') {
          setBulletedList(editor);
        }
        if (type === 'checklist') {
          setChecklist(editor, value);
        }
      } else if (isBulletedList) {
        if (type === 'numbered') {
          setNumberedList(editor);
        }
        if (type === 'bulleted') {
          setParagraph(editor);
        }
        if (type === 'checklist') {
          setChecklist(editor, value);
        }
      } else if (isChecklist) {
        if (type === 'numbered') {
          setNumberedList(editor);
        }
        if (type === 'bulleted') {
          setBulletedList(editor);
        }
        if (type === 'checklist') {
          setParagraph(editor);
        }
      } else {
        if (type === 'numbered') {
          setNumberedList(editor);
        }
        if (type === 'bulleted') {
          setBulletedList(editor);
        }
        if (type === 'checklist') {
          setChecklist(editor, value);
        }
      }
      editor.history.save();
    },
  });
  editor.container.on('click', event => {
    const mouseEvent = event as MouseEvent;
    if (editor.readonly) {
      return;
    }
    if (!mouseEvent.target) {
      return;
    }
    const target = query(mouseEvent.target as Element);
    if (target.name === 'li' && target.attr('value') !== '' && mouseEvent.offsetX <= 18) {
      target.attr('value', (target.attr('value') !== 'true').toString());
      editor.history.save();
    }
  });
};
