import { expect } from 'chai';
import { denormalizeValue } from '../../src/utils';

describe('utils.denormalizeValue()', () => {
  it('to denormalizeValue special tags', () => {
    expect(denormalizeValue('<p><br /><bookmark type="focus"></bookmark></p>')).to.equal('<p><br /><focus /></p>');
    expect(denormalizeValue('<p><bookmark type="anchor"></bookmark>foo<bookmark type="focus"></bookmark></p>')).to.equal('<p><anchor />foo<focus /></p>');
    expect(denormalizeValue('<p><br /><bookmark type="anchor"></bookmark></p>')).to.equal('<p><br /><anchor /></p>');
  });
});
