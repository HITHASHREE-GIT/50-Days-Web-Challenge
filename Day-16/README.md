\# Day 16: LocalStorage \& Client-Side Data Persistence



\## 📝 What I Built

Today I added LocalStorage persistence to the membership form so that data is saved automatically and restored on page refresh.



\## 📸 Screenshots



\### 💻 Code View

!\[Day 16 Code](screenshots/day16-code.png)



\### 🌐 Browser Output

!\[Day 16 Output](screenshots/day16-output.png)



\### 💾 Draft Saved Indicator

!\[Draft Saved](screenshots/day16-draft-saved.png)



\## 🔑 Key Learnings



\### 1. Saving to LocalStorage

```javascript

localStorage.setItem('key', JSON.stringify(data));



&#x20;Loading from LocalStorage

javascript



const saved = localStorage.getItem('key');

if (saved) {

&#x20;   const data = JSON.parse(saved);

&#x20;   // Restore data

}



. Real-time Auto-Save

javascript



input.addEventListener('input', function() {

&#x20;   // Save data on every keystroke

});





4\. Clear on Submit

javascript



localStorage.removeItem('key');



