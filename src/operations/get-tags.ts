import { NativeElement } from '../types/native';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';

type AttributeMapType = {[key: string]: string};
type AppliedTagMapType = {[key: string]: AttributeMapType};

// Returns the attributes of the element as an key-value object.
function getAttributes(node: Nodes): AttributeMapType {
  const nativeNode = node.get(0) as NativeElement;
  const attributes: AttributeMapType = {};
  if (nativeNode.hasAttributes()) {
    for (const attr of nativeNode.attributes) {
      attributes[attr.name] = attr.value;
    }
  }
  return attributes;
}

// Returns the applied tags of the current selection.
export function getTags(range: Range): AppliedTagMapType {
  let node = range.startNode;
  if (node.isText) {
    node = node.parent();
  }
  const appliedTags: AppliedTagMapType = {};
  while (node.length > 0) {
    if (!node.isEditable) {
      break;
    }
    appliedTags[node.name] = getAttributes(node);
    node = node.parent();
  }
  return appliedTags;
}
