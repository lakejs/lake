import { expect } from 'chai';
import { NativeNode } from '../../src/types/native';
import { query, morph, debug } from '../../src/utils';

function morphTest(node: ReturnType<typeof query>, otherNode: ReturnType<typeof query>) {
  /*
  const config = {
    attributes: true,
    childList: true,
    subtree: true,
    characterData: true,
  };
  const observer = new MutationObserver((records: MutationRecord[]) => {
    for (const record of records) {
      for (const addedNode of record.addedNodes) {
        debug('Added node: ', addedNode);
      }
      for (const removedNode of record.removedNodes) {
        debug('Removed node: ', removedNode);
      }
      if (record.type === 'attributes') {
        debug(`The '${record.attributeName}' attribute was modified.`, record.target);
      }
      if (record.type === 'characterData') {
        debug('Character data: ', record.target);
      }
    }
    observer.disconnect();
  });
  observer.observe(node.get(0), config);
  */
  const addedNodeList: ReturnType<typeof query>[] = [];
  const removedNodeList: ReturnType<typeof query>[] = [];
  morph(node, otherNode, {
    callbacks: {
      afterNodeAdded: (nativeNode: NativeNode) => {
        addedNodeList.push(query(nativeNode));
      },
      afterNodeRemoved: (nativeNode: NativeNode) => {
        removedNodeList.push(query(nativeNode));
      },
    },
  });
  const content = node.html();
  debug(content);
  return {
    content,
    addedNodeList,
    removedNodeList,
  };
}

describe('utils / morph', () => {

  it('shoud add ul', () => {
    const node = query('<div><h1>foo</h1><p>bar</p></div>');
    const otherNode = query('<div><h1>foo</h1><ul><li>list</li></ul><p>bar</p></div>');
    const result = morphTest(node, otherNode);
    expect(result.content).to.equal('<h1>foo</h1><ul><li>list</li></ul><p>bar</p>');
    expect(result.addedNodeList.length).to.equal(1);
    expect(result.addedNodeList[0].name).to.equal('ul');
    expect(result.removedNodeList.length).to.equal(0);
  });

  it('shoud add p', () => {
    const node = query('<div><p>a</p><h1><strong>b</strong></h1><p>c</p><p>d</p></div>');
    const otherNode = query('<div><p>a</p><p>new</p><h1><strong>b</strong></h1><p>c</p><p>d</p></div>');
    const result = morphTest(node, otherNode);
    expect(result.content).to.equal('<p>a</p><p>new</p><h1><strong>b</strong></h1><p>c</p><p>d</p>');
    // expect(result.addedNodeList.length).to.equal(1);
    // expect(result.addedNodeList[0].name).to.equal('p');
    // expect(result.removedNodeList.length).to.equal(0);
  });

  it('shoud update ul', () => {
    const node = query('<div><h1>foo</h1><ul class="a"><li>list</li></ul><p>bar</p></div>');
    const otherNode = query('<div><h1>foo</h1><ul class="b"><li>list</li></ul><p>bar</p></div>');
    const result = morphTest(node, otherNode);
    expect(result.content).to.equal('<h1>foo</h1><ul class="b"><li>list</li></ul><p>bar</p>');
    expect(result.addedNodeList.length).to.equal(0);
    expect(result.removedNodeList.length).to.equal(0);
  });

  it('shoud remove ul', () => {
    const node = query('<div><h1>foo</h1><ul><li>list</li></ul><p>bar</p></div>');
    const otherNode = query('<div><h1>foo</h1><p>bar</p></div>');
    const result = morphTest(node, otherNode);
    expect(result.content).to.equal('<h1>foo</h1><p>bar</p>');
    expect(result.addedNodeList.length).to.equal(0);
    expect(result.removedNodeList.length).to.equal(1);
    expect(result.removedNodeList[0].name).to.equal('ul');
  });

  it('beforeNodeAdded: shoud not add ul', () => {
    const node = query('<div><h1>foo</h1><p>bar</p></div>');
    const otherNode = query('<div><h1>foo</h1><ul><li>list</li></ul><p>bar</p></div>');
    morph(node, otherNode, {
      callbacks: {
        beforeNodeAdded: (nativeNode: NativeNode) => {
          if (query(nativeNode).name === 'ul') {
            return false;
          }
        },
      },
    });
    const content = node.html();
    expect(content).to.equal('<h1>foo</h1><p>bar</p>');
  });

  it('beforeNodeRemoved: shoud not remove ul', () => {
    const node = query('<div><h1>foo</h1><ul><li>list</li></ul><p>bar</p></div>');
    const otherNode = query('<div><h1>foo</h1><p>bar</p></div>');
    morph(node, otherNode, {
      callbacks: {
        beforeNodeRemoved: (nativeNode: NativeNode) => {
          if (query(nativeNode).name === 'ul') {
            return false;
          }
        },
      },
    });
    const content = node.html();
    expect(content).to.equal('<h1>foo</h1><ul><li>list</li></ul><p>bar</p>');
  });

  it('beforeChildrenUpdated: shoud not update children', () => {
    const node = query('<div><p>a</p><h1><strong>b</strong></h1><p>c</p></div>');
    const otherNode = query('<div><p>a2</p><h1><strong>b2</strong></h1><p>c2</p></div>');
    morph(node, otherNode, {
      callbacks: {
        beforeChildrenUpdated: (oldNode: NativeNode) => {
          if (query(oldNode).name === 'h1') {
            return false;
          }
        },
      },
    });
    const content = node.html();
    expect(content).to.equal('<p>a2</p><h1><strong>b</strong></h1><p>c2</p>');
  });

});
