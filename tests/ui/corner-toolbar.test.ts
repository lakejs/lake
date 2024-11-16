import { query } from '../../src/utils/query';
import { CornerToolbar } from '../../src/ui/corner-toolbar';
import { Nodes } from '../../src';

describe('ui / corner-toolbar', () => {

  let rootNode: Nodes;

  beforeEach(()=> {
    rootNode = query('<div class="lake-corner-toolbar-root" style="position:relative;" />');
    query(document.body).append(rootNode);
  });

  afterEach(() => {
    rootNode.remove();
  });

  it('should not render if items are empty', () => {
    const cornerToolbar = new CornerToolbar({
      root: rootNode,
      items: [],
    });
    cornerToolbar.render();
    expect(rootNode.first().length).to.equal(0);
  });

});
