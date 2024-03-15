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

app.post('/upload', (req, res) => {
  const result = {
    url: '../assets/images/heaven-lake-512.png',
    original: '../assets/images/heaven-lake-1280.png',
  };
  res.json(result);
});

app.post('/upload-error', (req, res) => {
  const result = {
    error: 'Upload failed.',
  };
  res.status(500).json(result);
});

app.listen(port, () => {
  console.log('Starting up an HTTP server');
  console.log('Available on:');
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4') {
        console.log(`- ${net.internal ? 'Local' : 'Network'}: http://${net.address}:${port}`);
      }
    }
  }
  console.log('Hit CTRL-C to stop the server');
});
