import { expect } from 'chai';
import { denormalizeValue } from '../../src/utils';

describe('utils.denormalizeValue()', () => {

  it('denormalizes special tags', () => {
    expect(denormalizeValue('<figure type="block" name="hr">\n<span class="figure-left"><br /></span><div class="figure-body" contenteditable="false"><hr /></div><span class="figure-right"><br /></span></figure>')).to.equal('<figure type="block" name="hr"></figure>');
    expect(denormalizeValue('<p><br /><bookmark type="focus"></bookmark></p>')).to.equal('<p><br /><focus /></p>');
    expect(denormalizeValue('<p><bookmark type="anchor"></bookmark>foo<bookmark type="focus"></bookmark></p>')).to.equal('<p><anchor />foo<focus /></p>');
    expect(denormalizeValue('<p><br /><bookmark type="anchor"></bookmark></p>')).to.equal('<p><br /><anchor /></p>');
  });

});
