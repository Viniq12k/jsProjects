const cartas = ["🍎","🍎","🍌","🍌","🍇","🍇","🍓","🍓"];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let erros = 0;
let pares = 0;
//Seleciona o tabuleiro do jogo;
const gameBoard = document.querySelector('#gameBoard');
//Chama a função para reiniciar o jogo quando o botão for clicado;
document.querySelector('#resetButton').addEventListener('click', reiniciarJogo);
//Resetar as cartas para o estado inicial;
function resetarCartas() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}
//Verificar se as cartas são iguais;
function verificarPar() {
    if (firstCard.dataset.value === secondCard.dataset.value) {
        firstCard.classList.add('iguais');
        secondCard.classList.add('iguais');
        firstCard.disabled = true;
        secondCard.disabled = true;
        pares++;
        verificarVitoria();
        resetarCartas();
    } else {
        lockBoard = true;
        erros++;
        document.querySelector('#erros').textContent = 'Erros: ' + erros;
        setTimeout(() => {
            firstCard.textContent = '?';
            secondCard.textContent = '?';
            resetarCartas();
        }, 900);
    }
}
//Criar cartas;
function criarCartas() {
    for (let i = 0; i < cartas.length; i++) {
        const carta = document.createElement('button');
        carta.classList.add('carta');
        carta.dataset.value = cartas[i];
        carta.textContent = '?';
        gameBoard.appendChild(carta);
        carta.addEventListener('click', function() {
            if (lockBoard) return;
            if (carta === firstCard) return;
            carta.textContent = carta.dataset.value;
            if (firstCard === null) {
                firstCard = carta;
            } else{
                secondCard = carta;
                verificarPar();
            }
        });
    }
}
//Embaralhar as cartas;
function embaralharCartas() {
    for (let i = cartas.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * cartas.length);
        [cartas[i], cartas[j]] = [cartas[j], cartas[i]];
    }
}
//Reiniciar o jogo;
function reiniciarJogo() {
    // reseta variáveis;
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    erros = 0;
    pares = 0;

    // reseta o contador na tela;
    document.querySelector('#erros').textContent = 'Erros: 0';
    // remove a mensagem de vitória, se existir;
    const msg = document.querySelector('#vitoriaMessage');
    if (msg) msg.remove();
    // limpa o tabuleiro;
    gameBoard.innerHTML = '';

    // embaralha e cria de novo;
    embaralharCartas();
    criarCartas();
    // esconde o botão de reset;
    document.querySelector('#resetButton').style.display = 'none';
}
//Verificar se o jogo foi concluído;
function verificarVitoria() {
    if (pares === cartas.length / 2) {
        const vitoriaMessage = document.createElement('h1');
        vitoriaMessage.id = 'vitoriaMessage'; 
        vitoriaMessage.textContent = 'Parabéns! Você venceu o jogo!';
        document.body.appendChild(vitoriaMessage);
        document.querySelector('#resetButton').style.display = 'block';
    }
}
embaralharCartas();
criarCartas();