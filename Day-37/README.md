# Day 37: Parallel Network Architecture (Promise.all)

## 📝 What I Built
Today I optimized network requests with Promise.all to fetch multiple API endpoints in parallel.

**Live Demo:** https://hithashree-git.github.io/50-Days-Web-Challenge/Day-37/

## 📸 Screenshots

### 💻 Code View
![Day 37 Code](screenshots/day37-code.png)

### 🌐 Browser Output
![Day 37 Output](screenshots/day37-output.png)

### ⚡ Parallel Requests
![Parallel Requests](screenshots/day37-parallel.png)

### 📊 Dashboard
![Dashboard](screenshots/day37-dashboard.png)

## 🔑 Key Learnings

### 1. The Waterfall Problem (Sequential)
```javascript
// BAD: Requests happen one after another
const profile = await fetch('/user');
const repos = await fetch('/repos'); // Waits for profile
const followers = await fetch('/followers'); // Waits for repos
// GOOD: All requests start simultaneously
const [profile, repos, followers] = await Promise.all([
    fetch('/user'),
    fetch('/repos'),
    fetch('/followers')
]);
// BEST: Waits for all, even if some fail
const results = await Promise.allSettled([
    fetch('/user'),
    fetch('/repos'),
    fetch('/followers')
]);
🧩 Challenges Faced

Challenge: Awaiting JSON in map

    Solution: Promise.all(responses.map(res => res.json()))

Challenge: One failure kills all

    Solution: Use Promise.allSettled() for graceful degradation

🎯 Features Implemented

    ☑

    Parallel network requests
    ☑

    Promise.all for speed
    ☑

    Array destructuring
    ☑

    Performance metrics
    ☑

    Unified dashboard payload
    ☑

    Partial data support

📊 Performance Comparison
Method	Time	Description
Sequential	~900ms	One request at a time
Parallel	~350ms	All requests at once ⚡
🔗 Links

    GitHub: https://github.com/HITHASHREE-GIT/50-Days-Web-Challenge

    Live Demo: https://hithashree-git.github.io/50-Days-Web-Challenge/Day-37/