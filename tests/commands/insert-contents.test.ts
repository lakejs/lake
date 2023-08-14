import { expect } from 'chai';
import { query } from '../../src/utils';
import { Range, Nodes } from '../../src/models';
import { insertContents } from '../../src/commands';

describe('commands.insertContents()', () => {
  let container: Nodes;

  beforeEach(() => {
    container = query('<div><strong>foo</strong>bar</div>').appendTo(document.body);
  });

  afterEach(() => {
    container.remove();
  });

  it('to insert an container after text node', () => {
    const range = new Range();
    range.selectNodeContents(container.find('strong'));
    range.collapse(false);
    insertContents(range, '<em>foo</em>');
    expect(container.html()).to.equal('<strong>foo<em>foo</em></strong>bar');
  });

  it('to insert multi-container after text node', () => {
    const range = new Range();
    range.selectNodeContents(container.find('strong'));
    range.collapse(false);
    insertContents(range, '<em>foo</em><span>bar</span>');
    expect(container.html()).to.equal('<strong>foo<em>foo</em><span>bar</span></strong>bar');
  });

  it('to call insertContents() several times consecutively', () => {
    const range = new Range();
    range.selectNodeContents(container.find('strong'));
    range.collapse(false);
    insertContents(range, '<em>foo</em>');
    insertContents(range, '<span>bar</span>');
    insertContents(range, '<strong>last</strong>');
    expect(container.html()).to.equal('<strong>foo<em>foo</em><span>bar</span><strong>last</strong></strong>bar');
  });
});
