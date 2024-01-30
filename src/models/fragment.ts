import { NativeNode } from '../types/native';
import { Nodes } from './nodes';

export class Fragment {
  // native document fragment
  private fragment: DocumentFragment;

  constructor(fragment?: DocumentFragment) {
    this.fragment = fragment ?? document.createDocumentFragment();
  }

  // Returns the descendants of the fragment which are selected by the specified CSS selector.
  public find(selector: string): Nodes {
    const nodeList: NativeNode[] = [];
    let child = new Nodes(this.fragment.firstChild);
    while (child.length > 0) {
      if (child.matches(selector)) {
        nodeList.push(child.get(0));
      } else if (child.isElement) {
        child.find(selector).each(node => {
          nodeList.push(node);
        });
      }
      child = child.next();
    }
    return new Nodes(nodeList);
  }

  // Inserts the specified node as the last child.
  public append(node: Nodes): void {
    node.each(nativeNode => {
      this.fragment.appendChild(nativeNode);
    });
  }
}
