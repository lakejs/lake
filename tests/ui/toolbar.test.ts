import { query } from '../../src/utils';
import { Nodes } from '../../src/models/nodes';
import { Editor } from '../../src';
import { Toolbar } from '../../src/ui/toolbar';

describe('ui / toolbar', () => {

  let editorNode: Nodes;

  beforeEach(() => {
    editorNode = query('<div class="lake-editor"><div class="lake-toolbar"></div><div class="lake-main"></div></div>');
    query(document.body).append(editorNode);
  });

  afterEach(() => {
    editorNode.remove();
  });

  it('renders toolbar items', () => {
    const editor = new Editor({
      root: editorNode.find('.lake-main'),
      value: '<p><br /><focus /></p>',
    });
    editor.render();
    const toolbarNode = editorNode.find('.lake-toolbar');
    const toolbar = new Toolbar({
      editor,
      root: toolbarNode,
    });
    toolbar.render();
    editor.unmount();
    expect(toolbarNode.find('button[name="undo"]').length).to.equal(1);
    expect(toolbarNode.find('div[name="heading"]').length).to.equal(1);
    expect(toolbarNode.find('div[name="fontColor"]').length).to.equal(1);
  });

  it('updates heading state', done => {
    const editor = new Editor({
      root: editorNode.find('.lake-main'),
      value: '<p><br /><focus /></p>',
    });
    editor.render();
    const toolbarNode = editorNode.find('.lake-toolbar');
    const toolbar = new Toolbar({
      editor,
      root: toolbarNode,
    });
    toolbar.render();
    editor.command.execute('heading', 'h3');
    window.setTimeout(() => {
      const headingText = toolbarNode.find('div[name="heading"] .lake-dropdown-text').text();
      editor.unmount();
      expect(headingText).to.equal('Heading 3');
      done();
    }, 200);
  });

});
