\# Day 06: Responsive Engineering \& Media Queries



\## 📝 What I Built

Today I made the entire TechNova platform fully responsive using CSS Media Queries. The layout adapts seamlessly from desktop (3 columns) to tablet (2 columns) to mobile (1 column).



\*\*Live Demo:\*\* https://hithashree-git.github.io/50-Days-Web-Challenge/Day-06/



\## 📸 Screenshots



\### 💻 Code View

!\[Day 06 Code](screenshots/day6-code.png)

\*Figure 1: HTML structure with responsive meta tag and CSS link\*



\### 🌐 Browser Output

!\[Day 06 Output](screenshots/day6-output.png)

\*Figure 2: Fully responsive TechNova community page\*



\## 🔑 Key Learnings



\### 1. Responsive Design

Designing layouts that adapt to different screen sizes:

\- Desktop: 3 columns

\- Tablet: 2 columns

\- Mobile: 1 column



\### 2. Media Queries

```css

/\* Tablet Breakpoint \*/

@media (max-width: 900px) {

&#x20;   .initiatives-grid {

&#x20;       grid-template-columns: repeat(2, 1fr);

&#x20;   }

}



/\* Mobile Breakpoint \*/

@media (max-width: 600px) {

&#x20;   .initiatives-grid {

&#x20;       grid-template-columns: 1fr;

&#x20;   }

}

