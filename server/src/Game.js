class Game {
    palavras = [
        'Amendoim', 'Banheiro', 'Caatinga', 'Cachorro',
        'Campeonato', 'Empenhado', 'Esparadrapo', 'Reportagem',
        'Basquete', 'Magenta', 'Menta', 'Moeda',
    ];
    palavrasAtuais = [];
    letrasEscolhidas = [];
    jogadores = [];
    turnoJogador = 1;

    sortearPalavra() {
        const index = Math.floor(Math.random() * this.palavras.length);
        return (this.palavras.splice(index, 1)[0]).toUpperCase();
    }

    /**
     * Inicia o jogo sorteando uma palavra e resetando o estado do jogo
     */
    start() {
        this.palavrasAtuais = [
            this.sortearPalavra(),
            this.sortearPalavra(),
            this.sortearPalavra(),
        ];
        this.letrasEscolhidas = [];
        this.jogadores = [
            { id: 1 },
            { id: 2 },
            { id: 3 }
        ];
        this.turnoJogador = 1;
    }

    /**
     * Retorna o estado da palavra com base nas letras escolhidas 
     */
    getPalavrasAtuais() {
        return this.palavrasAtuais.map((palavra) => {
            const letras = palavra.split('');
            return letras.map((letra) => {
                return this.letrasEscolhidas.includes(letra) ? letra : null;
            });
        })
    }

    /**
     * Retorna os dados do jogador
     */
    getJogadorAtual() {
        return this.jogadores.find((jogador) => jogador.id === this.turnoJogador);
    }

    /**
     * Retorna o jogador do turno atual
     */
    getTurnoJogador() {
        return { id: this.turnoJogador };
    }

    /**
     * Testa uma letra, e retorna as letra já escolhidas
     * @param {string} letra 
     */
    testarLetra(letra) {
        letra = (letra || '').toUpperCase();
        if (!this.letrasEscolhidas.includes(letra)) {
            this.letrasEscolhidas.push(letra);
        }
        if ((this.turnoJogador + 1) > this.jogadores.length) {
            this.turnoJogador = 1;
        } else {
            this.turnoJogador = this.turnoJogador + 1;
        }
        return this.letrasEscolhidas;
    }
}

module.exports = Game;
