const GameLocal = require('./GameLocal');
const GameMultiprocessado = require('./GameMultiprocessado');
const GameRPC = require('./GameRPC');
const GameTempoReal = require('./GameTempoReal');

class GameController {
    middleware = new GameLocal();

    start(req, res) {
        // Verifica se o jogo já foi iniciado
        if (this.middleware && this.middleware.palavrasAtuais.length && !req.query.restart) {
            res.status(400).send({ message: 'Já existe um jogo em andamento!' });
            return;
        }
        // Verifica o tipo de middleware
        if (!req.query.tipo || req.query.tipo === 'local') {
            this.middleware = new GameLocal();
        }
        // inicia o jogo
        this.middleware.start();
        res.send({ message: 'Jogo iniciado' });
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
        res.send(
            this.middleware.testarLetra(
                req.query.letra,
                Number(req.query.jogador)
            )
        );
    }
}

module.exports = GameController;
