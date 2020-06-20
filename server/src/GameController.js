const GameLocal = require('./GameLocal');
const GameMultiprocessado = require('./GameMultiprocessado');
const GameRPC = require('./GameRPC');
const GameTempoReal = require('./GameTempoReal');

class GameController {
    middleware = new GameLocal();

    start(req, res) {
        if (req.body.tipo === 'local') {
            this.middleware = new GameLocal();
        }
        // verificar demais tipos ..
        res.send(this.middleware.start());
    }

    getPalavrasAtuais(req, res) {
        res.send(this.middleware.getPalavrasAtuais());
    }

    getJogadorAtual(req, res) {
        res.send(this.middleware.getJogadorAtual());
    }

    getTurnoJogador(req, res) {
        res.send(this.middleware.getTurnoJogador());
    }

    testarLetra(req, res) {
        res.send(this.middleware.testarLetra(req.body.letra));
    }
}

module.exports = GameController;
