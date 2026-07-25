\# Day 05: CSS Grid Architecture (The Initiatives Gallery)



\## 📝 What I Built

Today I created a 2-dimensional Initiatives Gallery using CSS Grid. The gallery displays community projects and events in a clean, structured layout.



\*\*Live Demo:\*\* https://hithashree-git.github.io/50-Days-Web-Challenge/Day-05/



\## 📸 Screenshots



\### 💻 Code View

!\[Day 05 Code](screenshots/day5-code.png)



\### 🌐 Browser Output

!\[Day 05 Output](screenshots/day5-output.png)



\## 🔑 Key Learnings



\### 1. CSS Grid vs Flexbox

\- \*\*Flexbox:\*\* 1-dimensional (row OR column)

\- \*\*Grid:\*\* 2-dimensional (rows AND columns)



\### 2. Grid Setup

```css

.initiatives-grid {

&#x20;   display: grid;

&#x20;   grid-template-columns: repeat(3, 1fr);

&#x20;   gap: 30px;

}

