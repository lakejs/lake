import { testOperation } from '../utils';
import { removeMark } from '../../src/operations';

describe('operations.removeMark()', () => {

  it('removes an empty mark', () => {
    const content = `
    <p>foo<strong><focus /></strong>bar</p>
    `;
    const output = `
    <p>foo<focus />bar</p>
    `;
    testOperation(
      content,
      output,
      range => {
        removeMark(range, '<strong />');
      },
    );
  });

  it('removes a mark when the focus is at the end of the text', () => {
    const content = `
    <p>foo<strong>bold<focus /></strong>bar</p>
    `;
    const output = `
    <p>foo<strong>bold</strong>\u200B<focus />bar</p>
    `;
    testOperation(
      content,
      output,
      range => {
        removeMark(range, '<strong />');
      },
    );
  });

  it('collapsed range: no target mark', () => {
    const content = `
    <p>foo<strong><focus /></strong>bar</p>
    `;
    const output = `
    <p>foo<strong><focus /></strong>bar</p>
    `;
    testOperation(
      content,
      output,
      range => {
        removeMark(range, '<em />');
      },
    );
  });

  it('expanded range: removes a mark with selecting mark', () => {
    const content = `
    <p>foo<anchor /><strong>bold</strong><focus />bar</p>
    `;
    const output = `
    <p>foo<anchor />bold<focus />bar</p>
    `;
    testOperation(
      content,
      output,
      range => {
        removeMark(range, '<strong />');
      },
    );
  });

  it('expanded range: no target mark', () => {
    const content = `
    <p>foo<anchor /><strong>bold</strong><focus />bar</p>
    `;
    const output = `
    <p>foo<anchor /><strong>bold</strong><focus />bar</p>
    `;
    testOperation(
      content,
      output,
      range => {
        removeMark(range, '<em />');
      },
    );
  });

  it('expanded range: removes a mark with selecting text', () => {
    const content = `
    <p>foo<strong><anchor />bold<focus /></strong>bar</p>
    `;
    const output = `
    <p>foo<anchor />bold<focus />bar</p>
    `;
    testOperation(
      content,
      output,
      range => {
        removeMark(range, '<strong />');
      },
    );
  });

  it('expanded range: removes a mark with selecting part of a text', () => {
    const content = `
    <p><strong>foo<anchor />bold<focus />bar</strong></p>
    `;
    const output = `
    <p><strong>foo</strong><anchor />bold<focus /><strong>bar</strong></p>
    `;
    testOperation(
      content,
      output,
      range => {
        removeMark(range, '<strong />');
      },
    );
  });

  it('collapsed range: the mark already exists', () => {
    const content = `
    <p><strong>foo<focus />bar</strong></p>
    `;
    const output = `
    <p><strong>foo</strong>\u200B<focus /><strong>bar</strong></p>
    `;
    testOperation(
      content,
      output,
      range => {
        removeMark(range, '<strong />');
      },
    );
  });

  it('expanded range: the mark already exists', () => {
    const content = `
    <p><strong>foo<anchor />bold<focus />bar</strong></p>
    `;
    const output = `
    <p><strong>foo</strong><anchor />bold<focus /><strong>bar</strong></p>
    `;
    testOperation(
      content,
      output,
      range => {
        removeMark(range, '<strong />');
      },
    );
  });

  it('collapsed range: removes a mark in another mark', () => {
    const content = `
    <p><em>foo</em><strong><em><focus /></em></strong><em>bar</em></p>
    `;
    const output = `
    <p><em>foo</em><focus /><em>bar</em></p>
    `;
    testOperation(
      content,
      output,
      range => {
        removeMark(range, '<strong />');
      },
    );
  });

  it('expanded range: removes a mark in another mark', () => {
    const content = `
    <p><em>foo</em><anchor /><strong><em>bold</em></strong><focus /><em>bar</em></p>
    `;
    const output = `
    <p><em>foo</em><anchor /><em>bold</em><focus /><em>bar</em></p>
    `;
    testOperation(
      content,
      output,
      range => {
        removeMark(range, '<strong />');
      },
    );
  });

});
