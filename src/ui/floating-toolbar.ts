import { editors } from '../storage/editors';
import { isVisible } from '../utils/is-visible';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';
import { Toolbar, ToolbarConfig } from './toolbar';

type FloatingToolbarConfig = ToolbarConfig & {
  target: Nodes | Range;
};

// The FloatingToolbar class represents a button group that floats at the top of a box.
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
    const visible = isVisible(this.range);
    if (!visible.top) {
      this.container.css('visibility', 'hidden');
      return;
    }
    this.container.css('visibility', '');
    const rangeRect = this.range.get().getBoundingClientRect();
    this.container.show('flex');
    const rangeX = rangeRect.x + window.scrollX;
    const rangeY = rangeRect.y + window.scrollY;
    const left = (rangeX + rangeRect.width / 2 - this.container.width() / 2).toFixed(1);
    const top = (rangeY - this.container.height() - 6).toFixed(1);
    this.container.css({
      left: `${left}px`,
      top: `${top}px`,
    });
  }

  // Renders a floating toolbar for the specified range.
  public render(): void {
    const container = this.range.commonAncestor.closest('div[contenteditable]');
    const editor = container.length > 0 ? editors.get(container.id) : undefined;
    if (!editor) {
      throw new Error('The range must be within the editor.');
    }
    super.render(editor);
    this.updatePosition();
    this.updateState({
      appliedItems: [],
    });
    const viewport = this.range.commonAncestor.closestScroller();
    if (viewport.length > 0) {
      viewport.on('scroll', this.scrollListener);
    }
    window.addEventListener('resize', this.resizeListener);
  }

  // Destroys the floating toolbar.
  public unmount(): void {
    super.unmount();
    const viewport = this.range.commonAncestor.closestScroller();
    if (viewport.length > 0) {
      viewport.off('scroll', this.scrollListener);
    }
    window.removeEventListener('resize', this.resizeListener);
  }
}
