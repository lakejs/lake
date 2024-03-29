import { click } from '../utils';
import { query } from '../../src/utils';
import { Nodes } from '../../src/models/nodes';
import { Editor } from '../../src';
import { Toolbar } from '../../src/ui/toolbar';

describe('ui / toolbar', () => {

  let editorNode: Nodes;
  let editor: Editor;
  let toolbar: Toolbar;

  beforeEach(() => {
    editorNode = query('<div class="lake-editor"><div class="lake-toolbar"></div><div class="lake-main"></div></div>');
    query(document.body).append(editorNode);
    editor = new Editor({
      root: editorNode.find('.lake-main'),
      value: '<p><br /><focus /></p>',
    });
    editor.render();
    const toolbarNode = editorNode.find('.lake-toolbar');
    toolbar = new Toolbar({
      editor,
      root: toolbarNode,
      items: [
        'heading',
        'bold',
        'moreStyle',
        'fontColor',
        'image',
        'align',
        'list',
      ],
    });
    toolbar.render();
  });

  afterEach(() => {
    editorNode.remove();
  });

  it('renders toolbar items', () => {
    editor.unmount();
    expect(toolbar.root.find('div[name="heading"]').length).to.equal(1);
    expect(toolbar.root.find('button[name="bold"]').length).to.equal(1);
    expect(toolbar.root.find('div[name="moreStyle"]').length).to.equal(1);
    expect(toolbar.root.find('div[name="fontColor"]').length).to.equal(1);
    expect(toolbar.root.find('button[name="image"]').length).to.equal(1);
    expect(toolbar.root.find('div[name="align"]').length).to.equal(1);
    expect(toolbar.root.find('div[name="list"]').length).to.equal(1);
  });

  it('updates heading state', done => {
    toolbar.event.on('updatestate', () => {
      click(toolbar.root.find('div[name="heading"] .lake-dropdown-title'));
      const visibility = toolbar.root.find('div[name="heading"] li[value="h3"] .lake-dropdown-menu-check').computedCSS('visibility');
      const headingText = toolbar.root.find('div[name="heading"] .lake-dropdown-text').text();
      editor.unmount();
      expect(visibility).to.deep.equal('visible');
      expect(headingText).to.equal('Heading 3');
      done();
    });
    click(toolbar.root.find('div[name="heading"] .lake-dropdown-title'));
    click(toolbar.root.find('div[name="heading"] li[value="h3"]'));
  });

  it('updates bold state', done => {
    toolbar.event.on('updatestate', () => {
      const isSelected = toolbar.root.find('button[name="bold"].lake-toolbar-button-selected').length > 0;
      editor.unmount();
      expect(isSelected).to.equal(true);
      done();
    });
    click(toolbar.root.find('button[name="bold"]'));
  });

  it('updates moreStyle state', done => {
    toolbar.event.on('updatestate', () => {
      click(toolbar.root.find('div[name="moreStyle"] .lake-dropdown-title'));
      const visibility = toolbar.root.find('div[name="moreStyle"] li[value="underline"] .lake-dropdown-menu-check').computedCSS('visibility');
      editor.unmount();
      expect(visibility).to.deep.equal('visible');
      done();
    });
    click(toolbar.root.find('div[name="moreStyle"] .lake-dropdown-title'));
    click(toolbar.root.find('div[name="moreStyle"] li[value="underline"]'));
  });

  it('updates fontColor state', done => {
    toolbar.event.on('updatestate', () => {
      click(toolbar.root.find('div[name="fontColor"] .lake-dropdown-down-icon'));
      const visibility = toolbar.root.find('div[name="fontColor"] li[value="#f5222d"] .lake-dropdown-menu-check').computedCSS('visibility');
      editor.unmount();
      expect(visibility).to.deep.equal('visible');
      done();
    });
    click(toolbar.root.find('div[name="fontColor"] .lake-dropdown-down-icon'));
    click(toolbar.root.find('div[name="fontColor"] li[value="#f5222d"]'));
  });

  it('updates list state', done => {
    toolbar.event.on('updatestate', () => {
      click(toolbar.root.find('div[name="list"] .lake-dropdown-title'));
      const visibility = toolbar.root.find('div[name="list"] li[value="numbered"] .lake-dropdown-menu-check').computedCSS('visibility');
      editor.unmount();
      expect(visibility).to.deep.equal('visible');
      done();
    });
    click(toolbar.root.find('div[name="list"] .lake-dropdown-title'));
    click(toolbar.root.find('div[name="list"] li[value="numbered"]'));
  });

});
