\# Day 18: Timers, Intervals \& The Event Loop (Dynamic Carousel)



\## 📝 What I Built

Today I built an auto-rotating testimonial carousel using setInterval() and the browser's Event Loop.



\## 📸 Screenshots



\### 💻 Code View

!\[Day 18 Code](screenshots/day18-code.png)



\### 🌐 Browser Output

!\[Day 18 Output](screenshots/day18-output.png)



\### 🔄 Carousel in Action

!\[Carousel](screenshots/day18-carousel.png)



\## 🔑 Key Learnings



\### 1. setInterval for Auto-Rotation

```javascript

const timer = setInterval(updateTestimonial, 3000);



&#x20;Array Index Tracking

javascript



let currentIndex = 0;

const currentData = testimonialsData\[currentIndex];

currentIndex++;

if (currentIndex >= data.length) currentIndex = 0;



clearInterval to Stop

javascript



clearInterval(carouselTimer);



. Manual Controls (Bonus)

javascript



prevBtn.addEventListener('click', function() {

&#x20;   clearInterval(carouselTimer);

&#x20;   currentIndex--;

&#x20;   updateTestimonial();

&#x20;   setTimeout(startAutoPlay, 5000);

});









