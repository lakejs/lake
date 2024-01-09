import { expect } from 'chai';
import { NativeNode } from '../../src/types/native';
import { query, morph, debug } from '../../src/utils';

function testFidelity(start: string, end: string) {
  const node = query(`<div>${start}</div>`);
  const otherNode = query(`<div>${end}</div>`);
  morph(node, otherNode);
  const content = node.html();
  debug(content);
  expect(content).to.equal(end);
}

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

  it('can morph content to content', () => {
    const node = query('<button>Foo</button>');
    const otherNode = query('<button>Bar</button>');
    morph(node, otherNode);
    const content = node.html();
    debug(content);
    expect(node.name).to.equal('button');
    expect(content).to.equal('Bar');
  });

  it('can morph attributes', () => {
    const node = query('<div><button class="foo" disabled>Foo</button></div>');
    const otherNode = query('<div><button class="bar">Bar</button></div>');
    morph(node, otherNode);
    const content = node.html();
    debug(content);
    expect(content).to.equal(otherNode.html());
  });

  it('can morph children', () => {
    const node = query('<div><div><button class="foo" disabled>Foo</button></div></div>');
    const otherNode = query('<div><div><button class="bar">Bar</button></div></div>');
    morph(node, otherNode);
    const content = node.html();
    debug(content);
    expect(content).to.equal(otherNode.html());
  });

  it('basic deep morph works', () => {
    const node = query('<div><div id="root1"><div><div id="d1">A</div></div><div><div id="d2">B</div></div><div><div id="d3">C</div></div></div></div>');
    const otherNode = query('<div><div id="root2"><div><div id="d2">E</div></div><div><div id="d3">F</div></div><div><div id="d1">D</div></div></div></div>');
    morph(node, otherNode);
    const content = node.html();
    debug(content);
    expect(content).to.equal('<div id="root2"><div><div id="d2">E</div></div><div><div id="d3">F</div></div><div><div id="d1">D</div></div></div>');
  });

  it('deep morphdom does not work ideally', () => {
    const node = query('<div><div id="root"><div><div id="d1">A</div></div><div><div id="d2">B</div></div><div><div id="d3">C</div></div></div></div>');
    const otherNode = query('<div><div id="root2"><div><div id="d2">E</div></div><div><div id="d3">F</div></div><div><div id="d1">D</div></div></div></div>');
    morph(node, otherNode);
    const content = node.html();
    debug(content);
    expect(content).to.equal('<div id="root2"><div><div id="d2">E</div></div><div><div id="d3">F</div></div><div><div id="d1">D</div></div></div>');
  });

  it('morphs text correctly', () => {
    testFidelity('<button>Foo</button>', '<button>Bar</button>');
  });

  it('morphs attributes correctly', () => {
    testFidelity('<button class="foo">Foo</button>', '<button class="bar">Foo</button>');
  });

  it('morphs children', () => {
    testFidelity('<div><p>A</p><p>B</p></div>', '<div><p>C</p><p>D</p></div>');
  });

  it('morphs white space', () => {
    testFidelity('<div><p>A</p><p>B</p></div>', '<div><p>C</p><p>D</p>  </div>');
  });

  it('drops content', () => {
    testFidelity('<div><p>A</p><p>B</p></div>', '<div></div>');
  });

  it('adds content', () => {
    testFidelity('<div></div>', '<div><p>A</p><p>B</p></div>');
  });

  it('should morph a node', () => {
    testFidelity('<p>hello world</p>', '<p>hello you</p>');
  });

  it('should stay same if same', () => {
    testFidelity('<p>hello world</p>', '<p>hello world</p>');
  });

  it('should replace a node', () => {
    testFidelity('<main><p>hello world</p></main>', '<main><div>hello you</div></main>');
  });

  it('should append a node', () => {
    testFidelity('<main></main>', '<main><p>hello you</p></main>');
  });

  it('morphs outerHTML as content properly when argument is single node', () => {
    const node = query('<div><button>Foo</button></div>');
    const otherNode = query('<div><button>Bar</button></div>');
    morph(node, otherNode, {
      morphStyle:'outerHTML',
    });
    const content = node.html();
    debug(content);
    expect(content).to.equal('<button>Bar</button>');
  });

  it('morphs innerHTML as content properly when argument is single node', () => {
    const node = query('<div>Foo</div>');
    const otherNode = query('<div><button>Bar</button></div>');
    morph(node, otherNode, {
      morphStyle:'innerHTML',
    });
    const content = node.html();
    debug(content);
    expect(content).to.equal('<div><button>Bar</button></div>');
  });

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
    debug(content);
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
    debug(content);
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
    debug(content);
    expect(content).to.equal('<p>a2</p><h1><strong>b</strong></h1><p>c2</p>');
  });

});
