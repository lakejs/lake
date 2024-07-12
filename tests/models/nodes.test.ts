import { query, safeTemplate } from '../../src/utils';
import { Nodes } from '../../src/models/nodes';

describe('models / nodes', () => {

  let element: Element;
  let elementTwo: Element;

  beforeEach(() => {
    element = document.createElement('div');
    element.className = 'class1';
    element.innerHTML = 'one';
    document.body.appendChild(element);
    elementTwo = document.createElement('p');
    elementTwo.innerHTML = 'two';
    elementTwo.className = 'class2';
    document.body.appendChild(elementTwo);
  });

  afterEach(() => {
    document.body.removeChild(element);
    document.body.removeChild(elementTwo);
  });

  it('property: length', () => {
    expect(new Nodes(element).length).to.equal(1);
    expect(new Nodes([element, document.body]).length).to.equal(2);
  });

  it('property: id', () => {
    const nodes = new Nodes([element, elementTwo, document.body]);
    expect(nodes.id).to.be.a('number');
    expect(nodes.eq(1).id).to.be.a('number');
  });

  it('property: name', () => {
    const nodes = new Nodes([element, elementTwo, document.body]);
    expect(nodes.name).to.equal('div');
    expect(nodes.eq(1).name).to.equal('p');
  });

  it('property: isElement', () => {
    const container = query('<div contenteditable="true"><strong>foo</strong>bar</div>');
    expect(container.find('strong').isElement).to.equal(true);
    expect(container.find('strong').first().isElement).to.equal(false);
  });

  it('property: isText', () => {
    const container = query('<div contenteditable="true"><strong>foo</strong>bar</div>');
    expect(container.find('strong').first().isText).to.equal(true);
    expect(container.find('strong').isText).to.equal(false);
  });

  it('property: isBlock', () => {
    const container = query('<div contenteditable="true"><strong>foo</strong><p>bar</p></div>');
    expect(container.find('p').isBlock).to.equal(true);
    expect(container.find('strong').isBlock).to.equal(false);
  });

  it('property: isMark', () => {
    const container = query('<div contenteditable="true"><strong>foo</strong>bar</div>');
    expect(container.find('strong').isMark).to.equal(true);
    expect(container.find('strong').first().isMark).to.equal(false);
  });

  it('property: isVoid', () => {
    const container = query('<div contenteditable="true"><strong>foo</strong>bar<br /></div>');
    expect(container.find('br').isVoid).to.equal(true);
    expect(container.find('strong').isVoid).to.equal(false);
  });

  it('property: isHeading', () => {
    const container = query('<div contenteditable="true"><h1>foo</h1><p>bar</p></div>');
    expect(container.find('h1').isHeading).to.equal(true);
    expect(container.find('p').isHeading).to.equal(false);
  });

  it('property: isList', () => {
    const container = query('<div contenteditable="true"><ol><li>foo</li></ol><p>bar</p></div>');
    expect(container.find('ol').isList).to.equal(true);
    expect(container.find('li').isList).to.equal(true);
    expect(container.find('p').isList).to.equal(false);
  });

  it('property: isTable', () => {
    const container = query('<div contenteditable="true"><table><tr><td>foo</td></tr></table><p>bar</p></div>');
    expect(container.find('table').isTable).to.equal(true);
    expect(container.find('tr').isTable).to.equal(true);
    expect(container.find('td').isTable).to.equal(true);
    expect(container.find('p').isTable).to.equal(false);
  });

  it('property: isBookmark', () => {
    const container = query('<div contenteditable="true"><strong>foo</strong>bar<lake-bookmark /></div>');
    expect(container.find('lake-bookmark').isBookmark).to.equal(true);
    expect(container.find('strong').isBookmark).to.equal(false);
  });

  it('property: isBox', () => {
    const container = query('<div contenteditable="true"><lake-box><div class="lake-box-container"><hr /></div></lake-box><p>foo</p></div>');
    expect(container.find('lake-box').isBox).to.equal(true);
    expect(container.find('.lake-box-container').isBox).to.equal(false);
    expect(container.find('p').isBox).to.equal(false);
  });

  it('property: isInlineBox', () => {
    const container = query('<div contenteditable="true"><lake-box type="inline"><div class="lake-box-container"><hr /></div></lake-box><p>foo</p></div>');
    expect(container.find('lake-box').isInlineBox).to.equal(true);
    expect(container.find('.lake-box-container').isInlineBox).to.equal(false);
    expect(container.find('p').isInlineBox).to.equal(false);
  });

  it('property: isBlockBox', () => {
    const container = query('<div contenteditable="true"><lake-box type="block"><div class="lake-box-container"><hr /></div></lake-box><p>foo</p></div>');
    expect(container.find('lake-box').isBlockBox).to.equal(true);
    expect(container.find('.lake-box-container').isBlockBox).to.equal(false);
    expect(container.find('p').isBlockBox).to.equal(false);
  });

  it('property: isContainer', () => {
    const container = query('<div contenteditable="true"><strong>foo</strong>bar</div>');
    expect(container.isContainer).to.equal(true);
    expect(container.parent().isContainer).to.equal(false);
    expect(container.find('strong').isContainer).to.equal(false);
  });

  it('property: isOutside', () => {
    const container = query('<div contenteditable="true"><p>foo</p><div contenteditable="false">bar</div></div>');
    expect(container.isOutside).to.equal(false);
    expect(container.find('p').isOutside).to.equal(false);
    expect(container.find('p').first().isOutside).to.equal(false);
    expect(container.find('div').isOutside).to.equal(false);
    expect(container.find('div').first().isOutside).to.equal(false);
    expect(container.parent().isOutside).to.equal(true);
  });

  it('property: isInside', () => {
    const container = query('<div contenteditable="true"><p>foo</p>bar</div>');
    expect(container.isInside).to.equal(false);
    expect(container.find('p').isInside).to.equal(true);
    expect(container.find('p').first().isInside).to.equal(true);
    expect(container.find('p').next().isInside).to.equal(true);
    expect(container.parent().isInside).to.equal(false);
  });

  it('property: isTopInside', () => {
    const container = query('<div contenteditable="true"><h1><p>foo</p>bar</h1>end</div>');
    expect(container.isTopInside).to.equal(false);
    expect(container.find('h1').isTopInside).to.equal(true);
    expect(container.find('p').isTopInside).to.equal(false);
    expect(container.find('h1').next().isTopInside).to.equal(true);
    expect(container.parent().isTopInside).to.equal(false);
  });

  it('property: isContentEditable', () => {
    const container = query('<div contenteditable="true"><p>foo</p><div contenteditable="false">bar</div></div>');
    expect(container.isContentEditable).to.equal(true);
    expect(container.find('p').isContentEditable).to.equal(true);
    expect(container.find('p').first().isContentEditable).to.equal(true);
    expect(container.find('div').isContentEditable).to.equal(false);
    expect(container.find('div').first().isContentEditable).to.equal(false);
    expect(container.parent().isContentEditable).to.equal(false);
  });

  it('property: isIndivisible', () => {
    const container = query('<div contenteditable="true"><table><tr><td>foo</td></tr></table><p>bar</p></div>');
    expect(container.isIndivisible).to.equal(true);
    expect(container.find('table').isIndivisible).to.equal(true);
    expect(container.find('tr').first().isIndivisible).to.equal(true);
    expect(container.find('td').isIndivisible).to.equal(true);
    expect(container.find('td').first().isIndivisible).to.equal(false);
    expect(container.find('p').isIndivisible).to.equal(false);
  });

  it('isEmpty property: mark or text', () => {
    const container = query('<div contenteditable="true"><strong></strong><i>\u200B</i><u>\u2060</u></div>');
    expect(container.find('strong').isEmpty).to.equal(true);
    expect(container.find('i').isEmpty).to.equal(true);
    expect(container.find('i').first().isEmpty).to.equal(true);
    expect(container.find('u').isEmpty).to.equal(true);
  });

  it('isEmpty property: box', () => {
    const container = query('<div contenteditable="true"><lake-box><div class="lake-box-container"><hr /></div></lake-box></div>');
    expect(container.find('lake-box').isEmpty).to.equal(false);
  });

  it('isEmpty property: block includes a box', () => {
    const container = query('<div contenteditable="true"><p><lake-box></lake-box></p></div>');
    expect(container.find('p').isEmpty).to.equal(false);
  });

  it('isEmpty property: block includes br nodes', () => {
    const container = query('<div contenteditable="true"><p><br /></p><p><br /><br /></p></div>');
    expect(container.find('p').eq(0).isEmpty).to.equal(true);
    expect(container.find('p').eq(1).isEmpty).to.equal(false);
  });

  it('method: get', () => {
    const nodes = new Nodes([element, elementTwo, document.body]);
    expect(nodes.eq(1).html()).to.equal('two');
  });

  it('method: getAll', () => {
    const nodes = new Nodes([element, elementTwo, document.body]);
    expect(nodes.getAll().length).to.equal(3);
    expect((nodes.getAll()[1] as Element).innerHTML).to.equal('two');
  });

  it('method: eq', () => {
    const nodes = new Nodes([element, elementTwo, document.body]);
    expect(nodes.eq(2).name).to.equal('body');
  });

  it('method: each', () => {
    const textNode = document.createTextNode('foo');
    const nodes = new Nodes([element, textNode, elementTwo]);
    let firstNode;
    let secondNode;
    let thirdNode;
    const result = nodes.each((node, index) => {
      if (index === 0) {
        firstNode = node;
        return;
      }
      if (index === 1) {
        secondNode = node;
        return false;
      }
      if (index === 2) {
        thirdNode = node;
      }
    });
    expect(result).to.equal(nodes);
    expect(firstNode).to.equal(element);
    expect(secondNode).to.equal(textNode);
    expect(thirdNode).to.equal(undefined);
  });

  it('method: eachElement', () => {
    const textNode = document.createTextNode('foo');
    const nodes = new Nodes([element, textNode, elementTwo]);
    let firstNode: any;
    let secondNode: any;
    let thirdNode: any;
    const result = nodes.eachElement((node, index) => {
      if (index === 0) {
        firstNode = node;
        return;
      }
      if (index === 1) {
        secondNode = node;
      }
      if (index === 2) {
        thirdNode = node;
      }
    });
    expect(result).to.equal(nodes);
    expect(firstNode).to.equal(element);
    expect(secondNode).to.equal(undefined);
    expect(thirdNode).to.equal(elementTwo);
  });

  it('method: reverse', () => {
    const node = new Nodes([element, elementTwo, document.body]).reverse();
    expect(node.get(0)).to.equal(document.body);
    expect(node.eq(1).html()).to.equal('two');
    expect(node.eq(2).html()).to.equal('one');
  });

  it('method: matches', () => {
    const node = new Nodes(document.body);
    expect(node.matches('body')).to.equal(true);
    expect(node.find('.class1').matches('.class1')).to.equal(true);
    expect(node.find('.class1').matches('.class2')).to.equal(false);
  });

  it('method: contains', () => {
    const container = query('<div contenteditable="true"><h1><p>foo</p>bar</h1>end</div>');
    expect(container.contains(container)).to.equal(true);
    expect(container.contains(container.find('h1'))).to.equal(true);
    expect(container.contains(container.find('h1').get(0))).to.equal(true);
    expect(container.contains(container.find('p').first())).to.equal(true);
    expect(container.find('h1').contains(container)).to.equal(false);
    expect(container.find('p').first().contains(container.find('p'))).to.equal(false);
  });

  it('method: isSibling', () => {
    const container = query('<div contenteditable="true"><h1><p>foo</p>bar</h1>end</div>');
    expect(container.find('h1').isSibling(container.find('p'))).to.equal(false);
    expect(container.find('h1').isSibling(container.find('h1').next())).to.equal(true);
  });

  it('find method: by selector', () => {
    const node = new Nodes(document.body);
    const targetNodes1 = node.find('.class1');
    expect(targetNodes1.html()).to.equal('one');
    const targetNodes2 = node.find('.class1, .class2');
    expect(targetNodes2.html()).to.equal('one');
    expect(targetNodes2.eq(1).html()).to.equal('two');
  });

  it('find method: by path', () => {
    const container = query('<div contenteditable="true"><ol><li>foo</li><li>bar<lake-box></lake-box></li></ol></div>');
    expect(container.find([0, 1, 1]).name).to.equal('lake-box');
    expect(container.find([]).get(0)).to.equal(container.get(0));
  });

  it('method: closest', () => {
    const node = new Nodes(element);
    node.html('<p>foo</p><p>bar</p>');
    expect(node.find('p').closest('div').html()).to.equal('<p>foo</p><p>bar</p>');
    expect(node.find('p').first().closest('div').html()).to.equal('<p>foo</p><p>bar</p>');
    expect(node.find('p').first().closest('p').html()).to.equal('foo');
    expect(node.find('p').closest('p').html()).to.equal('foo');
    expect(new Nodes(document).closest('div').length).to.equal(0);
  });

  it('method: closestBlock', () => {
    const container = query('<div contenteditable="true"><p>foo</p>bar</div>');
    expect(container.find('p').first().closestBlock().html()).to.equal('foo');
    expect(container.find('p').next().closestBlock().length).to.equal(0);
  });

  it('method: closestOperableBlock', () => {
    const container = query(safeTemplate`
    <div contenteditable="true">
      <ul><li>foo</li></ul>
      <p>bar</p>
      <h1><lake-box><div class="lake-box-container">box</div></lake-box></h1>
      <table>
        <tr>
          <td>foo1</td>
          <td><h2>bar1</h2></td>
        </tr>
      </table>
    </div>
    `);
    expect(container.find('li').first().closestOperableBlock().html()).to.equal('<li>foo</li>');
    expect(container.find('p').first().closestOperableBlock().html()).to.equal('bar');
    expect(container.find('.lake-box-container').first().closestOperableBlock().name).to.equal('h1');
    expect(container.find('td').first().closestOperableBlock().length).to.equal(0);
    expect(container.find('h2').first().closestOperableBlock().html()).to.equal('bar1');
  });

  it('method: closestContainer', () => {
    const container = query('<div contenteditable="true"><p>foo</p>bar</div>');
    expect(container.find('p').first().closestContainer().html()).to.equal('<p>foo</p>bar');
    expect(container.parent().closestContainer().length).to.equal(0);
  });

  it('method: closestScroller', () => {
    const scroller = query('<div class="scroller" style="overflow: auto"><div contenteditable="true"><p>foo</p>bar</div></div>');
    expect(scroller.find('p').closestScroller().hasClass('scroller')).to.equal(true);
    expect(scroller.closestScroller().hasClass('scroller')).to.equal(true);
    expect(scroller.parent().closestScroller().length).to.equal(0);
    scroller.css('overflow', 'scroll');
    expect(scroller.closestScroller().hasClass('scroller')).to.equal(true);
    scroller.css('overflow', 'visible');
    expect(scroller.closestScroller().length).to.equal(0);
  });

  it('method: parent', () => {
    const node = new Nodes(element);
    node.html('<p>foo</p><p>bar</p>');
    expect(node.find('p').parent().get(0)).to.equal(element);
  });

  it('method: prev', () => {
    const node = new Nodes(element);
    node.html('<p>foo</p><p>bar</p>');
    expect(node.find('p').eq(1).prev().html()).to.equal('foo');
  });

  it('method: next', () => {
    const node = new Nodes(element);
    node.html('<p>foo</p><p>bar</p>');
    expect(node.find('p').eq(0).next().html()).to.equal('bar');
  });

  it('method: first', () => {
    const node = new Nodes(element);
    node.html('<p>foo</p><p>bar</p>');
    expect(node.first().html()).to.equal('foo');
  });

  it('method: last', () => {
    const node = new Nodes(element);
    node.html('<p>foo</p><p>bar</p>');
    expect(node.last().html()).to.equal('bar');
  });

  it('method: index', () => {
    const node = new Nodes(element);
    node.html('one<strong>two</strong>three<i>four</i>five');
    expect(node.find('strong').prev().index()).to.equal(0);
    expect(node.find('strong').index()).to.equal(1);
    expect(node.find('strong').next().index()).to.equal(2);
    expect(node.find('i').index()).to.equal(3);
    expect(node.find('i').next().index()).to.equal(4);
  });

  it('method: path', () => {
    const container = query('<div contenteditable="true"><ol><li>foo</li><li>bar<lake-box></lake-box></li></ol></div>');
    expect(container.find('lake-box').path()).to.deep.equal([0, 1, 1]);
    expect(container.path()).to.deep.equal([]);
  });

  it('method: children', () => {
    const node = new Nodes(element);
    node.html('<p>foo<strong>bold</strong></p>');
    const childList = node.find('p').children();
    expect(childList.length).to.equal(2);
    expect(childList[0].isText).to.equal(true);
    expect(childList[1].html()).to.equal('bold');
  });

  it('method: getWalker', () => {
    const node = new Nodes(element);
    node.html('<p>foo<strong>bold</strong></p><lake-box><div class="lake-box-container">box</div></lake-box><p><i>itelic</i>bar</p>');
    const childList: Nodes[] = [];
    for (const child of node.getWalker()) {
      childList.push(child);
    }
    expect(childList.length).to.equal(9);
    expect(childList[0].name).to.equal('p');
    expect(childList[2].name).to.equal('strong');
    expect(childList[4].name).to.equal('lake-box');
    expect(childList[5].name).to.equal('p');
    expect(childList[6].name).to.equal('i');
  });

  it('event method: an event', () => {
    const nodes = new Nodes([element, document.body]);
    const listener = () => {
      element.innerHTML = 'click event';
    };
    // bind an event
    const onResult = nodes.on('click', listener);
    expect(onResult).to.equal(nodes);
    expect(nodes.getEventListeners(0).length).to.equal(1);
    expect(nodes.getEventListeners(0)[0].type).to.equal('click');
    expect(nodes.getEventListeners(0)[0].listener).to.equal(listener);
    expect(nodes.getEventListeners(1).length).to.equal(1);
    expect(nodes.getEventListeners(1)[0].type).to.equal('click');
    expect(nodes.getEventListeners(1)[0].listener).to.equal(listener);
    // remove an event
    const offResult = nodes.off('click', listener);
    expect(offResult).to.equal(nodes);
    expect(nodes.getEventListeners(0).length).to.equal(0);
    expect(nodes.getEventListeners(1).length).to.equal(0);
  });

  it('event method: multi-event', () => {
    const nodes = new Nodes([element, document.body]);
    const clickListener = () => {
      element.innerHTML = 'click event';
    };
    const mousedownListener = () => {
      element.innerHTML = 'mousedown event';
    };
    const mouseupListener = () => {
      element.innerHTML = 'mouseup event';
    };
    // bind events
    nodes.on('click', clickListener);
    nodes.on('mousedown', mousedownListener);
    nodes.on('mouseup', mouseupListener);
    expect(nodes.getEventListeners(0).length).to.equal(3);
    expect(nodes.getEventListeners(0)[0].type).to.equal('click');
    expect(nodes.getEventListeners(0)[1].type).to.equal('mousedown');
    expect(nodes.getEventListeners(0)[2].type).to.equal('mouseup');
    // remove an event
    nodes.off('mousedown');
    expect(nodes.getEventListeners(0).length).to.equal(2);
    expect(nodes.getEventListeners(0)[0].type).to.equal('click');
    expect(nodes.getEventListeners(0)[1].type).to.equal('mouseup');
    nodes.emit('mousedown');
    expect(element.innerHTML).to.equal('one');
    // remove all events
    nodes.off();
    expect(nodes.getEventListeners(0).length).to.equal(0);
    nodes.emit('click');
    nodes.emit('mouseup');
    expect(element.innerHTML).to.equal('one');
  });

  it('event method: multi-event with the same type', () => {
    const nodes = new Nodes(element);
    let clickCount = 0;
    const clickListenerOne = () => {
      element.innerHTML = 'click event one';
      clickCount++;
    };
    const clickListenerTwo = () => {
      element.innerHTML = 'click event two';
      clickCount++;
    };
    const mousedownListener = () => {
      element.innerHTML = 'mousedown event';
    };
    // bind events
    nodes.on('click', clickListenerOne);
    nodes.on('click', clickListenerTwo);
    nodes.on('mousedown', mousedownListener);
    expect(element.innerHTML).to.equal('one');
    nodes.emit('click');
    expect(element.innerHTML).to.equal('click event two');
    nodes.emit('click');
    expect(clickCount).to.equal(4);
    nodes.emit('mousedown');
    expect(element.innerHTML).to.equal('mousedown event');
    // remove all events
    nodes.off();
  });

  it('event method: an element with multi-element-instance', () => {
    const nodesOne = new Nodes(element);
    let clickCount = 0;
    const clickListenerOne = () => {
      element.innerHTML = 'click event one';
      clickCount++;
    };
    const clickListenerTwo = () => {
      element.innerHTML = 'click event two';
      clickCount++;
    };
    const nodesTwo = new Nodes(element);
    // bind events
    nodesOne.on('click', clickListenerOne);
    nodesOne.on('click', clickListenerTwo);
    nodesTwo.emit('click');
    expect(element.innerHTML).to.equal('click event two');
    nodesTwo.emit('click');
    expect(clickCount).to.equal(4);
    // remove all events
    nodesTwo.off();
    expect(nodesOne.getEventListeners(0).length).to.equal(0);
  });

  it('event method: emit has event parameter', () => {
    const nodesOne = new Nodes(element);
    const clickListenerOne = (event: Event) => {
      element.innerHTML = `click event one: ${event.type}`;
    };
    const nodesTwo = new Nodes(element);
    // bind events
    nodesOne.on('click', clickListenerOne);
    const event = new Event('click');
    nodesTwo.emit('click', event);
    expect(element.innerHTML).to.equal('click event one: click');
  });

  it('event method: no event binding', () => {
    const nodesOne = new Nodes(element);
    nodesOne.off();
    expect(nodesOne.getEventListeners(0).length).to.equal(0);
  });

  it('method: focus', () => {
    const node = new Nodes(element);
    expect(node.focus().get(0)).to.equal(node.get(0));
  });

  it('method: blur', () => {
    const node = new Nodes(element);
    expect(node.blur().get(0)).to.equal(node.get(0));
  });

  it('method: clone', () => {
    const node = new Nodes(element);
    expect(node.clone().name).to.equal('div');
    expect(node.clone().first().length).to.equal(0);
    expect(node.clone(true).html()).to.equal(node.html());
  });

  it('attribute method: single key', () => {
    const nodes = new Nodes([element, document.body]);
    nodes.attr('class', 'my-class');
    expect(nodes.attr('class')).to.equal('my-class');
    expect(nodes.eq(1).attr('class')).to.equal('my-class');
    expect(nodes.hasAttr('class')).to.equal(true);
    nodes.removeAttr('class');
    expect(nodes.attr('class')).to.equal('');
    expect(nodes.eq(1).attr('class')).to.equal('');
    expect(nodes.hasAttr('class')).to.equal(false);
  });

  it('attribute method: multi-key', () => {
    const nodes = new Nodes([element, document.body]);
    nodes.attr({
      id: 'my-id',
      class: 'my-class',
      'data-one': 'my-data-one',
    });
    expect(nodes.attr('id')).to.equal('my-id');
    expect(nodes.attr('class')).to.equal('my-class');
    expect(nodes.attr('data-one')).to.equal('my-data-one');
    nodes.attr({
      id: 'my-id',
      class: 'my-class',
      'data-one': 'my-data-one',
    });
    expect(nodes.attr('id')).to.equal('my-id');
    expect(nodes.attr('class')).to.equal('my-class');
    expect(nodes.attr('data-one')).to.equal('my-data-one');
    expect(nodes.hasAttr('data-one')).to.equal(true);
    nodes.removeAttr('id');
    nodes.removeAttr('class');
    nodes.removeAttr('data-one');
    expect(nodes.attr('id')).to.equal('');
    expect(nodes.attr('class')).to.equal('');
    expect(nodes.attr('data-one')).to.equal('');
    expect(nodes.hasAttr('data-one')).to.equal(false);
  });

  it('class method: a string', () => {
    const nodes = new Nodes([element, elementTwo]);
    nodes.addClass('class-one');
    expect(nodes.hasClass('class-one')).to.equal(true);
    expect(nodes.eq(1).hasClass('class-one')).to.equal(true);
    nodes.addClass('class-two');
    expect(nodes.hasClass('class-two')).to.equal(true);
    expect(nodes.eq(1).hasClass('class-two')).to.equal(true);
    nodes.removeClass('class-one');
    expect(nodes.hasClass('class-one')).to.equal(false);
    expect(nodes.hasClass('class-two')).to.equal(true);
    nodes.removeClass('class-two');
    expect(nodes.hasClass('class-one')).to.equal(false);
    expect(nodes.hasClass('class-two')).to.equal(false);
  });

  it('class method: an array', () => {
    const nodes = new Nodes([element, elementTwo]);
    nodes.addClass(['class-one', 'class-two']);
    expect(nodes.hasClass('class-one')).to.equal(true);
    expect(nodes.hasClass('class-two')).to.equal(true);
    expect(nodes.eq(1).hasClass('class-one')).to.equal(true);
    expect(nodes.eq(1).hasClass('class-two')).to.equal(true);
    nodes.removeClass(['class-one', 'class-two']);
    expect(nodes.hasClass('class-one')).to.equal(false);
    expect(nodes.hasClass('class-two')).to.equal(false);
    expect(nodes.eq(1).hasClass('class-one')).to.equal(false);
    expect(nodes.eq(1).hasClass('class-two')).to.equal(false);
  });

  it('method: computedCSS', () => {
    const node = new Nodes(element);
    node.css('background-color', '');
    node.css('border', '');
    node.css('text-align', '');
    expect(node.computedCSS('background-color') === '').to.equal(false);
    expect(node.computedCSS('border-color') === '').to.equal(false);
    expect(node.computedCSS('text-align') === '').to.equal(false);
  });

  it('css method: a string', () => {
    const nodes = new Nodes([element, elementTwo]);
    nodes.css('background-color', '#ff0000');
    nodes.css('border', '1px solid #0000ff');
    nodes.css('text-align', 'center');
    expect(nodes.css('background-color')).to.equal('#ff0000');
    expect(nodes.eq(1).css('background-color')).to.equal('#ff0000');
    expect(nodes.css('border-color')).to.equal('#0000ff');
    expect(nodes.css('text-align')).to.equal('center');
    nodes.css('background-color', '');
    nodes.css('border', '');
    nodes.css('text-align', '');
    expect(nodes.css('background-color')).to.equal('');
    expect(nodes.eq(1).css('background-color')).to.equal('');
    expect(nodes.css('border-color')).to.equal('');
    expect(nodes.css('text-align')).to.equal('');
  });

  it('css method: an array', () => {
    const nodes = new Nodes([element, elementTwo]);
    nodes.css({
      'background-color': '#ff0000',
      'border': '1px solid #0000ff',
    });
    expect(nodes.css('background-color')).to.equal('#ff0000');
    expect(nodes.eq(1).css('background-color')).to.equal('#ff0000');
    expect(nodes.css('border-color')).to.equal('#0000ff');
  });

  it('css method: remove style attribute', () => {
    const nodes = new Nodes([element, elementTwo]);
    nodes.css({
      'background-color': '#ff0000',
    });
    nodes.css({
      'background-color': '',
    });
    expect(nodes.hasAttr('style')).to.equal(false);
    nodes.css('background-color', '#ff0000');
    nodes.css('background-color', '');
    expect(nodes.hasAttr('style')).to.equal(false);
  });

  it('method: width', () => {
    const nodes = new Nodes(element);
    // nodes.css('border', '1px solid #000');
    nodes.css('margin', '10px');
    nodes.css('padding', '20px');
    nodes.css('width', '200px');
    expect(nodes.width()).to.equal(240);
  });

  it('method: innerWidth', () => {
    const nodes = new Nodes(element);
    // nodes.css('border', '1px solid #000');
    nodes.css('margin', '10px');
    nodes.css('padding', '20px');
    nodes.css('width', '200px');
    expect(nodes.innerWidth()).to.equal(200);
  });

  it('method: height', () => {
    const nodes = new Nodes(element);
    // nodes.css('border', '1px solid #000');
    nodes.css('margin', '10px');
    nodes.css('padding', '20px');
    nodes.css('height', '100px');
    expect(nodes.height()).to.equal(140);
  });

  it('method: show', () => {
    const nodes = new Nodes([element, elementTwo]);
    nodes.show();
    expect(nodes.css('display')).to.equal('block');
    expect(nodes.eq(1).css('display')).to.equal('block');
    nodes.show('inline-block');
    expect(nodes.css('display')).to.equal('inline-block');
    expect(nodes.eq(1).css('display')).to.equal('inline-block');
  });

  it('method: hide', () => {
    const nodes = new Nodes([element, elementTwo]);
    nodes.hide();
    expect(nodes.css('display')).to.equal('none');
    expect(nodes.eq(1).css('display')).to.equal('none');
  });

  it('method: html', () => {
    const nodes = new Nodes([element, elementTwo]);
    nodes.html('<p>foo</p>');
    expect(nodes.html()).to.equal('<p>foo</p>');
    expect(nodes.eq(1).html()).to.equal('<p>foo</p>');
  });

  it('method: text', () => {
    const node = new Nodes([element, elementTwo]);
    node.html('<p>foo<br />bar<br /></p>');
    expect(node.text()).to.equal('foo\nbar');
    expect(node.find('p').first().text()).to.equal('foo');
    node.text('<p>foo<br />bar<br /></p>');
    expect(node.text()).to.equal('<p>foo<br />bar<br /></p>');
    node.text('foo\nbar');
    expect(node.html()).to.equal('foo<br>bar');
  });

  it('method: outerHTML', () => {
    const nodes = new Nodes([element, elementTwo]);
    nodes.html('<p>foo</p>');
    expect(nodes.outerHTML()).to.equal('<div class="class1"><p>foo</p></div>');
    expect(nodes.eq(1).outerHTML()).to.equal('<p class="class2"><p>foo</p></p>');
  });

  it('method: empty', () => {
    const nodes = new Nodes([element, elementTwo]);
    nodes.html('<p>foo</p>');
    nodes.empty();
    expect(nodes.html()).to.equal('');
    expect(nodes.eq(1).html()).to.equal('');
  });

  it('method: prepend', () => {
    const nodes = new Nodes([element, elementTwo]);
    // insert a HTML string
    nodes.prepend('<p>string</p>');
    expect(nodes.html()).to.equal('<p>string</p>one');
    nodes.empty();
    // insert a HTML string with multi-element
    nodes.html('foo');
    nodes.prepend('<p>multi-element-one</p>bar<p>multi-element-two</p>');
    expect(nodes.html()).to.equal('<p>multi-element-one</p>bar<p>multi-element-two</p>foo');
    nodes.empty();
    // insert a native node
    const newElement1 = document.createElement('p');
    newElement1.innerHTML = '<strong>native1</strong>native2';
    nodes.prepend(newElement1);
    expect(nodes.html()).to.equal('<p><strong>native1</strong>native2</p>');
    nodes.empty();
    // insert nodes
    const newElement2 = document.createElement('p');
    newElement2.innerHTML = '<strong>nodes1</strong>nodes2';
    const newNodes = new Nodes(newElement2);
    nodes.prepend(newNodes);
    expect(nodes.html()).to.equal('<p><strong>nodes1</strong>nodes2</p>');
    nodes.empty();
    // insert a document fragment
    const newElement3 = document.createElement('p');
    newElement3.innerHTML = '<strong>fragment1</strong>fragment2';
    const fragment = document.createDocumentFragment();
    fragment.appendChild(newElement3);
    nodes.prepend(fragment);
    expect(nodes.html()).to.equal('<p><strong>fragment1</strong>fragment2</p>');
  });

  it('method: append', () => {
    const nodes = new Nodes([element, elementTwo]);
    // insert a HTML string
    nodes.append('<p>foo</p>');
    expect(nodes.html()).to.equal('one<p>foo</p>');
    nodes.empty();
    // insert a HTML string with multi-element
    nodes.html('foo');
    nodes.append('<p>multi-element-one</p>bar<p>multi-element-two</p>');
    expect(nodes.html()).to.equal('foo<p>multi-element-one</p>bar<p>multi-element-two</p>');
    nodes.empty();
    // insert a native node
    const newElement1 = document.createElement('p');
    newElement1.innerHTML = '<strong>foo</strong>bar';
    nodes.append(newElement1);
    expect(nodes.html()).to.equal('<p><strong>foo</strong>bar</p>');
    nodes.empty();
    // insert nodes
    const newElement2 = document.createElement('p');
    newElement2.innerHTML = '<strong>foo</strong>bar';
    const newNodes = new Nodes(newElement2);
    nodes.append(newNodes);
    expect(nodes.html()).to.equal('<p><strong>foo</strong>bar</p>');
    nodes.empty();
    // insert a document fragment
    const newElement3 = document.createElement('p');
    newElement3.innerHTML = '<strong>foo</strong>bar';
    const fragment = document.createDocumentFragment();
    fragment.appendChild(newElement3);
    nodes.append(fragment);
    expect(nodes.html()).to.equal('<p><strong>foo</strong>bar</p>');
  });

  it('method: before', () => {
    const nodes = new Nodes([element, elementTwo]);
    // insert a HTML string
    nodes.before('<div class="insert-test">a HTML string</div>');
    expect(nodes.prev().html()).to.equal('a HTML string');
    query('.insert-test').remove();
    // insert a HTML string with multi-element
    nodes.before('<div class="insert-test">multi-element-one</div><div class="insert-test">multi-element-two</div>');
    expect(nodes.prev().html()).to.equal('multi-element-two');
    expect(nodes.prev().prev().html()).to.equal('multi-element-one');
    query('.insert-test').remove();
    // insert a native node
    const nativeElement = query('<div class="insert-test">native node</div>').get(0);
    nodes.before(nativeElement);
    expect(nodes.prev().html()).to.equal('native node');
    query('.insert-test').remove();
    // insert nodes
    const newNodes = query('<div class="insert-test">nodes</div>');
    nodes.before(newNodes);
    expect(nodes.prev().html()).to.equal('nodes');
    query('.insert-test').remove();
    // insert a document fragment
    const nativeElement2 = query('<div class="insert-test">fragment</div>').get(0);
    const fragment = document.createDocumentFragment();
    fragment.appendChild(nativeElement2);
    nodes.before(fragment);
    expect(nodes.prev().html()).to.equal('fragment');
    query('.insert-test').remove();
  });

  it('method: after', () => {
    const nodes = new Nodes([element, elementTwo]);
    // insert a HTML string
    nodes.after('<div class="insert-test">a HTML string</div>');
    expect(nodes.next().html()).to.equal('a HTML string');
    query('.insert-test').remove();
    // insert a HTML string with multi-element
    nodes.after('<div class="insert-test">multi-element-one</div><div class="insert-test">multi-element-two</div>');
    expect(nodes.next().html()).to.equal('multi-element-one');
    expect(nodes.next().next().html()).to.equal('multi-element-two');
    query('.insert-test').remove();
    // insert a native node
    const nativeElement = query('<div class="insert-test">native node</div>').get(0);
    nodes.after(nativeElement);
    expect(nodes.next().html()).to.equal('native node');
    query('.insert-test').remove();
    // insert nodes
    const newNodes = query('<div class="insert-test">nodes</div>');
    nodes.after(newNodes);
    expect(nodes.next().html()).to.equal('nodes');
    query('.insert-test').remove();
    // insert a document fragment
    const nativeElement2 = query('<div class="insert-test">fragment</div>').get(0);
    const fragment = document.createDocumentFragment();
    fragment.appendChild(nativeElement2);
    nodes.after(fragment);
    expect(nodes.next().html()).to.equal('fragment');
    query('.insert-test').remove();
  });

  it('method: replaceWith', () => {
    const node = new Nodes(element);
    node.html('<p><strong>foo1</strong>bar1</p><p><strong>foo2</strong>bar2</p>');
    node.find('strong').eq(0).replaceWith('<i>itelic</i>');
    expect(node.html()).to.equal('<p><i>itelic</i>bar1</p><p><strong>foo2</strong>bar2</p>');
  });

  it('method: remove', () => {
    const node = new Nodes([element, elementTwo]);
    // remove all
    node.html('<p><strong>foo1</strong>bar1</p><p><strong>foo2</strong>bar2</p>');
    node.first().remove();
    expect(node.html()).to.equal('<p><strong>foo2</strong>bar2</p>');
    // keep children
    node.html('<p><strong>foo1</strong>bar1</p><p><strong>foo2</strong>bar2</p>');
    node.first().remove(true);
    expect(node.html()).to.equal('<strong>foo1</strong>bar1<p><strong>foo2</strong>bar2</p>');
    // no parent
    const elem = query('<div />');
    const elemId = elem.id;
    elem.remove();
    expect(elem.id).to.equal(elemId);
  });

  it('method: splitText', () => {
    const node = new Nodes(document.createTextNode('foobar'));
    const newNode = node.splitText(3);
    expect(node.get(0).nodeValue).to.equal('foo');
    expect(newNode.get(0).nodeValue).to.equal('bar');
  });

  it('method: info', () => {
    const node = new Nodes([element, elementTwo]);
    node.info();
  });

});
