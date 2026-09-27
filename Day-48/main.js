/* ============================================================ */
/* DAY 48 - MAIN APPLICATION                                    */
/* ============================================================ */

import { globalStore } from './core/store.js';
import { saveOfflineData, getOfflineData, deleteOfflineData } from './core/db.js';

// Import Components
import './components/CartCounter.js';
import './components/CounterButton.js';

console.log('🚀 Day 48 - State & Memory Management');

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
            <p>Welcome to Day 48 - State & Memory Management!</p>
            <p>Check the <strong>Demo</strong> page to see reactive state in action.</p>
            <p>Check the <strong>Offline</strong> page to test IndexedDB storage.</p>
        </div>
    `,
    '/demo': `
        <div class="view-container">
            <h2>🧪 State Management Demo</h2>
            <p style="color: var(--text-muted);">The cart counter updates reactively across components!</p>
            
            <div class="demo-grid">
                <div class="demo-card">
                    <h4>🛒 Cart Counter</h4>
                    <cart-counter></cart-counter>
                </div>
                <div class="demo-card">
                    <h4>➕ Controls</h4>
                    <counter-button></counter-button>
                </div>
                <div class="demo-card">
                    <h4>📊 Current State</h4>
                    <p>Cart Count</p>
                    <div class="value" id="stateDisplay">0</div>
                </div>
            </div>
        </div>
    `,
    '/offline': `
        <div class="view-container">
            <h2>💾 Offline Storage (IndexedDB)</h2>
            <p style="color: var(--text-muted);">Save data locally - works even without internet!</p>
            
            <div class="offline-form">
                <input type="text" id="offlineTitle" placeholder="Title..." />
                <textarea id="offlineContent" rows="3" placeholder="Content..."></textarea>
                <button id="saveOfflineBtn">💾 Save Offline</button>
                <div id="offlineFeedback" class="feedback"></div>
            </div>
            
            <div class="offline-list" id="offlineList">
                <p style="color: var(--text-muted);">Loading saved data...</p>
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

    // Re-bind events after render
    if (path === '/demo') {
        bindDemoEvents();
    }
    if (path === '/offline') {
        bindOfflineEvents();
    }
}

// ============================================================ */
// DEMO EVENTS
// ============================================================ */

function bindDemoEvents() {
    setTimeout(() => {
        const stateDisplay = document.getElementById('stateDisplay');
        if (stateDisplay) {
            const updateDisplay = (state) => {
                stateDisplay.textContent = state.cartCount || 0;
            };
            globalStore.subscribe(updateDisplay);
            updateDisplay(globalStore.getState());
        }
    }, 100);
}

// ============================================================ */
// OFFLINE EVENTS
// ============================================================ */

async function bindOfflineEvents() {
    setTimeout(async () => {
        const saveBtn = document.getElementById('saveOfflineBtn');
        const titleInput = document.getElementById('offlineTitle');
        const contentInput = document.getElementById('offlineContent');
        const feedback = document.getElementById('offlineFeedback');

        // Load existing data
        await loadOfflineData();

        if (saveBtn) {
            saveBtn.addEventListener('click', async () => {
                const title = titleInput.value.trim();
                const content = contentInput.value.trim();

                if (!title || !content) {
                    feedback.className = 'feedback error';
                    feedback.textContent = '⚠️ Please fill in both fields.';
                    return;
                }

                try {
                    await saveOfflineData({ title, content });
                    feedback.className = 'feedback success';
                    feedback.textContent = '✅ Data saved offline!';
                    titleInput.value = '';
                    contentInput.value = '';
                    await loadOfflineData();
                } catch (error) {
                    feedback.className = 'feedback error';
                    feedback.textContent = '❌ Error saving data.';
                }
            });
        }
    }, 100);
}

async function loadOfflineData() {
    const list = document.getElementById('offlineList');
    if (!list) return;

    try {
        const data = await getOfflineData();
        if (data.length === 0) {
            list.innerHTML = '<p style="color: var(--text-muted);">No offline data saved.</p>';
            return;
        }

        list.innerHTML = data.map(item => `
            <div class="offline-item">
                <div>
                    <strong>${item.title}</strong>
                    <p style="font-size: 0.85rem; color: var(--text-muted);">${item.content}</p>
                    <span style="font-size: 0.7rem; color: var(--text-muted);">Saved: ${new Date(item.savedAt).toLocaleString()}</span>
                </div>
                <button class="delete-btn" data-id="${item.id}">✕</button>
            </div>
        `).join('');

        // Add delete handlers
        list.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = parseInt(btn.dataset.id);
                await deleteOfflineData(id);
                await loadOfflineData();
            });
        });

    } catch (error) {
        list.innerHTML = '<p style="color: var(--error-color);">Error loading offline data.</p>';
    }
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
    globalStore.setState({ theme });
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

// Subscribe to store for theme sync
globalStore.subscribe((state) => {
    const theme = state.theme || 'light';
    if (theme !== currentTheme) {
        setTheme(theme);
    }
});

router();
console.log('✅ Day 48 - State & Memory Management loaded!');