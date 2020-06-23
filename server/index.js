'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const GameController = require('./src/GameController');

const SERVER_PORT = 3000;
const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);
io.on('connection', (client) => {
  console.log('conectado!');
});

app.use(bodyParser.json());
app.use(cors());
app.use((req, res, next) => {
  console.log(req.method, req.path, req.body);
  next();
});

const gameController = new GameController({ io });
app.get('/start', gameController.start.bind(gameController));
app.get('/status', gameController.getStatus.bind(gameController));
app.get('/play', gameController.play.bind(gameController));

server.listen(SERVER_PORT);
