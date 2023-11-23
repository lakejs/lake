import { expect } from 'chai';
import { query } from '../../src/utils';
import { Nodes } from '../../src/models/nodes';
import { Range } from '../../src/models/range';
import { insertBookmark } from '../../src/operations/insert-bookmark';

describe('operations / insert-bookmark', () => {

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
    expect(bookmark.focus.name).to.equal('lake-bookmark');
    expect(container.html()).to.equal('<p>outer start</p>foo<strong>bold<lake-bookmark type="focus"></lake-bookmark></strong><p>outer end</p>');
  });

  it('is an expanded range', () => {
    const range = new Range();
    range.selectNodeContents(container.find('strong'));
    const bookmark = insertBookmark(range);
    expect(bookmark.anchor.name).to.equal('lake-bookmark');
    expect(bookmark.focus.name).to.equal('lake-bookmark');
    expect(container.html()).to.equal('<p>outer start</p>foo<strong><lake-bookmark type="anchor"></lake-bookmark>bold<lake-bookmark type="focus"></lake-bookmark></strong><p>outer end</p>');
  });

});
