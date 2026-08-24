/* ========================================== */
/* main.js: UI Bindings & Dashboard Rendering */
/* ========================================== */

import { debounce, formatDate, truncateText } from './utils.js';
import { fetchDashboardData, fetchDashboardDataSettled } from './api.js';

console.log("🚀 TechNova Engine Initialized - Day 37: Promise.all");

// ============================================================ */
// 1. DOM SELECTION
// ============================================================ */

const searchInput = document.getElementById('username-search');
const dashboardContainer = document.getElementById('dashboard-view');
const searchStatus = document.getElementById('search-status');
const performanceStats = document.getElementById('performance-stats');

// ============================================================ */
// 2. UPDATE SEARCH STATUS
// ============================================================ */

function updateStatus(status, message) {
    if (!searchStatus) return;
    searchStatus.textContent = message;
    searchStatus.className = 'search-status';
    if (status) {
        searchStatus.classList.add(status);
    }
}

// ============================================================ */
// 3. DASHBOARD RENDER FUNCTION
// ============================================================ */

async function renderDashboard() {
    const username = searchInput.value.trim();
    if (!username) {
        dashboardContainer.innerHTML = `
            <div class="placeholder-state">
                <span class="placeholder-icon">📊</span>
                <p>Enter a GitHub username to load the dashboard</p>
            </div>
        `;
        performanceStats.innerHTML = '';
        updateStatus('', 'Ready');
        return;
    }

    updateStatus('fetching', '⏳ Loading...');
    dashboardContainer.innerHTML = `
        <div class="loading-state">
            <div class="loading-spinner"></div>
            <p class="loading-text">Assembling dashboard with parallel requests...</p>
        </div>
    `;
    performanceStats.innerHTML = '';

    try {
        // Fetch everything in one highly optimized parallel blast
        const startTime = performance.now();
        const dashboard = await fetchDashboardData(username);
        const endTime = performance.now();
        const loadTime = (endTime - startTime).toFixed(0);

        updateStatus('success', `✅ Loaded in ${loadTime}ms`);

        // --- 1. PROFILE SECTION ---
        let html = '';
        
        if (dashboard.profile) {
            const profile = dashboard.profile;
            html += `
                <div class="dashboard-header">
                    <img src="${profile.avatar_url}" alt="${profile.login}'s avatar">
                    <div>
                        <h2>${profile.name || profile.login}</h2>
                        <p>@${profile.login} • ${profile.bio || 'No bio available'}</p>
                        <p>📁 ${profile.public_repos} repos • 👥 ${profile.followers} followers • Following ${profile.following}</p>
                        ${profile.company ? `<p>🏢 ${profile.company}</p>` : ''}
                        ${profile.location ? `<p>📍 ${profile.location}</p>` : ''}
                    </div>
                </div>
            `;
        } else {
            html += `<div class="dashboard-header"><p>⚠️ Profile data unavailable</p></div>`;
        }

        // --- 2. REPOSITORIES SECTION ---
        html += `<h3 class="dashboard-section-title">📦 Recent Repositories</h3>`;
        html += `<div class="repo-grid">`;
        if (dashboard.recentRepos.length === 0) {
            html += `<p style="color: var(--text-muted); grid-column: 1 / -1;">No public repositories found.</p>`;
        } else {
            dashboard.recentRepos.forEach(repo => {
                html += `
                    <div class="repo-card">
                        <h4>${repo.name}</h4>
                        <p>${truncateText(repo.description || 'No description', 80)}</p>
                        <div class="repo-stats">
                            <span>⭐ ${repo.stargazers_count}</span>
                            <span>🍴 ${repo.forks_count}</span>
                            <span>🔄 ${repo.language || 'N/A'}</span>
                        </div>
                    </div>
                `;
            });
        }
        html += `</div>`;

        // --- 3. FOLLOWERS SECTION ---
        html += `<h3 class="dashboard-section-title">👥 Recent Followers</h3>`;
        html += `<div class="follower-grid">`;
        if (dashboard.recentFollowers.length === 0) {
            html += `<p style="color: var(--text-muted);">No followers found.</p>`;
        } else {
            dashboard.recentFollowers.forEach(follower => {
                html += `
                    <div class="follower-card">
                        <img src="${follower.avatar_url}" alt="${follower.login}">
                        <span>${follower.login}</span>
                    </div>
                `;
            });
        }
        html += `</div>`;

        // Inject the fully assembled dashboard
        dashboardContainer.innerHTML = html;

        // Show performance stats
        performanceStats.innerHTML = `
            ⚡ Dashboard loaded in <span class="highlight">${loadTime}ms</span> 
            with ${dashboard.recentRepos.length} repos and ${dashboard.recentFollowers.length} followers 
            (${dashboard.profile ? '✅ Profile OK' : '❌ Profile unavailable'})
        `;

    } catch (error) {
        console.error('❌ Dashboard Error:', error);
        updateStatus('error', '❌ Error');
        dashboardContainer.innerHTML = `
            <div class="error-state" style="text-align: center; padding: 2rem; color: var(--error-color);">
                <span style="font-size: 2rem; display: block;">⚠️</span>
                <p>${error.message}</p>
                <p style="font-size: 0.85rem; color: var(--text-muted);">Please check the username and try again.</p>
            </div>
        `;
        performanceStats.innerHTML = '';
    }
}

// ============================================================ */
// 4. EVENT BINDING
// ============================================================ */

if (searchInput) {
    const optimizedSearch = debounce(renderDashboard, 600);
    searchInput.addEventListener('input', optimizedSearch);
    console.log('✅ Dashboard search bound with debounce (600ms)');
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

console.log('✅ Day 37 fully loaded!');
console.log('⚡ Promise.all enabled - parallel network requests!');
console.log('💡 Type a username to see the dashboard load in parallel!');