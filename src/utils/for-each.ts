type EachCallback = (key: string, value: any) => boolean | void;

export function forEach(object: { [key: string]: any }, callback: EachCallback): void {
  for (const key in object) {
    if (callback(key, object[key]) === false) {
      break;
    }
  }
}
