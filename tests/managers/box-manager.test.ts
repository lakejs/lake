import { expect } from 'chai';
import { query } from '../../src/utils';
import { Nodes } from '../../src/models/nodes';
import { BoxManager } from '../../src/managers/box-manager';
import { Editor } from '../../src/editor';

describe('managers / box-manager', () => {

  let targetNode: Nodes;

  beforeEach(() => {
    targetNode = query('<div class="lake-container" />');
    query(document.body).append(targetNode);
  });

  afterEach(() => {
    targetNode.remove();
  });

  it('should render a box', () => {
    const box = new BoxManager();
    box.add({
      type: 'block',
      name: 'managerTest',
      render: () => 'bar',
    });
    expect(box.getNames().indexOf('managerTest') >= 0).to.equal(true);
    const editor = new Editor(targetNode, {
      defaultValue: '<lake-box type="block" name="managerTest"></lake-box>',
    });
    editor.render();
    box.renderAll(editor);
    const childrenLength = box.findAll(editor).eq(0).children().length;
    editor.unmount();
    box.remove('managerTest');
    expect(childrenLength).to.equal(3);
  });

});
