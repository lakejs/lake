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
    const html = editor.getValue();
    expect(html).to.equal(output);
  });

});
