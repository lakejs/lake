import { debug, query } from '../src/utils';
import { Nodes } from '../src/models/nodes';
import { Box } from '../src/models/box';
import { Editor } from '../src/editor';
import { click } from './utils';

function inputData(editor: Editor, data: string) {
  const event = new InputEvent('input', {
    data,
    inputType: 'insertText',
    isComposing: false,
  });
  editor.container.emit('beforeinput', event);
  editor.container.emit('input', event);
}

function inputCompositionData(editor: Editor, data: string) {
  editor.container.emit('compositionstart');
  const event = new InputEvent('input', {
    data,
    inputType: 'insertCompositionText',
    isComposing: true,
  });
  editor.container.emit('beforeinput', event);
  editor.container.emit('input', event);
  editor.container.emit('compositionend');
}

describe('editor', () => {

  let rootNode: Nodes;

  beforeEach(() => {
    Editor.box.add({
      type: 'inline',
      name: 'inlineBox',
      render: () => '<img />',
    });
    Editor.box.add({
      type: 'block',
      name: 'blockBox',
      render: () => '<hr />',
    });
    rootNode = query('<div class="lake-root" />');
    query(document.body).append(rootNode);
  });

  afterEach(() => {
    Editor.box.remove('inlineBox');
    Editor.box.remove('blockBox');
    rootNode.remove();
  });

  it('constructor: sets spellcheck', () => {
    const editor = new Editor({
      root: rootNode,
      spellcheck: true,
    });
    editor.render();
    const spellcheck = editor.container.attr('spellcheck');
    editor.unmount();
    expect(spellcheck).to.equal('true');
  });

  it('constructor: empty default value', () => {
    const input = '';
    const output = '';
    const editor = new Editor({
      root: rootNode,
      value: input,
    });
    editor.render();
    const value = editor.getValue();
    debug(`output: ${value}`);
    editor.unmount();
    expect(value).to.equal(output);
  });

  it('method: getValue', () => {
    const input = '<p><strong>\u200B# <focus />foo</strong></p>';
    const output = '<p><strong># <focus />foo</strong></p>';
    const editor = new Editor({
      root: rootNode,
      value: input,
    });
    editor.render();
    const value = editor.getValue();
    debug(`output: ${value}`);
    editor.unmount();
    expect(value).to.equal(output);
  });

  it('method: setValue', () => {
    const input = '<p><strong>\u200B# <focus />foo</strong></p>';
    const output = '<p><strong># <focus />foo</strong></p>';
    const editor = new Editor({
      root: rootNode,
    });
    editor.render();
    editor.setValue(input);
    const value = editor.getValue();
    debug(`output: ${value}`);
    editor.unmount();
    expect(value).to.equal(output);
  });

  it('method: insertBox', () => {
    const output = '<p><lake-box type="inline" name="inlineBox" focus="right"></lake-box></p>';
    const editor = new Editor({
      root: rootNode,
    });
    editor.render();
    expect(editor.box.getInstances(editor).size).to.equal(0);
    editor.insertBox('inlineBox');
    expect(editor.box.getInstances(editor).size).to.equal(1);
    const value = editor.getValue();
    debug(`output: ${value}`);
    editor.unmount();
    expect(value).to.equal(output);
  });

  it('method: removeBox', () => {
    const input = '<p>foo<lake-box type="inline" name="inlineBox" focus="left"></lake-box>bar</p>';
    const output = '<p>foo<focus />bar</p>';
    const editor = new Editor({
      root: rootNode,
    });
    editor.render();
    editor.setValue(input);
    expect(editor.box.getInstances(editor).size).to.equal(1);
    editor.removeBox();
    expect(editor.box.getInstances(editor).size).to.equal(0);
    const value = editor.getValue();
    debug(`output: ${value}`);
    editor.unmount();
    expect(value).to.equal(output);
  });

  it('selection event: should not have any class', done => {
    const input = '<p>foo<lake-box type="inline" name="inlineBox" focus="left"></lake-box>bar</p>';
    const editor = new Editor({
      root: rootNode,
    });
    editor.render();
    editor.setValue(input);
    const boxNode = editor.container.find('lake-box');
    const box = new Box(boxNode);
    const boxContainer = box.getContainer();
    window.setTimeout(() => {
      const isActivated = boxContainer.hasClass('lake-box-activated');
      const isFocused = boxContainer.hasClass('lake-box-focused');
      const isSelected = boxContainer.hasClass('lake-box-selected');
      editor.unmount();
      expect(isActivated).to.equal(false);
      expect(isFocused).to.equal(false);
      expect(isSelected).to.equal(false);
      done();
    }, 0);
  });

  it('selection event: should have activated class', done => {
    const input = '<p>foo<lake-box type="inline" name="inlineBox" focus="left"></lake-box>bar</p>';
    const editor = new Editor({
      root: rootNode,
    });
    editor.render();
    editor.setValue(input);
    const range = editor.selection.range;
    const boxNode = editor.container.find('lake-box');
    const box = new Box(boxNode);
    const boxContainer = box.getContainer();
    range.selectNodeContents(boxContainer);
    window.setTimeout(() => {
      const isActivated = boxContainer.hasClass('lake-box-activated');
      const isFocused = boxContainer.hasClass('lake-box-focused');
      const isSelected = boxContainer.hasClass('lake-box-selected');
      editor.unmount();
      expect(isActivated).to.equal(true);
      expect(isFocused).to.equal(false);
      expect(isSelected).to.equal(false);
      done();
    }, 100);
  });

  it('selection event: should have focused class', done => {
    const input = '<p>foo<lake-box type="inline" name="inlineBox" focus="left"></lake-box>bar</p>';
    const editor = new Editor({
      root: rootNode,
    });
    editor.render();
    editor.setValue(input);
    const range = editor.selection.range;
    const boxNode = editor.container.find('lake-box');
    const box = new Box(boxNode);
    const boxContainer = box.getContainer();
    range.selectBox(boxNode);
    window.setTimeout(() => {
      const isActivated = boxContainer.hasClass('lake-box-activated');
      const isFocused = boxContainer.hasClass('lake-box-focused');
      const isSelected = boxContainer.hasClass('lake-box-selected');
      editor.unmount();
      expect(isActivated).to.equal(false);
      expect(isFocused).to.equal(true);
      expect(isSelected).to.equal(false);
      done();
    }, 100);
  });

  it('selection event: should have selected class', done => {
    const input = '<p>foo<lake-box type="inline" name="inlineBox" focus="left"></lake-box>bar</p>';
    const editor = new Editor({
      root: rootNode,
    });
    editor.render();
    editor.setValue(input);
    const range = editor.selection.range;
    const boxNode = editor.container.find('lake-box');
    const box = new Box(boxNode);
    const boxContainer = box.getContainer();
    range.selectNodeContents(editor.container);
    window.setTimeout(() => {
      const isActivated = boxContainer.hasClass('lake-box-activated');
      const isFocused = boxContainer.hasClass('lake-box-focused');
      const isSelected = boxContainer.hasClass('lake-box-selected');
      editor.unmount();
      expect(isActivated).to.equal(false);
      expect(isFocused).to.equal(false);
      expect(isSelected).to.equal(true);
      done();
    }, 100);
  });

  it('input event: input text in the left strip of inline box', done => {
    const input = '<p>foo<lake-box type="inline" name="inlineBox" focus="left"></lake-box>bar</p>';
    const output = '<p>fooa<focus /><lake-box type="inline" name="inlineBox"></lake-box>bar</p>';
    const editor = new Editor({
      root: rootNode,
    });
    editor.render();
    editor.setValue(input);
    editor.event.on('input', () => {
      const value = editor.getValue();
      debug(`output: ${value}`);
      editor.unmount();
      expect(value).to.equal(output);
      done();
    });
    editor.container.find('.lake-box-strip').eq(0).text('a');
    inputData(editor, 'a');
  });

  it('input event: input text in the right strip of inline box', done => {
    const input = '<p>foo<lake-box type="inline" name="inlineBox" focus="right"></lake-box>bar</p>';
    const output = '<p>foo<lake-box type="inline" name="inlineBox"></lake-box>a<focus />bar</p>';
    const editor = new Editor({
      root: rootNode,
    });
    editor.render();
    editor.setValue(input);
    editor.event.on('input', () => {
      const value = editor.getValue();
      debug(`output: ${value}`);
      editor.unmount();
      expect(value).to.equal(output);
      done();
    });
    editor.container.find('.lake-box-strip').eq(1).text('a');
    inputData(editor, 'a');
  });

  it('input event: input composition text in the left strip of inline box', done => {
    const input = '<p>foo<lake-box type="inline" name="inlineBox" focus="left"></lake-box>bar</p>';
    const output = '<p>foo你好<focus /><lake-box type="inline" name="inlineBox"></lake-box>bar</p>';
    const editor = new Editor({
      root: rootNode,
    });
    editor.render();
    editor.setValue(input);
    editor.event.on('input', () => {
      const value = editor.getValue();
      debug(`output: ${value}`);
      editor.unmount();
      expect(value).to.equal(output);
      done();
    });
    editor.container.find('.lake-box-strip').eq(0).text('你好');
    inputCompositionData(editor, '你好');
  });

  it('click event', () => {
    const editor = new Editor({
      root: rootNode,
    });
    editor.render();
    let clickCount = 0;
    editor.event.on('click', () => {
      clickCount++;
    });
    click(editor.container.parent());
    expect(clickCount).to.equal(1);
    click(query(editor.popupContainer));
    expect(clickCount).to.equal(1);
  });

  /*
  it('always keeps empty paragraph', () => {
    const input = '<p>foo</p>';
    const output = '<p><br /><focus /></p>';
    const editor = new Editor({
      root: rootNode,
    });
    editor.render();
    editor.setValue(input);
    editor.command.execute('selectAll');
    editor.selection.deleteContents();
    editor.history.save();
    const value = editor.getValue();
    debug(`output: ${value}`);
    editor.unmount();
    expect(value).to.equal(output);
  });
  */

  it('readonly mode', () => {
    const input = '<p>foo<focus /></p>';
    const output = '<p>foo<focus /></p>';
    const view = new Editor({
      root: rootNode,
      readonly: true,
      value: input,
    });
    view.render();
    const readonly = view.readonly;
    const value = view.getValue();
    debug(`output: ${value}`);
    view.unmount();
    expect(readonly).to.equal(true);
    expect(value).to.equal(output);
  });

});
