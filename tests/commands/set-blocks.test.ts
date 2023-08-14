import { expect } from 'chai';
import { query } from '../../src/utils';
import { Range, Nodes } from '../../src/models';
import { setBlocks } from '../../src/commands';

describe('commands.setBlocks()', () => {
  let container: Nodes;

  beforeEach(() => {
    container = query('<div><strong>foo</strong>bar</div>').appendTo(document.body);
  });

  afterEach(() => {
    container.remove();
  });

  it('add a new block', () => {
    const range = new Range();
    range.selectNodeContents(container.find('strong'));
    setBlocks(range, '<p style="text-align: center;"></p>');
    expect(container.html()).to.equal('<p style="text-align: center;"><strong>foo</strong>bar</p>');
  });
});
