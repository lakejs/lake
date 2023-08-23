import { expect } from 'chai';
import { query, normalizeBookmark } from '../../src/utils';
import { Range, Nodes } from '../../src/models';
import { toBookmark } from '../../src/operations';

describe('operations.toBookmark()', () => {
  let container: Nodes;

  beforeEach(() => {
    container = query('<div contenteditable="true"></div>').appendTo(document.body);
  });

  afterEach(() => {
    container.remove();
  });

  it('only focus', () => {
    const content = normalizeBookmark('<p>outer start</p>foo<strong>bold<focus /></strong><p>outer end</p>');
    container.html(content);
    const range = new Range();
    const anchor = new Nodes();
    const focus = container.find('bookmark[type="focus"]');
    toBookmark(range, {
      anchor,
      focus,
    });
    expect(range.startNode.get(0)).to.equal(container.find('strong').get(0));
    expect(range.startOffset).to.equal(1);
    expect(range.isCollapsed).to.equal(true);
    expect(container.html()).to.equal('<p>outer start</p>foo<strong>bold</strong><p>outer end</p>');
  });

  it('only anchor', () => {
    const content = normalizeBookmark('<p>outer start</p>foo<strong>bold<anchor /></strong><p>outer end</p>');
    container.html(content);
    const range = new Range();
    const anchor = container.find('bookmark[type="anchor"]');
    const focus = new Nodes();
    toBookmark(range, {
      anchor,
      focus,
    });
    expect(range.startNode.get(0)).to.equal(container.find('strong').get(0));
    expect(range.startOffset).to.equal(1);
    expect(range.isCollapsed).to.equal(true);
    expect(container.html()).to.equal('<p>outer start</p>foo<strong>bold</strong><p>outer end</p>');
  });

  it('both anchor and focus', () => {
    const content = normalizeBookmark('<p>outer start</p>foo<strong><anchor />bold<focus /></strong><p>outer end</p>');
    container.html(content);
    const range = new Range();
    const anchor = container.find('bookmark[type="anchor"]');
    const focus = container.find('bookmark[type="focus"]');
    toBookmark(range, {
      anchor,
      focus,
    });
    expect(range.startNode.get(0)).to.equal(container.find('strong').get(0));
    expect(range.startOffset).to.equal(0);
    expect(range.endNode.get(0)).to.equal(container.find('strong').get(0));
    expect(range.endOffset).to.equal(1);
    expect(range.isCollapsed).to.equal(false);
    expect(container.html()).to.equal('<p>outer start</p>foo<strong>bold</strong><p>outer end</p>');
  });

});
