import { query } from '../../src/utils';
import { Nodes } from '../../src/models/nodes';
import { BoxManager } from '../../src/managers/box-manager';
import { Editor } from '../../src/editor';

describe('managers / box-manager', () => {

  let rootNode: Nodes;

  beforeEach(() => {
    rootNode = query('<div class="lake-root" />');
    query(document.body).append(rootNode);
  });

  afterEach(() => {
    rootNode.remove();
  });

  it('should render a box', () => {
    const box = new BoxManager();
    box.add({
      type: 'block',
      name: 'managerTest',
      render: () => '<div>bar</div>',
    });
    expect(box.getNames().indexOf('managerTest') >= 0).to.equal(true);
    const editor = new Editor({
      root: rootNode,
      value: '<lake-box type="block" name="managerTest"></lake-box>',
    });
    editor.render();
    const childrenLength = box.findAll(editor).eq(0).children().length;
    editor.unmount();
    box.remove('managerTest');
    expect(childrenLength).to.equal(3);
  });

  it('should rectify boxes that were removed', () => {
    const box = new BoxManager();
    box.add({
      type: 'block',
      name: 'managerTest',
      render: () => '<div>bar</div>',
    });
    expect(box.getNames().indexOf('managerTest') >= 0).to.equal(true);
    const editor = new Editor({
      root: rootNode,
      value: '<lake-box type="block" name="managerTest" focus="end"></lake-box><lake-box type="block" name="managerTest"></lake-box>',
    });
    editor.render();
    editor.container.find('lake-box').eq(1).remove();
    expect(editor.box.getInstances(editor).size).to.equal(2);
    editor.box.rectifyInstances(editor);
    expect(editor.box.getInstances(editor).size).to.equal(1);
    editor.unmount();
  });

});
