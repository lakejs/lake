import { expect } from 'chai';
import { testPlugin } from '../utils';

describe('formatPainter plugin', () => {

  it('copies and adds strong', () => {
    const content = `
    <p><strong><anchor />foo<focus /></strong></p>
    <p>bar</p>
    `;
    const output = `
    <p><strong>foo</strong></p>
    <p><anchor /><strong>bar</strong><focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('formatPainter');
        expect(editor.container.hasClass('lake-format-painter')).to.equal(true);
        editor.selection.range.selectNodeContents(editor.container.find('p').eq(1));
        editor.container.emit('click');
        expect(editor.container.hasClass('lake-format-painter')).to.equal(false);
      },
    );
  });

});
