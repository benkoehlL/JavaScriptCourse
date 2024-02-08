'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

const displayMovements = function (user) {
  containerMovements.innerHTML = '';
  user.movements.forEach(function (mov, i) {
    const typeDeposit = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${typeDeposit}">${
      i + 1
    } ${typeDeposit}</div>
      <div class="movements__value">${mov}€</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

function displayBalance(user) {
  const balance = user.movements.reduce((acc, cur) => acc + cur, 0);
  user.balance = balance;
  labelBalance.textContent = balance + '€';
}

function displaySumIn(user) {
  labelSumIn.textContent =
    user.movements.filter(mov => mov > 0).reduce((acc, cur) => acc + cur, 0) +
    '€';
}
function displaySumOut(user) {
  labelSumOut.textContent =
    Math.abs(
      user.movements.filter(mov => mov < 0).reduce((acc, cur) => acc + cur, 0)
    ) + '€';
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
  displayMovements(user);
  displayBalance(user);
  displaySumIn(user);
  displaySumOut(user);
  displayInterest(user);
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
    containerApp.style.opacity = 0;
    displayError('You entered a wrong username or PIN');
  }
  clearLoginForm();
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recipient = accounts.find(
    acc =>
      acc.owner === inputTransferTo.value ||
      acc.username === inputTransferTo.value
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
  const loan = Number(inputLoanAmount.value);
  if (loan > 0) {
    currentAccount.movements.push(loan);
    currentAccount.interestRate *= 0.95;
    displayMessage(`You took a loan of ${loan}€`);
  } else {
    displayError('You can not give a loan to the bank!');
  }
  clearLoanForm();
  displayMovementElements(currentAccount);
});
// initialisation
createUserNames(accounts);
let currentAccount;
displayMovementElements(accounts.find(acc => acc.owner === 'Sarah Smith'));

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
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
