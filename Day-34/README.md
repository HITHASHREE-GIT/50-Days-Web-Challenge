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
2. Retry Loop with State Lock
javascript

export async function fetchWithRetry(url, options = {}, retries = 3, backoff = 500) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            if (response.ok) return response;
        } catch (error) {
            if (i === retries - 1) throw error;
            await sleep(backoff);
            backoff *= 2; // Exponential magic!
        }
    }
}

3. Client Error Detection (Don't Retry)
javascript

// 400-level errors are client errors - retrying won't help
if (response.status >= 400 && response.status < 500) {
    return response; // Let api.js handle it
}

4. Offline Detection
javascript

// Check if user is completely offline
if (!navigator.onLine) {
    throw new Error("No internet connection detected.");
}

5. Promise-based Delay
javascript

// Pause execution for a specific time
await new Promise(resolve => setTimeout(resolve, backoff));