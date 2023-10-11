import type LakeCore from '..';

export default (editor: LakeCore) => {
  editor.command.add('indent', (type: 'increase' | 'decrease') => {
    editor.focus();
    const blocks = editor.selection.getBlocks();
    for (const block of blocks) {
      let value = Number.parseInt(block.css('margin-left'), 10) || 0;
      if (type === 'increase') {
        value += 40;
      } else {
        value -= 40;
      }
      if (value <= 0) {
        value = 0;
      }
      if (value === 0) {
        block.css('margin-left', '');
      } else {
        block.css('margin-left', `${value}px`);
      }
      if (block.attr('style') === '') {
        block.removeAttr('style');
      }
    }
    editor.history.save();
    editor.select();
  });
};
