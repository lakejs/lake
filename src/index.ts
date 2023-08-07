import { EventEmitter } from 'eventemitter3';
import './utils';
import pkg from '../package.json';

const event = new EventEmitter();

const Lake = {
  verson: pkg.version,
  event,
};

declare global {
  interface Window {
    Lake: any;
  }
}

window.Lake = Lake;
