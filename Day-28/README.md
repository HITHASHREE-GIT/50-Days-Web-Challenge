# Day 28: Real-Time API Search & Network Throttling

## 📝 What I Built
Today I built a real-time search interface with debouncing to prevent API rate limiting.

**Live Demo:** https://hithashree-git.github.io/50-Days-Web-Challenge/Day-28/

## 📸 Screenshots

### 💻 Code View
![Day 28 Code](screenshots/day28-code.png)

### 🌐 Browser Output
![Day 28 Output](screenshots/day28-output.png)

### 🔍 Search Status
![Search Status](screenshots/day28-search.png)

## 🔑 Key Learnings

### 1. Debounce Pattern
```javascript
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}
input.addEventListener('input', debounce(() => {
    // Search logic
}, 500));
if (response.status === 403 || response.status === 429) {
    throw new Error("API Rate Limit exceeded.");
}