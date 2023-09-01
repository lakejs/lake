import { expect } from 'chai';
import { getDocument } from '../../src/utils';

describe('utils.getDocument()', () => {

  it('node is null', () => {
    expect(getDocument(null)).to.equal(document);
  });

  it('node is window', () => {
    expect(getDocument(window)).to.equal(document);
  });

  it('node is document', () => {
    expect(getDocument(document)).to.equal(document);
  });

  it('node is element', () => {
    expect(getDocument(document.body)).to.equal(document);
  });

  it('node is text node', () => {
    const textNode = document.createTextNode('one');
    document.body.appendChild(textNode);
    expect(getDocument(textNode)).to.equal(document);
    document.body.removeChild(textNode);
  });

  it('invalid node', () => {
    expect(getDocument('one')).to.equal(document);
  });

});
