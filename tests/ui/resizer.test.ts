import { isFirefox } from '../utils';
import { boxes } from '../../src/storage/boxes';
import { query } from '../../src/utils/query';
import { Nodes } from '../../src/models/nodes';
import { Box } from '../../src/models/box';
import { Resizer } from '../../src/ui/resizer';

describe('ui / resizer', () => {

  let container: Nodes;

  beforeEach(() => {
    boxes.set('inlineBox', {
      type: 'inline',
      name: 'inlineBox',
      value: {
        width: 500,
        height: 400,
      },
      render: box => {
        const boxContainer = box.getContainer();
        const value = box.value;
        boxContainer.addClass('lake-box-focused');
        const rootNode = query('<div class="lake-inline" style="position: relative;"><div>This is an inline box.</div></div>');
        rootNode.css({
          width: `${value.width}px`,
          height: `${value.height}px`,
          'background-color': '#eee',
        });
        boxContainer.append(rootNode);
        new Resizer({
          root: rootNode,
          target: boxContainer,
          onResize: (width, height) => {
            rootNode.css({
              width: `${width}px`,
              height: `${height}px`,
            });
          },
          onStop: (width, height) => {
            box.updateValue({
              width,
              height,
            });
          },
        }).render();
      },
    });
    container = query('<div contenteditable="true"></div>');
    query(document.body).append(container);
  });

  afterEach(() => {
    boxes.delete('inlineBox');
    container.remove();
  });

  it('should resize the box', () => {
    const pointerId = isFirefox ? 0 : 1;
    const box = new Box('inlineBox');
    container.append(box.node);
    box.render();
    const boxNode = box.node;
    const pointerdownEvent = new PointerEvent('pointerdown', {
      pointerId,
      clientX: 500,
      clientY: 500,
    });
    const pointermoveEvent = new PointerEvent('pointermove', {
      pointerId,
      clientX: 300,
      clientY: 300,
    });
    const pointerupEvent = new PointerEvent('pointerup', {
      pointerId,
      clientX: 300,
      clientY: 300,
    });
    boxNode.find('.lake-resizer-bottom-right').emit('pointerdown', pointerdownEvent);
    boxNode.find('.lake-resizer-bottom-right').emit('pointermove', pointermoveEvent);
    boxNode.find('.lake-resizer-bottom-right').emit('pointerup', pointerupEvent);
    expect(box.node.find('.lake-inline').css('width')).to.equal('300px');
    expect(box.node.find('.lake-inline').css('height')).to.equal('240px');
    expect(box.value.width).to.equal(300);
    expect(box.value.height).to.equal(240);
  });

});
