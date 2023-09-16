import { expect } from 'chai';
import { query } from '../../src/utils';
import { History, Selection, Nodes } from '../../src/models';

describe('models.History class', () => {

  let container: Nodes;

  beforeEach(() => {

    container = query('<div />').appendTo(document.body);
  });

  afterEach(() => {
    container.remove();
  });

  it('should get correct content after undoing', () => {
    const selection = new Selection(container);
    const history = new History(selection);
    container.html('<p>foo</p>');
    history.save();
    container.find('p').append('<i>one</i>');
    history.save();
    container.find('p').append('<i>two</i>');
    history.save();
    container.find('p').append('<i>three</i>');
    history.save();
    container.find('p').append('<i>four</i>');
    history.save();
    history.undo();
    expect(container.html()).to.equal('<p>foo<i>one</i><i>two</i><i>three</i></p>');
    history.undo();
    expect(container.html()).to.equal('<p>foo<i>one</i><i>two</i></p>');
    history.undo();
    expect(container.html()).to.equal('<p>foo<i>one</i></p>');
    history.undo();
    expect(container.html()).to.equal('<p>foo</p>');
  });

  it('should get correct content after redoing', () => {
    const selection = new Selection(container);
    const history = new History(selection);
    container.html('one');
    history.save();
    container.html('two');
    history.save();
    container.html('three');
    history.save();
    container.html('four');
    history.save();
    history.undo();
    expect(container.html()).to.equal('three');
    history.undo();
    expect(container.html()).to.equal('two');
    history.undo();
    expect(container.html()).to.equal('one');
    history.redo();
    expect(container.html()).to.equal('two');
    history.redo();
    expect(container.html()).to.equal('three');
    history.redo();
    expect(container.html()).to.equal('four');
  });

  it('should remove all the items from the next item to the end of the items after saving new item', () => {
    const selection = new Selection(container);
    const history = new History(selection);
    container.html('one');
    history.save();
    container.html('two');
    history.save();
    container.html('three');
    history.save();
    container.html('four');
    history.save();
    history.undo();
    expect(container.html()).to.equal('three');
    history.undo();
    expect(container.html()).to.equal('two');
    history.save();
    container.html('five');
    history.save();
    history.undo();
    expect(container.html()).to.equal('two');
    history.undo();
    expect(container.html()).to.equal('one');
    history.redo();
    expect(container.html()).to.equal('two');
    history.redo();
    expect(container.html()).to.equal('five');
  });

});
