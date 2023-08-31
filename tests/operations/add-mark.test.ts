import { testOperation } from '../utils';
import { addMark } from '../../src/operations';

describe('operations.addMark()', () => {

  it('collapsed range: adding a mark', () => {
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

  it('collapsed range: adding a mark in other mark', () => {
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

  it('expanded range: adding a mark in other mark', () => {
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

});
