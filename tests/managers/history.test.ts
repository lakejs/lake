import { boxes } from '../../src/storage/boxes';
import { debug } from '../../src/utils/debug';
import { query } from '../../src/utils/query';
import { Nodes } from '../../src/models/nodes';
import { Selection } from '../../src/managers/selection';
import { History } from '../../src/managers/history';
import { getContainerValue, setContainerValue } from '../utils';

describe('managers / history', () => {

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
  });

  afterEach(() => {
    boxes.delete('inlineBox');
    boxes.delete('blockBox');
    container.remove();
  });

  it('cloneContainer method: range is outside', () => {
    const content = '<p>foo</p>';
    const selection = new Selection(container);
    const history = new History(selection);
    setContainerValue(container, content);
    const item = history.cloneContainer();
    const value = getContainerValue(item);
    expect(value).to.equal(content);
  });

  it('cloneContainer method: collapsed range', () => {
    const content = '<p>foo<focus /></p>';
    const selection = new Selection(container);
    const history = new History(selection);
    const range = setContainerValue(container, content);
    selection.range = range;
    selection.sync();
    const item = history.cloneContainer();
    const value = getContainerValue(item);
    expect(value).to.equal(content);
  });

  it('cloneContainer method: expanded range', () => {
    const content = '<p><anchor />foo<focus /></p>';
    const selection = new Selection(container);
    const history = new History(selection);
    const range = setContainerValue(container, content);
    selection.range = range;
    selection.sync();
    const item = history.cloneContainer();
    const value = getContainerValue(item);
    expect(value).to.equal(content);
  });

  it('cloneContainer method: range is at the beginning of the box', () => {
    const content = '<p>foo<lake-box type="inline" name="inlineBox" focus="start"></lake-box></p>';
    const selection = new Selection(container);
    const history = new History(selection);
    const range = setContainerValue(container, content);
    selection.range = range;
    selection.sync();
    const item = history.cloneContainer();
    const value = getContainerValue(item);
    expect(value).to.equal(content);
  });

  it('cloneContainer method: range is at the center of the box', () => {
    const content = '<p>foo<lake-box type="inline" name="inlineBox" focus="center"></lake-box></p>';
    const selection = new Selection(container);
    const history = new History(selection);
    const range = setContainerValue(container, content);
    selection.range = range;
    selection.sync();
    const item = history.cloneContainer();
    const value = getContainerValue(item);
    expect(value).to.equal(content);
  });

  it('cloneContainer method: range is at the end of the box', () => {
    const content = '<p>foo<lake-box type="inline" name="inlineBox" focus="end"></lake-box></p>';
    const selection = new Selection(container);
    const history = new History(selection);
    const range = setContainerValue(container, content);
    selection.range = range;
    selection.sync();
    const item = history.cloneContainer();
    const value = getContainerValue(item);
    expect(value).to.equal(content);
  });

  it('cloneContainer method: range is in the box', () => {
    const content = '<p>foo<lake-box type="inline" name="inlineBox" focus="center"></lake-box></p>';
    const selection = new Selection(container);
    const history = new History(selection);
    setContainerValue(container, content);
    const boxNode = container.find('lake-box');
    selection.range.selectNode(boxNode.find('img'));
    selection.range.collapseToEnd();
    selection.sync();
    const item = history.cloneContainer();
    const value = getContainerValue(item);
    expect(value).to.equal(content);
  });

  it('should set correct content after undoing', () => {
    const selection = new Selection(container);
    const history = new History(selection);
    container.html('<p>foo</p>');
    expect(history.canUndo).to.equal(false);
    history.save(); // index: 1
    expect(history.index).to.equal(1);
    expect(history.canUndo).to.equal(false);
    container.find('p').append('<i>one</i>');
    history.save(); // index: 2
    expect(history.index).to.equal(2);
    expect(history.canUndo).to.equal(true);
    container.find('p').append('<i>two</i>');
    history.save(); // index: 3
    expect(history.index).to.equal(3);
    container.find('p').append('<i>three</i>');
    history.save(); // index: 4
    expect(history.index).to.equal(4);
    container.find('p').append('<i>four</i>');
    history.save(); // index: 5
    expect(history.index).to.equal(5);
    history.undo(); // index: 4
    expect(history.index).to.equal(4);
    expect(container.html()).to.equal('<p>foo<i>one</i><i>two</i><i>three</i></p>');
    history.undo(); // index: 3
    expect(history.index).to.equal(3);
    expect(container.html()).to.equal('<p>foo<i>one</i><i>two</i></p>');
    history.undo(); // index: 2
    expect(history.index).to.equal(2);
    expect(container.html()).to.equal('<p>foo<i>one</i></p>');
    history.undo(); // index: 1
    expect(history.index).to.equal(1);
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
    container.html('abcde');
    history.save();
    history.undo();
    expect(container.html()).to.equal('abcd');
    history.undo();
    expect(container.html()).to.equal('abc');
    container.html('abce');
    history.save();
    history.undo();
    expect(container.html()).to.equal('abc');
    history.undo();
    expect(container.html()).to.equal('ab');
    history.undo();
    expect(container.html()).to.equal('a');
    history.redo();
    expect(container.html()).to.equal('ab');
    history.redo();
    expect(container.html()).to.equal('abc');
    history.redo();
    expect(container.html()).to.equal('abce');
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

  it('undoes or redoes with boxes', () => {
    let oldBoxNodes: Nodes;
    let newBoxNodes: Nodes;
    let value = '';
    const selection = new Selection(container);
    const history = new History(selection);
    // action 1
    setContainerValue(container, '<p>foo</p>');
    history.save();
    // action 2
    setContainerValue(container, '<p>foo<lake-box type="inline" name="inlineBox"></lake-box></p>');
    history.save();
    // action 3
    setContainerValue(container, '<p>bar</p><p>foo<lake-box type="inline" name="inlineBox"></lake-box></p>');
    history.save();
    // action 4
    setContainerValue(container, '<p>bar</p><p>foo<lake-box type="inline" name="inlineBox"></lake-box><lake-box type="inline" name="inlineBox"></lake-box></p>');
    history.save();
    // action 5
    oldBoxNodes = container.find('lake-box');
    history.undo();
    newBoxNodes = container.find('lake-box');
    value = getContainerValue(container);
    debug(value);
    expect(value).to.equal('<p>bar</p><p>foo<lake-box type="inline" name="inlineBox"></lake-box></p>');
    expect(oldBoxNodes.eq(0).find('img').get(0)).to.equal(newBoxNodes.eq(0).find('img').get(0));
    // action 6
    oldBoxNodes = container.find('lake-box');
    history.undo();
    newBoxNodes = container.find('lake-box');
    value = getContainerValue(container);
    debug(value);
    expect(value).to.equal('<p>foo<lake-box type="inline" name="inlineBox"></lake-box></p>');
    expect(oldBoxNodes.eq(0).find('img').get(0)).to.equal(newBoxNodes.eq(0).find('img').get(0));
    // action 7
    history.undo();
    value = getContainerValue(container);
    debug(value);
    expect(value).to.equal('<p>foo</p>');
    // action 8
    history.redo();
    value = getContainerValue(container);
    debug(value);
    expect(value).to.equal('<p>foo<lake-box type="inline" name="inlineBox"></lake-box></p>');
    // action 9
    oldBoxNodes = container.find('lake-box');
    history.redo();
    newBoxNodes = container.find('lake-box');
    value = getContainerValue(container);
    debug(value);
    expect(value).to.equal('<p>bar</p><p>foo<lake-box type="inline" name="inlineBox"></lake-box></p>');
    expect(oldBoxNodes.eq(0).find('img').get(0)).to.equal(newBoxNodes.eq(0).find('img').get(0));
    // action 10
    oldBoxNodes = container.find('lake-box');
    history.redo();
    newBoxNodes = container.find('lake-box');
    value = getContainerValue(container);
    debug(value);
    expect(value).to.equal('<p>bar</p><p>foo<lake-box type="inline" name="inlineBox"></lake-box><lake-box type="inline" name="inlineBox"></lake-box></p>');
    expect(oldBoxNodes.eq(0).find('img').get(0)).to.equal(newBoxNodes.eq(0).find('img').get(0));
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

  it('should remove unallowed elements', () => {
    const selection = new Selection(container);
    const history = new History(selection);
    history.contentRules = {
      p: {},
    };
    let savedValue = '';
    history.event.on('save', value => {
      savedValue = value;
    });
    container.html('<h1>a</h1>');
    history.save();
    container.html('<h2>ab</h2>');
    history.save();
    expect(savedValue).to.equal('ab');
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
    expect(history.list.length).to.equal(1);
    selection.range.setEnd(container.find('p'), 1);
    selection.range.collapseToEnd();
    history.save();
    expect(history.list.length).to.equal(1);
  });

  it('should pass through options', () => {
    const selection = new Selection(container);
    const history = new History(selection);
    let saveOptions = {};
    history.event.on('save', (value, options) => {
      saveOptions = options;
    });
    container.html('a');
    history.save({
      inputType: 'insertText',
      update: false,
      emitEvent: true,
    });
    expect(saveOptions).to.deep.equal({
      inputType: 'insertText',
      update: false,
      emitEvent: true,
    });
  });

  it('should update the last item', () => {
    const selection = new Selection(container);
    const history = new History(selection);
    let savedValue = '';
    history.event.on('save', value => {
      savedValue = value;
    });
    container.html('a');
    history.save();
    container.html('ab');
    history.save();
    expect(history.list.length).to.equal(2);
    expect(savedValue).to.equal('ab');
    container.html('abc');
    history.save({
      update: true,
    });
    expect(history.list.length).to.equal(2);
    expect(savedValue).to.equal('abc');
  });

  it('should trigger events', () => {
    const selection = new Selection(container);
    const history = new History(selection);
    let savedValue = '';
    history.event.on('save', value => {
      savedValue = value;
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
    expect(savedValue).to.equal('abc');
    history.undo();
    expect(undoValue).to.equal('ab');
    history.redo();
    expect(redoValue).to.equal('abc');
  });

  it('should not trigger save event', () => {
    const selection = new Selection(container);
    const history = new History(selection);
    let savedValue = '';
    history.event.on('save', value => {
      savedValue = value;
    });
    container.html('a');
    history.save({
      emitEvent: false,
    });
    expect(savedValue).to.equal('');
  });

  it('can undo when the index is 0', () => {
    const selection = new Selection(container);
    const history = new History(selection);
    container.html('ab');
    history.save(); // index: 1
    expect(history.index).to.equal(1);
    container.html('a');
    history.save(); // index: 2
    expect(history.index).to.equal(2);
    history.undo(); // index: 1
    expect(history.index).to.equal(1);
    expect(container.html()).to.equal('ab');
    container.html('a');
    history.save(); // index: 2
    expect(history.index).to.equal(2);
    history.undo(); // index: 1
    expect(history.index).to.equal(1);
    expect(container.html()).to.equal('ab');
  });

  it('should always keep correct index when undoing', () => {
    const selection = new Selection(container);
    const history = new History(selection);
    container.html('ab');
    history.save(); // index: 1
    expect(history.index).to.equal(1);
    container.html('abc');
    history.save(); // index: 2
    expect(history.index).to.equal(2);
    container.html('a');
    history.undo(); // index: 1
    expect(history.index).to.equal(1);
    history.undo(); // index: 1
    expect(history.index).to.equal(1);
    expect(container.html()).to.equal('ab');
  });

});
