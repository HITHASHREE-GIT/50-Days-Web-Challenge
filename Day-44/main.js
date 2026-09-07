/* ========================================== */
/* main.js: UI Bindings & Store Demo          */
/* ========================================== */

import { globalStore } from './store.js';

console.log('🚀 TechNova Engine Initialized - Day 44: Reactive Web Components');

// ============================================================ */
// 1. DOM SELECTION
// ============================================================ */

const stateDisplay = document.getElementById('state-display');
const subscriberCount = document.getElementById('subscriber-count');
const memoryStatus = document.getElementById('memory-status');
const toggleCounterBtn = document.getElementById('toggle-counter-btn');
const resetStoreBtn = document.getElementById('reset-store-btn');
const addMultipleBtn = document.getElementById('add-multiple-btn');
const storeFeedback = document.getElementById('store-feedback');

let counterVisible = true;

// ============================================================ */
// 2. UPDATE STORE INFO
// ============================================================ */

function updateStoreInfo() {
    const state = globalStore.getState();
    const subscribers = globalStore.getSubscriberCount();
    const history = globalStore.getHistory();
    
    if (stateDisplay) {
        const stateStr = JSON.stringify(state);
        stateDisplay.textContent = stateStr.length > 40 ? stateStr.substring(0, 40) + '...' : stateStr;
    }
    
    if (subscriberCount) {
        subscriberCount.textContent = subscribers;
    }
    
    if (memoryStatus) {
        // Check if there are any potential memory leaks
        // If subscribers > 0 but no components visible, there might be a leak
        const cartCounter = document.querySelector('cart-counter');
        if (!cartCounter && subscribers > 0) {
            memoryStatus.textContent = '⚠️ Possible Leak';
            memoryStatus.style.color = 'var(--error-color)';
        } else {
            memoryStatus.textContent = '✅ Clean';
            memoryStatus.style.color = 'var(--success-color)';
        }
    }
}

// ============================================================ */
// 3. SUBSCRIBE TO STORE CHANGES
// ============================================================ */

globalStore.subscribe((state) => {
    updateStoreInfo();
});

// ============================================================ */
// 4. INITIAL UPDATE
// ============================================================ */

updateStoreInfo();

// ============================================================ */
// 5. TOGGLE CART COUNTER (Test Memory Cleanup)
// ============================================================ */

if (toggleCounterBtn) {
    toggleCounterBtn.addEventListener('click', function() {
        const counter = document.querySelector('cart-counter');
        const storeHeader = document.querySelector('.store-header');
        
        if (counter) {
            counter.remove();
            counterVisible = false;
            this.textContent = '👁️ Show Cart Counter';
            showFeedback('🛒 Cart counter removed - memory cleaned up!', 'info');
            console.log('🧹 Cart counter removed from DOM');
        } else {
            const newCounter = document.createElement('cart-counter');
            storeHeader.appendChild(newCounter);
            counterVisible = true;
            this.textContent = '👁️ Toggle Cart Counter';
            showFeedback('🛒 Cart counter re-added!', 'success');
            console.log('🛒 Cart counter re-added to DOM');
        }
        updateStoreInfo();
    });
}

// ============================================================ */
// 6. RESET STORE
// ============================================================ */

if (resetStoreBtn) {
    resetStoreBtn.addEventListener('click', function() {
        globalStore.resetState();
        globalStore.setState({ cartCount: 0 });
        showFeedback('🔄 Store has been reset', 'info');
    });
}

// ============================================================ */
// 7. ADD MULTIPLE ITEMS
// ============================================================ */

if (addMultipleBtn) {
    addMultipleBtn.addEventListener('click', function() {
        let count = 0;
        const interval = setInterval(() => {
            count++;
            const current = globalStore.getState().cartCount || 0;
            globalStore.setState({ cartCount: current + 1 });
            
            if (count >= 5) {
                clearInterval(interval);
                showFeedback('✅ Added 5 items to cart!', 'success');
            }
        }, 300);
    });
}

// ============================================================ */
// 8. SHOW FEEDBACK
// ============================================================ */

function showFeedback(message, type = 'info') {
    if (!storeFeedback) return;
    storeFeedback.textContent = message;
    storeFeedback.className = 'store-feedback ' + type;
    setTimeout(() => {
        storeFeedback.className = 'store-feedback';
        storeFeedback.textContent = '';
    }, 3000);
}

// ============================================================ */
// 9. THEME TOGGLE
// ============================================================ */

const STORAGE_THEME_KEY = 'synexus_theme';
const themeToggleBtn = document.getElementById('theme-toggle');

const currentTheme = localStorage.getItem(STORAGE_THEME_KEY);
if (currentTheme === 'dark') {
    document.body.classList.add('dark-theme');
    if (themeToggleBtn) themeToggleBtn.textContent = '☀️';
    globalStore.setState({ theme: 'dark' });
} else if (currentTheme === 'light') {
    document.body.classList.remove('dark-theme');
    if (themeToggleBtn) themeToggleBtn.textContent = '🌙';
    globalStore.setState({ theme: 'light' });
} else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    if (prefersDark.matches) {
        document.body.classList.add('dark-theme');
        if (themeToggleBtn) themeToggleBtn.textContent = '☀️';
        localStorage.setItem(STORAGE_THEME_KEY, 'dark');
        globalStore.setState({ theme: 'dark' });
    }
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
        localStorage.setItem(STORAGE_THEME_KEY, theme);
        themeToggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
        globalStore.setState({ theme: theme });
    });
}

// ============================================================ */
// 10. MOBILE MENU TOGGLE
// ============================================================ */

const menuToggle = document.querySelector('.menu-toggle');
const navLinksContainer = document.querySelector('nav ul');

if (menuToggle && navLinksContainer) {
    menuToggle.addEventListener('click', function() {
        navLinksContainer.classList.toggle('nav-active');
        menuToggle.classList.toggle('active');
        const isExpanded = navLinksContainer.classList.contains('nav-active');
        menuToggle.setAttribute('aria-expanded', isExpanded);
    });
}

// ============================================================ */
// 11. HERO BUTTON
// ============================================================ */

const heroButton = document.getElementById('heroButton');
const heroHeadline = document.querySelector('.hero-section h1');

if (heroButton && heroHeadline) {
    heroButton.addEventListener('click', function() {
        const original = 'Empowering the Next Generation of Engineers';
        const newText = 'Welcome to the TechNova Core! 🎉';
        if (heroHeadline.textContent === original) {
            heroHeadline.textContent = newText;
        } else {
            heroHeadline.textContent = original;
        }
        heroHeadline.classList.toggle('active-state');
    });
}

// ============================================================ */
// 12. FORM VALIDATION
// ============================================================ */

const membershipForm = document.getElementById('membershipForm');
const nameInput = document.getElementById('fullName');
const emailInput = document.getElementById('emailAddress');
const motivationInput = document.getElementById('motivation');
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const draftIndicator = document.getElementById('draft-indicator');

function showError(input, errorElement, message) {
    input.classList.add('error');
    input.classList.remove('success');
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function showSuccess(input, errorElement) {
    input.classList.remove('error');
    input.classList.add('success');
    errorElement.classList.remove('show');
}

function clearValidation() {
    document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
        input.classList.remove('error', 'success');
    });
    document.querySelectorAll('.error-message').forEach(error => {
        error.classList.remove('show');
        error.textContent = '';
    });
    const successMsg = document.querySelector('.success-message');
    if (successMsg) successMsg.classList.remove('show');
}

if (membershipForm) {
    membershipForm.addEventListener('submit', function(e) {
        e.preventDefault();
        clearValidation();
        const nameValue = nameInput.value.trim();
        const emailValue = emailInput.value.trim();
        const motivationValue = motivationInput.value.trim();
        
        let isValid = true;
        if (nameValue === '') { showError(nameInput, nameError, 'Full name is required.'); isValid = false; }
        else if (nameValue.length < 2) { showError(nameInput, nameError, 'Name must be at least 2 characters.'); isValid = false; }
        else { showSuccess(nameInput, nameError); }
        
        if (emailValue === '') { showError(emailInput, emailError, 'Email address is required.'); isValid = false; }
        else if (!emailValue.includes('@')) { showError(emailInput, emailError, 'Please enter a valid email address.'); isValid = false; }
        else { showSuccess(emailInput, emailError); }
        
        if (isValid) {
            console.log('✅ SUCCESS! Application submitted!');
            const successMsg = document.createElement('div');
            successMsg.className = 'success-message show';
            successMsg.textContent = `✅ Thank you ${nameValue}! Your application has been submitted successfully!`;
            const existingSuccess = document.querySelector('.success-message');
            if (existingSuccess) existingSuccess.remove();
            const submitButton = document.querySelector('.btn-submit');
            submitButton.parentNode.insertBefore(successMsg, submitButton.nextSibling);
            membershipForm.reset();
            setTimeout(() => {
                clearValidation();
                setTimeout(() => {
                    const msg = document.querySelector('.success-message');
                    if (msg) { msg.classList.remove('show'); setTimeout(() => msg.remove(), 300); }
                }, 5000);
            }, 100);
        }
    });
}

console.log('✅ Day 44 fully loaded!');
console.log('🔄 Reactive Web Components with memory management active!');
console.log('💡 Click "Toggle Cart Counter" to see memory cleanup in action!');