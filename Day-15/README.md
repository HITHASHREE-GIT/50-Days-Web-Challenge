\# Day 15: Array Filtering \& Real-Time Search (Data Manipulation)



\## 📝 What I Built

Today I built a real-time search filter for the initiatives gallery using JavaScript's .filter() method and the 'input' event.



\## 📸 Screenshots



\### 💻 Code View

!\[Day 15 Code](screenshots/day15-code.png)



\### 🌐 Browser Output

!\[Day 15 Output](screenshots/day15-output.png)



\## 🔑 Key Learnings



\### 1. Reusable Render Function

```javascript

function renderProjects(dataArray) {

&#x20;   gridContainer.innerHTML = '';  // Clear first!

&#x20;   dataArray.forEach(project => {

&#x20;       // Build and inject HTML

&#x20;   });

}

Search Input Event

searchInput.addEventListener('input', function() {

&#x20;   const searchTerm = this.value.toLowerCase();

&#x20;   // Filter and render

});

Array .filter() Method

const filtered = projectsData.filter(project => {

&#x20;   return project.title.toLowerCase().includes(searchTerm);

});

Case-Insensitive Search

// Normalize both strings to lowercase

project.title.toLowerCase().includes(searchTerm)

No Results State (Bonus)

if (dataArray.length === 0) {

&#x20;   // Show "No results found" message

}







