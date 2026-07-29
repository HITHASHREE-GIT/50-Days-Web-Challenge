\# Day 12: State Manipulation \& Dynamic Menus (Mobile Navigation)



\## 📝 What I Built

Today I built a fully functional mobile hamburger menu toggle using JavaScript classList manipulation.



\## 📸 Screenshots



\### 💻 Code View

!\[Day 12 Code](screenshots/day12-code.png)



\### 🌐 Browser Output

!\[Day 12 Output](screenshots/day12-output.png)



\## 🔑 Key Learnings



\### 1. Mobile Menu Architecture

```html

<button class="menu-toggle" aria-label="Toggle menu">

&#x20;   <span class="bar"></span>

&#x20;   <span class="bar"></span>

&#x20;   <span class="bar"></span>

</button>

<ul class="nav-links">

&#x20;   <li><a href="#">Link</a></li>

</ul>



2\. JavaScript Toggle Logic

const menuToggle = document.querySelector('.menu-toggle');

const navLinks = document.querySelector('nav ul');



menuToggle.addEventListener('click', () => {

&#x20;   navLinks.classList.toggle('nav-active');

&#x20;   menuToggle.classList.toggle('active');

});



3\. CSS State Management

/\* Hidden by default on mobile \*/

nav ul {

&#x20;   display: none;

}



/\* Shown when active class is added \*/

nav ul.nav-active {

&#x20;   display: flex;

}



Bonus: Hamburger to X Morph

.m

