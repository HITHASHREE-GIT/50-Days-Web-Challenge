/* ============================================================ */
/* CAPSTONE - MAIN APPLICATION                                  */
/* ============================================================ */

console.log('🚀 TechNova Capstone - Initializing...');

// ============================================================ */
// 1. DOM REFS
// ============================================================ */

const appRoot = document.getElementById('app-root');
const navLinks = document.querySelectorAll('.nav-link');
const themeToggle = document.getElementById('themeToggle');
const menuToggle = document.getElementById('menuToggle');
const navLinksContainer = document.getElementById('navLinks');

// ============================================================ */
// 2. ROUTER
// ============================================================ */

const routes = {
    '/': `
        <div class="view-container">
            <section class="hero-section">
                <h1>Welcome to TechNova</h1>
                <p>Enterprise-grade SPA built with Vanilla JavaScript</p>
                <a href="/dashboard" class="btn-primary nav-link" data-route="dashboard">View Dashboard →</a>
            </section>
        </div>
    `,
    '/about': `
        <div class="view-container">
            <h2>About TechNova</h2>
            <p>Built entirely with standard web technologies. No frameworks, no libraries.</p>
            <p><strong>"Standard, not a trend. The logic, not a language."</strong></p>
        </div>
    `,
    '/dashboard': `
        <div class="view-container">
            <h2>📊 Dashboard</h2>
            <p>Coming soon: Real-time data feeds and analytics</p>
        </div>
    `,
    '/team': `
        <div class="view-container">
            <h2>👥 Core Team</h2>
            <div class="team-grid">
                <div class="profile-card">
                    <div class="avatar">S</div>
                    <h3>Sarah Johnson</h3>
                    <p>Lead Developer</p>
                </div>
                <div class="profile-card">
                    <div class="avatar">M</div>
                    <h3>Michael Chen</h3>
                    <p>DevOps Engineer</p>
                </div>
                <div class="profile-card">
                    <div class="avatar">P</div>
                    <h3>Priya Patel</h3>
                    <p>UX Researcher</p>
                </div>
            </div>
        </div>
    `
};

// ============================================================ */
// 3. ROUTER FUNCTION
// ============================================================ */

function router() {
    let path = window.location.pathname;
    if (path === '') path = '/';
    if (path.includes('index.html')) path = '/';
    if (path.endsWith('/') && path !== '/') path = path.slice(0, -1);
    
    const view = routes[path] || `<div class="view-container"><h2>404</h2><p>Page not found</p></div>`;
    appRoot.innerHTML = view;
    
    // Update active nav link
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === path);
    });
}

// ============================================================ */
// 4. NAVIGATION INTERCEPT
// ============================================================ */

document.addEventListener('click', (e) => {
    const link = e.target.closest('.nav-link');
    if (link && link.getAttribute('href')) {
        e.preventDefault();
        const href = link.getAttribute('href');
        window.history.pushState({}, '', href);
        router();
        // Close mobile menu
        navLinksContainer.classList.remove('open');
        menuToggle.classList.remove('active');
    }
});

window.addEventListener('popstate', router);

// ============================================================ */
// 5. THEME TOGGLE
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
// 6. MOBILE MENU
// ============================================================ */

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinksContainer.classList.toggle('open');
});

// ============================================================ */
// 7. INIT
// ============================================================ */

router();
console.log('✅ Capstone initialized successfully!');