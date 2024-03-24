import { expect } from 'chai';
import { query } from '../../src/utils';
import { Nodes } from '../../src/models/nodes';
import { Plugin } from '../../src/managers/plugin';
import { Editor } from '../../src/editor';

describe('managers / plugin', () => {

  let targetNode: Nodes;

  beforeEach(() => {
    targetNode = query('<div class="lake-container" />');
    query(document.body).append(targetNode);
  });

  afterEach(() => {
    targetNode.remove();
  });

  it('should load a plugin', () => {
    const plugin = new Plugin();
    let editorValue = '';
    plugin.add((editor: Editor) => {
      editorValue = editor.getValue();
    });
    const editor = new Editor({
      root: targetNode,
      value: '<p>foo</p>',
    });
    editor.render();
    plugin.loadAll(editor);
    editor.unmount();
    expect(editorValue).to.equal('<p>foo</p>');
  });

});
