import { testPlugin } from '../utils';

describe('formatPainter plugin', () => {

  it('align left', () => {
    const content = `
    <p><anchor />heading<focus /></p>
    <p>foo</p>
    `;
    const output = `
    <p style="text-align: left;"><anchor />heading<focus /></p>
    <p>foo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('align', 'left');
      },
    );
  });

});
