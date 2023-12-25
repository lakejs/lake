import { expect } from 'chai';
import { query } from '../../src/utils';
import { Nodes } from '../../src/models/nodes';
import { BoxManager } from '../../src/managers/box';
import { Core } from '../../src/core';

describe('managers / box', () => {

  let targetNode: Nodes;

  beforeEach(() => {
    targetNode = query('<div></div>');
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
    const editor = new Core(targetNode.get(0), {
      defaultValue: '<lake-box type="block" name="managerTest"></lake-box>',
    });
    editor.create();
    box.renderAll(editor);
    editor.remove();
    box.remove('managerTest');
    expect(box.getNodeList(editor)[0].children().length).to.equal(3);
  });

});
