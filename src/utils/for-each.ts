type CallbackFunction = (key: string, value: any) => boolean | void;

export function forEach(map: { [key: string]: any }, callback: CallbackFunction): void {
  for (const key in map) {
    if (callback(key, map[key]) === false) {
      break;
    }
  }
}
