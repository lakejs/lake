/* eslint no-console: "off" */

import { networkInterfaces } from 'os';
import path from 'path';
import express from 'express';

const app = express();

const port = 8080;

app.use((req, res, next) => {
  const date = new Date().toUTCString();
  console.log(`${req.ip} - [${date}] "${req.method} ${req.url}"`);
  next();
});

app.use(express.static(path.resolve('./')));

app.get('/examples/*', (req, res) => {
  res.sendFile(path.resolve('./examples/index.html'));
});

app.listen(port, () => {
  console.log('Starting up an HTTP server');
  console.log('Available on:');
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4;
      if (net.family === familyV4Value) {
        console.log(`- ${net.internal ? 'Local' : 'Network'}: http://${net.address}:${port}`);
      }
    }
  }
  console.log('Hit CTRL-C to stop the server');
});
