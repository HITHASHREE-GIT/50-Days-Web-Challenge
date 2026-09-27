/* ============================================================ */
/* DAY 47 - MAIN APPLICATION                                    */
/* ============================================================ */

// Import components
import './components/UserCard.js';
import './components/DataFeed.js';
import './components/CustomModal.js';

console.log('🚀 Day 47 - Component Library');

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
            <p>Welcome to TechNova Component Library Demo!</p>
            <p>Click "Components" to see all Web Components in action.</p>
        </div>
    `,
    '/components': `
        <div class="view-container">
            <h2>🧩 Component Library</h2>
            
            <div class="component-demo">
                <h3>👤 User Cards</h3>
                <div class="component-grid">
                    <user-card name="Sarah Johnson" role="Lead Developer" avatar="S"></user-card>
                    <user-card name="Michael Chen" role="DevOps Engineer" avatar="M"></user-card>
                    <user-card name="Priya Patel" role="UX Researcher" avatar="P"></user-card>
                </div>
            </div>

            <div class="component-demo">
                <h3>📊 Data Feeds</h3>
                <div class="component-grid">
                    <data-feed count="12" title="📈 Analytics">
                        <p>Active users: 1,234</p>
                        <p>New signups: 56</p>
                    </data-feed>
                    <data-feed count="8" title="📋 Tasks">
                        <p>Completed: 5</p>
                        <p>Pending: 3</p>
                    </data-feed>
                </div>
            </div>

            <div class="component-demo">
                <h3>📋 Modals</h3>
                <div class="demo-buttons">
                    <button class="btn" id="openWarningModal">⚠️ Warning Modal</button>
                    <button class="btn" id="openWelcomeModal">🎉 Welcome Modal</button>
                    <button class="btn btn-secondary" id="openConfirmModal">❓ Confirm Modal</button>
                </div>
                
                <custom-modal id="warningModal">
                    <h2 slot="title">⚠️ Warning</h2>
                    <p>This is a warning message. Please be careful!</p>
                    <span slot="footer">
                        <button class="modal-close-btn" style="padding:8px 20px; background:#ef4444; color:white; border:none; border-radius:8px; cursor:pointer;">OK</button>
                    </span>
                </custom-modal>

                <custom-modal id="welcomeModal">
                    <h2 slot="title">🎉 Welcome!</h2>
                    <p>Welcome to TechNova! We're glad you're here.</p>
                    <span slot="footer">
                        <button class="modal-close-btn" style="padding:8px 20px; background:#22c55e; color:white; border:none; border-radius:8px; cursor:pointer;">Get Started</button>
                    </span>
                </custom-modal>

                <custom-modal id="confirmModal">
                    <h2 slot="title">❓ Confirm</h2>
                    <p>Are you sure you want to proceed?</p>
                    <span slot="footer">
                        <button class="modal-close-btn" style="padding:8px 20px; background:#6b7280; color:white; border:none; border-radius:8px; cursor:pointer;">Cancel</button>
                        <button style="padding:8px 20px; background:#22c55e; color:white; border:none; border-radius:8px; cursor:pointer;">Yes</button>
                    </span>
                </custom-modal>
            </div>
        </div>
    `,
    '/team': `
        <div class="view-container">
            <h2>👥 Team</h2>
            <div class="team-grid">
                <user-card name="Sarah Johnson" role="Lead Developer" avatar="S"></user-card>
                <user-card name="Michael Chen" role="DevOps Engineer" avatar="M"></user-card>
                <user-card name="Priya Patel" role="UX Researcher" avatar="P"></user-card>
                <user-card name="David Kim" role="Community Manager" avatar="D"></user-card>
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

    // Re-bind modal events after render
    if (path === '/components') {
        bindModalEvents();
    }
}

// ============================================================ */
// MODAL EVENTS
// ============================================================ */

function bindModalEvents() {
    setTimeout(() => {
        const warningBtn = document.getElementById('openWarningModal');
        const welcomeBtn = document.getElementById('openWelcomeModal');
        const confirmBtn = document.getElementById('openConfirmModal');

        const warningModal = document.getElementById('warningModal');
        const welcomeModal = document.getElementById('welcomeModal');
        const confirmModal = document.getElementById('confirmModal');

        if (warningBtn && warningModal) {
            warningBtn.addEventListener('click', () => warningModal.open());
        }
        if (welcomeBtn && welcomeModal) {
            welcomeBtn.addEventListener('click', () => welcomeModal.open());
        }
        if (confirmBtn && confirmModal) {
            confirmBtn.addEventListener('click', () => confirmModal.open());
        }
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
console.log('✅ Day 47 - Component Library loaded!');