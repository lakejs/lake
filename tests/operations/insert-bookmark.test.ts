import { expect } from 'chai';
import { boxes } from '../../src/storage/boxes';
import { query } from '../../src/utils';
import { Nodes } from '../../src/models/nodes';
import { Range } from '../../src/models/range';
import { Box } from '../../src/models/box';
import { insertBookmark } from '../../src/operations/insert-bookmark';

describe('operations / insert-bookmark', () => {

  let container: Nodes;

  beforeEach(() => {
    boxes.set('inlineBox', {
      type: 'inline',
      name: 'inlineBox',
      render: () => '<img />',
    });
    boxes.set('blockBox', {
      type: 'block',
      name: 'blockBox',
      render: () => '<hr />',
    });
    container = query('<div contenteditable="true"></div>');
    query(document.body).append(container);
  });

  afterEach(() => {
    boxes.delete('inlineBox');
    boxes.delete('blockBox');
    container.remove();
  });

  it('ordinary bookmark: collapsed range', () => {
    container.html('<p>outer start</p>foo<strong>bold</strong><p>outer end</p>');
    const range = new Range();
    range.selectNodeContents(container.find('strong'));
    range.collapseToEnd();
    const bookmark = insertBookmark(range);
    expect(bookmark.anchor.length).to.equal(0);
    expect(bookmark.focus.name).to.equal('lake-bookmark');
    expect(container.html()).to.equal('<p>outer start</p>foo<strong>bold<lake-bookmark type="focus"></lake-bookmark></strong><p>outer end</p>');
  });

  it('ordinary bookmark: expanded range', () => {
    container.html('<p>outer start</p>foo<strong>bold</strong><p>outer end</p>');
    const range = new Range();
    range.selectNodeContents(container.find('strong'));
    const bookmark = insertBookmark(range);
    expect(bookmark.anchor.name).to.equal('lake-bookmark');
    expect(bookmark.focus.name).to.equal('lake-bookmark');
    expect(container.html()).to.equal('<p>outer start</p>foo<strong><lake-bookmark type="anchor"></lake-bookmark>bold<lake-bookmark type="focus"></lake-bookmark></strong><p>outer end</p>');
  });

  it('box-bookmark: left strip', () => {
    container.html('<p>outer start</p><lake-box type="block" name="blockBox"></lake-box><p>outer end</p>');
    const range = new Range();
    const boxNode = container.find('lake-box');
    const box = new Box(boxNode);
    box.render();
    range.selectBoxLeft(boxNode);
    const bookmark = insertBookmark(range);
    expect(bookmark.anchor.length).to.equal(0);
    expect(bookmark.focus.name).to.equal('lake-box');
    expect(bookmark.focus.attr('focus')).to.equal('left');
  });

  it('box-bookmark: right strip', () => {
    container.html('<p>outer start</p><lake-box type="block" name="blockBox"></lake-box><p>outer end</p>');
    const range = new Range();
    const boxNode = container.find('lake-box');
    const box = new Box(boxNode);
    box.render();
    range.selectBoxRight(boxNode);
    const bookmark = insertBookmark(range);
    expect(bookmark.anchor.length).to.equal(0);
    expect(bookmark.focus.name).to.equal('lake-box');
    expect(bookmark.focus.attr('focus')).to.equal('right');
  });

  it('box-bookmark: focus on the box', () => {
    container.html('<p>outer start</p><lake-box type="block" name="blockBox"></lake-box><p>outer end</p>');
    const range = new Range();
    const boxNode = container.find('lake-box');
    const box = new Box(boxNode);
    box.render();
    range.selectNodeContents(box.getContainer());
    const bookmark = insertBookmark(range);
    expect(bookmark.anchor.length).to.equal(0);
    expect(bookmark.focus.name).to.equal('lake-box');
    expect(bookmark.focus.attr('focus')).to.equal('center');
  });

});
