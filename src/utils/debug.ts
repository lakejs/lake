/* eslint no-console: "off" */

export function debug(...data: any[]): void {
  if (window.DEBUG) {
    console.log(data);
  }
}
