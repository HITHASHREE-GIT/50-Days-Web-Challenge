# Day 35: API Security & Authentication (Bearer Tokens)

## 📝 What I Built
Today I added Bearer Token authentication to secure API requests.

**Live Demo:** https://hithashree-git.github.io/50-Days-Web-Challenge/Day-35/

## 📸 Screenshots

### 💻 Code View
![Day 35 Code](screenshots/day35-code.png)

### 🌐 Browser Output
![Day 35 Output](screenshots/day35-output.png)

### 🔒 Authentication UI
![Auth Status](screenshots/day35-auth.png)

### ✅ Secure Delete Success
![Secure Delete](screenshots/day35-delete.png)

## 🔑 Key Learnings

### 1. Bearer Token Authentication
```javascript
const headers = {
    'Authorization': `Bearer ${token}`  // Note the space!
};
function getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    if (!token) {
        throw new Error("No authentication token found.");
    }
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}
const response = await fetch(url, {
    method: 'DELETE',
    headers: getAuthHeaders()
});

if (response.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('auth_token');
    throw new Error("Session expired. Please log in again.");
}
Challenges Faced

Challenge: Forgetting the space after "Bearer"

    Solution: Bearer ${token} (with space!)

Challenge: 401 errors

    Solution: Clear token and prompt re-login
    Features Implemented

    ☑

    Bearer Token authentication
    ☑

    Auth headers utility
    

    Login/Logout simulation
    

    401 Unauthorized handling
    

    403 Forbidden handling
    

    Secure DELETE request
     Links

    GitHub: https://github.com/HITHASHREE-GIT/50-Days-Web-Challenge

    Live Demo: https://hithashree-git.github.io/50-Days-Web-Challenge/Day-35/