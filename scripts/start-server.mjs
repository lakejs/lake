import process from 'node:process';
import console from 'node:console';
import pc from 'picocolors';
import { startServer } from './utils.mjs';

const argv = process.argv.slice(2);

const port = argv[0] || 8080;

const step = msg => console.log(pc.cyan(msg));

step('Starting up an HTTP server');
await startServer(port, true);

console.log('Hit CTRL-C to stop the server');
