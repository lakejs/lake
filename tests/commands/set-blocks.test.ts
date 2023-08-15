import { expect } from 'chai';
import { query } from '../../src/utils';
import { Range, Nodes } from '../../src/models';
import { setBlocks } from '../../src/commands';

describe('commands.setBlocks()', () => {
  let container: Nodes;

  beforeEach(() => {
    container = query('<div contenteditable="true"></div>').appendTo(document.body);
  });

  afterEach(() => {
    container.remove();
  });

  it('set a new block', () => {
    container.html('<p>outer start</p>foo<strong>bold</strong><p>outer end</p>');
    const range = new Range();
    range.setStart(container.find('strong').prev(), 1);
    range.collapse(true);
    setBlocks(range, '<h2 />');
    expect(container.html()).to.equal('<p>outer start</p><h2>foo<strong>bold</strong></h2><p>outer end</p>');
  });

  it('set multi-block', () => {
    container.html('<p>outer start</p><p>foo<strong>bold</strong></p><h1>heading</h1><p><em>itelic</em>bar</p><p>outer end</p>');
    const range = new Range();
    range.setStart(container.find('strong').prev(), 1);
    range.setEnd(container.find('em').next(), 2);
    setBlocks(range, '<h2 style="text-align: center;"></h2>');
    expect(container.html()).to.equal('<p>outer start</p><h2 style="text-align: center;">foo<strong>bold</strong></h2><h2 style="text-align: center;">heading</h2><h2 style="text-align: center;"><em>itelic</em>bar</h2><p>outer end</p>');
  });
});
