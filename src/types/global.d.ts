import { KeyValue } from './object';

declare global {
  interface Window {
    LAKE_DEBUG: boolean;
    LAKE_TEST: boolean;
    LAKE_ERROR: boolean;
    LakeCodeMirror: any;
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
