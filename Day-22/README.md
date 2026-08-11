\# Day 22: Advanced DOM \& The Intersection Observer (Scroll Animations)



\## 📝 What I Built

Today I added smooth scroll animations using the Intersection Observer API. Elements fade in as they enter the viewport.



\## 📸 Screenshots



\### 💻 Code View

!\[Day 22 Code](screenshots/day22-code.png)



\### 🌐 Browser Output

!\[Day 22 Output](screenshots/day22-output.png)



\## 🔑 Key Learnings



\### 1. Intersection Observer API

```javascript

const observer = new IntersectionObserver((entries) => {

&#x20;   entries.forEach(entry => {

&#x20;       if (entry.isIntersecting) {

&#x20;           entry.target.classList.add('show');

&#x20;       }

&#x20;   });

});

