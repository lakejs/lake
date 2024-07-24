import { scrollToNode, nodeAndView, query, safeTemplate } from '../../src/utils';

describe('utils / scroll-to-node', () => {

  it('should scroll to the node', () => {
    const rootNode = query(safeTemplate`
    <div class="lake-root" style="height: 100px; overflow: auto;">
      <div class="lake-container-wrapper">
        <div class="lake-container" contenteditable="true">
          <p>0</p>
          <p>1</p>
          <p>2</p>
          <p>3</p>
          <p>4</p>
        </div>
      </div>
    </div>
    `);
    query(document.body).append(rootNode);
    (rootNode.get(0) as Element).scrollTo(0, 50);
    const node = rootNode.find('p').eq(0);
    const position = nodeAndView(node);
    expect(position.left > 0).to.equal(true);
    expect(position.right > 0).to.equal(true);
    expect(position.top > 0).to.equal(false);
    expect(position.bottom > 0).to.equal(true);
    scrollToNode(node);
    const newPosition = nodeAndView(node);
    expect(newPosition.left > 0).to.equal(true);
    expect(newPosition.right > 0).to.equal(true);
    expect(newPosition.top > 0).to.equal(true);
    expect(newPosition.bottom > 0).to.equal(true);
    rootNode.remove();
  });

});
