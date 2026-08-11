# Day 26: Asynchronous JavaScript & External APIs

## 📝 What I Built
Today I built a GitHub Contributor Lookup tool that fetches real-time profile data from the GitHub API.

## 📸 Screenshots

### 💻 Code View
![Day 26 Code](screenshots/day26-code.png)

### 🌐 Browser Output
![Day 26 Output](screenshots/day26-output.png)

### ✅ Successful API Call
![GitHub Profile](screenshots/day26-profile.png)

### ❌ Error Handling
![Error State](screenshots/day26-error.png)

## 🔑 Key Learnings

### 1. Async/Await Syntax
```javascript
async function fetchData(username) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        const data = await response.json();
        // Use data
    } catch (error) {
        // Handle error
    }
}