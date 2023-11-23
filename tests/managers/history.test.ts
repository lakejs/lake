import { expect } from 'chai';
import { query } from '../../src/utils';
import { Nodes } from '../../src/models';
import { Selection } from '../../src/managers/selection';
import { History } from '../../src/managers/history';

describe('managers / history', () => {

  let container: Nodes;

  beforeEach(() => {
    container = query('<div />');
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

});
