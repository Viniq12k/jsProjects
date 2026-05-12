// Array de cartas (pares de frutas);
const cartas = [
  "🍎","🍎","🍌","🍌","🍇","🍇","🍓","🍓","🍊","🍊",
  "🍉","🍉","🍋","🍋","🍑","🍑","🍒","🍒","🥝","🥝",
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

// Map para guardar os valores das cartas (invisível no inspetor);
const cardValues = new Map();

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
  if (cardValues.get(firstCard) === cardValues.get(secondCard)) {
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
  cardValues.clear();
  gameBoard.className = "";

  if (level <= 1) gameBoard.classList.add("grid-2");
  else if (level <= 4) gameBoard.classList.add("grid-4");
  else gameBoard.classList.add("grid-5");

  const config = niveis[level - 1];
  const cartasDoNivel = cartas.slice(0, config.pares * 2);

  for (let i = cartasDoNivel.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cartasDoNivel[i], cartasDoNivel[j]] = [cartasDoNivel[j], cartasDoNivel[i]];
  }

  for (let i = 0; i < cartasDoNivel.length; i++) {
    const carta = document.createElement("button");
    carta.classList.add("carta");
    cardValues.set(carta, cartasDoNivel[i]);
    carta.textContent = "?";
    gameBoard.appendChild(carta);
    carta.addEventListener("click", function () {
      if (lockBoard) return;
      if (carta === firstCard) return;
      carta.textContent = cardValues.get(carta);
      if (firstCard === null) {
        firstCard = carta;
      } else {
        secondCard = carta;
        verificarPar();
      }
    });
  }

  // Revela todas as cartas no início;
  lockBoard = true;
  const todasCartas = document.querySelectorAll(".carta");
  for (let i = 0; i < todasCartas.length; i++) {
    todasCartas[i].textContent = cardValues.get(todasCartas[i]);
  }
  setTimeout(() => {
    for (let i = 0; i < todasCartas.length; i++) {
      todasCartas[i].textContent = "?";
    }
    lockBoard = false;
  }, 4000);
}

// Função para avançar para o próximo nível;
function proximoNivel() {
  if (level < 5) {
    level++;
    pares = 0;
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    cardValues.clear();
    gameBoard.innerHTML = "";
    document.querySelector("#modal").classList.add("modal-hidden");
    document.querySelector("#levelInfo").textContent = "Nível: " + level;
    criarCartas();
  }
}

// Função para reiniciar o jogo;
function reiniciarJogo() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  erros = 0;
  pares = 0;
  level = 1;
  document.querySelector("#erros").textContent = "Erros: 0";
  document.querySelector("#levelInfo").textContent = "Nível: 1";
  document.querySelector("#modal").classList.add("modal-hidden");
  cardValues.clear();
  gameBoard.innerHTML = "";
  criarCartas();
}

// Função para verificar vitória;
function verificarVitoria() {
  const config = niveis[level - 1];
  if (pares === config.pares) {
    const modal = document.querySelector("#modal");
    const modalMsg = document.querySelector("#modalMsg");
    const nextButton = document.querySelector("#nextButton");
    const resetButton = document.querySelector("#resetButton");

    if (level === 5) {
      modalMsg.textContent = "Parabéns! Você zerou o jogo! 🏆";
      nextButton.style.display = "none";
      resetButton.style.display = "block";
    } else {
      modalMsg.textContent = "Nível " + level + " completo! 🎉";
      nextButton.style.display = "block";
      resetButton.style.display = "none";
    }

    modal.classList.remove("modal-hidden");
  }
}

criarCartas();