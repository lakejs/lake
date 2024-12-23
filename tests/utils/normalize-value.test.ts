import { normalizeValue } from '../../src/utils/normalize-value';

describe('utils / normalize-value', () => {

  it('should normalize complete box tag', () => {
    const input = '<p>foo</p><p><lake-box type="block" name="image"><span></span><div class="lake-box-container"><div>box</div></div><span></span></lake-box></p><p>bar</p>';
    const output = '<p>foo</p><p><lake-box type="block" name="image"></lake-box></p><p>bar</p>';
    expect(normalizeValue(input)).to.equal(output);
  });

  it('should normalize incomplete box tag', () => {
    const input = '<p>foo</p><p><lake-box type="block" name="image"><span></span><div class="lake-box-container"><div>box</div></div><span></span>';
    const output = '<p>foo</p><p><lake-box type="block" name="image"></lake-box>';
    expect(normalizeValue(input)).to.equal(output);
  });

  it('should normalize selection tags', () => {
    expect(normalizeValue('<p><br /><focus /></p>')).to.equal('<p><br /><lake-bookmark type="focus"></lake-bookmark></p>');
    expect(normalizeValue('<p><anchor />foo<focus /></p>')).to.equal('<p><lake-bookmark type="anchor"></lake-bookmark>foo<lake-bookmark type="focus"></lake-bookmark></p>');
    expect(normalizeValue('<p><br /><anchor /></p>')).to.equal('<p><br /><lake-bookmark type="anchor"></lake-bookmark></p>');
  });

});
