import { expect } from 'chai';
import { getWindow } from '../../src/utils';

describe('getWindow in utils', () => {
  it('node is null', () => {
    expect(getWindow(null)).to.equal(window);
  });

  it('node is window', () => {
    expect(getWindow(window)).to.equal(window);
  });

  it('node is document', () => {
    expect(getWindow(document)).to.equal(window);
  });

  it('node is element', () => {
    expect(getWindow(document.body)).to.equal(window);
  });

  it('node is text node', () => {
    const textNode = document.createTextNode('one');
    document.body.appendChild(textNode);
    expect(getWindow(textNode)).to.equal(window);
    document.body.removeChild(textNode);
  });

  it('invalid node', () => {
    expect(getWindow('one')).to.equal(window);
  });
});
