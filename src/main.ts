import { EventEmitter } from 'eventemitter3';
import { sayHello } from './greet';

function showHello(divName: string, name: string) {
  const elt = document.getElementById(divName);
  if (elt) {
    elt.innerText = sayHello(name);
  }
}

const EE = new EventEmitter();

EE.on('my-event', () => {
  showHello('greeting', 'TypeScript');
});

EE.emit('my-event');

const Lake = {
  event: EE,
  verson: '',
};

Lake.verson = '0.0.2';
