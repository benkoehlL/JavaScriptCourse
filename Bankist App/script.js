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
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
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
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
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

const displayMovements = function (user, sort = false) {
  containerMovements.innerHTML = '';
  const sortedMovements = sort
    ? user.movements.slice().sort((a, b) => a - b)
    : user.movements;
  sortedMovements.forEach(function (mov, i) {
    const typeDeposit = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(user.movementsDates[i]);
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth()}`.padStart(2, 0);
    const year = date.getFullYear();
    const displayDate = `${day}/${month}/${year}`;
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${typeDeposit}">${
      i + 1
    } ${typeDeposit}</div>
    <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${Number(mov).toFixed(2)}€</div>
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
  user.balance = balance.toFixed(2);
  labelBalance.textContent = balance + '€';
}

function displaySumIn(user) {
  labelSumIn.textContent =
    Number(
      user.movements.filter(mov => mov > 0).reduce((acc, cur) => acc + cur, 0)
    ).toFixed(2) + '€';
}
function displaySumOut(user) {
  labelSumOut.textContent =
    Math.abs(
      user.movements.filter(mov => mov < 0).reduce((acc, cur) => acc + cur, 0)
    ).toFixed(2) + '€';
}

function displayInterest(user) {
  labelSumInterest.textContent =
    user.movements
      .filter(mov => mov > 0)
      .map(deposit => (deposit * user.interestRate) / 100)
      .filter(int => int >= 1)
      .reduce((acc, int) => acc + int, 0)
      .toFixed(2) + '€';
}

function displayMovementElements(user) {
  displayMovements(user, boolSort);
  displayBalance(user);
  displaySumIn(user);
  displaySumOut(user);
  displayInterest(user);
  labelDate.textContent = new Date().toUTCString();
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
  } else {
    closeApp();
    displayError('You entered a wrong username or PIN');
  }
  clearLoginForm();
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
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
    } else if (amount > currentAccount.balance) {
      displayError(
        `You do not have enough money to make an transfer of ${amount}€.`
      );
    } else {
      currentAccount.movements.push(-amount);
      recipient.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toUTCString());
      recipient.movementsDates.push(new Date().toUTCString());

      displayMessage(
        `You transfered ${amount}€ to ${recipient.owner.split(' ')[0]}.`
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
  const loan = Number(inputLoanAmount.value).toFixed(2);
  const maxLoan =
    0.1 *
    currentAccount.movements.reduce(
      (acc, cur) => (acc < cur ? cur : acc),
      currentAccount.movements[0]
    );
  if (loan > 0) {
    if (currentAccount.movements.some(mov => loan <= maxLoan)) {
      currentAccount.movements.push(loan);
      currentAccount.movementsDates.push(new Date().toUTCString());
      currentAccount.interestRate *= 0.95;
      displayMessage(`You took a loan of ${loan}€`);
    } else {
      displayError(`You can not take a loan that is higher than ${maxLoan}€`);
    }
  } else {
    displayError('You can not give a loan to the bank!');
  }
  clearLoanForm();
  displayMovementElements(currentAccount);
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
createUserNames(accounts);
let currentAccount;

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
