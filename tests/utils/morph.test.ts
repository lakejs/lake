import { expect } from 'chai';
import { NativeNode } from '../../src/types/native';
import { query, morph, debug } from '../../src/utils';

function morphTest(node: ReturnType<typeof query>, otherNode: ReturnType<typeof query>) {
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
    const node = query('<div><p>a</p><p>b</p><p>c</p><p>d</p></div>');
    const otherNode = query('<div><p>a</p><p>new</p><p>b</p><p>c</p><p>d</p></div>');
    const result = morphTest(node, otherNode);
    expect(result.content).to.equal('<p>a</p><p>new</p><p>b</p><p>c</p><p>d</p>');
    expect(result.addedNodeList.length).to.equal(1);
    expect(result.addedNodeList[0].name).to.equal('p');
    expect(result.removedNodeList.length).to.equal(0);
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

});
