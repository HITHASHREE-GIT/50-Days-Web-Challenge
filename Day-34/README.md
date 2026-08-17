# Day 34: Network Resilience (Retries & Exponential Backoff)

## 📝 What I Built
Today I added automatic retry logic with exponential backoff to make network requests resilient to temporary failures.

## 📸 Screenshots

### 💻 Code View
![Day 34 Code](screenshots/day34-code.png)

### 🌐 Browser Output
![Day 34 Output](screenshots/day34-output.png)

### 🔄 Retry Status
![Retry Status](screenshots/day34-retry.png)

## 🔑 Key Learnings

### 1. Exponential Backoff
```javascript
// Wait 500ms, then 1000ms, then 2000ms
backoff *= 2;