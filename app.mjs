/* eslint no-console: "off" */

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
  console.log('Starting up Express server');
  console.log(`Available on http://localhost:${port}`);
  console.log('Hit CTRL-C to stop the server');
});
