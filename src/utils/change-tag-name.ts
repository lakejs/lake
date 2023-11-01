import { NativeElement } from '../types/native';
import { query } from '../utils/query';
import { Nodes } from '../models/nodes';

export function changeTagName(element: Nodes, newTagName: string): Nodes {
  const nativeElement = element.get(0) as NativeElement;
  const newElement = query(`<${newTagName} />`);
  for (const attr of nativeElement.attributes) {
    newElement.attr(attr.name, attr.value);
  }
  let child = element.first();
  while(child.length > 0) {
    const nextNode = child.next();
    newElement.append(child);
    child = nextNode;
  }
  element.replaceWith(newElement);
  return newElement;
}
