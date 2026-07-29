/* ========================================== */
/* DAY 11: DOM FUNDAMENTALS & EVENTS          */
/* ========================================== */

// To ensure our script is running, let's log a message to the console.
// Press F12 in your browser and check the "Console" tab!
console.log("🚀 TechNova Engine Initialized. Ready for logic!");

// ============================================================ */
// 1. DOM SELECTION
// ============================================================ */

// Select the Hero heading (h1)
const heroHeadline = document.querySelector('.hero-section h1');
console.log("Hero Headline selected:", heroHeadline);

// Select the Hero button
const heroButton = document.querySelector('#heroButton');
console.log("Hero Button selected:", heroButton);

// Select the Hero section for additional effects
const heroSection = document.querySelector('.hero-section');

// Select the counter display (for bonus)
let clickCount = 0;

// ============================================================ */
// 2. EVENT LISTENER - Click on Hero Button
// ============================================================ */

heroButton.addEventListener('click', function() {
    console.log("🔘 Hero button clicked!");
    
    // ============================================================ */
    // 3. DOM MANIPULATION - Change Text Content
    // ============================================================ */
    
    // Change the text of the headline
    const originalText = "Empowering the Next Generation of Engineers";
    const newText = "Welcome to the TechNova Core! 🎉";
    
    if (heroHeadline.textContent === originalText) {
        heroHeadline.textContent = newText;
        console.log("✅ Headline changed to:", newText);
    } else {
        heroHeadline.textContent = originalText;
        console.log("✅ Headline changed back to:", originalText);
    }
    
    // ============================================================ */
    // 4. BONUS: Toggle CSS Class
    // ============================================================ */
    
    // Toggle the active-state class for color change
    heroHeadline.classList.toggle('active-state');
    console.log("🎨 Toggled active-state class");
    
    // ============================================================ */
    // 5. EXTRA: Button Text Feedback
    // ============================================================ */
    
    // Change button text to show action
    const buttonText = heroButton.textContent;
    if (buttonText === "Join Now") {
        heroButton.textContent = "✨ Joined!";
        setTimeout(() => {
            heroButton.textContent = "Join Now";
        }, 2000);
        console.log("✅ Button text changed to: Joined!");
    }
    
    // ============================================================ */
    // 6. EXTRA: Click Counter
    // ============================================================ */
    
    clickCount++;
    console.log(`📊 Button clicked ${clickCount} time(s)`);
    
    // Update a counter display if it exists
    const counterDisplay = document.querySelector('.click-counter');
    if (counterDisplay) {
        counterDisplay.textContent = `Clicks: ${clickCount}`;
    }
});

// ============================================================ */
// 7. EXTRA: Add a Click Counter Display Dynamically
// ============================================================ */

// Create a counter display element
const counterElement = document.createElement('p');
counterElement.className = 'click-counter';
counterElement.textContent = `Clicks: 0`;
counterElement.style.marginTop = '1rem';
counterElement.style.fontWeight = 'bold';
counterElement.style.color = 'var(--primary-color)';

// Insert it after the button
heroButton.parentNode.insertBefore(counterElement, heroButton.nextSibling);
console.log("📊 Counter display created");

// ============================================================ */
// 8. EXTRA: Keyboard Accessibility
// ============================================================ */

// Also trigger on Enter/Space key for accessibility
heroButton.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.click();
        console.log("⌨️ Button activated via keyboard");
    }
});

// ============================================================ */
// 9. EXTRA: Log DOM Ready
// ============================================================ */

console.log("✅ DOM fully loaded and script ready!");
console.log("ℹ️ Click the 'Join Now' button to see DOM manipulation in action!");

// ============================================================ */
// 10. EXTRA: Hamburger Menu Toggle (Mobile)
// ============================================================ */

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('nav ul');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('show');
        console.log("🍔 Hamburger menu toggled");
    });
}