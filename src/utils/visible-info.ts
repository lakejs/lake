import { Nodes } from '../models/nodes';
import { Range } from '../models/range';

// -1: the edge of the target node or range extends beyond the left or top edge of the viewport and is not visible
// 0: the edge of the target node or range is within the viewport and is visible
// 1: the edge of the target node or range extends beyond the right or bottom edge of the viewport and is not visible
type VisibleType = -1 | 0 | 1;

export function visibleInfo(target: Nodes | Range): {
  left: VisibleType;
  right: VisibleType;
  top: VisibleType;
  bottom: VisibleType;
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
  let leftEdge: VisibleType = 0;
  if (left < 0) {
    leftEdge = -1;
  } else if (viewportWidth - left < 0) {
    leftEdge = 1;
  }
  let rightEdge: VisibleType = 0;
  if (right < 0) {
    rightEdge = -1;
  } else if (viewportWidth - right < 0) {
    rightEdge = 1;
  }
  let topEdge: VisibleType = 0;
  if (top < 0) {
    topEdge = -1;
  } else if (viewportHeight - top < 0) {
    topEdge = 1;
  }
  let bottomEdge: VisibleType = 0;
  if (bottom < 0) {
    bottomEdge = -1;
  } else if (viewportHeight - bottom < 0) {
    bottomEdge = 1;
  }
  return {
    left: leftEdge,
    right: rightEdge,
    top: topEdge,
    bottom: bottomEdge,
  };
}
