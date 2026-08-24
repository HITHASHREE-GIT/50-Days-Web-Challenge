# Day 40: Client-Side Databases (IndexedDB)

## 📝 What I Built
Today I built a client-side database using IndexedDB to store offline form submissions.

**Live Demo:** https://hithashree-git.github.io/50-Days-Web-Challenge/Day-40/

## 📸 Screenshots

### 💻 Code View
![Day 40 Code](screenshots/day40-code.png)

### 🌐 Browser Output
![Day 40 Output](screenshots/day40-output.png)

### 🗄️ IndexedDB Storage
![IndexedDB](screenshots/day40-db.png)

### 📡 Offline Save
![Offline Save](screenshots/day40-offline.png)

## 🔑 Key Learnings

### 1. IndexedDB Setup
```javascript
const request = indexedDB.open('PlatformDB', 1);

request.onupgradeneeded = (event) => {
    const db = event.target.result;
    db.createObjectStore('offline_proposals', { keyPath: 'id', autoIncrement: true });
};
const transaction = db.transaction(['offline_proposals'], 'readwrite');
const store = transaction.objectStore('offline_proposals');
store.add(payload);
const transaction = db.transaction(['offline_proposals'], 'readonly');
const store = transaction.objectStore('offline_proposals');
const request = store.getAll();
if (!navigator.onLine) {
    await saveOfflineData(payload);
    throw new Error('OFFLINE_SAVED');
}
🧩 Challenges Faced

Challenge: Callback-based API

    Solution: Wrap in Promise for async/await

Challenge: Schema changes

    Solution: Increment version number in open()

🎯 Features Implemented

    ☑

    IndexedDB database setup
    ☑

    Offline data storage
    ☑

    Offline data retrieval
    ☑

    Data sync on reconnect
    ☑

    Delete offline items
    ☑

    Connection status UI
    ☑

    Offline proposal list

🔗 Links

    GitHub: https://github.com/HITHASHREE-GIT/50-Days-Web-Challenge

    Live Demo: https://hithashree-git.github.io/50-Days-Web-Challenge/Day-40/