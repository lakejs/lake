import { nodePosition, query, safeTemplate } from '../../src/utils';

describe('utils / node-position', () => {

  it('the node is visible', () => {
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
    const position = nodePosition(rootNode.find('p').eq(0));
    expect(position.left > 0).to.equal(true);
    expect(position.right > 0).to.equal(true);
    expect(position.top > 0).to.equal(true);
    expect(position.bottom > 0).to.equal(true);
    rootNode.remove();
  });

  it('the top of the node is not visible', () => {
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
    const position = nodePosition(rootNode.find('p').eq(0));
    expect(position.left > 0).to.equal(true);
    expect(position.right > 0).to.equal(true);
    expect(position.top > 0).to.equal(false);
    expect(position.bottom > 0).to.equal(true);
    rootNode.remove();
  });

  it('the bottom of the node is not visible', () => {
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
    const position = nodePosition(rootNode.find('p').eq(4));
    expect(position.left > 0).to.equal(true);
    expect(position.right > 0).to.equal(true);
    expect(position.top > 0).to.equal(true);
    expect(position.bottom > 0).to.equal(false);
    rootNode.remove();
  });

  it('the left of the node is not visible', () => {
    const rootNode = query(safeTemplate`
    <div class="lake-root" style="width: 200px; height: 100px; overflow: auto;">
      <div class="lake-container-wrapper">
        <div class="lake-container" contenteditable="true">
        <div style="width: 500px;">0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000</div>
          <p>1</p>
          <p>2</p>
          <p>3</p>
          <p>4</p>
        </div>
      </div>
    </div>
    `);
    query(document.body).append(rootNode);
    (rootNode.get(0) as Element).scrollTo(100, 0);
    const position = nodePosition(rootNode.find('.lake-container > div').eq(0));
    expect(position.left > 0).to.equal(false);
    expect(position.right > 0).to.equal(false);
    expect(position.top > 0).to.equal(true);
    expect(position.bottom > 0).to.equal(true);
    rootNode.remove();
  });

  it('the right of the node is not visible', () => {
    const rootNode = query(safeTemplate`
    <div class="lake-root" style="width: 200px; height: 100px; overflow: auto;">
      <div class="lake-container-wrapper">
        <div class="lake-container" contenteditable="true">
          <div style="width: 500px;">0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000</div>
          <p>1</p>
          <p>2</p>
          <p>3</p>
          <p>4</p>
        </div>
      </div>
    </div>
    `);
    query(document.body).append(rootNode);
    const position = nodePosition(rootNode.find('.lake-container > div').eq(0));
    expect(position.left > 0).to.equal(true);
    expect(position.right > 0).to.equal(false);
    expect(position.top > 0).to.equal(true);
    expect(position.bottom > 0).to.equal(true);
    rootNode.remove();
  });

});
