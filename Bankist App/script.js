'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2023-11-18T21:31:17.178Z',
    '2023-12-23T07:42:02.383Z',
    '2023-01-28T09:15:04.904Z',
    '2023-04-01T10:17:24.185Z',
    '2023-05-08T14:11:59.604Z',
    '2023-05-27T17:01:17.194Z',
    '2023-07-11T23:36:17.929Z',
    '2024-02-07T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2023-11-01T13:15:33.035Z',
    '2023-11-30T09:48:16.867Z',
    '2023-12-25T06:04:23.907Z',
    '2023-01-25T14:18:46.235Z',
    '2023-02-05T16:33:06.386Z',
    '2023-04-10T14:43:26.374Z',
    '2023-06-25T18:49:59.371Z',
    '2024-02-11T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');
const navigator = document.getElementById('nav');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

function createUserNames(users) {
  users.forEach(function (user) {
    user.username = user.owner
      .toLowerCase()
      .split(' ')
      .map(l => l[0])
      .join('');
  });
}

function displayDate(date, locale = locale) {
  const timePast = Math.round(
    Number(new Date() - date) / (1000 * 60 * 60 * 24)
  );
  if (timePast === 0) return 'today';
  if (timePast === 1) return 'yesterday';
  if (timePast <= 7) return `${Math.round(timePast)} days ago`;
  return new Intl.DateTimeFormat(locale).format(date);
}

function createMovementsWithDate(accounts) {
  accounts.forEach(function (acc, index, arr) {
    acc.movementsWithDate = acc.movements.map((mov, index) => {
      return { movement: mov, date: acc.movementsDates[index] };
    });
  });
}

function addAmountToMovement(account, amount) {
  account.movements.push(Number(amount));
  account.movementsDates.push(new Date().toUTCString());
  account.movementsWithDate.push({
    movement: Number(amount),
    date: new Date().toUTCString(),
  });
}

const displayMovements = function (user, sort = false) {
  containerMovements.innerHTML = '';
  const sortedMovements = sort
    ? user.movementsWithDate.slice().sort((a, b) => a.movement - b.movement)
    : user.movementsWithDate;
  sortedMovements.forEach(function (mov, i) {
    const typeDeposit = mov.movement > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${typeDeposit}">${
      i + 1
    } ${typeDeposit}</div>
    <div class="movements__date">${displayDate(
      new Date(mov.date),
      currentAccount.locale
    )}</div>
      <div class="movements__value">${Intl.NumberFormat(user.locale, {
        style: 'currency',
        currency: user.currency,
      }).format(mov.movement)}</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
  const lines = document.querySelectorAll('.movements__row');
  for (const [index, line] of lines.entries()) {
    if (index % 2) {
      line.style.background = '#ddd';
    } else {
      line.style.background = '#bbb';
    }
  }
};

function displayBalance(user) {
  const balance = Number(user.movements.reduce((acc, cur) => acc + cur, 0));
  user.balance = balance;
  labelBalance.textContent = Intl.NumberFormat(user.locale, {
    style: 'currency',
    currency: user.currency,
  }).format(balance);
}

function displaySumIn(user) {
  labelSumIn.textContent = Intl.NumberFormat(user.locale, {
    style: 'currency',
    currency: user.currency,
  }).format(
    user.movements.filter(mov => mov > 0).reduce((acc, cur) => acc + cur, 0)
  );
}
function displaySumOut(user) {
  labelSumOut.textContent = Intl.NumberFormat(user.locale, {
    style: 'currency',
    currency: user.currency,
  }).format(
    user.movements.filter(mov => mov < 0).reduce((acc, cur) => acc + cur, 0)
  );
}

function displayInterest(user) {
  labelSumInterest.textContent = Intl.NumberFormat(user.locale, {
    style: 'currency',
    currency: user.currency,
  }).format(
    user.movements
      .filter(mov => mov > 0)
      .map(deposit => (deposit * user.interestRate) / 100)
      .filter(int => int >= 1)
      .reduce((acc, int) => acc + int, 0)
  );
}

function displayMovementElements(user) {
  displayMovements(user, boolSort);
  displayBalance(user);
  displaySumIn(user);
  displaySumOut(user);
  displayInterest(user);
  labelDate.textContent = Intl.DateTimeFormat(user.locale, {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date());
}
function clearLoginForm() {
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginUsername.blur();
  inputLoginPin.blur();
}

function clearTransferForm() {
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
  inputTransferTo.blur();
}

function clearLoanForm() {
  inputLoanAmount.value = inputTransferTo.value = '';
  inputLoanAmount.blur();
}

function clearCloseForm() {
  inputCloseUsername.value = inputTransferTo.value = '';
  inputClosePin.value = inputTransferTo.value = '';
  inputCloseUsername.blur();
  inputClosePin.blur();
}

function closeApp() {
  containerApp.style.opacity = 0;
}

function displayError(text) {
  navigator.style.background = '#f00';
  labelWelcome.textContent = text;
}

function displayMessage(text) {
  navigator.style.background = 'rgb(170 170 170)';
  labelWelcome.textContent = text;
}

const startLogOutTimer = function () {
  let time = 5 * 60;
  return setInterval(() => {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    if (time <= 0) {
      closeApp();
      displayMessage('You have been logged out automatically.');
      clearInterval(timer);
    }
    time--;
  }, 1000);
};

const resetTimer = function () {
  clearInterval(timer);
  timer = startLogOutTimer();
};

// Event handlers
btnLogin.addEventListener('click', function (event) {
  event.preventDefault();
  let searchAccount = accounts.find(
    acc =>
      acc.username === inputLoginUsername.value &&
      acc.pin === Number(inputLoginPin.value)
  );

  if (searchAccount) {
    currentAccount = searchAccount;
    containerApp.style.opacity = 1;
    displayMessage(`Welcome back, ${currentAccount.owner.split(' ')[0]}`);
    displayMovementElements(currentAccount);
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
  } else {
    closeApp();
    displayError('You entered a wrong username or PIN');
  }
  clearLoginForm();
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  resetTimer();
  const amount = Number(inputTransferAmount.value).toFixed(2);
  const recipient = accounts.find(
    acc =>
      acc.owner === inputTransferTo.value.toLowerCase() ||
      acc.username === inputTransferTo.value.toLowerCase()
  );
  if (recipient) {
    if (amount < 0) {
      displayError('You can not withdraw money from another account!');
      clearTransferForm();
    } else if (
      currentAccount.owner === recipient.owner ||
      currentAccount.username === recipient.username
    ) {
      displayError(`You can not transfer money to yourself.`);
    } else if (Number(amount) > Number(currentAccount.balance)) {
      displayError(
        `You do not have enough money to make an transfer of ${Intl.NumberFormat(
          currentAccount.locale,
          {
            style: 'currency',
            currency: currentAccount.currency,
          }
        ).format(amount)}.`
      );
    } else {
      addAmountToMovement(currentAccount, -amount);
      addAmountToMovement(recipient, amount);
      displayMessage(
        `You transfered ${Intl.NumberFormat(currentAccount.locale, {
          style: 'currency',
          currency: currentAccount.currency,
        }).format(amount)} to ${recipient.owner.split(' ')[0]}.`
      );
    }
    displayMovementElements(currentAccount);
  } else {
    displayError(
      `There is no user with either username nor name ${inputTransferTo.value}.`
    );
  }
  clearTransferForm();
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  resetTimer();
  const loan = Number(inputLoanAmount.value).toFixed(2);
  const maxLoan =
    0.1 *
    currentAccount.movements.reduce(
      (acc, cur) => (acc < cur ? cur : acc),
      currentAccount.movements[0]
    );
  displayMessage(
    `We are checking your loan request of ${Intl.NumberFormat(
      currentAccount.locale,
      {
        style: 'currency',
        currency: currentAccount.currency,
      }
    ).format(loan)}.`
  );
  clearLoanForm();
  const loanTimer = setTimeout(function () {
    if (loan > 0) {
      if (currentAccount.movements.some(mov => loan <= maxLoan)) {
        addAmountToMovement(currentAccount, loan);
        currentAccount.interestRate *= 0.95;
        displayMessage(
          `You took a loan of ${Intl.NumberFormat(currentAccount.locale, {
            style: 'currency',
            currency: currentAccount.currency,
          }).format(loan)}`
        );
      } else {
        displayError(
          `You can not take a loan that is higher than ${Intl.NumberFormat(
            currentAccount.locale,
            {
              style: 'currency',
              currency: currentAccount.currency,
            }
          ).format(maxLoan)}`
        );
      }
    } else {
      displayError('You can not give a loan to the bank!');
    }
    displayMovementElements(currentAccount);
  }, 1000 * 0.5 * 60);
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const confirmUser = inputCloseUsername.value.toLowerCase();
  const confirmPIN = Number(inputClosePin.value);
  if (
    (confirmUser === currentAccount.username ||
      confirmUser === currentAccount.owner) &&
    confirmPIN == currentAccount.pin
  ) {
    const deleteIndex = accounts.findIndex(
      acc =>
        acc.username === currentAccount.username ||
        acc.owner === currentAccount.owner
    );
    accounts.splice(deleteIndex, 1);
    displayMessage(
      `${currentAccount.owner.split(' ')[0]}, your account has been deleted.`
    );
    closeApp();
  } else {
    displayError('You entered a wrong username or PIN');
  }
  clearCloseForm();
});

btnSort.addEventListener('click', function () {
  boolSort = !boolSort;
  displayMovements(currentAccount, boolSort);
});
// initialisation
let boolSort = false;
const locale = navigator.language;
createUserNames(accounts);
createMovementsWithDate(accounts);
let currentAccount;
let timer;

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States Dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound Sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// SLICE
let arr = ['a', 'b', 'c', 'd', 'e'];
console.log(arr.slice(2, 4));
// to make shallow copy
console.log([...arr]);
console.log(arr.slice());

// SPLICE (does the same as slice, but mutates the array so that the extracted part is deleted)
console.log(arr.splice(-1));

// extract two elements starting from position 3
arr = ['a', 'b', 'c', 'd', 'e'];
console.log(arr.splice(3, 2));
console.log(arr);

// REVERSE (also mutates the array!)
let arr2 = ['j', 'i', 'h', 'g', 'f'];
arr2.reverse();
console.log(arr2);

// CONCAT
arr = ['a', 'b', 'c', 'd', 'e'];
const letters = arr.concat(arr2);

// instead of
const letters2 = [...arr, ...arr2];

console.log(letters);
console.log(letters2);

// JOIN
console.log(letters.join(' - '));

// the new at method
const arrDummy = [23, 11, 64];
console.log(arrDummy[0]);
console.log(arrDummy.at(0));

// get last element
console.log('Getting last element by \n');
console.log('The length attribute: ', arrDummy[arrDummy.length - 1]);
console.log('The slice method: ', arrDummy.slice(-1)[0]);
console.log('The at method: ', arrDummy.at(-1));

// forEach looping
// before
console.log("---The regular for loop with 'of' keyword---");
for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`${i + 1}: You deposited ${movement}€ into your account.`);
  } else {
    console.log(
      `${i + 1}: You withdrew ${Math.abs(movement)}€ out of your account.`
    );
  }
}
// with for each
console.log('----The forEach method---');
movements.forEach(function (movement, index, array) {
  if (movement > 0) {
    console.log(
      `Movement ${index + 1}: You deposited ${movement}€ into your account.`
    );
  } else {
    console.log(
      `Movement ${index + 1}: You withdrew ${Math.abs(
        movement
      )}€ out of your account.`
    );
  }
});

// forEach with maps and sets
currencies.forEach(function (value, key, map) {
  console.log(
    `MAP\n value: ${value}\n key: ${key}\n map of ${key}: ${map.get(key)}`
  );
});

const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR']);
console.log(currenciesUnique);
currenciesUnique.forEach(function (value, _, map) {
  console.log(`SET\n value: ${value}\n key: ${value}`);
});

// the MAP method
const euroToUsd = function (euro) {
  const usd = euro * 1.1;
  return usd;
};

const usdToEuro = function (usd) {
  const euro = usd / 1.1;
  return euro;
};

const poundToUsd = function (pound) {
  const usd = pound * 1.21;
  return usd;
};

const usdToPound = function (usd) {
  const pound = usd / 1.21;
  return pound;
};

const euroToPound = euro => euro * 1.1;

function PoundToEuro(pound) {
  const euro = pound / 1.1;
  return euro;
}

console.log(account1.movements, account1.movements.map(PoundToEuro));

const movementDescription = movements.map((mov, i) => {
  return `Movement ${i + 1}: You ${
    mov > 0 ? 'deposited ' + mov : 'withdrew ' + Math.abs(mov)
  }.`;
});
console.log(movementDescription);

// the FILTER method
const deposits = movements.filter(function (mov, i) {
  return mov > 0;
});
console.log(deposits);

const withdrawels = movements.filter(mov => mov < 0);
console.log(withdrawels);

// the REDUCE method
const balance = movements.reduce(function (accumulator, current, index, array) {
  console.log(
    `iteration ${index}: accumulator: ${accumulator} current: ${current} array: ${array}`
  );
  return accumulator + current;
}, 0);

console.log(balance);

const balanceShort = movements.reduce((acc, cur) => acc + cur, 0);
console.log(balanceShort);

// get maximum value
const maximum = movements.reduce(
  (acc, cur) => (acc < cur ? cur : acc),
  movements[0]
);
const minimum = movements.reduce(
  (acc, cur) => (acc > cur ? cur : acc),
  movements[0]
);

console.log(`maximum: ${maximum}, minimum: ${minimum}`);

// the FLATMAP method
// can only go one level deep
// for deeper levels use ARRAY.flat(n).map(...)
const overallBalance = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, cur) => acc + cur, 0);
console.log(overallBalance);

// the FILL method
const x = new Array(7).fill(0).map((_, index) => index);
console.log(x);

// the FROM method
console.log(Array.from({ length: 7 }, (_, index) => index));

// Timer functions
// timout
let ingredients = ['olives', 'spinach'];
function printIngredientsUponDelivery(ingredients) {
  console.log(
    `Here is your Pizza with ${ingredients
      .map((value, index) => `fresh ${value} `)
      .join('and ')}`
  );
}
const timer1 = setTimeout(
  ingredients => printIngredientsUponDelivery(ingredients),
  3000,
  ingredients
);
console.log('Waiting...');
if (ingredients.includes('spinach')) {
  clearTimeout(timer1);
  ingredients[ingredients.indexOf('spinach')] = 'Ananas';
  console.log('Delivery cancelled. Delivering with Ananas instead');
}
const timer2 = setTimeout(
  ingredients => printIngredientsUponDelivery(ingredients),
  3000,
  ingredients
);

// setIntervall
const interval1 = setInterval(() => {
  console.log(new Date());
}, 1000);

setTimeout(() => {
  clearInterval(interval1);
}, 1000 * 60);
