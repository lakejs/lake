import { encode } from '../../src/utils/encode';

describe('utils / encode', () => {

  it('converts all of the reserved characters to HTML entities', () => {
    expect(encode('foo<>&"bar\xA0')).to.equal('foo&lt;&gt;&amp;&quot;bar&nbsp;');
  });

});
