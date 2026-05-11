// Array de cartas (pares de frutas);
const cartas = [
  "🍎",
  "🍎",
  "🍌",
  "🍌",
  "🍇",
  "🍇",
  "🍓",
  "🍓",
  "🍊",
  "🍊",
  "🍉",
  "🍉",
  "🍋",
  "🍋",
  "🍑",
  "🍑",
  "🍒",
  "🍒",
  "🥝",
  "🥝",
];
// Configurações dos níveis (quantidade de pares);
const niveis = [
  { level: 1, pares: 2 },
  { level: 2, pares: 4 },
  { level: 3, pares: 6 },
  { level: 4, pares: 8 },
  { level: 5, pares: 10 },
];
// Variáveis de controle do jogo;
let firstCard = null,
  secondCard = null,
  lockBoard = false,
  erros = 0,
  pares = 0,
  level = 1;

const gameBoard = document.querySelector("#gameBoard");
document.querySelector("#resetButton").addEventListener("click", reiniciarJogo);
document.querySelector("#nextButton").addEventListener("click", proximoNivel);
// Função para resetar as cartas selecionadas e desbloquear o tabuleiro;
function resetarCartas() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}
// Função para verificar se as cartas selecionadas formam um par;
function verificarPar() {
  if (firstCard.dataset.value === secondCard.dataset.value) {
    firstCard.classList.add("iguais");
    secondCard.classList.add("iguais");
    firstCard.disabled = true;
    secondCard.disabled = true;
    pares++;
    verificarVitoria();
    resetarCartas();
  } else {
    lockBoard = true;
    erros++;
    document.querySelector("#erros").textContent = "Erros: " + erros;
    setTimeout(() => {
      firstCard.textContent = "?";
      secondCard.textContent = "?";
      resetarCartas();
    }, 900);
  }
}
// Função para criar as cartas no tabuleiro de acordo com o nível atual;
function criarCartas() {
  const config = niveis[level - 1];
  const cartasDoNivel = cartas.slice(0, config.pares * 2);
  for (let i = cartasDoNivel.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cartasDoNivel[i], cartasDoNivel[j]] = [cartasDoNivel[j], cartasDoNivel[i]];
  }
  for (let i = 0; i < cartasDoNivel.length; i++) {
    const carta = document.createElement("button");
    carta.classList.add("carta");
    carta.dataset.value = cartasDoNivel[i];
    carta.textContent = "?";
    gameBoard.appendChild(carta);
    carta.addEventListener("click", function () {
      if (lockBoard) return;
      if (carta === firstCard) return;
      carta.textContent = carta.dataset.value;
      if (firstCard === null) {
        firstCard = carta;
      } else {
        secondCard = carta;
        verificarPar();
      }
    });
  }

  // Revela todas as cartas no início
  lockBoard = true;
  const todasCartas = document.querySelectorAll(".carta");
  for (let i = 0; i < todasCartas.length; i++) {
    todasCartas[i].textContent = todasCartas[i].dataset.value;
  }
  setTimeout(() => {
    for (let i = 0; i < todasCartas.length; i++) {
      todasCartas[i].textContent = "?";
    }
    lockBoard = false;
  }, 2000);
}
// Função para avançar para o próximo nível, resetando o tabuleiro e atualizando as informações do jogo;
function proximoNivel() {
  if (level < 5) {
    level++;
    pares = 0;
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    const msg = document.querySelector("#vitoriaMessage");
    if (msg) msg.remove();
    gameBoard.innerHTML = "";
    document.querySelector("#nextButton").style.display = "none";
    document.querySelector("#levelInfo").textContent = "Nível: " + level;
    criarCartas();
  }
}
// Função para reiniciar o jogo, resetando todas as variáveis e o tabuleiro para o estado inicial;
function reiniciarJogo() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  erros = 0;
  pares = 0;
  level = 1;
  document.querySelector("#erros").textContent = "Erros: 0";
  document.querySelector("#levelInfo").textContent = "Nível: 1";
  const msg = document.querySelector("#vitoriaMessage");
  if (msg) msg.remove();
  gameBoard.innerHTML = "";
  document.querySelector("#nextButton").style.display = "none";
  criarCartas();
}
// Função para verificar se o jogador completou o nível atual, exibindo uma mensagem de vitória e opções para avançar ou reiniciar o jogo;
function verificarVitoria() {
  const config = niveis[level - 1];
  if (pares === config.pares) {
    const vitoriaMessage = document.createElement("h1");
    vitoriaMessage.id = "vitoriaMessage";
    if (level === 5) {
      vitoriaMessage.textContent = "Parabéns! Você zerou o jogo! 🏆";
      document.querySelector("#resetButton").style.display = "block";
    } else {
      vitoriaMessage.textContent = "Nível " + level + " completo! 🎉";
      document.querySelector("#nextButton").style.display = "block";
    }
    document.body.appendChild(vitoriaMessage);
  }
}

criarCartas();
