/* ============================================================ */
/* DAY 50 - FINAL CAPSTONE - MAIN.JS                           */
/* ============================================================ */

import { globalStore } from './core/store.js';
import { fetchAllUserData } from './core/api.js';
import './components/GitHubCard.js';

console.log('🚀 DAY 50 - FINAL CAPSTONE! 🎉');

// ============================================================ */
// DOM REFS
// ============================================================ */

const appRoot = document.getElementById('app-root');
const navLinks = document.querySelectorAll('.nav-link');
const themeToggle = document.getElementById('themeToggle');
const menuToggle = document.getElementById('menuToggle');
const navLinksContainer = document.getElementById('navLinks');
const onlineStatus = document.getElementById('onlineStatus');

// ============================================================ */
// ONLINE/OFFLINE STATUS
// ============================================================ */

function updateOnlineStatus() {
    if (navigator.onLine) {
        onlineStatus.className = 'status-dot online';
        onlineStatus.title = 'Online';
    } else {
        onlineStatus.className = 'status-dot offline';
        onlineStatus.title = 'Offline';
    }
}

updateOnlineStatus();
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

// ============================================================ */
// ROUTES
// ============================================================ */

const routes = {
    '/home': `
        <div class="view-container">
            <div class="hero-section">
                <h1>🏆 50 Days Complete!</h1>
                <p>Enterprise-grade SPA built with Vanilla JavaScript</p>
                <p style="font-size: 0.95rem; color: var(--text-muted);">
                    🔍 Search for GitHub users • 📊 View your dashboard
                </p>
            </div>
        </div>
    `,
    '/search': `
        <div class="view-container">
            <h2>🔍 Search GitHub Users</h2>
            <p style="color: var(--text-muted);">Enter a GitHub username to fetch profile data</p>
            
            <div class="search-container">
                <input type="text" id="searchInput" placeholder="Enter username..." />
                <button id="searchBtn">🔍 Search</button>
            </div>
            
            <div id="searchResults">
                <p style="color: var(--text-muted); text-align: center;">Search for a user to see results</p>
            </div>
        </div>
    `,
    '/dashboard': `
        <div class="view-container">
            <h2>📊 Dashboard</h2>
            <p style="color: var(--text-muted);">Your GitHub data at a glance</p>
            
            <div id="dashboardContent">
                <p style="color: var(--text-muted); text-align: center; padding: 2rem;">
                    🔍 Search for a user first to see data here
                </p>
            </div>
        </div>
    `,
    '/about': `
        <div class="view-container">
            <h2>📖 About This Project</h2>
            <p style="color: var(--text-muted);">50 Days of Vanilla JavaScript Engineering</p>
            
            <div class="about-grid">
                <div class="about-card">
                    <span class="icon">🧩</span>
                    <h4>Web Components</h4>
                    <p>Reusable UI with Shadow DOM</p>
                </div>
                <div class="about-card">
                    <span class="icon">🧠</span>
                    <h4>State Management</h4>
                    <p>Pub/Sub pattern</p>
                </div>
                <div class="about-card">
                    <span class="icon">💾</span>
                    <h4>Offline Support</h4>
                    <p>Service Workers + IndexedDB</p>
                </div>
                <div class="about-card">
                    <span class="icon">📡</span>
                    <h4>API Integration</h4>
                    <p>GitHub REST API</p>
                </div>
                <div class="about-card">
                    <span class="icon">🌙</span>
                    <h4>Dark Mode</h4>
                    <p>Theme persistence</p>
                </div>
                <div class="about-card">
                    <span class="icon">📱</span>
                    <h4>Responsive</h4>
                    <p>Mobile-first design</p>
                </div>
            </div>
        </div>
    `
};

// ============================================================ */
// ROUTER FUNCTION - HASH BASED
// ============================================================ */

function router() {
    // Get hash from URL, default to '/home'
    let path = window.location.hash.replace('#', '') || '/home';
    
    // Ensure path starts with '/'
    if (!path.startsWith('/')) {
        path = '/' + path;
    }
    
    console.log('🔗 Navigating to:', path);
    
    const view = routes[path] || routes['/home'];
    appRoot.innerHTML = view;
    
    // Update active nav link
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href').replace('#', '');
        const fullLinkPath = linkPath.startsWith('/') ? linkPath : '/' + linkPath;
        link.classList.toggle('active', fullLinkPath === path);
    });

    // Bind page-specific events
    if (path === '/search') {
        bindSearchEvents();
    }
    if (path === '/dashboard') {
        bindDashboardEvents();
    }
}

// ============================================================ */
// SEARCH EVENTS
// ============================================================ */

function bindSearchEvents() {
    setTimeout(() => {
        const searchBtn = document.getElementById('searchBtn');
        const searchInput = document.getElementById('searchInput');
        const results = document.getElementById('searchResults');

        if (!searchBtn || !searchInput) return;

        async function performSearch() {
            const username = searchInput.value.trim();
            if (!username) {
                results.innerHTML = `<p style="color: var(--error-color);">Please enter a username</p>`;
                return;
            }

            results.innerHTML = `
                <div class="loading-state">
                    <div class="spinner"></div>
                    <p>Fetching data for ${username}...</p>
                </div>
            `;
            searchBtn.disabled = true;

            try {
                const data = await fetchAllUserData(username);
                globalStore.setState({ userData: data, searchQuery: username });

                results.innerHTML = `
                    <div class="results-grid">
                        <github-card 
                            username="${data.profile.login}"
                            name="${data.profile.name || data.profile.login}"
                            avatar="${data.profile.avatar_url}"
                            bio="${data.profile.bio || 'No bio available'}"
                            repos="${data.profile.public_repos}"
                            followers="${data.profile.followers}"
                            following="${data.profile.following}"
                        ></github-card>
                    </div>
                    <p style="text-align: center; margin-top: 1rem; color: var(--text-muted);">
                        📦 ${data.repos.length} repositories loaded
                    </p>
                `;

            } catch (error) {
                results.innerHTML = `
                    <div style="text-align: center; padding: 2rem; color: var(--error-color);">
                        <p>❌ ${error.message}</p>
                        <p style="font-size: 0.85rem; color: var(--text-muted);">Please try again</p>
                    </div>
                `;
            } finally {
                searchBtn.disabled = false;
            }
        }

        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') performSearch();
        });

    }, 100);
}

// ============================================================ */
// DASHBOARD EVENTS
// ============================================================ */

function bindDashboardEvents() {
    setTimeout(() => {
        const content = document.getElementById('dashboardContent');
        if (!content) return;

        const state = globalStore.getState();
        const data = state.userData;

        if (!data) {
            content.innerHTML = `
                <p style="color: var(--text-muted); text-align: center; padding: 2rem;">
                    🔍 Search for a user first to see data here
                </p>
            `;
            return;
        }

        const { profile, repos } = data;

        content.innerHTML = `
            <div class="dashboard-grid">
                <div class="dashboard-section">
                    <h3>👤 Profile</h3>
                    <p><strong>Name:</strong> ${profile.name || profile.login}</p>
                    <p><strong>Username:</strong> @${profile.login}</p>
                    <p><strong>Bio:</strong> ${profile.bio || 'No bio'}</p>
                    <p><strong>Location:</strong> ${profile.location || 'Not specified'}</p>
                    <p><strong>Company:</strong> ${profile.company || 'Not specified'}</p>
                    <p><strong>Joined:</strong> ${new Date(profile.created_at).toLocaleDateString()}</p>
                </div>
                <div class="dashboard-section">
                    <h3>📦 Recent Repositories</h3>
                    ${repos.length === 0 ? '<p>No repositories found</p>' : `
                        <ul class="repo-list">
                            ${repos.map(repo => `
                                <li>
                                    <span class="repo-name">${repo.name}</span>
                                    <span class="repo-stars">⭐ ${repo.stargazers_count}</span>
                                </li>
                            `).join('')}
                        </ul>
                    `}
                </div>
                <div class="dashboard-section">
                    <h3>📊 Stats</h3>
                    <p><strong>Public Repos:</strong> ${profile.public_repos}</p>
                    <p><strong>Followers:</strong> ${profile.followers}</p>
                    <p><strong>Following:</strong> ${profile.following}</p>
                    <p><strong>Gists:</strong> ${profile.public_gists}</p>
                </div>
                <div class="dashboard-section">
                    <h3>🔗 Links</h3>
                    <p><a href="${profile.html_url}" target="_blank" style="color: var(--primary-color);">GitHub Profile →</a></p>
                    ${profile.blog ? `<p><a href="${profile.blog}" target="_blank" style="color: var(--primary-color);">Blog →</a></p>` : ''}
                    ${profile.twitter_username ? `<p>🐦 @${profile.twitter_username}</p>` : ''}
                </div>
            </div>
        `;

    }, 100);
}

// ============================================================ */
// NAVIGATION - HASH BASED
// ============================================================ */

document.addEventListener('click', (e) => {
    const link = e.target.closest('.nav-link');
    if (link && link.getAttribute('href')) {
        e.preventDefault();
        const href = link.getAttribute('href');
        
        // If href already has #, use it
        if (href.startsWith('#')) {
            window.location.hash = href;
        } else {
            window.location.hash = '#' + href;
        }
        
        // Close mobile menu
        if (navLinksContainer && menuToggle) {
            navLinksContainer.classList.remove('open');
            menuToggle.classList.remove('active');
        }
    }
});

window.addEventListener('hashchange', router);

// ============================================================ */
// THEME TOGGLE
// ============================================================ */

const STORAGE_KEY = 'technova-theme';
let currentTheme = localStorage.getItem(STORAGE_KEY) || 'light';

function setTheme(theme) {
    document.body.classList.toggle('dark-theme', theme === 'dark');
    if (themeToggle) {
        themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
    localStorage.setItem(STORAGE_KEY, theme);
    currentTheme = theme;
    globalStore.setState({ theme });
}

setTheme(currentTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
}

// ============================================================ */
// MOBILE MENU
// ============================================================ */

if (menuToggle && navLinksContainer) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinksContainer.classList.toggle('open');
    });
}

// ============================================================ */
// STORE SUBSCRIPTION
// ============================================================ */

globalStore.subscribe((state) => {
    const theme = state.theme || 'light';
    if (theme !== currentTheme) {
        setTheme(theme);
    }
});

// ============================================================ */
// INITIALIZE
// ============================================================ */

// Set default hash if none exists
if (!window.location.hash) {
    window.location.hash = '#/home';
}

router();
console.log('✅ DAY 50 COMPLETE! 🎉');
console.log('🏆 50 Days of Web Development Challenge Complete!');