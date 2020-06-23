const server = axios.create({
    baseURL: 'http://localhost:3000',
});

class GameClient {
    tipo = 'local';
    idJogador = 1;

    async start(restart = '') {
        try {
            await server.get(`/start?tipo=${this.tipo}&restart=${restart}`);
        } catch (error) {}
    }

    async getStatus() {
        const { data } = await server.get('/status');
        return data;
    }

    async play(letra) {
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
