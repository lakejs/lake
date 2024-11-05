import type { Nodes } from '../models/nodes';
import { getDeepElement } from './get-deep-element';
import { query } from './query';

// Appends a list of nodes to the specified element.
export function wrapNodeList(nodeList: Nodes[], wrapper?: Nodes): Nodes {
  wrapper = wrapper ?? query('<p />');
  if (nodeList.length === 0) {
    return wrapper;
  }
  wrapper = wrapper.clone(true);
  const deepestElement = getDeepElement(wrapper);
  nodeList[0].before(wrapper);
  for (const node of nodeList) {
    deepestElement.append(node);
  }
  return wrapper;
}
