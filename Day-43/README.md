# Day 43: Global State Management (The Pub/Sub Pattern)

## 📝 What I Built
Today I built a global state management system using the Pub/Sub pattern with Vanilla JavaScript.

**Live Demo:** https://hithashree-git.github.io/50-Days-Web-Challenge/Day-43/

## 📸 Screenshots

### 💻 Code View
![Day 43 Code](screenshots/day43-code.png)

### 🌐 Browser Output
![Day 43 Output](screenshots/day43-output.png)

### 🧠 State Management Demo
![State Demo](screenshots/day43-demo.png)

## 🔑 Key Learnings

### 1. StateStore Class
```javascript
class StateStore {
    constructor(initialState) {
        this.state = initialState;
        this.listeners = [];
    }
}
2. Subscribe Pattern
javascript

subscribe(listener) {
    this.listeners.push(listener);
    return () => {
        this.listeners = this.listeners.filter(l => l !== listener);
    };
}
3. SetState & Broadcast
javascript

setState(newState) {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach(listener => listener(this.state));
}

4. Singleton Export
javascript

export const globalStore = new StateStore({ cartCount: 0 });

🧩 Challenges Faced

Challenge: Direct state mutation

    Solution: Always use setState() method

Challenge: Memory leaks from listeners

    Solution: Return unsubscribe function from subscribe()

🎯 Features Implemented

    ☑

    StateStore class
    ☑

    Subscribe/unsubscribe pattern
    ☑

    State broadcast to listeners
    ☑

    History tracking
    ☑

    Singleton export
    ☑

    Web Component integration
    ☑

    UI reactivity

🔗 Links

    GitHub: https://github.com/HITHASHREE-GIT/50-Days-Web-Challenge

    Live Demo: https://hithashree-git.github.io/50-Days-Web-Challenge/Day-43/