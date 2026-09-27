/* ============================================================ */
/* DAY 49 - DATA STREAMS & ROUTING                              */
/* ============================================================ */

import { globalStore } from './core/store.js';
import { fetchAllUserData } from './core/api.js';
import './components/GitHubCard.js';

console.log('🚀 Day 49 - Data Streams & Routing');

// ============================================================ */
// DOM REFS
// ============================================================ */

const appRoot = document.getElementById('app-root');
const navLinks = document.querySelectorAll('.nav-link');
const themeToggle = document.getElementById('themeToggle');
const menuToggle = document.getElementById('menuToggle');
const navLinksContainer = document.getElementById('navLinks');

// ============================================================ */
// ROUTER
// ============================================================ */

const routes = {
    '/': `
        <div class="view-container">
            <h2>🏠 Home</h2>
            <p>Welcome to Day 49 - Data Streams & Routing!</p>
            <p>🔍 Go to <strong>Search</strong> to find GitHub users</p>
            <p>📊 Go to <strong>Dashboard</strong> to see your data</p>
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
                <p style="color: var(--text-muted); text-align: center; padding: 2rem;">Search for a user first to see data here</p>
            </div>
        </div>
    `
};

// ============================================================ */
// ROUTER FUNCTION
// ============================================================ */

function router() {
    let path = window.location.pathname;
    if (path === '') path = '/';
    if (path.includes('index.html')) path = '/';
    if (path.endsWith('/') && path !== '/') path = path.slice(0, -1);
    
    const view = routes[path] || `<div class="view-container"><h2>404</h2><p>Page not found</p></div>`;
    appRoot.innerHTML = view;
    
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === path);
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
                
                // Save to store
                globalStore.setState({ 
                    userData: data,
                    searchQuery: username
                });

                // Display results
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
// NAVIGATION
// ============================================================ */

document.addEventListener('click', (e) => {
    const link = e.target.closest('.nav-link');
    if (link && link.getAttribute('href')) {
        e.preventDefault();
        const href = link.getAttribute('href');
        window.history.pushState({}, '', href);
        router();
        navLinksContainer.classList.remove('open');
        menuToggle.classList.remove('active');
    }
});

window.addEventListener('popstate', router);

// ============================================================ */
// THEME TOGGLE
// ============================================================ */

const STORAGE_KEY = 'technova-theme';
let currentTheme = localStorage.getItem(STORAGE_KEY) || 'light';

function setTheme(theme) {
    document.body.classList.toggle('dark-theme', theme === 'dark');
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    localStorage.setItem(STORAGE_KEY, theme);
    currentTheme = theme;
}

setTheme(currentTheme);

themeToggle.addEventListener('click', () => {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

// ============================================================ */
// MOBILE MENU
// ============================================================ */

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinksContainer.classList.toggle('open');
});

// ============================================================ */
// INIT
// ============================================================ */

router();
console.log('✅ Day 49 - Data Streams & Routing loaded!');