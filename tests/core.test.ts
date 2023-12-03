import { expect } from 'chai';
import { query } from '../src/utils';
import { Nodes } from '../src/models/nodes';
import { Core } from '../src/core';

describe('core', () => {

  let targetNode: Nodes;

  beforeEach(() => {
    targetNode = query('<div />');
    query(document.body).append(targetNode);
  });

  afterEach(() => {
    targetNode.remove();
  });

  it('constructor: sets className', () => {
    const editor = new Core(targetNode.get(0), {
      className: 'my-editor-container',
    });
    editor.create();
    expect(editor.container.hasClass('my-editor-container')).to.equal(true);
    editor.remove();
  });

  it('constructor: sets spellcheck', () => {
    const editor = new Core(targetNode.get(0), {
      spellcheck: true,
    });
    editor.create();
    expect(editor.container.attr('spellcheck')).to.equal('true');
    editor.remove();
  });

  it('method: getValue', () => {
    const input = '<p><strong>\u200B# <focus />foo</strong></p>';
    const output = '<p><strong># <focus />foo</strong></p>';
    const editor = new Core(targetNode.get(0), {
      defaultValue: input,
    });
    editor.create();
    expect(editor.getValue()).to.equal(output);
    editor.remove();
  });


  it('method: setValue', () => {
    const input = '<p><strong>\u200B# <focus />foo</strong></p>';
    const output = '<p><strong># <focus />foo</strong></p>';
    const editor = new Core(targetNode.get(0), {
      className: 'my-editor-container',
    });
    editor.create();
    editor.setValue(input);
    expect(editor.getValue()).to.equal(output);
    editor.remove();
  });

  it('readonly mode', () => {
    const input = '<p>foo<focus /></p>';
    const output = '<p>foo<focus /></p>';
    const view = new Core(targetNode.get(0), {
      readonly: true,
      defaultValue: input,
    });
    view.create();
    expect(view.readonly).to.equal(true);
    expect(view.getValue()).to.equal(output);
    view.remove();
  });

});
