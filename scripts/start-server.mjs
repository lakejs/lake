/* eslint no-console: "off" */

import path from 'path';
import { networkInterfaces } from 'os';
import { fileURLToPath } from 'url';
import express from 'express';
import multer from 'multer';

const port = 8080;
const maxFileSize = 10 * 1024 * 1024;

const scriptsPath = path.dirname(fileURLToPath(import.meta.url));
const rootPath = path.resolve(scriptsPath, '../');
const uploadPath = path.resolve(rootPath, './temp/');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const name = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${name}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: {
    files: 1,
    fileSize: maxFileSize,
  },
}).single('file');

const app = express();

app.use((req, res, next) => {
  const date = new Date().toUTCString();
  console.log(`${req.ip} - [${date}] "${req.method} ${req.url}"`);
  next();
});

app.use(express.static(rootPath));

app.get('/examples/*', (req, res) => {
  res.sendFile(path.resolve(rootPath, './examples/index.html'));
});

app.post('/upload', (req, res) => {
  upload(req, res, error => {
    // A Multer error occurred when uploading.
    if (error instanceof multer.MulterError) {
      res.status(500).json({
        error: error.code,
      });
      return;
    }
    // An unknown error occurred when uploading.
    if (error) {
      res.status(500).json({
        error: 'Upload failed.',
      });
      return;
    }
    // Everything went fine.
    res.json({
      url: `/temp/${req.file.filename}`,
    });
  });
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
