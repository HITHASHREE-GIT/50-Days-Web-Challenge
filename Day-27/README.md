# Day 27: API Array Iteration & Dynamic Feeds

## 📝 What I Built
Today I expanded the GitHub lookup tool to fetch and display a user's recent repositories as a dynamic grid.

**Live Demo:** https://hithashree-git.github.io/50-Days-Web-Challenge/Day-27/

## 📸 Screenshots

### 💻 Code View
![Day 27 Code](screenshots/day27-code.png)

### 🌐 Browser Output
![Day 27 Output](screenshots/day27-output.png)

### 📦 Repository Grid
![Repositories Grid](screenshots/day27-repos.png)

### 📭 Empty State
![Empty State](screenshots/day27-empty.png)

## 🔑 Key Learnings

### 1. Fetching Repository Arrays
```javascript
const response = await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`
);
const repos = await response.json();