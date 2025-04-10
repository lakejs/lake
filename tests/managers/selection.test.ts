import { boxes } from '../../src/storage/boxes';
import { getInstanceMap } from '../../src/storage/box-instances';
import { query } from '../../src/utils/query';
import { getBox } from '../../src/utils/get-box';
import { normalizeValue } from '../../src/utils/normalize-value';
import { Nodes } from '../../src/models/nodes';
import { Range } from '../../src/models/range';
import { Selection } from '../../src/managers/selection';
import { getContainerValue, setContainerValue } from '../utils';

describe('managers / selection', () => {

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
    container = query('<div contenteditable="true" />');
    query(document.body).append(container);
    window.getSelection()?.removeAllRanges();
  });

  afterEach(() => {
    boxes.delete('inlineBox');
    boxes.delete('blockBox');
    container.remove();
  });

  it('sync method: should set the native selection using the saved range', () => {
    const selection = new Selection(container);
    const range = new Range();
    container.html('<p>foo</p>');
    range.selectNodeContents(container.find('p'));
    selection.range = range;
    selection.sync();
    const rangeFromSelection = new Range(window.getSelection()?.getRangeAt(0));
    expect(rangeFromSelection.startNode.name).to.equal('p');
    expect(rangeFromSelection.startOffset).to.equal(0);
    expect(rangeFromSelection.endNode.name).to.equal('p');
    expect(rangeFromSelection.endOffset).to.equal(1);
  });

  it('sync method: should not set the native selection using the saved range', () => {
    const selection = new Selection(container);
    const range = new Range();
    container.html('<p>foo</p>');
    range.selectNodeContents(container.find('p'));
    selection.range = range;
    selection.sync();
    const range2 = new Range();
    range2.selectNodeContents(container.parent());
    range2.collapseToEnd();
    selection.range = range2;
    selection.sync();
    const rangeFromSelection = new Range(window.getSelection()?.getRangeAt(0));
    expect(rangeFromSelection.startNode.name).to.equal('p');
    expect(rangeFromSelection.startOffset).to.equal(0);
    expect(rangeFromSelection.endNode.name).to.equal('p');
    expect(rangeFromSelection.endOffset).to.equal(1);
  });

  it('updateByRange method: should set the saved range using the native selection', () => {
    container.html('<p>foo</p>');
    // set the native selection
    const nativeRange = document.createRange();
    nativeRange.selectNodeContents(container.find('p').get(0));
    const nativeSelection = window.getSelection();
    nativeSelection?.removeAllRanges();
    nativeSelection?.addRange(nativeRange);
    const selection = new Selection(container);
    // initiate the saved range
    selection.range = new Range();
    expect(selection.range.startNode.get(0)).to.equal(document);
    // set the saved range using the native selection
    selection.updateByRange();
    expect(selection.range.startNode.name).to.equal('p');
    expect(selection.range.startOffset).to.equal(0);
    expect(selection.range.endNode.name).to.equal('p');
    expect(selection.range.endOffset).to.equal(1);
  });

  it('updateByRange method: the saved range should not be set by the native selection that is outside the container', () => {
    container.html('<p>foo</p>');
    // set the native selection
    const nativeRange = document.createRange();
    nativeRange.selectNodeContents(container.parent().get(0));
    const nativeSelection = window.getSelection();
    nativeSelection?.removeAllRanges();
    nativeSelection?.addRange(nativeRange);
    const selection = new Selection(container);
    // initiate the saved range
    selection.range = new Range();
    expect(selection.range.startNode.get(0)).to.equal(document);
    selection.updateByRange();
    expect(selection.range.startNode.get(0)).to.equal(document);
  });

  it('updateByBookmark method: ordinary bookmark', () => {
    const content = `
    <p><anchor />foo<focus /></p>
    `;
    const selection = new Selection(container);
    container.html(normalizeValue(content.trim()));
    selection.updateByBookmark();
    expect(selection.range.startNode.name).to.equal('p');
    expect(selection.range.startOffset).to.equal(0);
    expect(selection.range.endNode.name).to.equal('p');
    expect(selection.range.endOffset).to.equal(1);
    const rangeFromSelection = new Range(window.getSelection()?.getRangeAt(0));
    expect(rangeFromSelection.startNode.name).to.equal('p');
    expect(rangeFromSelection.startOffset).to.equal(0);
    expect(rangeFromSelection.endNode.name).to.equal('p');
    expect(rangeFromSelection.endOffset).to.equal(1);
  });

  it('updateByBookmark method: box bookmark', () => {
    const content = `
    <lake-box type="block" name="blockBox" focus="end"></lake-box>
    `;
    const selection = new Selection(container);
    container.html(normalizeValue(content.trim()));
    selection.updateByBookmark();
    expect(selection.range.isBoxEnd).to.equal(true);
    const rangeFromSelection = new Range(window.getSelection()?.getRangeAt(0));
    expect(rangeFromSelection.isBoxEnd).to.equal(true);
  });

  it('getActiveItems method: should get all ancestors when range is collapsed', () => {
    const content = `
    <p><strong>one<i>tw<focus />o</i>three</strong></p>
    `;
    const selection = new Selection(container);
    container.html(normalizeValue(content.trim()));
    selection.updateByBookmark();
    const activeItems = selection.getActiveItems();
    expect(activeItems.length).to.equal(3);
    expect(activeItems[0].name).to.equal('i');
    expect(activeItems[1].name).to.equal('strong');
    expect(activeItems[2].name).to.equal('p');
  });

  it('getActiveItems method: should get next mark when range is collapsed', () => {
    const content = `
    <p><focus /><strong>one<i>two</i>three</strong></p>
    `;
    const selection = new Selection(container);
    container.html(normalizeValue(content.trim()));
    selection.updateByBookmark();
    const activeItems = selection.getActiveItems();
    expect(activeItems.length).to.equal(2);
    expect(activeItems[0].name).to.equal('p');
    expect(activeItems[1].name).to.equal('strong');
  });

  it('getActiveItems method: should get next block when range is collapsed', () => {
    const content = `
    <p>foo</p><focus /><h1>bar</h1>
    `;
    const selection = new Selection(container);
    container.html(normalizeValue(content.trim()));
    selection.updateByBookmark();
    const activeItems = selection.getActiveItems();
    expect(activeItems.length).to.equal(1);
    expect(activeItems[0].name).to.equal('h1');
  });

  it('getActiveItems method: should get all ancestors when range is expanded', () => {
    const content = `
    <p><strong>one<i>tw<anchor />o</i>three</strong><focus /></p>
    `;
    const selection = new Selection(container);
    container.html(normalizeValue(content.trim()));
    selection.updateByBookmark();
    const activeItems = selection.getActiveItems();
    expect(activeItems.length).to.equal(3);
    expect(activeItems[0].name).to.equal('i');
    expect(activeItems[1].name).to.equal('strong');
    expect(activeItems[2].name).to.equal('p');
  });

  it('getActiveItems method: should get attributes', () => {
    const content = `
    <p><span style="color: red;" class="foo">one<i>tw<focus />o</i>three</strong></p>
    `;
    const selection = new Selection(container);
    container.html(normalizeValue(content.trim()));
    selection.updateByBookmark();
    const activeItems = selection.getActiveItems();
    expect(activeItems.length).to.equal(3);
    expect(activeItems[0].name).to.equal('i');
    expect(activeItems[1].name).to.equal('span');
    expect(activeItems[1].attributes).to.deep.equal({ style: 'color: red;', class: 'foo' });
    expect(activeItems[2].name).to.deep.equal('p');
  });

  it('getActiveItems method: should get strong tag', () => {
    const content = `
    <p>one<anchor /><i><strong>two</strong></i><focus />three</p>
    `;
    const selection = new Selection(container);
    container.html(normalizeValue(content.trim()));
    selection.updateByBookmark();
    const activeItems = selection.getActiveItems();
    expect(activeItems.length).to.equal(3);
    expect(activeItems[0].name).to.equal('p');
    expect(activeItems[1].name).to.equal('i');
    expect(activeItems[2].name).to.equal('strong');
  });

  it('cloneContainer method: range is outside', () => {
    const content = '<p>foo</p>';
    const selection = new Selection(container);
    setContainerValue(container, content);
    const item = selection.cloneContainer();
    const value = getContainerValue(item);
    expect(value).to.equal(content);
  });

  it('cloneContainer method: collapsed range', () => {
    const content = '<p>foo<focus /></p>';
    const selection = new Selection(container);
    const range = setContainerValue(container, content);
    selection.range = range;
    selection.sync();
    const item = selection.cloneContainer();
    const value = getContainerValue(item);
    expect(value).to.equal(content);
  });

  it('cloneContainer method: expanded range', () => {
    const content = '<p><anchor />foo<focus /></p>';
    const selection = new Selection(container);
    const range = setContainerValue(container, content);
    selection.range = range;
    selection.sync();
    const item = selection.cloneContainer();
    const value = getContainerValue(item);
    expect(value).to.equal(content);
  });

  it('cloneContainer method: range is at the beginning of the box', () => {
    const content = '<p>foo<lake-box type="inline" name="inlineBox" focus="start"></lake-box></p>';
    const selection = new Selection(container);
    const range = setContainerValue(container, content);
    selection.range = range;
    selection.sync();
    const item = selection.cloneContainer();
    const value = getContainerValue(item);
    expect(value).to.equal(content);
  });

  it('cloneContainer method: range is at the center of the box', () => {
    const content = '<p>foo<lake-box type="inline" name="inlineBox" focus="center"></lake-box></p>';
    const selection = new Selection(container);
    const range = setContainerValue(container, content);
    selection.range = range;
    selection.sync();
    const item = selection.cloneContainer();
    const value = getContainerValue(item);
    expect(value).to.equal(content);
  });

  it('cloneContainer method: range is at the end of the box', () => {
    const content = '<p>foo<lake-box type="inline" name="inlineBox" focus="end"></lake-box></p>';
    const selection = new Selection(container);
    const range = setContainerValue(container, content);
    selection.range = range;
    selection.sync();
    const item = selection.cloneContainer();
    const value = getContainerValue(item);
    expect(value).to.equal(content);
  });

  it('cloneContainer method: range is in the box', () => {
    const content = '<p>foo<lake-box type="inline" name="inlineBox" focus="center"></lake-box></p>';
    const selection = new Selection(container);
    setContainerValue(container, content);
    const boxNode = container.find('lake-box');
    selection.range.selectNode(boxNode.find('img'));
    selection.range.collapseToEnd();
    selection.sync();
    const item = selection.cloneContainer();
    const value = getContainerValue(item);
    expect(value).to.equal(content);
  });

  it('selectBox method: by box', () => {
    const content = '<p>foo<lake-box type="inline" name="inlineBox"></lake-box>bar<focus /></p>';
    const selection = new Selection(container);
    container.html(normalizeValue(content.trim()));
    selection.updateByBookmark();
    const boxNode = container.find('lake-box');
    const box = getBox(boxNode);
    box.render();
    selection.selectBox(box);
    expect(selection.range.isBoxCenter).to.equal(true);
  });

  it('selectBox method: by node', () => {
    const content = '<p>foo<lake-box type="inline" name="inlineBox"></lake-box>bar<focus /></p>';
    const selection = new Selection(container);
    container.html(normalizeValue(content.trim()));
    selection.updateByBookmark();
    const boxNode = container.find('lake-box');
    const box = getBox(boxNode);
    box.render();
    selection.selectBox(boxNode);
    expect(selection.range.isBoxCenter).to.equal(true);
  });

  it('method: insertBox', () => {
    const content = '<p>foo<focus /></p>';
    const selection = new Selection(container);
    container.html(normalizeValue(content.trim()));
    selection.updateByBookmark();
    const box = selection.insertBox('inlineBox');
    expect(getInstanceMap(container.id).get(box.node.id)?.name).to.equal('inlineBox');
    expect(selection.range.isBoxEnd).to.equal(true);
  });

  it('removeBox method: no parameter', () => {
    const content = '<p>foo<lake-box type="inline" name="inlineBox" focus="start"></lake-box>bar</p>';
    const selection = new Selection(container);
    container.html(normalizeValue(content.trim()));
    selection.updateByBookmark();
    const boxNode = container.find('lake-box');
    const box = getBox(boxNode);
    box.render();
    expect(getInstanceMap(0).get(box.node.id)).to.equal(undefined);
    expect(getInstanceMap(container.id).get(box.node.id) === box).to.equal(true);
    selection.removeBox();
    expect(getInstanceMap(0).get(box.node.id) === box).to.equal(true);
    expect(getInstanceMap(container.id).get(box.node.id)).to.equal(undefined);
    expect(container.find('lake-box').length).to.equal(0);
  });

  it('removeBox method: by box node', () => {
    const content = '<p>foo<lake-box type="inline" name="inlineBox" focus="start"></lake-box>bar</p>';
    const selection = new Selection(container);
    container.html(normalizeValue(content.trim()));
    selection.updateByBookmark();
    const boxNode = container.find('lake-box');
    const box = getBox(boxNode);
    box.render();
    expect(getInstanceMap(0).get(box.node.id)).to.equal(undefined);
    expect(getInstanceMap(container.id).get(box.node.id) === box).to.equal(true);
    selection.removeBox(boxNode);
    expect(getInstanceMap(0).get(box.node.id) === box).to.equal(true);
    expect(getInstanceMap(container.id).get(box.node.id)).to.equal(undefined);
    expect(container.find('lake-box').length).to.equal(0);
  });

  it('removeBox method: by box instance', () => {
    const content = '<p>foo<lake-box type="inline" name="inlineBox" focus="start"></lake-box>bar</p>';
    const selection = new Selection(container);
    container.html(normalizeValue(content.trim()));
    selection.updateByBookmark();
    const boxNode = container.find('lake-box');
    const box = getBox(boxNode);
    box.render();
    expect(getInstanceMap(0).get(box.node.id)).to.equal(undefined);
    expect(getInstanceMap(container.id).get(box.node.id) === box).to.equal(true);
    selection.removeBox(box);
    expect(getInstanceMap(0).get(box.node.id) === box).to.equal(true);
    expect(getInstanceMap(container.id).get(box.node.id)).to.equal(undefined);
    expect(container.find('lake-box').length).to.equal(0);
  });

});
