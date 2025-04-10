import { query } from '../../src/utils/query';
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
    const childrenLength = editor.container.find('lake-box').eq(0).children().length;
    editor.unmount();
    box.remove('managerTest');
    expect(childrenLength).to.equal(3);
  });

});
