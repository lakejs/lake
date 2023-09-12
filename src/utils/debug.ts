/* eslint no-console: "off" */

export function debug(...data: Parameters<typeof console.log>): void {
  if (window.DEBUG) {
    console.log.apply(console.log, data);
  }
}
