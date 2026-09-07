# Day 42: UI Architecture (Native Web Components)

## 📝 What I Built
Today I built reusable Web Components using the native Custom Elements API and Shadow DOM.

**Live Demo:** https://hithashree-git.github.io/50-Days-Web-Challenge/Day-42/

## 📸 Screenshots

### 💻 Code View
![Day 42 Code](screenshots/day42-code.png)

### 🌐 Browser Output
![Day 42 Output](screenshots/day42-output.png)

### 🧩 Web Components
![Web Components](screenshots/day42-components.png)

## 🔑 Key Learnings

### 1. Custom Element Registration
```javascript
class UserCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
}
window.customElements.define('user-card', UserCard);