import { expect } from 'chai';
import { query } from '../../src/utils';
import { Range, Nodes } from '../../src/models';
import { insertContents } from '../../src/commands';

describe('commands.insertContents()', () => {
  let element1: Nodes;
  let element2: Nodes;

  beforeEach(() => {
    element1 = query('<div><strong>foo1</strong>bar1</div>').appendTo(document.body);
    element2 = query('<div><strong>foo2</strong>bar2</div>').appendTo(document.body);
  });

  afterEach(() => {
    element1.remove();
    element2.remove();
  });

  it('native element', () => {
    const range = new Range();
    range.selectNodeContents(element1.find('strong'));
    range.collapse(false);
    insertContents(range, '<em>foo</em>');
    expect(element1.html()).to.equal('<strong>foo1<em>foo</em></strong>bar1');
  });
});
