\# Day 19: Event Delegation \& Bubbling (Dynamic Modals)



\## 📝 What I Built

Today I built a dynamic modal system using Event Delegation. Only ONE event listener handles all "View Details" buttons!



\## 📸 Screenshots



\### 💻 Code View

!\[Day 19 Code](screenshots/day19-code.png)



\### 🌐 Browser Output

!\[Day 19 Output](screenshots/day19-output.png)



\### 🔍 Modal Open

!\[Modal Open](screenshots/day19-modal.png)



\## 🔑 Key Learnings



\### 1. Event Delegation

```javascript

// Attach ONE listener to parent

gridContainer.addEventListener('click', function(e) {

&#x20;   const button = e.target.closest('.view-btn');

&#x20;   if (!button) return;

&#x20;   // Handle click

});

2\. Event Bubbling



Events bubble up from child to parent elements

3\. e.target vs e.currentTarget



&#x20;   e.target - The element that was clicked



&#x20;   e.currentTarget - The element the listener is on



4\. Modal Controls

javascript



// Open

modal.style.display = 'flex';



// Close

modal.style.display = 'none';



// Escape key

document.addEventListener('keydown', function(e) {

&#x20;   if (e.key === 'Escape') closeModal();

});

