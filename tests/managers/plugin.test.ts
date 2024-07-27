import { query } from '../../src/utils';
import { Nodes } from '../../src/models/nodes';
import { Plugin } from '../../src/managers/plugin';
import { Editor } from '../../src/editor';

describe('managers / plugin', () => {

  let rootNode: Nodes;

  beforeEach(() => {
    rootNode = query('<div class="lake-root" />');
    query(document.body).append(rootNode);
  });

  afterEach(() => {
    rootNode.remove();
  });

  it('should load a plugin', () => {
    const plugin = new Plugin();
    let editorValue = '';
    plugin.add('myPlugin1', (editor: Editor) => {
      editorValue = editor.getValue();
    });
    const editor = new Editor({
      root: rootNode,
      value: '<p>foo</p>',
    });
    editor.render();
    plugin.loadAll(editor);
    editor.unmount();
    expect(editorValue).to.equal('<p>foo</p>');
  });

  it('should not load a plugin', () => {
    const plugin = new Plugin();
    let editorValue = '';
    plugin.add('myPlugin2', (editor: Editor) => {
      editorValue = editor.getValue();
    });
    const editor = new Editor({
      root: rootNode,
      value: '<p>foo</p>',
      myPlugin2: false,
    });
    editor.render();
    plugin.loadAll(editor);
    editor.unmount();
    expect(editorValue).to.equal('');
  });

});
