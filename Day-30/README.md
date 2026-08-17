\# Day 30: Completing the Cycle (PUT \& DELETE Requests)



\## 📝 What I Built

Today I completed the full CRUD cycle with PUT (Update) and DELETE (Remove) requests.



\*\*Live Demo:\*\* https://hithashree-git.github.io/50-Days-Web-Challenge/Day-30/



\## 📸 Screenshots



\### 💻 Code View

!\[Day 30 Code](screenshots/day30-code.png)



\### 🌐 Browser Output

!\[Day 30 Output](screenshots/day30-output.png)



\### 🗑️ Delete Confirmation

!\[Delete Confirmation](screenshots/day30-delete.png)



\## 🔑 Key Learnings



\### 1. PUT Request (Update)

```javascript

const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {

&#x20;   method: 'PUT',

&#x20;   headers: {

&#x20;       'Content-type': 'application/json; charset=UTF-8',

&#x20;   },

&#x20;   body: JSON.stringify(updatedData)

});

const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {

&#x20;   method: 'DELETE'

});

if (window.confirm("Are you sure you want to delete this?")) {

&#x20;   deleteInitiative(id);

}

