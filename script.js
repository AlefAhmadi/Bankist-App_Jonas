'use strict';

// Dark Mode Toggle
const btnDarkMode = document.querySelector('.btn--dark-mode');
btnDarkMode.addEventListener('click', function () {
  document.body.classList.toggle('dark-mode');
  btnDarkMode.textContent = document.body.classList.contains('dark-mode')
    ? '☀️'
    : '🌙';
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP ( Jonas Challng By ME )

/////////////////////////////////////////////////
// Data
// Contains user account information including transaction history, interest rate, and locale information

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2026-02-05T10:00:00.000Z', // Today
    '2026-02-04T10:00:00.000Z', // Yesterday
    '2026-02-02T10:00:00.000Z', // 3 days ago
    '2026-01-29T10:00:00.000Z', // 7 days ago
    '2026-01-15T10:00:00.000Z',
    '2025-12-25T10:00:00.000Z',
    '2025-11-01T10:00:00.000Z',
    '2025-10-10T10:00:00.000Z',
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
  currency: 'IRR',
  locale: 'fa-IR',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
// Selecting all page elements via class and ID
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

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

const now = new Date();
const year = now.getFullYear();
const month = `${now.getMonth() + 1}`.padStart(2, 0);
const day = `${now.getDate()}`.padStart(2, 0);
const hour = `${now.getHours()}`.padStart(2, 0);
const min = `${now.getMinutes()}`.padStart(2, 0);

/////////////////////////////////////////////////
// Functions

// Function to format movement date
const formatMovementDate = function (date, locale) {
  // Calculate days passed between two dates
  const calcDayPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const dayPassed = calcDayPassed(new Date(), date);

  // Return appropriate text for date
  if (dayPassed === 0) return 'Today';
  if (dayPassed === 1) return 'Yesterday';
  if (dayPassed <= 7) return `${dayPassed} days ago`;
  else {
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

// Function to display account movements
const displayMovements = function (acc, sort = false) {
  // Clear previous content and sort movements if requested
  containerMovements.innerHTML = '';
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  // Loop to display each movement
  movs.forEach(function (mov, i) {
    // Determine movement type (deposit or withdrawal)
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    // Format amount based on locale and currency
    const formattedMov = new Intl.NumberFormat(acc.locale, {
      style: 'currency',
      currency: acc.currency,
    }).format(mov);

    // Create HTML to display movement
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>

      </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Function to calculate and display balance
const calcDisplayBalance = function (acc) {
  // Sum up all movements to get balance
  const balance = (acc.balance = acc.movements.reduce(
    (acc, mov) => acc + mov,
    0,
  ));

  // Display balance with appropriate locale and currency format
  labelBalance.textContent = new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(balance);
};

// Function to calculate and display summary (income, outcome, interest)
const calcDisplaySummary = function (acc) {
  // Calculate total incomes
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(incomes);

  // Calculate total outcomes
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(out);

  // Calculate bank interest (only for deposits > 1)
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(interest);
};

// Function to create username from account owner name
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    // Convert first letter of each name part to username
    // Example: Jonas Schmedtmann -> js
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

// Function to start logout timer
const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }

    time--;
  };

  // Set time to 5 minutes
  let time = 300;

  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

// Function to update the entire UI
const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer; // Variables to store current account and timer

// Fake login for development
const enableFakeLogin = true;
if (enableFakeLogin) {
  currentAccount = account1;
  labelWelcome.textContent = `Welcome back, ${
    currentAccount.owner.split(' ')[0]
  }`;
  updateUI(currentAccount);
  containerApp.style.opacity = 100;
}
///////////////////////////////////////

// Display current date and time
labelDate.textContent = `${month}/${day}/${year}- ${hour}:${min}`;

// Login button click handler
btnLogin.addEventListener('click', function (e) {
  // Prevent form submission
  e.preventDefault();

  // Find account with entered username
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value,
  );
  console.log(currentAccount);

  // Check pin correctness
  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Display current date based on locale
    const today = new Date();
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
    ).format(today);

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

// btn transfer
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value,
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // add date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

// Request loan button click handler
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +inputLoanAmount.value;

  // Check condition: loan only if account has deposit 10% of requested amount
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();

    // Add loan to movements
    setTimeout(() => {
      currentAccount.movements.push(amount);

      // Add date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);
    }, 2500);
  }
  inputLoanAmount.value = '';
});

// Close account button click handler
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username,
    );

    // Delete account from list
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

// Sort movements button click handler
let sorted = false; // Variable to track sort state
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  // Toggle sort state and redisplay movements
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;

  // Reset timer
  clearInterval(timer);
  timer = startLogOutTimer();
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
