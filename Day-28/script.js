/* ========================================== */
/* DAY 28: REAL-TIME API SEARCH & THROTTLING  */
/* ========================================== */

console.log("🚀 TechNova Engine Initialized - Day 28: Real-Time Search");

// ============================================================ */
// 1. DOM SELECTION
// ============================================================ */

const usernameInput = document.getElementById('github-username');
const profileContainer = document.getElementById('dev-profile-card');
const reposGrid = document.getElementById('repos-grid');
const searchStatus = document.getElementById('search-status');

console.log("📦 Elements selected");

// ============================================================ */
// 2. DEBOUNCE UTILITY (From Day 21)
// ============================================================ */

function debounce(func, delay = 300) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
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
// 4. THE REPOSITORY FETCH FUNCTION (From Day 27)
// ============================================================ */

async function fetchRepositories(username) {
    if (!reposGrid) return;
    
    reposGrid.innerHTML = `
        <div class="loading-state" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
            <div class="loading-spinner"></div>
            <p class="loading-text">Loading repositories...</p>
        </div>
    `;

    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
        
        if (!response.ok) {
            throw new Error("Could not fetch repositories.");
        }

        const data = await response.json();
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
                    <p>${repo.description || "No description provided for this project."}</p>
                    <div class="repo-meta">
                        <span>⭐ ${repo.stargazers_count}</span>
                        <span>🍴 ${repo.forks_count}</span>
                        <span>🔄 ${repo.language || "N/A"}</span>
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
                <p>Failed to load repositories.</p>
            </div>
        `;
    }
}

// ============================================================ */
// 5. THE PROFILE FETCH FUNCTION (Updated with Rate Limit Handling)
// ============================================================ */

async function fetchContributor(username) {
    // Handle empty input
    const trimmedUsername = username.trim();
    if (trimmedUsername === '') {
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
        return;
    }

    // Update status to fetching
    updateStatus('fetching', '⏳ Fetching...');

    // Show loading state
    profileContainer.innerHTML = `
        <div class="loading-state">
            <div class="loading-spinner"></div>
            <p class="loading-text">Fetching data from GitHub...</p>
        </div>
    `;

    try {
        const response = await fetch(`https://api.github.com/users/${trimmedUsername}`);
        
        // ============================================================ */
        // 6. RATE LIMIT GATEKEEPING
        // ============================================================ */
        if (response.status === 403 || response.status === 429) {
            throw new Error("API Rate Limit exceeded. Please wait a moment.");
        }
        
        if (!response.ok) {
            throw new Error(`Profile not found (Status: ${response.status})`);
        }

        const data = await response.json();
        
        // Update status to success
        updateStatus('success', '✅ Found!');

        // Render profile
        profileContainer.innerHTML = `
            <div class="profile-result">
                <img src="${data.avatar_url}" alt="${data.name || data.login}'s Avatar">
                <div class="profile-info">
                    <h3>${data.name || data.login}</h3>
                    <p class="profile-username">@${data.login}</p>
                    <p class="profile-bio">${data.bio || "No bio available."}</p>
                    <div class="profile-stats">
                        <span>📁 Repos: <strong>${data.public_repos}</strong></span>
                        <span>👥 Followers: <strong>${data.followers}</strong></span>
                        <span>Following: <strong>${data.following}</strong></span>
                    </div>
                    <a href="${data.html_url}" target="_blank" class="profile-link" rel="noopener noreferrer">🔗 View GitHub Profile</a>
                </div>
            </div>
        `;
        
        // Fetch repositories
        await fetchRepositories(trimmedUsername);

    } catch (error) {
        console.error("❌ API Error:", error);
        
        // Update status to error
        updateStatus('error', '❌ Error');
        
        // Check if it's a rate limit error
        const isRateLimit = error.message.includes("Rate Limit exceeded");
        
        profileContainer.innerHTML = `
            <div class="error-state">
                <span class="error-icon">${isRateLimit ? '🚫' : '⚠️'}</span>
                <p>${error.message}</p>
                <p style="font-size: 0.85rem; margin-top: 0.5rem; color: var(--text-muted);">
                    ${isRateLimit ? 'Please wait a moment and try again.' : 'Please check the username and try again.'}
                </p>
            </div>
        `;
        
        // Clear repos grid on error
        if (reposGrid) {
            reposGrid.innerHTML = `
                <div class="placeholder-state" style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-muted);">
                    <span class="placeholder-icon">📂</span>
                    <p>${isRateLimit ? 'Rate limit exceeded. Please wait.' : 'No repositories to display'}</p>
                </div>
            `;
        }
    }
}

// ============================================================ */
// 7. THE DEBOUNCED SEARCH FUNCTION
// ============================================================ */

const debouncedSearch = debounce(function() {
    const username = this.value;
    updateStatus('typing', '⌨️ Typing...');
    fetchContributor(username);
}, 500);

// ============================================================ */
// 8. BIND THE INPUT EVENT
// ============================================================ */

if (usernameInput) {
    usernameInput.addEventListener('input', debouncedSearch);
    console.log("✅ Real-time search initialized with debounce (500ms)");
}

// ============================================================ */
// 9. THEME TOGGLE (From Day 17)
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
// 10. MOBILE MENU TOGGLE (From Day 12)
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
// 11. HERO BUTTON (From Day 11)
// ============================================================ */

const heroButton = document.getElementById('heroButton');
const heroHeadline = document.querySelector('.hero-section h1');

if (heroButton && heroHeadline) {
    heroButton.addEventListener('click', function() {
        const original = "Empowering the Next Generation of Engineers";
        const newText = "Welcome to the TechNova Core! 🎉";
        if (heroHeadline.textContent === original) {
            heroHeadline.textContent = newText;
        } else {
            heroHeadline.textContent = original;
        }
        heroHeadline.classList.toggle('active-state');
    });
}

// ============================================================ */
// 12. FORM VALIDATION (From Day 13)
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
        if (nameValue === "") { showError(nameInput, nameError, "Full name is required."); isValid = false; }
        else if (nameValue.length < 2) { showError(nameInput, nameError, "Name must be at least 2 characters."); isValid = false; }
        else { showSuccess(nameInput, nameError); }
        
        if (emailValue === "") { showError(emailInput, emailError, "Email address is required."); isValid = false; }
        else if (!emailValue.includes('@')) { showError(emailInput, emailError, "Please enter a valid email address."); isValid = false; }
        else { showSuccess(emailInput, emailError); }
        
        if (isValid) {
            console.log("✅ SUCCESS! Application submitted!");
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

console.log("✅ Day 28 fully loaded!");
console.log("🔍 Start typing a GitHub username to search in real-time!");
console.log("⏱️ Search is debounced with 500ms delay to prevent rate limiting!");