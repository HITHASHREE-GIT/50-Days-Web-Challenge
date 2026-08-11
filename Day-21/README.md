\# Day 21: Performance Engineering (Debouncing \& Closures)



\## 📝 What I Built

Today I engineered a Debounce utility using JavaScript Closures to optimize search performance.



\## 📸 Screenshots



\### 💻 Code View

!\[Day 21 Code](screenshots/day21-code.png)



\### 🌐 Browser Output

!\[Day 21 Output](screenshots/day21-output.png)



\## 🔑 Key Learnings



\### 1. Debounce Utility

```javascript

function debounce(func, delay) {

&#x20;   let timeoutId;

&#x20;   return function(...args) {

&#x20;       clearTimeout(timeoutId);

&#x20;       timeoutId = setTimeout(() => {

&#x20;           func.apply(this, args);

&#x20;       }, delay);

&#x20;   };

}

