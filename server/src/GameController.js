const GameLocal = require('./GameLocal');
const GameMultiprocessado = require('./GameMultiprocessado');
const GameRPC = require('./GameRPC');
const GameTempoReal = require('./GameTempoReal');

class GameController {
    middleware = new GameLocal();

    constructor({ io }) {
        this.io = io;
        this.jogador = 1;
    }

    start(req, res) {
        const jogador = this.jogador;
        this.jogador += 1;
        // Verifica se o jogo já foi iniciado
        if (this.middleware && this.middleware.palavrasAtuais.length && !req.query.restart) {
            res.status(200).send({ message: 'Já existe um jogo em andamento!', jogador });
            return;
        }

        this.jogador = 2;
        // Verifica o tipo de middleware
        if (!req.query.tipo || req.query.tipo === 'local') {
            this.middleware = new GameLocal();
        } else if (req.query.tipo === 'multiprocessado') {
            this.middleware = new GameMultiprocessado();
        } else if (req.query.tipo === 'rpc') {
            this.middleware = new GameRPC();
        }

        // inicia o jogo
        this.middleware.start();
        res.send({ message: 'Jogo iniciado', jogador: 1 });
    }

    getStatus(req, res) {
        res.send({
            palavrasAtuais: this.middleware.getPalavrasAtuais(),
            letrasEscolhidas: this.middleware.letrasEscolhidas,
            jogadores: this.middleware.jogadores,
            pontuacao: this.middleware.pontuacao,
            isFimJogo: this.middleware.isFimJogo(),
        });
    }

    play(req, res) {
        if (!req.query.letra) {
            res.status(400).send({ message: 'Informe uma letra!' });
            return;
        }
        if (!req.query.jogador) {
            res.status(400).send({ message: 'Informe o jogador!' });
            return;
        }
        const result = this.middleware.testarLetra(
            req.query.letra,
            Number(req.query.jogador)
        );
        this.io.emit('broadcast', result);
        res.send(result);
    }
}

module.exports = GameController;
