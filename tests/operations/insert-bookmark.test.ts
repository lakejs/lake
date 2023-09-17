import { expect } from 'chai';
import { query } from '../../src/utils';
import { Range, Nodes } from '../../src/models';
import { insertBookmark } from '../../src/operations';

describe('operations.insertBookmark()', () => {

  let container: Nodes;

  beforeEach(() => {
    container = query('<div contenteditable="true"></div>');
    query(document.body).append(container);
    container.html('<p>outer start</p>foo<strong>bold</strong><p>outer end</p>');
  });

  afterEach(() => {
    container.remove();
  });

  it('is a collapsed range', () => {
    const range = new Range();
    range.selectNodeContents(container.find('strong'));
    range.collapseToEnd();
    const bookmark = insertBookmark(range);
    expect(bookmark.anchor.length).to.equal(0);
    expect(bookmark.focus.name).to.equal('bookmark');
    expect(container.html()).to.equal('<p>outer start</p>foo<strong>bold<bookmark type="focus"></bookmark></strong><p>outer end</p>');
  });

  it('is an expanded range', () => {
    const range = new Range();
    range.selectNodeContents(container.find('strong'));
    const bookmark = insertBookmark(range);
    expect(bookmark.anchor.name).to.equal('bookmark');
    expect(bookmark.focus.name).to.equal('bookmark');
    expect(container.html()).to.equal('<p>outer start</p>foo<strong><bookmark type="anchor"></bookmark>bold<bookmark type="focus"></bookmark></strong><p>outer end</p>');
  });

});
