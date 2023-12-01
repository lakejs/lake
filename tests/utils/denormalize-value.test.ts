import { expect } from 'chai';
import { denormalizeValue } from '../../src/utils';

describe('utils / denormalize-value', () => {

  it('denormalizes special tags', () => {
    expect(denormalizeValue('<lake-box type="block" name="hr">\n<span class="lake-box-strip"><br /></span><div class="lake-box-container" contenteditable="false"><hr /></div><span class="lake-box-strip"><br /></span></lake-box>')).to.equal('<lake-box type="block" name="hr"></lake-box>');
    expect(denormalizeValue('<p><br /><lake-bookmark type="focus"></lake-bookmark></p>')).to.equal('<p><br /><focus /></p>');
    expect(denormalizeValue('<p><lake-bookmark type="anchor"></lake-bookmark>foo<lake-bookmark type="focus"></lake-bookmark></p>')).to.equal('<p><anchor />foo<focus /></p>');
    expect(denormalizeValue('<p><br /><lake-bookmark type="anchor"></lake-bookmark></p>')).to.equal('<p><br /><anchor /></p>');
  });

});
