import { query } from '../utils/query';
import { safeTemplate } from '../utils/safe-template';
import { Nodes } from '../models/nodes';
import { Box } from '../models/box';

type BoxResizerConfig = {
  root: Nodes;
  box: Box;
  width: number;
  height: number;
  onResize?: (width: number, height: number) => void;
  onStop: (width: number, height: number) => void;
};

export class BoxResizer {
  private config: BoxResizerConfig;

  private root: Nodes;

  private box: Box;

  constructor(config: BoxResizerConfig) {
    this.config = config;
    this.root = config.root;
    this.box = config.box;
  }

  private bindEvents(pointerNode: Nodes): void {
    const box = this.box;
    const boxContainer = box.getContainer();
    const resizerNode = pointerNode.closest('.lake-resizer');
    const infoNode = resizerNode.find('.lake-resizer-info');
    const isPlus = pointerNode.attr('class').indexOf('-right') >= 0;
    const initialWidth = boxContainer.width();
    const initialHeight = boxContainer.height();
    const rate = initialHeight / initialWidth;
    let clientX = 0;
    let width = 0;
    // resizing box
    const pointermoveListener = (event: Event) => {
      const pointerEvent = event as PointerEvent;
      const diffX = pointerEvent.clientX - clientX;
      const newWidth = Math.round(isPlus ? width + diffX : width - diffX);
      const newHeight = Math.round(rate * newWidth);
      infoNode.text(`${newWidth} x ${newHeight}`);
      boxContainer.css({
        width: `${newWidth}px`,
        height: `${newHeight}px`,
      });
      if (this.config.onResize) {
        this.config.onResize(newWidth, newHeight);
      }
    };
    // start resizing
    const pointerdownListener = (event: Event) => {
      const pointerEvent = event as PointerEvent;
      const pointerNativeNode = pointerNode.get(0) as Element;
      // The capture will be implicitly released after a pointerup or pointercancel event.
      // https://developer.mozilla.org/en-US/docs/Web/API/Element/setPointerCapture
      try {
        // Test case throws an exception on Firefox.
        pointerNativeNode.setPointerCapture(pointerEvent.pointerId);
      } catch { /* empty */ }
      clientX = pointerEvent.clientX;
      width = boxContainer.width();
      infoNode.show();
      pointerNode.on('pointermove', pointermoveListener);
    };
    // stop resizing
    const pointerupListner = () => {
      pointerNode.off('pointermove');
      infoNode.hide();
      width = box.getContainer().width();
      const height = Math.round(rate * width);
      this.config.onStop(width, height);
    };
    // cancel resizing
    const pointercancelListner = () => {
      pointerNode.off('pointermove');
      infoNode.hide();
    };
    pointerNode.on('pointerdown', pointerdownListener);
    pointerNode.on('pointerup', pointerupListner);
    pointerNode.on('pointercancel', pointercancelListner);
  }

  public render(): void {
    const { width, height }= this.config;
    const resizerNode = query(safeTemplate`
      <div class="lake-resizer">
        <div class="lake-resizer-top-left"></div>
        <div class="lake-resizer-top-right"></div>
        <div class="lake-resizer-bottom-left"></div>
        <div class="lake-resizer-bottom-right"></div>
        <div class="lake-resizer-info">${width} x ${height}</div>
      </div>
    `);
    this.bindEvents(resizerNode.find('.lake-resizer-top-left'));
    this.bindEvents(resizerNode.find('.lake-resizer-top-right'));
    this.bindEvents(resizerNode.find('.lake-resizer-bottom-left'));
    this.bindEvents(resizerNode.find('.lake-resizer-bottom-right'));
    this.root.append(resizerNode);
  }
}
