import { expect } from 'chai';
import { query } from '../src/utils';
import { Nodes } from '../src/models/nodes';
import { Core } from '../src/core';

describe('core', () => {

  let targetNode: Nodes;
  let editor: Core;

  beforeEach(() => {
    targetNode = query('<div />');
    query(document.body).append(targetNode);
    editor = new Core(targetNode.get(0), {
      className: 'my-editor-container',
    });
    editor.create();
  });

  afterEach(() => {
    editor.remove();
    targetNode.remove();
  });

  it('sets value', () => {
    const input = '<p><strong>\u200B# <focus />foo</strong></p>';
    const output = '<p><strong># <focus />foo</strong></p>';
    editor.setValue(input);
    expect(editor.getValue()).to.equal(output);
  });

  it('readonly mode', () => {
    const input = '<p>foo<focus /></p>';
    editor.remove();
    const view = new Core(targetNode.get(0), {
      readonly: true,
      className: 'my-editor-container',
      defaultValue: input,
    });
    view.create();
    expect(view.readonly).to.equal(true);
    view.remove();
  });

});
