type EachCallback = (key: string, value: any) => boolean | void;

export function forEach(value: object, callback: EachCallback): void {
  for (const key in value) {
    if (value.hasOwnProperty(key)) {
      if (callback(key, value[key]) === false) {
        break;
      }
    }
  }
}
