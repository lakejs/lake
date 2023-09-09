import { testOperation } from '../utils';
import { addMark } from '../../src/operations';

describe('operations.addMark()', () => {

  it('collapsed range: adding a mark', () => {
    const content = `
    <p>foo<focus />bar</p>
    `;
    const output = `
    <p>foo<strong>\u200B<focus /></strong>bar</p>
    `;
    testOperation(
      content,
      output,
      range => {
        addMark(range, '<strong />');
      },
    );
  });

  it('expanded range: adding a mark', () => {
    const content = `
    <p>foo<anchor />bold<focus />bar</p>
    `;
    const output = `
    <p>foo<anchor /><strong>bold</strong><focus />bar</p>
    `;
    testOperation(
      content,
      output,
      range => {
        addMark(range, '<strong />');
      },
    );
  });


  it('collapsed range: the mark already exists', () => {
    const content = `
    <p><strong>foo<focus />bar</strong></p>
    `;
    const output = `
    <p><strong>foo<focus />bar</strong></p>
    `;
    testOperation(
      content,
      output,
      range => {
        addMark(range, '<strong />');
      },
    );
  });

  it('expanded range: the mark already exists', () => {
    const content = `
    <p><strong>foo<anchor />bold<focus />bar</strong></p>
    `;
    const output = `
    <p><strong>foo<anchor />bold<focus />bar</strong></p>
    `;
    testOperation(
      content,
      output,
      range => {
        addMark(range, '<strong />');
      },
    );
  });

  it('collapsed range: adding a mark in the other mark', () => {
    const content = `
    <p><em>foo<focus />bar</em></p>
    `;
    const output = `
    <p><em>foo</em><strong><em>\u200B<focus /></em></strong><em>bar</em></p>
    `;
    testOperation(
      content,
      output,
      range => {
        addMark(range, '<strong />');
      },
    );
  });

  it('expanded range: adding a mark in the other mark', () => {
    const content = `
    <p><em>foo<anchor />bold<focus />bar</em></p>
    `;
    const output = `
    <p><em>foo</em><anchor /><strong><em>bold</em></strong><focus /><em>bar</em></p>
    `;
    testOperation(
      content,
      output,
      range => {
        addMark(range, '<strong />');
      },
    );
  });

  it('expanded range: adding a mark in the other nested mark', () => {
    const content = `
    <p><strong><em>foo<anchor />bold<focus />bar</em></strong></p>
    `;
    const output = `
    <p><strong><em>foo</em></strong><anchor /><i><strong><em>bold</em></strong></i><focus /><strong><em>bar</em></strong></p>
    `;
    testOperation(
      content,
      output,
      range => {
        addMark(range, '<i />');
      },
    );
  });

  it('expanded range: start position in the other mark', () => {
    const content = `
    <p><em><anchor />one</em>two<focus />three</p>
    `;
    const output = `
    <p><anchor /><strong><em>one</em></strong><strong>two</strong><focus />three</p>
    `;
    testOperation(
      content,
      output,
      range => {
        addMark(range, '<strong />');
      },
    );
  });

  it('expanded range: end position in the other mark', () => {
    const content = `
    <p>one<anchor /><em>two<focus />three</em></p>
    `;
    const output = `
    <p>one<anchor /><strong><em>two</em></strong><focus /><em>three</em></p>
    `;
    testOperation(
      content,
      output,
      range => {
        addMark(range, '<strong />');
      },
    );
  });

  it('should add a strong to an em', () => {
    const content = `
    <p>one<anchor /><em>two</em><focus />three</p>
    `;
    const output = `
    <p>one<anchor /><strong><em>two</em></strong><focus />three</p>
    `;
    testOperation(
      content,
      output,
      range => {
        addMark(range, '<strong />');
      },
    );
  });

  it('should add a strong to an em with a text', () => {
    const content = `
    <p>one<anchor /><em>two</em>foo<focus />three</p>
    `;
    const output = `
    <p>one<anchor /><strong><em>two</em></strong><strong>foo</strong><focus />three</p>
    `;
    testOperation(
      content,
      output,
      range => {
        addMark(range, '<strong />');
      },
    );
  });

  it('should add a CSS property to a span', () => {
    const content = `
    <p>one<anchor /><span style="color: red;">two</span><focus />three</p>
    `;
    const output = `
    <p>one<anchor /><span style="color: red; text-decoration: underline;">two</span><focus />three</p>
    `;
    testOperation(
      content,
      output,
      range => {
        addMark(range, '<span style="text-decoration: underline;" />');
      },
    );
  });

  it('should add a CSS property to a span with a text', () => {
    const content = `
    <p>one<anchor /><span style="color: red;">two</span>foo<focus />three</p>
    `;
    const output = `
    <p>one<anchor /><span style="color: red; text-decoration: underline;">two</span><span style="text-decoration: underline;">foo</span><focus />three</p>
    `;
    testOperation(
      content,
      output,
      range => {
        addMark(range, '<span style="text-decoration: underline;" />');
      },
    );
  });

  it('should add a CSS property to a span that is above a strong', () => {
    const content = `
    <p>one<anchor /><span style="color: red;"><strong>two</strong></span><focus />three</p>
    `;
    const output = `
    <p>one<anchor /><span style="color: red; text-decoration: underline;"><strong>two</strong></span><focus />three</p>
    `;
    testOperation(
      content,
      output,
      range => {
        addMark(range, '<span style="text-decoration: underline;" />');
      },
    );
  });

  it('should remove a CSS property from a span', () => {
    const content = `
    <p>one<anchor /><span style="color: red; text-decoration: underline;">two</span><focus />three</p>
    `;
    const output = `
    <p>one<anchor /><span style="color: red;">two</span><focus />three</p>
    `;
    testOperation(
      content,
      output,
      range => {
        addMark(range, '<span style="text-decoration: ;" />');
      },
    );
  });

  it('should remove the style attribute when its value is empty', () => {
    const content = `
    <p>one<anchor /><span class="test" style="text-decoration: underline;">two</span><focus />three</p>
    `;
    const output = `
    <p>one<anchor /><span class="test">two</span><focus />three</p>
    `;
    testOperation(
      content,
      output,
      range => {
        addMark(range, '<span style="text-decoration: ;" />');
      },
    );
  });

});
