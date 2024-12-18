import { query } from '../../src/utils/query';
import { fixNumberedList } from '../../src/utils/fix-numbered-list';

describe('utils / fix-numbered-list', () => {

  it('adds start attributes', () => {
    const container = query('<div><ol><li>one</li></ol><ol><li>two</li></ol></div>');
    fixNumberedList(container.children());
    expect(container.html()).to.equal('<ol start="1"><li>one</li></ol><ol start="2"><li>two</li></ol>');
  });

  it('fixes wrong start attributes', () => {
    const container = query('<div><ol start="2"><li>one</li></ol><ol start="3"><li>two</li></ol></div>');
    fixNumberedList(container.children());
    expect(container.html()).to.equal('<ol start="1"><li>one</li></ol><ol start="2"><li>two</li></ol>');
  });

  it('no numbered list', () => {
    const container = query('<div><h1>foo</h1><h2>bar</h2></div>');
    fixNumberedList(container.children());
    expect(container.html()).to.equal('<h1>foo</h1><h2>bar</h2>');
  });

  it('with indent attribute', () => {
    const container = query('<div><ol><li>one</li></ol><ol><li>one</li></ol><ol indent="1"><li>two</li></ol><ol indent="1"><li>two</li></ol></div>');
    fixNumberedList(container.children());
    expect(container.html()).to.equal('<ol start="1"><li>one</li></ol><ol start="2"><li>one</li></ol><ol indent="1" start="1"><li>two</li></ol><ol indent="1" start="2"><li>two</li></ol>');
  });

});
