import { scrollToNode, isVisible, query, template } from '../../src/utils';

describe('utils / scroll-to-node', () => {

  it('should scroll to the node', () => {
    const rootNode = query(template`
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
    const visible = isVisible(node);
    expect(visible.left).to.equal(true);
    expect(visible.right).to.equal(true);
    expect(visible.top).to.equal(false);
    expect(visible.bottom).to.equal(false);
    scrollToNode(node);
    const visible2 = isVisible(node);
    expect(visible2.left).to.equal(true);
    expect(visible2.right).to.equal(true);
    expect(visible2.top).to.equal(true);
    expect(visible2.bottom).to.equal(true);
    rootNode.remove();
  });

});
