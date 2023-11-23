import { expect } from 'chai';
import { TextParser } from '../../src/parsers/text-parser';

describe('parsers / text-parser', () => {

  it('getHTML method: converts \\n', () => {
    const input = 'one\ntwo\n\nthree\n\n\nfour\n\n\n\nfive\n\n\n\n\n';
    const output = '<p>one</p><p>two</p><p><br /></p><p>three</p><p><br /></p><p>four</p><p><br /></p><p>five</p>';
    const textParser = new TextParser(input);
    expect(textParser.getHTML()).to.equal(output);
  });

  it('getHTML method: converts \\r', () => {
    const input = 'one\rtwo\r\rthree\r\r\rfour\r\r\r\rfive\r\r\r\r\r';
    const output = '<p>one</p><p>two</p><p><br /></p><p>three</p><p><br /></p><p>four</p><p><br /></p><p>five</p>';
    const textParser = new TextParser(input);
    expect(textParser.getHTML()).to.equal(output);
  });

  it('getHTML method: converts \\r\\n', () => {
    const input = 'one\r\ntwo\r\n\r\nthree\r\n\r\n\r\nfour\r\n\r\n\r\n\r\nfive\r\n\r\n\r\n\r\n\r\n';
    const output = '<p>one</p><p>two</p><p><br /></p><p>three</p><p><br /></p><p>four</p><p><br /></p><p>five</p>';
    const textParser = new TextParser(input);
    expect(textParser.getHTML()).to.equal(output);
  });

  it('getHTML method: converts all of the reserved characters', () => {
    const input = '<p id="myId">& one  two</p>   three    four';
    const output = '<p>&lt;p id=&quot;myId&quot;&gt;&amp; one &nbsp;two&lt;/p&gt; &nbsp; three &nbsp; &nbsp;four</p>';
    const textParser = new TextParser(input);
    expect(textParser.getHTML()).to.equal(output);
  });

  it('getFragment method: converts \\n', () => {
    const input = 'one\ntwo';
    const textParser = new TextParser(input);
    const fragment = textParser.getFragment();
    expect(fragment.childNodes.length).to.equal(2);
    expect(fragment.firstChild?.nodeName).to.equal('P');
  });

});
