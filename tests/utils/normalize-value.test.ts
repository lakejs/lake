import { expect } from 'chai';
import { normalizeValue } from '../../src/utils';

describe('utils / normalize-value', () => {

  it('normalizes special tags', () => {
    expect(normalizeValue('<p><br /><focus /></p>')).to.equal('<p><br /><lake-bookmark type="focus"></lake-bookmark></p>');
    expect(normalizeValue('<p><anchor />foo<focus /></p>')).to.equal('<p><lake-bookmark type="anchor"></lake-bookmark>foo<lake-bookmark type="focus"></lake-bookmark></p>');
    expect(normalizeValue('<p><br /><anchor /></p>')).to.equal('<p><br /><lake-bookmark type="anchor"></lake-bookmark></p>');
  });

});
