\# Day 03: Flexbox Architecture (Navigation \& Hero)



\## 📝 What I Built

Today I used CSS Flexbox to create a fluid navigation bar and a perfectly centered Hero section for my TechNova community page.



\*\*Live Demo:\*\* https://hithashree-git.github.io/50-Days-Web-Challenge/Day-03/



\## 📸 Screenshots



\### 💻 Code View

!\[Day 03 Code](screenshots/day3-code.png)

\*Figure 1: Screenshot of the Flexbox CSS code\*



\### 🌐 Browser Output

!\[Day 03 Output](screenshots/day3-output.png)

\*Figure 2: Screenshot of the aligned navigation and centered hero\*



\## 🔑 Key Learnings



\### 1. Flexbox Basics

\- `display: flex` creates a flex container

\- Direct children become flex items

\- One-dimensional layout (row or column)



\### 2. Navigation Bar Layout

```css

nav {

&#x20;   display: flex;

&#x20;   justify-content: space-between;  /\* Logo left, links right \*/

&#x20;   align-items: center;             /\* Vertical alignment \*/

}



