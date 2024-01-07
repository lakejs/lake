import { expect } from 'chai';
import { NativeElement, NativeNode } from '../../src/types/native';
import { query, diff } from '../../src/utils';

describe('utils / diff', () => {

  it('shoud add ul', () => {
    const node = query('<div><h1>foo</h1><p>bar</p></div>');
    const otherNode = query('<div><h1>foo</h1><ul><li>list</li></ul><p>bar</p></div>');
    const addedNodeList: ReturnType<typeof query>[] = [];
    const updatedNodeList: ReturnType<typeof query>[] = [];
    const removedNodeList: ReturnType<typeof query>[] = [];
    diff(node, otherNode, {
      childrenOnly: true,
      onNodeAdded: (nativeNode: NativeNode) => {
        addedNodeList.push(query(nativeNode));
        return nativeNode;
      },
      onElUpdated: (element: NativeElement) => {
        updatedNodeList.push(query(element));
      },
      onNodeDiscarded: (nativeNode: NativeNode) => {
        removedNodeList.push(query(nativeNode));
      },
    });
    expect(node.html()).to.equal('<h1>foo</h1><ul><li>list</li></ul><p>bar</p>');
    expect(addedNodeList[0].name).to.equal('ul');
    expect(updatedNodeList.length).to.equal(0);
    expect(removedNodeList.length).to.equal(0);
  });

  it('shoud update ul', () => {
    const node = query('<div><h1>foo</h1><ul class="a"><li>list</li></ul><p>bar</p></div>');
    const otherNode = query('<div><h1>foo</h1><ul class="b"><li>list</li></ul><p>bar</p></div>');
    const addedNodeList: ReturnType<typeof query>[] = [];
    const updatedNodeList: ReturnType<typeof query>[] = [];
    const removedNodeList: ReturnType<typeof query>[] = [];
    diff(node, otherNode, {
      childrenOnly: true,
      onNodeAdded: (nativeNode: NativeNode) => {
        addedNodeList.push(query(nativeNode));
        return nativeNode;
      },
      onElUpdated: (element: NativeElement) => {
        updatedNodeList.push(query(element));
      },
      onNodeDiscarded: (nativeNode: NativeNode) => {
        removedNodeList.push(query(nativeNode));
      },
    });
    expect(node.html()).to.equal('<h1>foo</h1><ul class="b"><li>list</li></ul><p>bar</p>');
    expect(addedNodeList.length).to.equal(0);
    expect(updatedNodeList[0].name).to.equal('ul');
    expect(removedNodeList.length).to.equal(0);
  });

  it('shoud remove ul', () => {
    const node = query('<div><h1>foo</h1><ul><li>list</li></ul><p>bar</p></div>');
    const otherNode = query('<div><h1>foo</h1><p>bar</p></div>');
    const addedNodeList: ReturnType<typeof query>[] = [];
    const updatedNodeList: ReturnType<typeof query>[] = [];
    const removedNodeList: ReturnType<typeof query>[] = [];
    diff(node, otherNode, {
      childrenOnly: true,
      onNodeAdded: (nativeNode: NativeNode) => {
        addedNodeList.push(query(nativeNode));
        return nativeNode;
      },
      onElUpdated: (element: NativeElement) => {
        updatedNodeList.push(query(element));
      },
      onNodeDiscarded: (nativeNode: NativeNode) => {
        removedNodeList.push(query(nativeNode));
      },
    });
    expect(node.html()).to.equal('<h1>foo</h1><p>bar</p>');
    expect(addedNodeList.length).to.equal(0);
    expect(updatedNodeList.length).to.equal(0);
    expect(removedNodeList[0].name).to.equal('ul');
  });

});
