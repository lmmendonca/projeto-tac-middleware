class Game {
    palavras = [
        'Amendoim', 'Banheiro', 'Caatinga', 'Cachorro',
        'Campeonato', 'Empenhado', 'Esparadrapo', 'Reportagem',
        'Basquete', 'Magenta', 'Menta', 'Moeda',
    ];
    palavrasAtuais = [];
    letrasEscolhidas = [];
    jogadores = [];
    pontuacao = 0;

    sortearPontuacao() {
        this.pontuacao = Math.floor(Math.random() * 1000);
    }

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
            { id: 1, pontos: 0 },
            { id: 2, pontos: 0 },
            { id: 3, pontos: 0 }
        ];
        this.sortearPontuacao();
    }

    /**
     * Verifica se o jogo terminou
     */
    isFimJogo() {
        const palavras = this.getPalavrasAtuais();
        const letrasFaltando = palavras.reduce((total, palavra) => {
            const count = palavra.filter((letra) => !letra);
            if (count.length) {
                return total + count.length;
            }
            return total;
        }, 0);
        return !letrasFaltando;
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
     * Testa uma letra, e retorna as letra já escolhidas
     * @param {string} letra 
     * @param {number} idJogador
     * @returns {string[]} 
     */
    testarLetra(letra, idJogador) {
        letra = (letra || '').toUpperCase();
        // Verifica se a letra já foi escolhida
        if (!letra || this.letrasEscolhidas.includes(letra)) {
            this.sortearPontuacao();
            return { letras: 0 };
        }
        this.letrasEscolhidas.push(letra);
    
        // Verifica letras encontradas
        let count = 0;
        this.palavrasAtuais.forEach((palavra) => {
            const letras = palavra.split('');
            letras.forEach((l) => {
                if (l === letra) {
                    count += 1;
                }
            });
        });

        // Adiciona pontos para o jogador
        if (count) {
            this.jogadores = this.jogadores.map((jogador) => {
                if (jogador.id === idJogador) {
                    jogador.pontos += this.pontuacao;
                }
                return jogador;
            });
        }
        this.sortearPontuacao();
        return { letras: count };
    }
}

module.exports = Game;
