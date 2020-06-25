# projeto-tac-middleware-gui
[Projeto] Forca com middleware - GUI

## Alunos
- Elias Soares
- Leonardo Maximino

## Requisitos

- Nodejs 12.x
- NPM 6.x

## Instalação

Para instalar as dependências do client:
```bash
cd client/
npm install
```

Para instalar as dependências do server:
```bash
cd ../server/
npm install
```

## Iniciar aplicação
Para iniciar o client você precisa estar na subpasta `client/` e executar:

```bash
npm run start
```
Para iniciar o server você precisa estar na subpasta `server/` e executar:

```bash
npm run start
```

## Selecionar middleware
Para definir o midleware altere a constante no arquivo `client/scripts/game.js`
```js
const MIDDLEWARE = 'rpc'; // rpc, local, multiprocessado
```

## Perguntas

Quão difícil seria implementar uma modalidade de jogo em que cada jogador pode responder ao mesmo tempo, aquele que responder certo primeiro ganha o prêmio, e os que responderem errado perdem pontos? Tag `v2.0`.

R: Em uma implementação onde os jogadores podem responder ao mesmo tempo a dificuldade se encontra no controle da ordenação das operações, como cada jogador está em um processo diferente conectado pela rede, a latência da conexão pode fazer com que o jogador que respondeu primeiro não necessáriamente seja recebido na ordem correta pelo servidor.  

Novamente, quão complicado seria implementar a versão em tempo real do jogo, utilizando RPC? Tag `v3.0`.

R:
