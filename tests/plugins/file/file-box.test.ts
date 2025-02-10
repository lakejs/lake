import { debug } from 'lakelib/utils/debug';
import { query } from 'lakelib/utils/query';
import { Nodes } from 'lakelib/models/nodes';
import { Box } from 'lakelib/models/box';
import { Editor } from 'lakelib/editor';
import { click } from '../../utils';

const fileUrl = '../assets/images/heaven-lake-512.png';

describe('plugins / file / file-box', () => {

  let rootNode: Nodes;
  let editor: Editor;
  let box: Box;

  beforeEach(() => {
    rootNode = query('<div class="lake-root" />');
    query(document.body).append(rootNode);
    editor = new Editor({
      root: rootNode,
      value: '<p>foo<focus />bar</p>',
    });
    editor.render();
    box = editor.selection.insertBox('file', {
      url: fileUrl,
      status: 'done',
      name: 'heaven-lake-512.png',
      size: 60008,
      type: 'image/jpeg',
      lastModified: 1710229517198,
    });
  });

  afterEach(() => {
    editor.unmount();
    rootNode.remove();
  });

  it('should remove the box', done => {
    const boxNode = box.node;
    editor.event.once('statechange', () => {
      click(query(document.body).find('.lake-floating-toolbar button[name="remove"]'));
      const value = editor.getValue();
      debug(`output: ${value}`);
      expect(value).to.equal('<p>foo<focus />bar</p>');
      done();
    });
    click(boxNode.find('.lake-file'));
  });

  it('should hide the floating toolbar', done => {
    const boxNode = box.node;
    editor.event.once('statechange', () => {
      expect(query(document.body).find('.lake-floating-toolbar').length).to.equal(0);
      done();
    });
    click(boxNode.find('.lake-file'));
    editor.selection.range.selectBoxEnd(boxNode);
  });

});
