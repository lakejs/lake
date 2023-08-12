declare global {
  interface Window {
    DEBUG: boolean;
  }

  interface Element {
    style: { [key: string]: string };
  }

  interface Node {
    lakeId: number;
  }
}

export type NativeEvent = Event;

export type NativeElement = Element;

export type NativeNode = Node;
export const NativeNode = Node;

export type NativeNodeList = NodeList;

export type NativeText = Text;

export type NativeRange = Range;
export const NativeRange = Range;
