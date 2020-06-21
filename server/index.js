'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const GameController = require('./src/GameController')

const SERVER_PORT = 3000;
const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use((req, res, next) => {
  console.log(req.method, req.path, req.body);
  next();
});

const gameController = new GameController();
app.get('/start', gameController.start.bind(gameController));
app.get('/status', gameController.getStatus.bind(gameController));
app.get('/play', gameController.play.bind(gameController))

app.listen(SERVER_PORT, function () {
  console.log(`Server running on: http://localhost:${SERVER_PORT}`);
});
