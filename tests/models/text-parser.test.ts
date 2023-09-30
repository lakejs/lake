import { expect } from 'chai';
import { TextParser } from '../../src/models';

describe('models.TextParser class', () => {

  it('getHTML method: converts \\n', () => {
    const input = 'one\ntwo\n\nthree\n\n\nfour\n\n\n\nfive\n\n\n\n\n';
    const output = '<p>one</p><p>two</p><p>three</p><p>four</p><p>five</p>';
    const textParser = new TextParser(input);
    expect(textParser.getHTML()).to.equal(output);
  });

  it('getHTML method: converts \\r', () => {
    const input = 'one\rtwo\r\rthree\r\r\rfour\r\r\r\rfive\r\r\r\r\r';
    const output = '<p>one</p><p>two</p><p>three</p><p>four</p><p>five</p>';
    const textParser = new TextParser(input);
    expect(textParser.getHTML()).to.equal(output);
  });

  it('getHTML method: converts \\r\\n', () => {
    const input = 'one\r\ntwo\r\n\r\nthree\r\n\r\n\r\nfour\r\n\r\n\r\n\r\nfive\r\n\r\n\r\n\r\n\r\n';
    const output = '<p>one</p><p>two</p><p>three</p><p>four</p><p>five</p>';
    const textParser = new TextParser(input);
    expect(textParser.getHTML()).to.equal(output);
  });

});
