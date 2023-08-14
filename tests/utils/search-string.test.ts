import { expect } from 'chai';
import { searchString } from '../../src/utils';

describe('utils.searchString()', () => {
  it('search a string', () => {
    expect(searchString('one,two,three', 'two')).to.equal(true);
    expect(searchString('one two three', 'two', ' ')).to.equal(true);
    expect(searchString('one two three', 'four', ' ')).to.equal(false);
  });
});
