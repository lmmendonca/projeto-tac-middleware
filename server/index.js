'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const RPCServer = require('rpc-websockets').Server;
const GameController = require('./src/GameController');

const SERVER_PORT = 3000;
const RPC_SERVER_PORT = 3001;

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const gameController = new GameController({ io });

// Websocket
io.on('connection', () => { console.log('conectado!') });

// Http
app.use(bodyParser.json());
app.use(cors());
app.use((req, res, next) => {
  console.log(req.method, req.path, req.body);
  next();
});
app.get('/start', gameController.start.bind(gameController));
app.get('/status', gameController.getStatus.bind(gameController));
app.get('/play', gameController.play.bind(gameController));

server.listen(SERVER_PORT);

// Rpc
const rpcServer = new RPCServer({
  port: RPC_SERVER_PORT,
  host: 'localhost'
});

rpcServer.register('start', function (params) {
  return new Promise((resolve) => {
    const res = {
      status() { return this; },
      send(data) { return resolve(data); }
    };
    gameController.start({ query: params }, res);
  });
});
rpcServer.register('getStatus', function (params) {
  return new Promise((resolve) => {
    const res = {
      status() { return this; },
      send(data) { return resolve(data); }
    };
    gameController.getStatus({ query: params }, res);
  });
});
rpcServer.register('play', function (params) {
  return new Promise((resolve) => {
    const res = {
      status() { return this; },
      send(data) {
        return resolve(data);
      }
    };
    gameController.play({ query: params }, res);
  });
});