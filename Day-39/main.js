/* ========================================== */
/* main.js: Service Worker Registration & UI  */
/* ========================================== */

import { debounce, formatDate, truncateText } from './utils.js';
import { fetchUserData, fetchRepos } from './api.js';

console.log("🚀 TechNova Engine Initialized - Day 39: Service Workers");

// ============================================================ */
// 1. DOM SELECTION
// ============================================================ */

const swStatus = document.getElementById('sw-status');
const cacheStatus = document.getElementById('cache-status');
const onlineStatus = document.getElementById('online-status');
const testOfflineBtn = document.getElementById('test-offline-btn');
const clearCacheBtn = document.getElementById('clear-cache-btn');
const showCacheBtn = document.getElementById('show-cache-btn');
const cacheDetails = document.getElementById('cache-details');
const cacheList = document.getElementById('cache-list');

// ============================================================ */
// 2. UPDATE STATUS UI
// ============================================================ */

function updateSwStatus(status, message) {
    if (!swStatus) return;
    const icon = swStatus.querySelector('.status-icon');
    const text = swStatus.querySelector('.status-text');
    swStatus.className = 'status-card';
    if (status === 'active') {
        swStatus.classList.add('active');
        icon.textContent = '✅';
        text.textContent = message || 'Service Worker active';
    } else if (status === 'error') {
        swStatus.classList.add('error');
        icon.textContent = '❌';
        text.textContent = message || 'Service Worker error';
    } else {
        icon.textContent = '⏳';
        text.textContent = message || 'Checking Service Worker...';
    }
}

function updateCacheStatus(status, message) {
    if (!cacheStatus) return;
    const icon = cacheStatus.querySelector('.status-icon');
    const text = cacheStatus.querySelector('.status-text');
    cacheStatus.className = 'status-card';
    if (status === 'active') {
        cacheStatus.classList.add('active');
        icon.textContent = '📦';
        text.textContent = message || 'Cache ready';
    } else if (status === 'error') {
        cacheStatus.classList.add('error');
        icon.textContent = '❌';
        text.textContent = message || 'Cache error';
    } else {
        icon.textContent = '📦';
        text.textContent = message || 'Cache status: Unknown';
    }
}

function updateOnlineStatus() {
    if (!onlineStatus) return;
    const icon = onlineStatus.querySelector('.status-icon');
    const text = onlineStatus.querySelector('.status-text');
    
    if (navigator.onLine) {
        onlineStatus.className = 'status-card active';
        icon.textContent = '🌐';
        text.textContent = 'Online - Connected to internet';
    } else {
        onlineStatus.className = 'status-card error';
        icon.textContent = '📴';
        text.textContent = 'Offline - No internet connection';
    }
}

// ============================================================ */
// 3. SERVICE WORKER REGISTRATION
// ============================================================ */

async function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
        updateSwStatus('error', 'Service Workers not supported in this browser');
        return;
    }

    try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('✅ Service Worker registered successfully:', registration);
        updateSwStatus('active', `Service Worker active (scope: ${registration.scope})`);
        
        // Check if there's an update waiting
        if (registration.waiting) {
            console.log('🔄 New Service Worker waiting to activate');
            registration.waiting.postMessage({ action: 'skipWaiting' });
        }
        
        // Check cache size
        await checkCacheSize();
        
    } catch (error) {
        console.error('⚠️ Service Worker registration failed:', error);
        updateSwStatus('error', `Registration failed: ${error.message}`);
    }
}

// ============================================================ */
// 4. CACHE MANAGEMENT
// ============================================================ */

async function checkCacheSize() {
    if (!('caches' in window)) {
        updateCacheStatus('error', 'Cache API not supported');
        return;
    }

    try {
        const cacheNames = await caches.keys();
        const totalFiles = [];
        
        for (const name of cacheNames) {
            const cache = await caches.open(name);
            const keys = await cache.keys();
            totalFiles.push(...keys);
        }
        
        if (totalFiles.length > 0) {
            updateCacheStatus('active', `Cache ready (${totalFiles.length} files cached)`);
        } else {
            updateCacheStatus('active', 'Cache empty - assets will be cached on first visit');
        }
        
        return totalFiles;
    } catch (error) {
        console.error('Error checking cache:', error);
        updateCacheStatus('error', 'Unable to check cache');
    }
}

async function clearCache() {
    if (!('caches' in window)) {
        alert('Cache API not supported');
        return;
    }

    if (!confirm('Are you sure you want to clear all cached files?')) return;

    try {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
        updateCacheStatus('active', 'Cache cleared successfully');
        cacheDetails.style.display = 'none';
        console.log('🧹 Cache cleared');
        alert('✅ Cache cleared successfully!');
    } catch (error) {
        console.error('Error clearing cache:', error);
        alert('❌ Error clearing cache');
    }
}

async function showCacheContents() {
    if (!('caches' in window)) {
        alert('Cache API not supported');
        return;
    }

    if (cacheDetails.style.display === 'block') {
        cacheDetails.style.display = 'none';
        return;
    }

    try {
        const cacheNames = await caches.keys();
        const items = [];
        
        for (const name of cacheNames) {
            const cache = await caches.open(name);
            const keys = await cache.keys();
            for (const request of keys) {
                const response = await cache.match(request);
                const size = response ? (await response.blob()).size : 0;
                items.push({
                    name: name,
                    url: request.url,
                    size: size
                });
            }
        }
        
        cacheList.innerHTML = '';
        if (items.length === 0) {
            cacheList.innerHTML = '<li>No cached files found</li>';
        } else {
            items.forEach(item => {
                const li = document.createElement('li');
                const sizeStr = item.size > 1024 ? `${(item.size / 1024).toFixed(1)} KB` : `${item.size} B`;
                li.innerHTML = `${item.url} <span class="file-size">${sizeStr}</span>`;
                cacheList.appendChild(li);
            });
        }
        
        cacheDetails.style.display = 'block';
        
    } catch (error) {
        console.error('Error showing cache:', error);
        alert('❌ Error showing cache contents');
    }
}

// ============================================================ */
// 5. THEME TOGGLE
// ============================================================ */

const STORAGE_THEME_KEY = 'synexus_theme';
const themeToggleBtn = document.getElementById('theme-toggle');

const currentTheme = localStorage.getItem(STORAGE_THEME_KEY);
if (currentTheme === 'dark') {
    document.body.classList.add('dark-theme');
    if (themeToggleBtn) themeToggleBtn.textContent = '☀️';
} else if (currentTheme === 'light') {
    document.body.classList.remove('dark-theme');
    if (themeToggleBtn) themeToggleBtn.textContent = '🌙';
} else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    if (prefersDark.matches) {
        document.body.classList.add('dark-theme');
        if (themeToggleBtn) themeToggleBtn.textContent = '☀️';
        localStorage.setItem(STORAGE_THEME_KEY, 'dark');
    }
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
        localStorage.setItem(STORAGE_THEME_KEY, theme);
        themeToggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
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
// 9. OFFLINE TEST
// ============================================================ */

function testOffline() {
    const isOnline = navigator.onLine;
    if (isOnline) {
        alert('🌐 You are currently online.\n\nTo test offline mode:\n1. Disable your Wi-Fi/network\n2. Refresh the page\n3. The app should still load from cache!\n\n(Re-enable network to go back online)');
    } else {
        alert('📡 You are currently OFFLINE!\n\n✅ The Service Worker is serving cached content.\n✅ The app should still work!\n\n(Re-enable network to go back online)');
    }
}

// ============================================================ */
// 10. INITIALIZATION
// ============================================================ */

async function initApp() {
    // Update online status
    updateOnlineStatus();
    
    // Register Service Worker
    await registerServiceWorker();
    
    // Set up event listeners
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    if (testOfflineBtn) {
        testOfflineBtn.addEventListener('click', testOffline);
    }
    
    if (clearCacheBtn) {
        clearCacheBtn.addEventListener('click', clearCache);
    }
    
    if (showCacheBtn) {
        showCacheBtn.addEventListener('click', showCacheContents);
    }
    
    console.log('✅ Day 39 fully loaded!');
    console.log('🦖 Offline architecture active with Service Workers!');
    console.log('💡 The app is now cached and will work offline!');
}

// ============================================================ */
// 11. WAIT FOR DOM TO LOAD
// ============================================================ */

document.addEventListener('DOMContentLoaded', initApp);