import { expect } from 'chai';
import { query } from '../../src/utils';
import { Selection, Nodes, Range } from '../../src/models';

describe('models.Selection class', () => {

  let container: Nodes;

  beforeEach(() => {
    container = query('<div />');
    query(document.body).append(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('setRange method: should set correct range', () => {
    const selection = new Selection(container);
    const range = new Range();
    container.html('<p>foo</p>');
    range.selectNodeContents(container.find('p'));
    selection.range = range;
    selection.setRange();
    const rangeFromSelection = new Range(window.getSelection()?.getRangeAt(0));
    expect(rangeFromSelection.startNode.name).to.equal('p');
    expect(rangeFromSelection.startOffset).to.equal(0);
    expect(rangeFromSelection.endNode.name).to.equal('p');
    expect(rangeFromSelection.endOffset).to.equal(1);
  });

  it('syncByRange method: should synchronize correct range', () => {
    const selection = new Selection(container);
    const range = new Range();
    container.html('<p>foo</p>');
    range.selectNodeContents(container.find('p'));
    selection.range = range;
    selection.setRange();
    selection.range = new Range();
    expect(selection.range.startNode.get(0)).to.equal(document);
    selection.syncByRange();
    expect(selection.range.startNode.name).to.equal('p');
    expect(selection.range.startOffset).to.equal(0);
    expect(selection.range.endNode.name).to.equal('p');
    expect(selection.range.endOffset).to.equal(1);
  });

  it('synByBookmark method: should synchronize correct range', () => {
    const selection = new Selection(container);
    container.html('<p><bookmark type="anchor"></bookmark>foo<bookmark type="focus"></bookmark></p>');
    selection.synByBookmark();
    expect(selection.range.startNode.name).to.equal('p');
    expect(selection.range.startOffset).to.equal(0);
    expect(selection.range.endNode.name).to.equal('p');
    expect(selection.range.endOffset).to.equal(1);
  });

});
