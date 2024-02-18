import { expect } from 'chai';
import { query } from '../../src/utils';
import { Nodes } from '../../src/models/nodes';
import { Plugin } from '../../src/managers/plugin';
import { Editor } from '../../src/editor';

describe('managers / plugin', () => {

  let targetNode: Nodes;

  beforeEach(() => {
    targetNode = query('<div />');
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
      defaultValue: '<p>foo</p>',
    });
    editor.render(targetNode.get(0));
    plugin.loadAll(editor);
    editor.unmount();
    expect(editorValue).to.equal('<p>foo</p>');
  });

});
