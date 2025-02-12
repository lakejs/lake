import process from 'node:process';
import console from 'node:console';
import { startServer } from './utils.mjs';

const argv = process.argv.slice(2);

const port = argv[0] || 8080;

await startServer(port, true);

console.log('Hit CTRL-C to stop the server');
