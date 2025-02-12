import { query } from '../utils/query';
import { Nodes } from './nodes';

/**
 * The Fragment interface represents a lightweight document object that has no parent.
 * It is designed for efficient manipulation of document structures without affecting the main DOM.
 */
export class Fragment {
  /**
   * A native DocumentFragment object.
   */
  private readonly fragment: DocumentFragment;

  constructor(fragment?: DocumentFragment) {
    this.fragment = fragment ?? document.createDocumentFragment();
  }

  /**
   * Returns a native DocumentFragment object from the fragment.
   */
  public get(): DocumentFragment {
    return this.fragment;
  }

  /**
   * Finds and returns descendants of the fragment that match the specified CSS selector.
   */
  public find(selector: string): Nodes {
    const nodeList: Node[] = [];
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

  /**
   * Inserts the specified content just inside the fragment, after its last child.
   */
  public append(content: string | Node | Nodes): void {
    query(content).each(nativeNode => {
      this.fragment.appendChild(nativeNode);
    });
  }
}
