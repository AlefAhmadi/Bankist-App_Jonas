# 🏦 Bankist App // Virtual Banking Web Application

[فارسی](README.fa.md)

A minimalist virtual banking web application with interactive transactions, currency formatting, auto-logout inactivity timers, and a custom dark mode.

---

## 📸 Architecture & Flowchart

![Bankist Flowchart](Bankist-flowchart.png)

---

## 🔑 Demo Accounts

Use these credentials to log in and test the application:

| User | Username | PIN |
| :--- | :--- | :--- |
| **Jonas Schmedtmann** | `js` | `1111` |
| **Jessica Davis** | `jd` | `2222` |

---

## ✨ Features

- **🔐 Authentication & Inactivity Timer:** Simulates user login with PIN; automatically logs out after 5 minutes of inactivity with a real-time countdown timer.
- **💸 Money Transfers:** Transfer money instantly to another valid account with balance verification.
- **📈 Request Loan:** Request a loan with automatic approval logic (requires at least one deposit $\ge 10\%$ of requested loan).
- **❌ Close Account:** Delete an account by confirming credentials.
- **🔄 Sort Movements:** Toggle between chronological and sorted transactions.
- **🌐 Internationalization (Intl API):** Formats currency and dates according to user locale.
- **🌓 Custom Dark Mode:** Full dark mode support with instant theme toggle.

---

## 🛠️ Built With

- **HTML5 & CSS3** (Custom UI, responsive layout, dark mode styles)
- **JavaScript (ES6+)**
  - Array Methods (`map`, `filter`, `reduce`, `find`, `findIndex`, `some`, `every`, `flat`, `flatMap`)
  - `Intl.DateTimeFormat` & `Intl.NumberFormat`
  - Timers (`setInterval`, `setTimeout`)
  - DOM Manipulation & Event Handling

---

## 📄 License & Attribution

Based on the project from Jonas Schmedtmann's *The Complete JavaScript Course*. The JavaScript logic (`script.js`) and features were personally implemented and customized by **Arian Ahmadi (AlefAhmadi)**.