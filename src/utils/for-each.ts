type EachCallback = (key: string, value: any) => boolean | void;

export function forEach(value: { [key: string]: any }, callback: EachCallback): void {
  for (const key in value) {
    if (callback(key, value[key]) === false) {
      break;
    }
  }
}
