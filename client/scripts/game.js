const server = axios.create({
    baseURL: 'http://localhost:3000',
});

class GameClient {
    async start() {
        await server.post('/start', { tipo: 'local' });
    }

    async getPalavrasAtuais() {
        const { data } = await server.get('/palavrasAtuais');
        return data;
    }

    async getJogadorAtual() {
        const { data } = await server.get('/jogadorAtual');
        return data;
    }
    
    async getTurnoJogador() {
        const { data } = await server.get('/turnoJogador');
        return data;
    }

    async testarLetra(letra) {
        const { data } = await server.post('/testarLetra', { letra })
        return data;
    }
}

const game = new GameClient();
const app = new Vue({
    el: '#app',
    data: {
        palavrasAtuais: [],
        letrasEscolhidas: [],
        turnoJogador: {},
        jogadorAtual: {},
        letraAtual: '',
    },
    async created() {
        await game.start();
        await this.loadState();
    },
    methods: {
        async testarLetra(e) {
            e.preventDefault();
            if (this.letraAtual) {
                this.letrasEscolhidas = await game.testarLetra(this.letraAtual);
                await this.loadState();
            }
        },
        async loadState() {
            this.palavrasAtuais = await game.getPalavrasAtuais();
            this.jogadorAtual = await game.getJogadorAtual();
            this.turnoJogador = await game.getTurnoJogador();
            this.letraAtual = '';
        }
    }
});
