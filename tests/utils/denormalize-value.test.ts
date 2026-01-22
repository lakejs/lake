import { denormalizeValue } from '../../src/utils/denormalize-value';

describe('utils / denormalize-value', () => {

  it('should denormalize box tag', () => {
    const input = '<lake-box type="block" name="hr">\n<span class="lake-box-strip"><br /></span><div class="lake-box-container" contenteditable="false"><hr /></div><span class="lake-box-strip"><br /></span></lake-box>';
    const output = '<lake-box type="block" name="hr"></lake-box>';
    expect(denormalizeValue(input)).to.equal(output);
  });

  it('should denormalize selection tags', () => {
    expect(denormalizeValue('<p><br /><lake-bookmark type="focus"></lake-bookmark></p>')).to.equal('<p><br /><focus /></p>');
    expect(denormalizeValue('<p><lake-bookmark type="anchor"></lake-bookmark>foo<lake-bookmark type="focus"></lake-bookmark></p>')).to.equal('<p><anchor />foo<focus /></p>');
    expect(denormalizeValue('<p><br /><lake-bookmark type="anchor"></lake-bookmark></p>')).to.equal('<p><br /><anchor /></p>');
    expect(denormalizeValue('<lake-bookmark type="anchor">   </lake-bookmark>')).to.equal('<anchor />');
  });

  it('should not affect unrelated HTML tags', () => {
    const input = '<div>Hello <b>World</b></div>';
    expect(denormalizeValue(input)).to.equal(input);
  });

});
