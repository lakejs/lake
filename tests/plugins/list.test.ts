import { testPlugin } from '../utils';

describe('list plugin', () => {

  it('no text is selected: sets a numbered list', () => {
    const content = `
    <p>numbered list<focus /></p>
    <p>foo</p>
    `;
    const output = `
    <ol><li>numbered list<focus /></li></ol>
    <p>foo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('list', 'numbered');
      },
    );
  });

});
