import { expect } from 'chai';
import { query } from '../../src/utils';
import { History, Nodes } from '../../src/models';

describe('models.History class', () => {

  let container: Nodes;

  beforeEach(() => {

    container = query('<div />').appendTo(document.body);
  });

  afterEach(() => {
    container.remove();
  });

  it('should get correct content after undoing', () => {
    const history = new History(container);
    container.html('one');
    history.save();
    container.html('two');
    history.save();
    container.html('three');
    history.save();
    history.undo();
    expect(container.html()).to.equal('three');
    history.undo();
    expect(container.html()).to.equal('two');
    history.undo();
    expect(container.html()).to.equal('one');
    history.undo();
    expect(container.html()).to.equal('one');
  });

  it('should get correct content after redoing', () => {
    const history = new History(container);
    container.html('one');
    history.save();
    container.html('two');
    history.save();
    container.html('three');
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
    expect(container.html()).to.equal('three');
  });

  it('should remove all the items from the next item to the end of the items after saving new item', () => {
    const history = new History(container);
    container.html('one');
    history.save();
    container.html('two');
    history.save();
    container.html('three');
    history.save();
    history.undo();
    expect(container.html()).to.equal('three');
    history.undo();
    expect(container.html()).to.equal('two');
    container.html('four');
    history.save();
    history.undo();
    expect(container.html()).to.equal('four');
    history.undo();
    expect(container.html()).to.equal('one');
    history.redo();
    expect(container.html()).to.equal('four');
  });

});
