import { query } from '../utils/query';
import { template } from '../utils/template';
import { Nodes } from '../models/nodes';

type ResizerConfig = {
  root: string | Node | Nodes;
  target: string | Node | Nodes;
  onResize?: (width: number, height: number) => void;
  onStop: (width: number, height: number) => void;
};

// The Resizer class represents a UI component used to resize images or videos.
export class Resizer {
  private config: ResizerConfig;

  private root: Nodes;

  private target: Nodes;

  public container: Nodes;

  constructor(config: ResizerConfig) {
    this.config = config;
    this.root = query(config.root);
    this.target = query(config.target);
    this.container = query(template`
      <div class="lake-resizer">
        <div class="lake-resizer-top-left"></div>
        <div class="lake-resizer-top-right"></div>
        <div class="lake-resizer-bottom-left"></div>
        <div class="lake-resizer-bottom-right"></div>
        <div class="lake-resizer-info"></div>
      </div>
    `);
  }

  private bindEvents(pointerNode: Nodes): void {
    const target = this.target;
    const infoNode = this.container.find('.lake-resizer-info');
    const isPlus = pointerNode.attr('class').indexOf('-right') >= 0;
    const initialWidth = target.width();
    const initialHeight = target.height();
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
      target.css({
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
      width = target.width();
      infoNode.text(`${initialWidth} x ${initialHeight}`);
      infoNode.show();
      pointerNode.on('pointermove', pointermoveListener);
    };
    // stop resizing
    const pointerupListner = () => {
      pointerNode.off('pointermove');
      infoNode.hide();
      width = target.width();
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
    this.bindEvents(this.container.find('.lake-resizer-top-left'));
    this.bindEvents(this.container.find('.lake-resizer-top-right'));
    this.bindEvents(this.container.find('.lake-resizer-bottom-left'));
    this.bindEvents(this.container.find('.lake-resizer-bottom-right'));
    this.root.append(this.container);
  }
}
