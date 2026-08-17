\# Day 31: Data Scaling (Pagination \& Infinite Scroll)



\## 📝 What I Built

Today I built an infinite scroll feed with pagination using Intersection Observer.



\*\*Live Demo:\*\* https://hithashree-git.github.io/50-Days-Web-Challenge/Day-31/



\## 📸 Screenshots



\### 💻 Code View

!\[Day 31 Code](screenshots/day31-code.png)



\### 🌐 Browser Output

!\[Day 31 Output](screenshots/day31-output.png)



\### 📜 Infinite Scroll

!\[Infinite Scroll](screenshots/day31-scroll.png)



\## 🔑 Key Learnings



\### 1. Pagination Parameters

```javascript

let currentPage = 1;

const limit = 10;



const response = await fetch(

&#x20;   `https://jsonplaceholder.typicode.com/posts?\_page=${currentPage}\&\_limit=${limit}`

);

let isLoading = false;



if (isLoading) return;

isLoading = true;

// ... fetch data

isLoading = false;

let isLoading = false;



if (isLoading) return;

isLoading = true;

// ... fetch data

isLoading = false;

const observer = new IntersectionObserver((entries) => {

&#x20;   if (entries\[0].isIntersecting) {

&#x20;       currentPage++;

&#x20;       fetchNextPage();

&#x20;   }

}, { rootMargin: '200px' });

if (data.length === 0) {

&#x20;   hasMoreData = false;

&#x20;   sentinel.textContent = "You've reached the end of the feed.";

&#x20;   observer.disconnect();

}



