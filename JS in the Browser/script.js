'use strict';

function getSecretNumber() {
  return Math.trunc(20 * Math.random()) + 1;
}

function setMessage(message) {
  document.querySelector('.message').textContent = message;
}

function setBackgroundColor(colour) {
  document.querySelector('body').style.backgroundColor = colour;
}

function checkGuess() {
  const guess = Number(document.querySelector('.guess').value);
  if (!guess) {
    setMessage('You need to enter a number!!!');
  } else if (guess > 20 || guess < 1) {
    setMessage(`You need to guess a number between 0 and 20!!!`);
    setBackgroundColor('#f22');
    if (guess === 42) {
      setBackgroundColor('#60b347');
      setMessage(`Yes, this is the answer, but what is the question???`);
    }
  } else {
    if (guess === secretNumber) {
      setMessage(`You guessed correctly. Your score was ${scoreCurrent}!!!`);
      setBackgroundColor('#60b347');

      if (scoreCurrent > scoreHigh) {
        scoreHigh = scoreCurrent;
        document.querySelector('.highscore').textContent = scoreHigh;
        setMessage(`You guessed correctly and even set a new highscore!!!`);
        setBackgroundColor('#929704');
      }
      secretNumber = getSecretNumber();
      pastGuessed = [];
      scoreCurrent = 20;
    } else if (pastGuessed.includes(guess)) {
      setBackgroundColor('#f22');
      setMessage('You already guessed this number!!!');
    } else {
      setBackgroundColor('#222');
      setMessage(
        'Your guess was not right. It was ' +
          (guess < secretNumber ? 'too low.' : 'too high.')
      );
      pastGuessed.push(guess);
      scoreCurrent -= 1;
      document.querySelector('.score').textContent = scoreCurrent;
    }
  }
}

let secretNumber = getSecretNumber();
let scoreCurrent = 20;
let scoreHigh = 0;
let pastGuessed = [];
document.querySelector('.check').addEventListener('click', function () {
  checkGuess();
});

document.querySelector('.guess').addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    checkGuess();
  }
});

document.querySelector('.again').addEventListener('click', function () {
  secretNumber = getSecretNumber();
  scoreCurrent = 20;
  setMessage('Guess a number between 1 and 20...');
  setBackgroundColor('#222');
  document.querySelector('.guess').value = '';
});
