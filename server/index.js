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
app.post('/start', gameController.start.bind(gameController))
app.get('/palavrasAtuais', gameController.getPalavrasAtuais.bind(gameController))
app.get('/jogadorAtual', gameController.getJogadorAtual.bind(gameController))
app.get('/turnoJogador', gameController.getTurnoJogador.bind(gameController))
app.post('/testarLetra', gameController.testarLetra.bind(gameController))

app.listen(SERVER_PORT, function () {
  console.log(`Server running on: http://localhost:${SERVER_PORT}`);
});
