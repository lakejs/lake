import { NativeElement } from '../types/native';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';

type AttributeMapType = {[key: string]: string};

type AppliedTagMapType = {
  name: string,
  attributes: AttributeMapType,
};

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
export function getTags(range: Range): AppliedTagMapType[] {
  let parentNode = range.startNode;
  if (parentNode.isText) {
    parentNode = parentNode.parent();
  }
  const appliedTags: AppliedTagMapType[] = [];
  while (parentNode.length > 0) {
    if (!parentNode.isEditable) {
      break;
    }
    appliedTags.push({
      name: parentNode.name,
      attributes: getAttributes(parentNode),
    });
    parentNode = parentNode.parent();
  }
  return appliedTags;
}
