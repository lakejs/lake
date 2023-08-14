import { expect } from 'chai';
import { query } from '../../src/utils';
import { Range, Nodes } from '../../src/models';
import { insertContents } from '../../src/commands';

describe('commands.insertContents()', () => {
  let element: Nodes;

  beforeEach(() => {
    element = query('<div><strong>foo1</strong>bar1</div>').appendTo(document.body);
  });

  afterEach(() => {
    element.remove();
  });

  it('to insert an element after text node', () => {
    const range = new Range();
    range.selectNodeContents(element.find('strong'));
    range.collapse(false);
    insertContents(range, '<em>foo</em>');
    expect(element.html()).to.equal('<strong>foo1<em>foo</em></strong>bar1');
  });

  it('to insert multi-element after text node', () => {
    const range = new Range();
    range.selectNodeContents(element.find('strong'));
    range.collapse(false);
    insertContents(range, '<em>foo</em><span>bar</span>');
    expect(element.html()).to.equal('<strong>foo1<em>foo</em><span>bar</span></strong>bar1');
  });

  it('to call insertContents() several times consecutively', () => {
    const range = new Range();
    range.selectNodeContents(element.find('strong'));
    range.collapse(false);
    insertContents(range, '<em>foo</em>');
    insertContents(range, '<span>bar</span>');
    insertContents(range, '<strong>last</strong>');
    expect(element.html()).to.equal('<strong>foo1<em>foo</em><span>bar</span><strong>last</strong></strong>bar1');
  });
});
