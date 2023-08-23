import { expect } from 'chai';
import { normalizeValue } from '../../src/utils';

describe('utils.normalizeValue()', () => {
  it('to normalize special tags', () => {
    expect(normalizeValue('<p><br /><focus /></p>')).to.equal('<p><br /><bookmark type="focus"></bookmark></p>');
    expect(normalizeValue('<p><anchor />foo<focus /></p>')).to.equal('<p><bookmark type="anchor"></bookmark>foo<bookmark type="focus"></bookmark></p>');
    expect(normalizeValue('<p><br /><anchor /></p>')).to.equal('<p><br /><bookmark type="anchor"></bookmark></p>');
  });
});
