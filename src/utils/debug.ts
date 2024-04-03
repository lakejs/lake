/* eslint no-console: "off" */

export function debug(...data: any[]): void {
  if (window.LAKE_DEBUG) {
    console.log.apply(console.log, data);
  }
}
