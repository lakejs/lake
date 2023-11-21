import { expect } from 'chai';
import { denormalizeValue } from '../../src/utils';

describe('utils.denormalizeValue()', () => {

  it('denormalizes special tags', () => {
    expect(denormalizeValue('<lake-box type="block" name="hr">\n<span class="box-strip"><br /></span><div class="box-body" contenteditable="false"><hr /></div><span class="box-strip"><br /></span></lake-box>')).to.equal('<lake-box type="block" name="hr"></lake-box>');
    expect(denormalizeValue('<p><br /><lake-bookmark type="focus"></lake-bookmark></p>')).to.equal('<p><br /><focus /></p>');
    expect(denormalizeValue('<p><lake-bookmark type="anchor"></lake-bookmark>foo<lake-bookmark type="focus"></lake-bookmark></p>')).to.equal('<p><anchor />foo<focus /></p>');
    expect(denormalizeValue('<p><br /><lake-bookmark type="anchor"></lake-bookmark></p>')).to.equal('<p><br /><anchor /></p>');
  });

});
