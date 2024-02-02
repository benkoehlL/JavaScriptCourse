"use strict";
// setting winning score
const winningScore = 100;

// selecting elements
const playerName = [
  document.getElementById("name--0"),
  document.getElementById("name--1"),
];
const playerElement = [
  document.querySelector(".player--0"),
  document.querySelector(".player--1"),
];
let btnRollDice = document.querySelector(".btn--roll");
let btnHold = document.querySelector(".btn--hold");
let btnNewGame = document.querySelector(".btn--new");
let dicePic = document.querySelector(".dice");
let scoreBoard = [];
for (let i = 0; i < 2; i++) {
  scoreBoard.push(document.getElementById(`score--${i}`));
}
let scoreCurrent = [];
for (let i = 0; i < 2; i++) {
  scoreCurrent.push(document.getElementById(`current--${i}`));
}

// declare functions
const resetGame = function () {
  playing = true;
  resetScores();
  hideDie();
  currentPlayer = 0;
  for (let i = 0; i < 2; i++) {
    playerName[i].textContent = `${NamePlayer[i]}`;
    scoreCurrent[i].textContent = 0;
    playerElement[i].classList.remove("player--winner");
  }

  if (!playerElement[0].classList.contains("player--active")) {
    playerElement[0].classList.toggle("player--active");
    playerElement[1].classList.toggle("player--active");
  }
};

const switchPlayer = function () {
  playerElement[currentPlayer].classList.toggle("player--active");
  currentPlayer = (currentPlayer + 1) % 2;
  playerElement[currentPlayer].classList.toggle("player--active");
};

const hideDie = function () {
  dicePic.classList.add("hidden");
};

const addScoreToBoard = function (score) {
  scoreBoard[currentPlayer].textContent =
    Number(scoreBoard[currentPlayer].textContent) + score;
};

const resetScores = function () {
  for (let i = 0; i < scoreBoard.length; i++) {
    scoreBoard[i].textContent = 0;
  }
};

const setCurrentScore = function (score) {
  scoreCurrent[currentPlayer].textContent = score;
};

const resetCurrentScore = function () {
  setCurrentScore(0, currentPlayer);
};

const checkWinningCondition = function () {
  if (Number(scoreBoard[currentPlayer].textContent) >= winningScore) {
    playerName[currentPlayer].textContent = "Winner";
    playerName[(currentPlayer + 1) % 2].textContent = "Not Winner";
    playerElement[currentPlayer].classList.toggle("player--winner");
    hideDie();
    playing = false;
  }
};

const throwDice = function () {
  const diceNumber = Number(Math.trunc(6 * Math.random() + 1));
  dicePic.src = `dice-${diceNumber}.png`;
  if (dicePic.classList.contains("hidden")) {
    dicePic.classList.remove("hidden");
  }
  if (diceNumber !== 1) {
    setCurrentScore(
      Number(scoreCurrent[currentPlayer].textContent) + diceNumber,
      currentPlayer
    );
  } else {
    resetCurrentScore();
    switchPlayer();
  }
  return diceNumber;
};

const rollDice = function () {
  if (playing) {
    if (!currentPlayer) {
      throwDice();
    } else {
      let d = throwDice();
      let i = 0;
      while (
        i < 4 &&
        d !== 1 &&
        Number(scoreBoard[currentPlayer].textContent) +
          Number(scoreCurrent[currentPlayer].textContent) <
          winningScore
      ) {
        d = throwDice();
        i++;
      }
      if (d !== 1) {
        holdScore();
      }
    }
  }
};

const holdScore = function () {
  if (playing) {
    addScoreToBoard(Number(scoreCurrent[currentPlayer].textContent));
    checkWinningCondition();
    resetCurrentScore();
    switchPlayer();
  }
};

btnRollDice.addEventListener("click", rollDice);
btnHold.addEventListener("click", holdScore);
btnNewGame.addEventListener("click", resetGame);
let currentPlayer = 0;
let playing;
const NamePlayer = ["Player 1", "Player 2"];
NamePlayer[0] = "You"; //prompt("What is the name of the first player?");
NamePlayer[1] = "Computer"; //prompt("What is the name of the second player?");
resetGame();
// const statisticsDie = {
//   1: 0,
//   2: 0,
//   3: 0,
//   4: 0,
//   5: 0,
//   6: 0,
// };
// for (let i = 0; i < 100000; i++) {
//   let d = throwDice();
//   statisticsDie[d] += 1;
// }
// console.log(statisticsDie);
