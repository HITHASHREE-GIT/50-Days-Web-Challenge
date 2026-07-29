\# Day 13: Client-Side Form Validation \& Conditional Logic



\## 📝 What I Built

Today I built client-side form validation for the membership application using Vanilla JavaScript. The form now validates user input before submission.



\## 📸 Screenshots



\### 💻 Code View

!\[Day 13 Code](screenshots/day13-code.png)



\### 🌐 Browser Output

!\[Day 13 Output](screenshots/day13-output.png)



\## 🔑 Key Learnings



\### 1. Form Submission Interception

```javascript

form.addEventListener('submit', function(e) {

&#x20;   e.preventDefault();  // Stops page reload

});



function showError(input, errorElement, message) {

&#x20;   input.classList.add('error');

&#x20;   errorElement.textContent = message;

&#x20;   errorElement.classList.add('show');

}



🔗 Links



&#x20;   GitHub: https://github.com/HITHASHREE-GIT/50-Days-Web-Challenge

