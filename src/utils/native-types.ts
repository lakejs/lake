declare global {
  interface Element {
    style: { [key: string]: string };
    lakeId: number;
  }
}

export type NativeElement = Element;
export type NativeRange = Range;
export type NativeNode = Node;
export type NativeText = Text;
