import { testOperation } from '../utils';
import { addMark } from '../../src/operations';

describe('operations.addMark()', () => {

  it('to add mark to the position of the cursor', () => {
    const content = `
    <p>foo<focus />bar</p>
    `;
    const output = `
    <p>foo<strong><focus /></strong>bar</p>
    `;
    testOperation(
      content,
      output,
      range => {
        addMark(range, '<strong />');
      },
    );
  });

  it('the mark already exists', () => {
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

  it('to add mark in other mark', () => {
    const content = `
    <p><em>foo<focus />bar</em></p>
    `;
    const output = `
    <p><em>foo</em><strong><em><focus /></em></strong><em>bar</em></p>
    `;
    testOperation(
      content,
      output,
      range => {
        addMark(range, '<strong />');
      },
    );
  });

  it('to select ', () => {
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
