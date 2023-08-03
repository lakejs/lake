import { EventEmitter } from 'eventemitter3';
import { sayHello } from './greet';

function showHello(divName: string, name: string) {
  const elt = document.getElementById(divName);
  if (elt) {
    elt.innerText = sayHello(name);
  }
}

console.log('foo');

const EE = new EventEmitter();

EE.on('my-event', () => {
  showHello('greeting', 'TypeScript');
});

EE.emit('my-event');
