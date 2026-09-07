# Day 44: Reactive Web Components & Memory Management

## 📝 What I Built
Today I built reactive Web Components that subscribe to global state and clean up properly to prevent memory leaks.

**Live Demo:** https://hithashree-git.github.io/50-Days-Web-Challenge/Day-44/

## 📸 Screenshots

### 💻 Code View
![Day 44 Code](screenshots/day44-code.png)

### 🌐 Browser Output
![Day 44 Output](screenshots/day44-output.png)

### 🔄 Reactive Store
![Reactive Store](screenshots/day44-store.png)

## 🔑 Key Learnings

### 1. Subscribe in connectedCallback
```javascript
connectedCallback() {
    this.unsubscribe = globalStore.subscribe((state) => {
        this.updateUI(state.cartCount);
    });
}
2. Memory Cleanup in disconnectedCallback
javascript

disconnectedCallback() {
    if (this.unsubscribe) {
        this.unsubscribe(); // Prevents memory leaks!
    }
}

3. Initial State on Mount
javascript

connectedCallback() {
    const initialState = globalStore.getState();
    this.updateUI(initialState.cartCount); // No 0 flash!
}

4. Publisher Component
javascript

btn.addEventListener('click', () => {
    const current = globalStore.getState().cartCount || 0;
    globalStore.setState({ cartCount: current + 1 });
});

🧩 Challenges Faced

Challenge: Shadow DOM queries

    Solution: Use this.shadowRoot.querySelector(), not document.querySelector()

Challenge: this context in callbacks

    Solution: Use arrow functions for callbacks

Challenge: Memory leaks

    Solution: Unsubscribe in disconnectedCallback()

🎯 Features Implemented

    ☑

    Reactive Web Components
    ☑

    Store subscription in connectedCallback
    ☑

    Memory cleanup in disconnectedCallback
    ☑

    Initial state on mount (no flash)
    ☑

    Publisher components
    ☑

    Toggle counter (test cleanup)
    ☑

    Memory leak detection

🔗 Links

    GitHub: https://github.com/HITHASHREE-GIT/50-Days-Web-Challenge

    Live Demo: https://hithashree-git.github.io/50-Days-Web-Challenge/Day-44/