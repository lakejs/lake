import { expect } from 'chai';
import { debug, query } from '../src/utils';
import { Nodes } from '../src/models/nodes';
import { Core } from '../src/core';

function inputData(editor: Core, data: string) {
  const event = new InputEvent('input', {
    data,
    inputType: 'insertText',
    isComposing: false,
  });
  editor.container.emit('beforeinput', event);
  editor.container.emit('input', event);
}

function inputCompositionData(editor: Core, data: string) {
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

describe('core', () => {

  let targetNode: Nodes;

  beforeEach(() => {
    Core.box.add({
      type: 'inline',
      name: 'inlineBox',
      render: () => '<img />',
    });
    Core.box.add({
      type: 'block',
      name: 'blockBox',
      render: () => '<hr />',
    });
    targetNode = query('<div />');
    query(document.body).append(targetNode);
  });

  afterEach(() => {
    Core.box.remove('inlineBox');
    Core.box.remove('blockBox');
    targetNode.remove();
  });

  it('constructor: sets className', () => {
    const editor = new Core(targetNode.get(0), {
      className: 'my-editor-container',
    });
    editor.create();
    const hasClass = editor.container.hasClass('my-editor-container');
    editor.remove();
    expect(hasClass).to.equal(true);
  });

  it('constructor: sets spellcheck', () => {
    const editor = new Core(targetNode.get(0), {
      spellcheck: true,
    });
    editor.create();
    const spellcheck = editor.container.attr('spellcheck');
    editor.remove();
    expect(spellcheck).to.equal('true');
  });

  it('constructor: empty default value', () => {
    const input = '';
    const output = '';
    const editor = new Core(targetNode.get(0), {
      className: 'my-editor-container',
      defaultValue: input,
    });
    editor.create();
    const value = editor.getValue();
    debug(`output: ${value}`);
    editor.remove();
    expect(value).to.equal(output);
  });

  it('method: getValue', () => {
    const input = '<p><strong>\u200B# <focus />foo</strong></p>';
    const output = '<p><strong># <focus />foo</strong></p>';
    const editor = new Core(targetNode.get(0), {
      defaultValue: input,
    });
    editor.create();
    const value = editor.getValue();
    debug(`output: ${value}`);
    editor.remove();
    expect(value).to.equal(output);
  });

  it('method: setValue', () => {
    const input = '<p><strong>\u200B# <focus />foo</strong></p>';
    const output = '<p><strong># <focus />foo</strong></p>';
    const editor = new Core(targetNode.get(0), {
      className: 'my-editor-container',
    });
    editor.create();
    editor.setValue(input);
    const value = editor.getValue();
    debug(`output: ${value}`);
    editor.remove();
    expect(value).to.equal(output);
  });

  it('input event: input text in the left strip of inline box', done => {
    const input = '<p>foo<lake-box type="inline" name="inlineBox" focus="left"></lake-box>bar</p>';
    const output = '<p>fooa<focus /><lake-box type="inline" name="inlineBox"></lake-box>bar</p>';
    const editor = new Core(targetNode.get(0), {
      className: 'my-editor-container',
    });
    editor.create();
    editor.setValue(input);
    editor.event.on('input', () => {
      const value = editor.getValue();
      debug(`output: ${value}`);
      editor.remove();
      expect(value).to.equal(output);
      done();
    });
    editor.container.find('.lake-box-strip').eq(0).html('a');
    inputData(editor, 'a');
  });

  it('input event: input text in the right strip of inline box', done => {
    const input = '<p>foo<lake-box type="inline" name="inlineBox" focus="right"></lake-box>bar</p>';
    const output = '<p>foo<lake-box type="inline" name="inlineBox"></lake-box>a<focus />bar</p>';
    const editor = new Core(targetNode.get(0), {
      className: 'my-editor-container',
    });
    editor.create();
    editor.setValue(input);
    editor.event.on('input', () => {
      const value = editor.getValue();
      debug(`output: ${value}`);
      editor.remove();
      expect(value).to.equal(output);
      done();
    });
    editor.container.find('.lake-box-strip').eq(1).html('a');
    inputData(editor, 'a');
  });

  it('input event: input composition text in the left strip of inline box', done => {
    const input = '<p>foo<lake-box type="inline" name="inlineBox" focus="left"></lake-box>bar</p>';
    const output = '<p>foo你好<focus /><lake-box type="inline" name="inlineBox"></lake-box>bar</p>';
    const editor = new Core(targetNode.get(0), {
      className: 'my-editor-container',
    });
    editor.create();
    editor.setValue(input);
    editor.event.on('input', () => {
      const value = editor.getValue();
      debug(`output: ${value}`);
      editor.remove();
      expect(value).to.equal(output);
      done();
    });
    editor.container.find('.lake-box-strip').eq(0).html('你好');
    inputCompositionData(editor, '你好');
  });

  /*
  it('always keeps empty paragraph', () => {
    const input = '<p>foo</p>';
    const output = '<p><br /><focus /></p>';
    const editor = new Core(targetNode.get(0), {
      className: 'my-editor-container',
    });
    editor.create();
    editor.setValue(input);
    editor.command.execute('selectAll');
    editor.selection.deleteContents();
    editor.history.save();
    const value = editor.getValue();
    debug(`output: ${value}`);
    editor.remove();
    expect(value).to.equal(output);
  });
  */

  it('readonly mode', () => {
    const input = '<p>foo<focus /></p>';
    const output = '<p>foo<focus /></p>';
    const view = new Core(targetNode.get(0), {
      readonly: true,
      defaultValue: input,
    });
    view.create();
    const readonly = view.readonly;
    const value = view.getValue();
    debug(`output: ${value}`);
    view.remove();
    expect(readonly).to.equal(true);
    expect(value).to.equal(output);
  });

});
