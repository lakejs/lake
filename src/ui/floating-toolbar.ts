import { editors } from '../storage/editors';
import { visibleInfo } from '../utils/visible-info';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';
import { Toolbar, ToolbarConfig } from './toolbar';

type FloatingToolbarConfig = ToolbarConfig & {
  target: Nodes | Range;
};

// The FloatingToolbar class, inheriting from the Toolbar class, represents a toolbar that floats at the top of a box.
export class FloatingToolbar extends Toolbar {

  private range: Range;

  constructor(config: FloatingToolbarConfig) {
    super(config);
    if (config.target instanceof Nodes) {
      const range = new Range();
      range.selectNodeContents(config.target);
      this.range = range;
    } else {
      this.range = config.target;
    }
    this.container.removeClass('lake-toolbar');
    this.container.addClass('lake-popup');
    this.container.addClass('lake-floating-toolbar');
  }

  private scrollListener = () => this.updatePosition();

  private resizeListener = () => this.updatePosition();

  private updatePosition(): void {
    const visible = visibleInfo(this.range);
    if (
      (visible.top === -1 && visible.bottom === -1) ||
      (visible.top === 1 && visible.bottom === 1)
    ) {
      this.container.css('visibility', 'hidden');
      return;
    }
    this.container.css('visibility', '');
    const rangeRect = this.range.get().getBoundingClientRect();
    this.container.show('flex');
    const rangeX = rangeRect.x + window.scrollX;
    const rangeY = rangeRect.y + window.scrollY;
    let left = Number((rangeX + rangeRect.width / 2 - this.container.width() / 2).toFixed(1));
    let top = Number((rangeY - this.container.height() - 6).toFixed(1));
    const viewport = this.range.commonAncestor.closestScroller();
    const editArea = this.range.commonAncestor.closestContainer();
    const editAreaRect = (editArea.get(0) as Element).getBoundingClientRect();
    let leftEdge = window.scrollX + 6;
    if (viewport.length > 0) {
      leftEdge += editAreaRect.x + (viewport.get(0) as Element).scrollLeft;
    } else {
      leftEdge += editAreaRect.x + window.scrollX;
    }
    const rightEdge = leftEdge + editAreaRect.width - this.container.width() - 12;
    let topEdge = window.scrollY;
    if (viewport.length > 0) {
      topEdge += editAreaRect.y + (viewport.get(0) as Element).scrollTop + 10;
    } else {
      topEdge += editAreaRect.y + window.scrollY;
    }
    if (left < leftEdge) {
      left = leftEdge;
    } else if (left > rightEdge) {
      left = rightEdge;
    }
    if (top < topEdge) {
      top = topEdge;
    }
    this.container.css({
      left: `${left}px`,
      top: `${top}px`,
    });
  }

  // Renders a floating toolbar.
  public render(): void {
    const container = this.range.commonAncestor.closest('div[contenteditable]');
    const editor = container.length > 0 ? editors.get(container.id) : undefined;
    if (!editor) {
      throw new Error('The range must be within the editing area.');
    }
    super.render(editor);
    this.updatePosition();
    this.updateState();
    const viewport = this.range.commonAncestor.closestScroller();
    if (viewport.length > 0) {
      viewport.on('scroll', this.scrollListener);
    } else {
      window.addEventListener('scroll', this.scrollListener);
    }
    window.addEventListener('resize', this.resizeListener);
  }

  // Destroys the floating toolbar.
  public unmount(): void {
    super.unmount();
    const viewport = this.range.commonAncestor.closestScroller();
    if (viewport.length > 0) {
      viewport.off('scroll', this.scrollListener);
    } else {
      window.removeEventListener('scroll', this.scrollListener);
    }
    window.removeEventListener('resize', this.resizeListener);
  }
}
