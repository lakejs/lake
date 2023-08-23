import { expect } from 'chai';
import { normalizeBookmark } from '../../src/utils';

describe('utils.normalizeBookmark()', () => {
  it('to normalize bookmark tags', () => {
    expect(normalizeBookmark('<p><br /><focus /></p>')).to.equal('<p><br /><bookmark type="focus"></bookmark></p>');
    expect(normalizeBookmark('<p><anchor />foo<focus /></p>')).to.equal('<p><bookmark type="anchor"></bookmark>foo<bookmark type="focus"></bookmark></p>');
    expect(normalizeBookmark('<p><br /><anchor /></p>')).to.equal('<p><br /><bookmark type="anchor"></bookmark></p>');
  });
});
