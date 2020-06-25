const MIDDLEWARE = 'rpc'; // rpc, local, multiprocessado

const server = axios.create({
    baseURL: 'http://localhost:3000',
});

var socket = io('http://localhost:3000');
socket.on('connect', function () { });
socket.on('disconnect', function () { });

const RPC = require('rpc-websockets').Client;
const RPCServer = new RPC('ws://localhost:3001');
RPCServer.on('open', function () {
    class GameClient {
        tipo = MIDDLEWARE;
        idJogador = 1;

        async start(restart = '') {
            try {
                let data = {};
                if (this.tipo === 'rpc') {
                    data = await RPCServer.call('start', { tipo: this.tipo, restart });
                    console.log('RPC start', data);
                } else {
                    const res = await server.get(`/start?tipo=${this.tipo}&restart=${restart}`);
                    data = res.data;
                }
                if (this.tipo !== 'local' && data.jogador) {
                    this.idJogador = data.jogador;
                }
            } catch (error) {
                console.log(error);
            }
        }

        async getStatus() {
            if (this.tipo === 'rpc') {
                console.log('RPC getStatus');
                return RPCServer.call('getStatus');
            }
            const { data } = await server.get('/status');
            return data;
        }

        async play(letra) {
            if (this.tipo === 'rpc') {
                console.log('RPC play');
                return RPCServer.call('play', { jogador: this.idJogador, letra });
            }
            const { data } = await server.get(`/play?jogador=${this.idJogador}&letra=${letra}`);
            // Quando o tipo é local o jogo utiliza o mesmo processo,
            // por isso precisa alternar o usuário
            if (this.tipo === 'local') {
                const totalJogadores = 3;
                if ((this.idJogador + 1) > totalJogadores) {
                    this.idJogador = 1;
                } else {
                    this.idJogador += 1;
                }
            }
            return data;
        }
    }

    const game = new GameClient();
    const app = new Vue({
        el: '#app',
        data: {
            palavrasAtuais: [],
            letrasEscolhidas: [],
            jogadores: [],
            jogador: {},
            letraAtual: '',
            pontuacao: 0,
            isFimJogo: false,
        },
        async created() {
            await game.start();
            await this.getStatus();
        },
        methods: {
            async testarLetra(e) {
                e.preventDefault();
                if (this.letraAtual) {
                    await game.play(this.letraAtual);
                    await this.getStatus();
                }
            },
            async getStatus() {
                const {
                    palavrasAtuais,
                    letrasEscolhidas,
                    jogadores,
                    pontuacao,
                    isFimJogo,
                } = await game.getStatus();
                this.palavrasAtuais = palavrasAtuais;
                this.letrasEscolhidas = letrasEscolhidas;
                this.jogadores = jogadores;
                this.pontuacao = pontuacao;
                this.isFimJogo = isFimJogo;
                this.jogador = jogadores.find((jogador) => {
                    return jogador.id === game.idJogador;
                }) || {};
                this.letraAtual = '';
            },
            async restart() {
                game.start(true);
                this.getStatus();
            }
        }
    });

    socket.on('broadcast', function (data) {
        if (game.tipo !== 'local') {
            console.log('DATA', data);
            app.getStatus();
        }
    });
});