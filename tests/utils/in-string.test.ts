import { expect } from 'chai';
import { inString } from '../../src/utils';

describe('utils.inString()', () => {
  it('to search a string', () => {
    expect(inString('one,two,three', 'two')).to.equal(true);
    expect(inString('one two three', 'two', ' ')).to.equal(true);
    expect(inString('one two three', 'four', ' ')).to.equal(false);
  });
});
