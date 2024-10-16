import { Nodes } from '../models/nodes';
import { Range } from '../models/range';

// Returns an object indicating whether the specified node or range is visible.
export function isVisible(target: Nodes | Range): {
  left: boolean;
  right: boolean;
  top: boolean;
  bottom: boolean;
} {
  let rect: DOMRect;
  let viewport: Nodes;
  if (target instanceof Nodes) {
    const nativeNode = target.get(0) as Element;
    rect = nativeNode.getBoundingClientRect();
    viewport = target.closestScroller();
  } else {
    rect = target.get().getBoundingClientRect();
    viewport = target.commonAncestor.closestScroller();
  }
  let left = rect.left;
  let right = rect.right;
  let top = rect.top;
  let bottom = rect.bottom;
  let viewportWidth = window.innerWidth;
  let viewportHeight = window.innerHeight;
  if (viewport.length > 0) {
    const nativeViewport = viewport.get(0) as Element;
    const viewportRect = nativeViewport.getBoundingClientRect();
    const offsetLeft = viewportRect.x;
    const offsetTop = viewportRect.y;
    left -= offsetLeft;
    right -= offsetLeft;
    top -= offsetTop;
    bottom -= offsetTop;
    viewportWidth = viewportRect.width;
    viewportHeight = viewportRect.height;
  }
  return {
    left: left >= 0 && viewportWidth - left >= 0,
    right: right >= 0 && viewportWidth - right >= 0,
    top: top >= 0 && viewportHeight - top >= 0,
    bottom: bottom >= 0 && viewportHeight - bottom >= 0,
  };
}
