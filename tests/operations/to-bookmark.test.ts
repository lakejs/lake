import { boxes } from '../../src/storage/boxes';
import { query } from '../../src/utils/query';
import { normalizeValue } from '../../src/utils/normalize-value';
import { Nodes } from '../../src/models/nodes';
import { Range } from '../../src/models/range';
import { toBookmark } from '../../src/operations/to-bookmark';

describe('operations / to-bookmark', () => {

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

  it('normalizes text', () => {
    const content = normalizeValue('<p>f<focus />oo<strong>bar</strong></p>');
    container.html(content);
    const range = new Range();
    const anchor = new Nodes();
    const focus = container.find('lake-bookmark[type="focus"]');
    toBookmark(range, {
      anchor,
      focus,
    });
    expect(range.startNode.get(0)).to.equal(container.find('strong').prev().get(0));
    expect(range.startOffset).to.equal(1);
    expect(range.isCollapsed).to.equal(true);
  });

  it('no anchor', () => {
    const content = normalizeValue('<p>outer start</p>foo<strong>bold<focus /></strong><p>outer end</p>');
    container.html(content);
    const range = new Range();
    const anchor = new Nodes();
    const focus = container.find('lake-bookmark[type="focus"]');
    toBookmark(range, {
      anchor,
      focus,
    });
    expect(range.startNode.get(0)).to.equal(container.find('strong').get(0));
    expect(range.startOffset).to.equal(1);
    expect(range.isCollapsed).to.equal(true);
    expect(container.html()).to.equal('<p>outer start</p>foo<strong>bold</strong><p>outer end</p>');
  });

  it('no focus', () => {
    const content = normalizeValue('<p>outer start</p>foo<strong>bold<anchor /></strong><p>outer end</p>');
    container.html(content);
    const range = new Range();
    const anchor = container.find('lake-bookmark[type="anchor"]');
    const focus = new Nodes();
    toBookmark(range, {
      anchor,
      focus,
    });
    expect(range.startNode.get(0)).to.equal(document);
    expect(range.startOffset).to.equal(0);
    expect(range.isCollapsed).to.equal(true);
    expect(container.html()).to.equal('<p>outer start</p>foo<strong>bold</strong><p>outer end</p>');
  });

  it('focus is after anchor', () => {
    const content = normalizeValue('<p>outer start</p>foo<strong><anchor />bold<focus /></strong><p>outer end</p>');
    container.html(content);
    const range = new Range();
    const anchor = container.find('lake-bookmark[type="anchor"]');
    const focus = container.find('lake-bookmark[type="focus"]');
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

  it('anchor is after focus', () => {
    const content = normalizeValue('<p>outer start</p>foo<strong><focus />bold<anchor /></strong><p>outer end</p>');
    container.html(content);
    const range = new Range();
    const anchor = container.find('lake-bookmark[type="anchor"]');
    const focus = container.find('lake-bookmark[type="focus"]');
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

  it('focus is on the start strip of box', () => {
    const content = '<lake-box type="block" name="blockBox" focus="start"></lake-box>';
    container.html(content);
    const range = new Range();
    const anchor = new Nodes();
    const focus = container.find('lake-box');
    toBookmark(range, {
      anchor,
      focus,
    });
    expect(range.isBoxStart).to.equal(true);
  });

  it('focus is on the end strip of box', () => {
    const content = '<lake-box type="block" name="blockBox" focus="end"></lake-box>';
    container.html(content);
    const range = new Range();
    const anchor = new Nodes();
    const focus = container.find('lake-box');
    toBookmark(range, {
      anchor,
      focus,
    });
    expect(range.isBoxEnd).to.equal(true);
  });

  it('focus is on the box', () => {
    const content = '<lake-box type="block" name="blockBox" focus="center"></lake-box>';
    container.html(content);
    const range = new Range();
    const anchor = new Nodes();
    const focus = container.find('lake-box');
    toBookmark(range, {
      anchor,
      focus,
    });
    expect(range.isBox).to.equal(true);
    expect(range.isBoxStart).to.equal(false);
    expect(range.isBoxEnd).to.equal(false);
  });

});
