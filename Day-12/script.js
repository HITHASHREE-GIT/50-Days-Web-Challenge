/* ========================================== */
/* DAY 12: MOBILE MENU TOGGLE LOGIC           */
/* ========================================== */

console.log("🚀 TechNova Engine Initialized - Day 12: Mobile Menu");

// ============================================================ */
// 1. SELECT TARGET COMPONENTS
// ============================================================ */

// The hamburger menu toggle button
const menuToggle = document.querySelector('.menu-toggle');

// The navigation links container
const navLinksContainer = document.querySelector('nav ul');

console.log("Menu toggle button:", menuToggle);
console.log("Nav links container:", navLinksContainer);

// ============================================================ */
// 2. INTERACTION BINDING
// ============================================================ */

// Check if elements exist to avoid runtime errors
if (menuToggle && navLinksContainer) {
    
    // Add click event listener to toggle button
    menuToggle.addEventListener('click', function() {
        console.log("🍔 Menu toggle clicked!");
        
        // ============================================================ */
        // 3. STATE MANIPULATION
        // ============================================================ */
        
        // Toggle the 'nav-active' class on the navigation links container
        navLinksContainer.classList.toggle('nav-active');
        console.log("✅ nav-active toggled:", navLinksContainer.classList.contains('nav-active'));
        
        // ============================================================ */
        // 4. BONUS: HAMBURGER MORPH TO X
        // ============================================================ */
        
        // Toggle 'active' class on the menu toggle button
        // This triggers the CSS animation to morph bars into an X
        menuToggle.classList.toggle('active');
        console.log("✅ menu-toggle active toggled:", menuToggle.classList.contains('active'));
        
        // ============================================================ */
        // 5. ACCESSIBILITY: ARIA EXPANDED
        // ============================================================ */
        
        // Update aria-expanded attribute for screen readers
        const isExpanded = navLinksContainer.classList.contains('nav-active');
        menuToggle.setAttribute('aria-expanded', isExpanded);
        console.log("✅ aria-expanded set to:", isExpanded);
    });
    
    // ============================================================ */
    // 6. EXTRA: Close menu when a link is clicked (on mobile)
    // ============================================================ */
    
    // Select all navigation links
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Only close if menu is open on mobile
            if (window.innerWidth <= 600 && navLinksContainer.classList.contains('nav-active')) {
                navLinksContainer.classList.remove('nav-active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                console.log("❌ Menu closed via link click");
            }
        });
    });
    
    // ============================================================ */
    // 7. EXTRA: Close menu on window resize (if going from mobile to desktop)
    // ============================================================ */
    
    window.addEventListener('resize', function() {
        // If window width is greater than 600px (desktop)
        if (window.innerWidth > 600) {
            // Remove all mobile menu classes
            if (navLinksContainer.classList.contains('nav-active')) {
                navLinksContainer.classList.remove('nav-active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                console.log("❌ Menu closed on resize to desktop");
            }
        }
    });
    
    console.log("✅ Mobile menu fully initialized!");

} else {
    console.error("❌ Menu toggle or nav links container not found!");
}

// ============================================================ */
// 8. EXTRA: Log instructions for testing
// ============================================================ */

console.log("ℹ️ To test the mobile menu:");
console.log("  1. Open Developer Tools (F12)");
console.log("  2. Click the 'Toggle Device Toolbar' icon (Ctrl+Shift+M)");
console.log("  3. Resize to mobile width (< 600px)");
console.log("  4. Click the ☰ hamburger menu button");
console.log("  5. Watch the menu appear/disappear!");