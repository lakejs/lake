import { testOperation } from '../utils';
import { splitBlock } from '../../src/operations';

describe('operations.splitBlock()', () => {

  it('collapsed range: splitting a block with a text', () => {
    const content = `
    <p>one<focus />two</p>
    `;
    const output = `
    <p>one</p>
    <p><focus />two</p>
    `;
    testOperation(
      content,
      output,
      range => {
        splitBlock(range);
      },
    );
  });

  it('collapsed range: splitting a block with a mark', () => {
    const content = `
    <p><strong>one<focus />two</strong></p>
    `;
    const output = `
    <p><strong>one</strong></p>
    <p><strong><focus />two</strong></p>
    `;
    testOperation(
      content,
      output,
      range => {
        splitBlock(range);
      },
    );
  });

  it('expanded range: splitting a block with a text', () => {
    const content = `
    <p>one<anchor />foo<focus />two</p>
    `;
    const output = `
    <p>one</p>
    <p><focus />two</p>
    `;
    testOperation(
      content,
      output,
      range => {
        splitBlock(range);
      },
    );
  });

  it('expanded range: splitting a block with a mark', () => {
    const content = `
    <p><strong>one<anchor />foo<focus />two</strong></p>
    `;
    const output = `
    <p><strong>one</strong></p>
    <p><strong><focus />two</strong></p>
    `;
    testOperation(
      content,
      output,
      range => {
        splitBlock(range);
      },
    );
  });

  it('expanded range: splitting multi-block', () => {
    const content = `
    <p>foo1<anchor />bar1</p>
    <p>foo2<focus />bar2</p>
    `;
    const output = `
    <p>foo1</p>
    <p><focus />bar2</p>
    `;
    testOperation(
      content,
      output,
      range => {
        splitBlock(range);
      },
    );
  });

  it('collapsed range: splitting a block at the beginning of the text', () => {
    const content = `
    <p><focus />foo</p>
    `;
    const output = `
    <p><br /></p>
    <p><focus />foo</p>
    `;
    testOperation(
      content,
      output,
      range => {
        splitBlock(range);
      },
    );
  });

  it('collapsed range: splitting a block at the end of the text', () => {
    const content = `
    <p>foo<focus /></p>
    `;
    const output = `
    <p>foo</p>
    <p><focus /><br /></p>
    `;
    testOperation(
      content,
      output,
      range => {
        splitBlock(range);
      },
    );
  });

});
