\# Day 32: Architecture \& Code Splitting (ES6 Modules)



\## 📝 What I Built

Today I refactored the codebase into ES6 Modules with separate files for utilities, API calls, and UI logic.



\*\*Live Demo:\*\* https://hithashree-git.github.io/50-Days-Web-Challenge/Day-32/



\## 📸 Screenshots



\### 💻 Code View

!\[Day 32 Code](screenshots/day32-code.png)



\### 🌐 Browser Output

!\[Day 32 Output](screenshots/day32-output.png)



\### 📂 File Structure

!\[File Structure](screenshots/day32-structure.png)



\## 🔑 Key Learnings



\### 1. ES6 Modules

```html

<script type="module" src="main.js"></script>

2\. Export

javascript



// utils.js

export function debounce(func, delay) {

&#x20;   let timeoutId;

&#x20;   return function (...args) {

&#x20;       clearTimeout(timeoutId);

&#x20;       timeoutId = setTimeout(() => {

&#x20;           func.apply(this, args);

&#x20;       }, delay);

&#x20;   };

}



3\. Import

javascript



// main.js

import { debounce } from './utils.js';

import { fetchUserProfile } from './api.js';



4\. Separation of Concerns

text



main.js  → UI Logic \& Event Binding

api.js   → Network Requests \& API Calls

utils.js → Helper Functions (debounce, formatDate, etc.)



5\. Module Scope



Variables declared in a module are scoped to that module only, preventing global namespace pollution.



