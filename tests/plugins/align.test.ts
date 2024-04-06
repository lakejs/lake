import { testPlugin } from '../utils';

describe('plugins / align', () => {

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

  it('selectedValues: start', () => {
    const content = `
    <p style="text-align: start;">heading<focus /></p>
    <p>foo</p>
    `;
    const output = content;
    testPlugin(
      content,
      output,
      editor => {
        expect(editor.command.selectedValues('align')[0]).to.equal('left');
      },
    );
  });

  it('selectedValues: center', () => {
    const content = `
    <p style="text-align: center;">heading<focus /></p>
    <p>foo</p>
    `;
    const output = content;
    testPlugin(
      content,
      output,
      editor => {
        expect(editor.command.selectedValues('align')[0]).to.equal('center');
      },
    );
  });

  it('selectedValues: end', () => {
    const content = `
    <p style="text-align: end;">heading<focus /></p>
    <p>foo</p>
    `;
    const output = content;
    testPlugin(
      content,
      output,
      editor => {
        expect(editor.command.selectedValues('align')[0]).to.equal('right');
      },
    );
  });

  it('selectedValues: empty', () => {
    const content = `
    foo<focus />
    `;
    const output = content;
    testPlugin(
      content,
      output,
      editor => {
        expect(editor.command.selectedValues('align').length).to.equal(0);
      },
    );
  });

});
