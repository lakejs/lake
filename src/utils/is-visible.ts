import { Nodes } from '../models/nodes';

// Returns an object indicating whether the specified node or range is visible.
export function isVisible(node: Nodes): {
  left: boolean;
  right: boolean;
  top: boolean;
  bottom: boolean;
} {
  const nativeNode = node.get(0) as Element;
  const rect = nativeNode.getBoundingClientRect();
  let left = rect.left;
  let right = rect.right;
  let top = rect.top;
  let bottom = rect.bottom;
  let viewportWidth = window.innerWidth;
  let viewportHeight = window.innerHeight;
  const viewport = node.closestScroller();
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
    left: left >= 0,
    right: viewportWidth - right >= 0,
    top: top >= 0,
    bottom: viewportHeight - bottom >= 0,
  };
}
