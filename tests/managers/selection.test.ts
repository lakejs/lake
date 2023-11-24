import { expect } from 'chai';
import { normalizeValue, query } from '../../src/utils';
import { Nodes } from '../../src/models/nodes';
import { Range } from '../../src/models/range';
import { Selection } from '../../src/managers/selection';

describe('managers / selection', () => {

  let container: Nodes;

  beforeEach(() => {
    container = query('<div contenteditable="true" />');
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
    const content = `
    <p><anchor />foo<focus /></p>
    `;
    const selection = new Selection(container);
    container.html(normalizeValue(content.trim()));
    selection.synByBookmark();
    expect(selection.range.startNode.name).to.equal('p');
    expect(selection.range.startOffset).to.equal(0);
    expect(selection.range.endNode.name).to.equal('p');
    expect(selection.range.endOffset).to.equal(1);
  });

  it('getAppliedNodes method: is a collapsed range', () => {
    const content = `
    <p><strong>one<i>tw<focus />o</i>three</strong></p>
    `;
    const selection = new Selection(container);
    container.html(normalizeValue(content.trim()));
    selection.synByBookmark();
    const appliedNodes = selection.getAppliedNodes();
    expect(appliedNodes.length).to.equal(3);
    expect(appliedNodes[0].name).to.equal('i');
    expect(appliedNodes[1].name).to.equal('strong');
    expect(appliedNodes[2].name).to.equal('p');
  });

  it('getAppliedNodes method: is an expanded range', () => {
    const content = `
    <p><strong>one<i>tw<anchor />o</i>three</strong><focus /></p>
    `;
    const selection = new Selection(container);
    container.html(normalizeValue(content.trim()));
    selection.synByBookmark();
    const appliedNodes = selection.getAppliedNodes();
    expect(appliedNodes.length).to.equal(3);
    expect(appliedNodes[0].name).to.equal('i');
    expect(appliedNodes[1].name).to.equal('strong');
    expect(appliedNodes[2].name).to.equal('p');
  });

  it('getAppliedNodes method: gets attributes', () => {
    const content = `
    <p><span style="color: red;" class="foo">one<i>tw<focus />o</i>three</strong></p>
    `;
    const selection = new Selection(container);
    container.html(normalizeValue(content.trim()));
    selection.synByBookmark();
    const appliedNodes = selection.getAppliedNodes();
    expect(appliedNodes.length).to.equal(3);
    expect(appliedNodes[0].name).to.equal('i');
    expect(appliedNodes[1].name).to.equal('span');
    expect(appliedNodes[1].attributes).to.deep.equal({style: 'color: red;', class: 'foo'});
    expect(appliedNodes[2].name).to.deep.equal('p');
  });

  it('getAppliedNodes method: should get strong tag', () => {
    const content = `
    <p>one<anchor /><i><strong>two</strong></i><focus />three</p>
    `;
    const selection = new Selection(container);
    container.html(normalizeValue(content.trim()));
    selection.synByBookmark();
    const appliedNodes = selection.getAppliedNodes();
    expect(appliedNodes.length).to.equal(3);
    expect(appliedNodes[0].name).to.equal('p');
    expect(appliedNodes[1].name).to.equal('i');
    expect(appliedNodes[2].name).to.equal('strong');
  });

});
