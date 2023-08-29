import { testOperation } from '../utils';
import { addMark } from '../../src/operations';

describe('operations.addMark()', () => {

  it('to add mark to the cursor', () => {
    const content = `
    <p><strong>foo<focus />bar</strong></p>
    `;
    const output = `
    <p><strong>foo</strong><strong><focus /></strong><strong>bar</strong></p>
    `;
    testOperation(
      content,
      output,
      range => {
        addMark(range, '<strong />');
      },
    );
  });

  it('the selection is a part of a text node', () => {
    const content = `
    <p><strong>one<anchor />two<focus />three</strong></p>
    `;
    const output = `
    <p><strong>one<strong><strong><em><anchor />two<focus /></em></strong><strong>three</strong></p>
    `;
    testOperation(
      content,
      output,
      range => {
        addMark(range, '<strong />');
      },
    );
  });

  it('the selection is a part of a text node', () => {
    const content = `
    <p><strong>one<anchor />two<focus />three</strong></p>
    `;
    const output = `
    <p><strong>one<strong><strong><em><anchor />two<focus /></em></strong><strong>three</strong></p>
    `;
    testOperation(
      content,
      output,
      range => {
        addMark(range, '<strong />');
      },
    );
  });

});
