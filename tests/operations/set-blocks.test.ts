import { testOperation } from '../utils';
import { setBlocks } from '../../src/operations';

describe('operations.setBlocks()', () => {

  it('to set a block with cursor', () => {
    const content = `
    <p>outer start</p>
    <p>foo<strong>bold</strong><focus /></p>
    <p>outer end</p>
    `;
    const output = `
    <p>outer start</p>
    <h1>foo<strong>bold</strong><focus /></h1>
    <p>outer end</p>
    `;
    testOperation(
      content,
      output,
      range => {
        setBlocks(range, '<h1 />');
      },
    );
  });

  it('to set a block with selected text', () => {
    const content = `
    <p>outer start</p>
    <p><anchor />foo<strong>bold</strong><focus /></p>
    <p>outer end</p>
    `;
    const output = `
    <p>outer start</p>
    <h1><anchor />foo<strong>bold</strong><focus /></h1>
    <p>outer end</p>
    `;
    testOperation(
      content,
      output,
      range => {
        setBlocks(range, '<h1 />');
      },
    );
  });

  it('to set multi-block with style', () => {
    const content = `
    <p>outer start</p>
    <p>f<anchor />oo<strong>bold</strong></p>
    <h1>heading</h1>
    <p><em>itelic</em>ba<focus />r</p>
    <p>outer end</p>
    `;
    const output = `
    <p>outer start</p>
    <h2 style="text-align: center;">f<anchor />oo<strong>bold</strong></h2>
    <h2 style="text-align: center;">heading</h2>
    <h2 style="text-align: center;"><em>itelic</em>ba<focus />r</h2>
    <p>outer end</p>
    `;
    testOperation(
      content,
      output,
      range => {
        setBlocks(range, '<h2 style="text-align: center;"></h2>');
      },
    );
  });

  it('to set multi-block with a new block', () => {
    const content = `
    <p>outer start</p>
    f<focus />oo<strong>bold</strong>
    <p>outer end</p>
    `;
    const output = `
    <p>outer start</p>
    <h2>f<focus />oo<strong>bold</strong></h2>
    <p>outer end</p>
    `;
    testOperation(
      content,
      output,
      range => {
        setBlocks(range, '<h2 />');
      },
    );
  });
});
