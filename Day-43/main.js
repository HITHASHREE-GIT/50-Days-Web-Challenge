/* ========================================== */
/* main.js: UI Bindings & Store Demo          */
/* ========================================== */

import { globalStore } from './store.js';

console.log('🚀 TechNova Engine Initialized - Day 43: Global State Management');

// ============================================================ */
// 1. DOM SELECTION
// ============================================================ */

const stateDisplay = document.getElementById('state-display');
const subscriberCount = document.getElementById('subscriber-count');
const historyCount = document.getElementById('history-count');
const resetStateBtn = document.getElementById('reset-state-btn');
const logStateBtn = document.getElementById('log-state-btn');
const testStateBtn = document.getElementById('test-state-btn');
const stateFeedback = document.getElementById('state-feedback');

// ============================================================ */
// 2. UPDATE STATE INFO DISPLAY
// ============================================================ */

function updateStateInfo() {
    const state = globalStore.getState();
    const subscribers = globalStore.getSubscriberCount();
    const history = globalStore.getHistory();
    
    if (stateDisplay) {
        stateDisplay.textContent = JSON.stringify(state, null, 2);
        // Truncate if too long
        if (stateDisplay.textContent.length > 50) {
            stateDisplay.textContent = stateDisplay.textContent.substring(0, 50) + '...';
        }
    }
    
    if (subscriberCount) {
        subscriberCount.textContent = subscribers;
    }
    
    if (historyCount) {
        historyCount.textContent = history.length;
    }
}

// ============================================================ */
// 3. SUBSCRIBE TO STORE CHANGES
// ============================================================ */

globalStore.subscribe((state) => {
    updateStateInfo();
    console.log('📊 UI updated with new state:', state);
});

// ============================================================ */
// 4. STATE INFO - INITIAL UPDATE
// ============================================================ */

updateStateInfo();

// ============================================================ */
// 5. THEME TOGGLE
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
// 6. MOBILE MENU TOGGLE
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
// 7. HERO BUTTON
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
// 8. FORM VALIDATION
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

// ============================================================ */
// 9. STATE MANAGEMENT UI CONTROLS
// ============================================================ */

if (resetStateBtn) {
    resetStateBtn.addEventListener('click', function() {
        globalStore.resetState();
        globalStore.setState({ cartCount: 0 });
        if (stateFeedback) {
            stateFeedback.className = 'state-feedback info';
            stateFeedback.textContent = '🔄 State has been reset';
            setTimeout(() => {
                stateFeedback.className = 'state-feedback';
                stateFeedback.textContent = '';
            }, 3000);
        }
    });
}

if (logStateBtn) {
    logStateBtn.addEventListener('click', function() {
        const state = globalStore.getState();
        const history = globalStore.getHistory();
        console.log('📊 Current State:', state);
        console.log('📜 History:', history);
        if (stateFeedback) {
            stateFeedback.className = 'state-feedback info';
            stateFeedback.textContent = '📊 State logged to console (F12)';
            setTimeout(() => {
                stateFeedback.className = 'state-feedback';
                stateFeedback.textContent = '';
            }, 3000);
        }
    });
}

if (testStateBtn) {
    testStateBtn.addEventListener('click', function() {
        // Test multiple updates in sequence
        let count = 0;
        const interval = setInterval(() => {
            count++;
            const current = globalStore.getState().cartCount || 0;
            globalStore.setState({ cartCount: current + 1 });
            
            if (count >= 5) {
                clearInterval(interval);
                if (stateFeedback) {
                    stateFeedback.className = 'state-feedback success';
                    stateFeedback.textContent = '✅ 5 rapid updates completed!';
                    setTimeout(() => {
                        stateFeedback.className = 'state-feedback';
                        stateFeedback.textContent = '';
                    }, 3000);
                }
            }
        }, 500);
    });
}

// ============================================================ */
// 10. INITIALIZATION
// ============================================================ */

console.log('✅ Day 43 fully loaded!');
console.log('🧠 Global State Management with Pub/Sub pattern active!');
console.log('💡 Click the Add/Remove buttons to see the state sync across components!');