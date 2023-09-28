import { testPlugin } from '../utils';

describe('align plugin', () => {

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

  it('align center', () => {
    const content = `
    <p><anchor />heading<focus /></p>
    <p>foo</p>
    `;
    const output = `
    <p style="text-align: center;"><anchor />heading<focus /></p>
    <p>foo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('align', 'center');
      },
    );
  });

  it('align right', () => {
    const content = `
    <p><anchor />heading</p>
    <p>foo<focus /></p>
    `;
    const output = `
    <p style="text-align: right;"><anchor />heading</p>
    <p style="text-align: right;">foo<focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('align', 'right');
      },
    );
  });

  it('align justify', () => {
    const content = `
    <p><anchor />heading</p>
    <p>foo<focus /></p>
    `;
    const output = `
    <p style="text-align: justify;"><anchor />heading</p>
    <p style="text-align: justify;">foo<focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('align', 'justify');
      },
    );
  });

});
