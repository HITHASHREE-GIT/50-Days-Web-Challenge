\# Day 17: Theme Engineering \& Persistent State (Dark Mode)



\## 📝 What I Built

Today I built a Dark Mode toggle that persists across browser sessions using CSS variables and LocalStorage.



\## 📸 Screenshots



\### 💻 Code View

!\[Day 17 Code](screenshots/day17-code.png)



\### 🌐 Light Mode

!\[Light Mode](screenshots/day17-light.png)



\### 🌙 Dark Mode

!\[Dark Mode](screenshots/day17-dark.png)



\## 🔑 Key Learnings



\### 1. CSS Variables for Theming

```css

:root {

&#x20;   --bg-color: #ffffff;

&#x20;   --text-color: #333333;

}



.dark-theme {

&#x20;   --bg-color: #121212;

&#x20;   --text-color: #f1f1f1;

}



Theme Toggle Logic

javascript



document.body.classList.toggle('dark-theme');



Persist Theme Preference

javascript



localStorage.setItem('theme', 'dark');



&#x20;Restore on Load

javascript



if (localStorage.getItem('theme') === 'dark') {

&#x20;   document.body.classList.add('dark-theme');

}



&#x20;System Preference (Bonus)

javascript



window.matchMedia('(prefers-color-scheme: dark)').matches





