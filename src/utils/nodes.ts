import { getDocument } from './get-document';
import { getWindow } from './get-window';

type EachCallback = (node: Node, index: number) => boolean | void;

type EventItem = {
  type: string,
  callback: EventListener,
};

type EventItemArray = Array<EventItem>;

export class Nodes {
  nodes: Array<Node>;
  events: Array<EventItemArray>;
  length: number;
  doc: Document;
  win: Window;
  name: string;
  type: Node['nodeType'];

  constructor(node: Node | Array<Node>) {
    this.nodes = Array.isArray(node) ? node : [node];
    this.events = [];
    for (let i = 0; i < this.nodes.length; i++) {
      this.events[i] = [];
    }
    this.length = this.nodes.length;
    const firstNode =  this.nodes[0];
    this.doc = getDocument(firstNode);
    this.win = getWindow(firstNode);
    this.name = firstNode.nodeName.toLowerCase();
    this.type = firstNode.nodeType;
  }

  each(callback: EachCallback): this {
    for (let i = 0; i < this.nodes.length; i++) {
      if (callback(this.nodes[i], i) === false) {
        return this;
      }
    }
    return this;
  }

  on(type: string, callback: EventListener): this {
    this.each((node, index) => {
      node.addEventListener(type, callback, false);
      this.events[index].push({
        type,
        callback,
      });
    });
    return this;
  }

  off(type?: string, callback?: EventListener): this {
    this.each((node, index) => {
      const eventItems = this.events[index];
      eventItems.forEach((item, index) => {
        if (type! || type === item.type && (!callback || callback === item.callback)) {
          node.removeEventListener(type, item.callback, false);
          eventItems.splice(index, 1);
        }
      });
    });
    return this;
  }
}
