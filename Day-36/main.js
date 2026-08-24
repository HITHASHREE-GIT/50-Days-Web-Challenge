/* ========================================== */
/* main.js: UI Bindings & URL State Sync      */
/* ========================================== */

import { debounce, formatDate, truncateText } from './utils.js';
import { fetchUserProfile, fetchUserRepos, isUserCached } from './api.js';

console.log("🚀 TechNova Engine Initialized - Day 36: Deep Linking");

// ============================================================ */
// 1. DOM SELECTION
// ============================================================ */

const usernameInput = document.getElementById('github-username');
const profileContainer = document.getElementById('dev-profile-card');
const reposGrid = document.getElementById('repos-grid');
const searchStatus = document.getElementById('search-status');
const currentUrlDisplay = document.getElementById('current-url');

// ============================================================ */
// 2. UPDATE URL - WRITE STATE
// ============================================================ */

function updateURLParameter(key, value) {
    // Grab the current window location
    const url = new URL(window.location);
    
    if (value) {
        // Safely set or overwrite the parameter
        url.searchParams.set(key, value);
    } else {
        // Cleanly remove the parameter if the value is empty
        url.searchParams.delete(key);
    }
    
    // Update the address bar without refreshing the page!
    window.history.pushState({}, "", url);
    
    // Update the URL display
    updateUrlDisplay();
}

function updateUrlDisplay() {
    if (currentUrlDisplay) {
        const url = new URL(window.location);
        currentUrlDisplay.textContent = url.pathname + url.search || '/';
    }
}

// ============================================================ */
// 3. UPDATE SEARCH STATUS
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
// 4. REPOSITORY RENDER FUNCTION
// ============================================================ */

async function renderRepositories(username) {
    if (!reposGrid) return;
    
    reposGrid.innerHTML = `
        <div class="loading-state" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
            <div class="loading-spinner"></div>
            <p class="loading-text">Loading repositories...</p>
        </div>
    `;

    try {
        const data = await fetchUserRepos(username, 6);
        reposGrid.innerHTML = '';

        if (data.length === 0) {
            reposGrid.innerHTML = `
                <div class="placeholder-state" style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-muted);">
                    <span class="placeholder-icon">📂</span>
                    <p>No public repositories found for this user.</p>
                </div>
            `;
            return;
        }

        data.forEach(repo => {
            const repoCard = `
                <div class="initiative-card">
                    <h3>📁 ${repo.name}</h3>
                    <p>${truncateText(repo.description || 'No description provided.', 120)}</p>
                    <div class="repo-meta">
                        <span>⭐ ${repo.stargazers_count}</span>
                        <span>🍴 ${repo.forks_count}</span>
                        <span>🔄 ${repo.language || 'N/A'}</span>
                        ${repo.updated_at ? `<span>📅 ${formatDate(repo.updated_at)}</span>` : ''}
                    </div>
                    <a href="${repo.html_url}" target="_blank" class="btn-secondary" rel="noopener noreferrer">🔗 View Code</a>
                </div>
            `;
            reposGrid.innerHTML += repoCard;
        });

    } catch (error) {
        reposGrid.innerHTML = `
            <div class="error-state" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                <span class="error-icon">⚠️</span>
                <p>${error.message}</p>
            </div>
        `;
    }
}

// ============================================================ */
// 5. THE SEARCH HANDLER (With URL Sync)
// ============================================================ */

async function handleSearch(searchTerm) {
    // If we call this from the input event, grab the value.
    // If we call it from the URL load, use the passed term.
    const username = searchTerm || usernameInput.value.trim();
    
    if (!username) {
        profileContainer.innerHTML = `
            <div class="placeholder-state">
                <span class="placeholder-icon">👤</span>
                <p>Start typing to search for a GitHub user</p>
            </div>
        `;
        reposGrid.innerHTML = `
            <div class="placeholder-state" style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-muted);">
                <span class="placeholder-icon">📂</span>
                <p>Search for a user to see their repositories</p>
            </div>
        `;
        updateStatus('', 'Ready');
        updateURLParameter('user', null); // Clear the URL
        return;
    }

    // Ensure the input box reflects the term (critical for page load hydration)
    if (usernameInput) usernameInput.value = username;

    // Sync the URL with the active search
    updateURLParameter('user', username);
    updateStatus('fetching', '⏳ Fetching...');

    profileContainer.innerHTML = `
        <div class="loading-state">
            <div class="loading-spinner"></div>
            <p class="loading-text">${isUserCached(username) ? 'Loading from cache...' : 'Fetching data from GitHub...'}</p>
        </div>
    `;

    try {
        const data = await fetchUserProfile(username);
        updateStatus('success', '✅ Found!');

        profileContainer.innerHTML = `
            <div class="profile-result">
                <img src="${data.avatar_url}" alt="${data.name || data.login}'s Avatar">
                <div class="profile-info">
                    <h3>${data.name || data.login}</h3>
                    <p class="profile-username">@${data.login}</p>
                    <p class="profile-bio">${data.bio || 'No bio available.'}</p>
                    <div class="profile-stats">
                        <span>📁 Repos: <strong>${data.public_repos}</strong></span>
                        <span>👥 Followers: <strong>${data.followers}</strong></span>
                        <span>Following: <strong>${data.following}</strong></span>
                        ${data.created_at ? `<span>📅 Joined: ${formatDate(data.created_at)}</span>` : ''}
                    </div>
                    <a href="${data.html_url}" target="_blank" class="profile-link" rel="noopener noreferrer">🔗 View GitHub Profile</a>
                </div>
            </div>
        `;
        
        await renderRepositories(username);

    } catch (error) {
        console.error('❌ API Error:', error);
        updateStatus('error', '❌ Error');
        profileContainer.innerHTML = `
            <div class="error-state">
                <span class="error-icon">⚠️</span>
                <p>${error.message}</p>
                <p style="font-size: 0.85rem; margin-top: 0.5rem; color: var(--text-muted);">
                    Please check the username and try again.
                </p>
            </div>
        `;
        if (reposGrid) {
            reposGrid.innerHTML = `
                <div class="placeholder-state" style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-muted);">
                    <span class="placeholder-icon">📂</span>
                    <p>No repositories to display</p>
                </div>
            `;
        }
    }
}

// ============================================================ */
// 6. EVENT BINDING
// ============================================================ */

if (usernameInput) {
    const optimizedSearch = debounce(() => handleSearch(), 500);
    usernameInput.addEventListener('input', optimizedSearch);
    console.log('✅ Search input bound with debounce (500ms)');
}

// ============================================================ */
// 7. HYDRATE STATE ON PAGE LOAD (Read State)
// ============================================================ */

function initApp() {
    console.log("App Initialized. Checking URL for state...");
    
    // Parse the query strings from the URL (e.g., ?user=john)
    const params = new URLSearchParams(window.location.search);
    const userFromURL = params.get('user');
    
    // Update URL display
    updateUrlDisplay();
    
    // If the URL contains a user, immediately trigger the search!
    if (userFromURL) {
        console.log(`🔗 Found user in URL: "${userFromURL}"`);
        handleSearch(userFromURL);
    }
    
    console.log('✅ App initialized');
}

// ============================================================ */
// 8. THEME TOGGLE
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
// 9. MOBILE MENU TOGGLE
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
// 10. HERO BUTTON
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
// 11. FORM VALIDATION
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
// 12. INITIALIZE
// ============================================================ */

// Run the initialization sequence when the DOM is ready
document.addEventListener('DOMContentLoaded', initApp);

console.log('✅ Day 36 fully loaded!');
console.log('🔗 Deep linking active - URL updates with search!');
console.log('💡 Try adding ?user=octocat to the URL!');