import { NativeRange } from '../types/native';
import { ElementList } from './element-list';

export class Range {
  start: ElementList;
  end: ElementList;
  startOffset: number;
  endOffset: number;
  commonAncestor: ElementList;
  collapsed: boolean;

  constructor(range: NativeRange) {
    this.start = new ElementList(range.startContainer);
    this.end = new ElementList(range.endContainer);
    this.startOffset = range.startOffset;
    this.endOffset = range.endOffset;
    this.commonAncestor = new ElementList(range.commonAncestorContainer);
    this.collapsed = range.collapsed;
  }
}
