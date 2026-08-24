# Day 36: Deep Linking & URL Search Parameters

## 📝 What I Built
Today I added deep linking with URL search parameters for shareable application state.

**Live Demo:** https://hithashree-git.github.io/50-Days-Web-Challenge/Day-36/

## 📸 Screenshots

### 💻 Code View
![Day 36 Code](screenshots/day36-code.png)

### 🌐 Browser Output
![Day 36 Output](screenshots/day36-output.png)

### 🔗 URL Update
![URL Update](screenshots/day36-url.png)

### 🔗 Hydration on Load
![Hydration](screenshots/day36-hydrate.png)

## 🔑 Key Learnings

### 1. URLSearchParams API
```javascript
const params = new URLSearchParams(window.location.search);
const user = params.get('user');