import { expect } from 'chai';
import { query } from '../../src/utils';
import { Nodes } from '../../src/models/nodes';
import { Selection } from '../../src/managers/selection';
import { History } from '../../src/managers/history';

describe('managers / history', () => {

  let container: Nodes;

  beforeEach(() => {
    container = query('<div contenteditable="true" />');
    query(document.body).append(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('should set correct content after undoing', () => {
    const selection = new Selection(container);
    const history = new History(selection);
    container.html('<p>foo</p>');
    expect(history.canUndo).to.equal(false);
    history.save(); // index: 1
    expect(history.canUndo).to.equal(false);
    container.find('p').append('<i>one</i>');
    history.save(); // index: 2
    expect(history.canUndo).to.equal(true);
    container.find('p').append('<i>two</i>');
    history.save(); // index: 3
    container.find('p').append('<i>three</i>');
    history.save(); // index: 4
    container.find('p').append('<i>four</i>');
    history.undo(); // index: 3
    expect(container.html()).to.equal('<p>foo<i>one</i><i>two</i><i>three</i></p>');
    history.undo(); // index: 2
    expect(container.html()).to.equal('<p>foo<i>one</i><i>two</i></p>');
    history.undo(); // index: 1
    expect(container.html()).to.equal('<p>foo<i>one</i></p>');
    history.undo(); // index: 1
    expect(container.html()).to.equal('<p>foo</p>');
  });

  it('should set correct content after redoing', () => {
    const selection = new Selection(container);
    const history = new History(selection);
    container.html('a');
    history.save();
    container.html('ab');
    history.save();
    container.html('abc');
    history.save();
    container.html('abcd');
    history.save();
    history.undo();
    expect(container.html()).to.equal('abc');
    history.undo();
    expect(container.html()).to.equal('ab');
    history.undo();
    expect(container.html()).to.equal('a');
    expect(history.canUndo).to.equal(false);
    expect(history.canRedo).to.equal(true);
    history.redo();
    expect(container.html()).to.equal('ab');
    history.redo();
    expect(container.html()).to.equal('abc');
    history.redo();
    expect(container.html()).to.equal('abcd');
  });

  it('should remove all the items from the next item to the end of the items after saving new item', () => {
    const selection = new Selection(container);
    const history = new History(selection);
    container.html('a');
    history.save();
    container.html('ab');
    history.save();
    container.html('abc');
    history.save();
    container.html('abcd');
    history.save();
    history.undo();
    expect(container.html()).to.equal('abc');
    history.undo();
    expect(container.html()).to.equal('ab');
    history.save();
    container.html('abe');
    history.save();
    history.undo();
    expect(container.html()).to.equal('ab');
    history.undo();
    expect(container.html()).to.equal('a');
    history.redo();
    expect(container.html()).to.equal('ab');
    history.redo();
    expect(container.html()).to.equal('abe');
  });

  it('undoes to the first item', () => {
    const selection = new Selection(container);
    const history = new History(selection);
    container.html('a');
    history.save();
    container.html('ab');
    history.save();
    history.undo();
    expect(container.html()).to.equal('a');
    history.undo();
    expect(container.html()).to.equal('a');
    history.undo();
    expect(container.html()).to.equal('a');
  });

  it('undoes or redoes one item', () => {
    const selection = new Selection(container);
    const history = new History(selection);
    container.html('a');
    history.save();
    history.save();
    history.save();
    history.save();
    history.save();
    history.undo();
    expect(container.html()).to.equal('a');
    history.undo();
    expect(container.html()).to.equal('a');
    history.undo();
    expect(container.html()).to.equal('a');
    history.redo();
    expect(container.html()).to.equal('a');
    history.redo();
    expect(container.html()).to.equal('a');
    history.undo();
    expect(container.html()).to.equal('a');
  });

  it('undoes or redoes the same item', () => {
    const selection = new Selection(container);
    const history = new History(selection);
    container.html('a');
    history.save();
    history.save();
    container.html('ab');
    history.save();
    history.save();
    history.save();
    history.undo();
    expect(container.html()).to.equal('a');
    history.undo();
    expect(container.html()).to.equal('a');
    history.undo();
    expect(container.html()).to.equal('a');
    history.redo();
    expect(container.html()).to.equal('ab');
    history.redo();
    expect(container.html()).to.equal('ab');
  });

  it('should remove the first item when the list size exceeds the limit', () => {
    const selection = new Selection(container);
    const history = new History(selection);
    history.limit = 3;
    container.html('a');
    history.save();
    container.html('ab');
    history.save();
    container.html('abc');
    history.save();
    container.html('abcd');
    history.save();
    history.undo();
    expect(container.html()).to.equal('abc');
    history.undo();
    expect(container.html()).to.equal('ab');
    history.undo();
    expect(container.html()).to.equal('ab');
  });

  it('should pause saving operation, and then restore', () => {
    const selection = new Selection(container);
    const history = new History(selection);
    container.html('a');
    history.save();
    container.html('ab');
    history.pause();
    history.save();
    history.continue();
    container.html('abc');
    history.save();
    history.undo();
    expect(container.html()).to.equal('a');
  });

  it('should not save when only changing selection', () => {
    container.html('<p>foo</p>');
    const selection = new Selection(container);
    selection.range.setEnd(container.find('p'), 0);
    selection.range.collapseToEnd();
    const history = new History(selection);
    history.save();
    expect(history.count).to.equal(1);
    selection.range.setEnd(container.find('p'), 1);
    selection.range.collapseToEnd();
    history.save();
    expect(history.count).to.equal(1);
  });

  it('should trigger events', () => {
    const selection = new Selection(container);
    const history = new History(selection);
    let saveValue = '';
    history.event.on('save', value => {
      saveValue = value;
    });
    let undoValue = '';
    history.event.on('undo', value => {
      undoValue = value;
    });
    let redoValue = '';
    history.event.on('redo', value => {
      redoValue = value;
    });
    container.html('a');
    history.save();
    container.html('ab');
    history.save();
    container.html('abc');
    history.save();
    expect(saveValue).to.equal('abc');
    history.undo();
    expect(undoValue).to.equal('ab');
    history.redo();
    expect(redoValue).to.equal('abc');
  });

});
