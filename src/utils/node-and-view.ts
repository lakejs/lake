import { Nodes } from '../models/nodes';

type NodePosition = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

// Returns an object that indicates the specified node's position relative to the viewport.
export function nodeAndView(node: Nodes): NodePosition {
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
  const position: NodePosition = {
    left,
    right: viewportWidth - right,
    top,
    bottom: viewportHeight - bottom,
  };
  return position;
}
