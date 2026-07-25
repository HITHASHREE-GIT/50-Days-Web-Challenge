\# Day 08: Native CSS Transitions \& Micro-Interactions



\## 📝 What I Built

Today I added smooth CSS transitions and micro-interactions to make the TechNova platform feel alive and responsive.



\## 📸 Screenshots



\### 💻 Code View

!\[Day 08 Code](screenshots/day8-code.png)



\### 🌐 Browser Output

!\[Day 08 Output](screenshots/day8-output.png)



\## 🔑 Key Learnings



\### 1. CSS Transitions

```css

.element {

&#x20;   transition: property duration timing-function;

}



/\* Example \*/

button {

&#x20;   transition: background-color 0.3s ease, transform 0.2s ease;

}



button:hover {

&#x20;   transform: translateY(-2px);

}

