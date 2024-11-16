import { inString } from '../../src/utils/in-string';

describe('utils / in-string', () => {

  it('searches a string', () => {
    expect(inString('one,two,three', 'two')).to.equal(true);
    expect(inString('one two three', 'two', ' ')).to.equal(true);
    expect(inString('one two three', 'four', ' ')).to.equal(false);
  });

});
