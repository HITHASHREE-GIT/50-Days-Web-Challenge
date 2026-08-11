\# Day 23: The HTML5 Drag and Drop API (Kanban Board)



\## 📝 What I Built

Today I built a fully functional Kanban Board using the native HTML5 Drag and Drop API.



\## 📸 Screenshots



\### 💻 Code View

!\[Day 23 Code](screenshots/day23-code.png)



\### 🌐 Browser Output

!\[Day 23 Output](screenshots/day23-output.png)



\### 📋 Kanban Board

!\[Kanban Board](screenshots/day23-kanban.png)



\## 🔑 Key Learnings



\### 1. Drag and Drop Events

```javascript

// Drag events on cards

card.addEventListener('dragstart', function() {

&#x20;   this.classList.add('is-dragging');

});



card.addEventListener('dragend', function() {

&#x20;   this.classList.remove('is-dragging');

});



