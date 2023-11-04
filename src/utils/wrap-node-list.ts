import { getDeepest } from './get-deepest';
import { query } from './query';
import { Nodes } from '../models/nodes';

export function wrapNodeList(nodeList: Nodes[], wrapper?: Nodes): Nodes {
  wrapper = wrapper ?? query('<p />');
  if (nodeList.length === 0) {
    return wrapper;
  }
  wrapper = wrapper.clone(true);
  const deepestElement = getDeepest(wrapper);
  nodeList[0].before(wrapper);
  nodeList.forEach(node => {
    deepestElement.append(node);
  });
  return wrapper;
}
