# Day 41: Multithreading & Background Processing (Web Workers)

## 📝 What I Built
Today I built a multithreaded application using Web Workers to run heavy computations in the background without freezing the UI.

**Live Demo:** https://hithashree-git.github.io/50-Days-Web-Challenge/Day-41/

## 📸 Screenshots

### 💻 Code View
![Day 41 Code](screenshots/day41-code.png)

### 🌐 Browser Output
![Day 41 Output](screenshots/day41-output.png)

### 🧵 Worker Running
![Worker Running](screenshots/day41-running.png)

## 🔑 Key Learnings

### 1. Web Worker Setup
```javascript
const worker = new Worker('worker.js');
worker.postMessage('START');
worker.onmessage = (e) => console.log(e.data);
// worker.js
self.onmessage = function(e) {
    const result = heavyComputation();
    self.postMessage(result);
};
3. Thread Communication

    postMessage() sends data

    onmessage receives data

    terminate() kills the worker

🧩 Challenges Faced

Challenge: DOM access in worker

    Solution: Workers cannot access DOM - isolated environment

Challenge: CORS errors

    Solution: Use a local server (Live Server / Python HTTP)

🎯 Features Implemented

    ☑

    Web Worker setup
    ☑

    Background computation
    ☑

    Progress reporting
    ☑

    Cancel functionality
    ☑

    Terminate thread
    ☑

    UI remains responsive

🔗 Links

    GitHub: https://github.com/HITHASHREE-GIT/50-Days-Web-Challenge

    Live Demo: https://hithashree-git.github.io/50-Days-Web-Challenge/Day-41/

Created as part of the Synexus 50-Day Web Development Challenge