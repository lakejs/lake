import { testOperation } from '../utils';
import { Range } from '../../src/models';
import { setBlocks } from '../../src/operations';

describe('operations.setBlocks()', () => {

  it('set a new block', () => {
    const content = `
    <p>outer start</p>
    f<focus />oo<strong>bold</strong>
    <p>outer end</p>
    `;
    const output = `
    <p>outer start</p>
    <h2>foo<strong>bold</strong></h2>
    <p>outer end</p>
    `;
    const operation = (range: Range) => {
      setBlocks(range, '<h2 />');
    };
    testOperation(
      content,
      output,
      operation,
    );
  });

  it('set multi-block', () => {
    const content = `
    <p>outer start</p>
    <p>f<anchor />oo<strong>bold</strong></p>
    <h1>heading</h1>
    <p><em>itelic</em>ba<focus />r</p>
    <p>outer end</p>
    `;
    const output = `
    <p>outer start</p>
    <h2 style="text-align: center;">foo<strong>bold</strong></h2>
    <h2 style="text-align: center;">heading</h2>
    <h2 style="text-align: center;"><em>itelic</em>bar</h2>
    <p>outer end</p>
    `;
    const operation = (range: Range) => {
      setBlocks(range, '<h2 style="text-align: center;"></h2>');
    };
    testOperation(
      content,
      output,
      operation,
    );
  });
});
