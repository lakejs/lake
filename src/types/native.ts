import { KeyValue } from './object';

declare global {
  interface Window {
    DEBUG: boolean;
  }

  interface Element {
    style: KeyValue;
  }

  interface Node {
    lakeId: number;
  }
}

export type NativeEvent = Event;

export type NativeHTMLElement = HTMLElement;

export type NativeElement = Element;

export type NativeNode = Node;
export const NativeNode = Node;

export type NativeNodeList = NodeList;

export type NativeText = Text;

export type NativeRange = Range;
export const NativeRange = Range;

export type NativeSelection = Selection;
