import { expect } from 'chai';
import { query } from '../../src/utils';
import { Nodes } from '../../src/models';
import { Plugin } from '../../src/managers/plugin';
import { Core } from '../../src/core';

describe('managers / plugin', () => {

  let container: Nodes;

  beforeEach(() => {
    container = query('<div contenteditable="true"></div>');
    query(document.body).append(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('should load a plugin', () => {
    const plugin = new Plugin();
    let editorValue = '';
    plugin.add((editor: Core) => {
      editorValue = editor.getValue();
    });
    const editor = new Core(container.get(0), {
      defaultValue: '<p>foo</p>',
    });
    editor.create();
    plugin.loadAll(editor);
    editor.remove();
    expect(editorValue).to.equal('<p>foo</p>');
  });

});
