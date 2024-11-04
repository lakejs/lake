/* eslint no-console: "off" */

// Outputs a message to the console.
export function debug(...data: any[]): void {
  if (window.LAKE_DEBUG) {
    console.log.apply(console.log, data);
  }
}
