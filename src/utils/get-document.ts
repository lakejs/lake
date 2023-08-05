export function getDocument(node: any): Document {
  if (!node || node === document) {
    return document;
  }
  return node.ownerDocument || node.document || document;
}
