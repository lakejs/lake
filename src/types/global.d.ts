import { KeyValue } from './object';
import { Locales } from '../i18n/types';

declare global {
  interface Window {
    LAKE_LANGUAGE: Locales;
    LAKE_DEBUG: boolean;
    CodeMirror: any;
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
