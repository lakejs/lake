import { KeyValue } from './object';

declare global {
  interface Window {
    DEBUG: boolean;
  }

  interface Element {
    style: KeyValue;
  }

  interface Node {
    lakeId: number;
  }

  interface ProgressEvent {
    percent: number;
  }
}
